
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface ReportData {
  id?: string;
  title: string;
  description?: string;
  type: string;
  is_template: boolean;
  site_id: string;
  created_by: string;
  parameters?: any;
  schedule?: string;
  last_run_at?: string;
}

export interface ReportResult {
  id?: string;
  report_id: string;
  result_data: any;
  created_at?: string;
  file_url?: string;
}

/**
 * Get all reports for a site
 */
export const getAllReports = async ({ siteId }: { siteId?: string } = {}): Promise<any[]> => {
  try {
    let query = supabase.from('reports').select('*');
    
    if (siteId) {
      query = query.eq('site_id', siteId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
    
  } catch (error) {
    console.error("Error fetching reports:", error);
    toast.error("Failed to load reports");
    return [];
  }
};

/**
 * Create a new report
 */
export const createReport = async (reportData: ReportData): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .insert([reportData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
    
  } catch (error) {
    console.error("Error creating report:", error);
    toast.error("Failed to create report");
    throw error;
  }
};

/**
 * Get report results for a specific report
 */
export const getReportResults = async (reportId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('report_results')
      .select('*')
      .eq('report_id', reportId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
    
  } catch (error) {
    console.error(`Error fetching results for report ${reportId}:`, error);
    toast.error("Failed to load report results");
    return [];
  }
};

/**
 * Run a report and generate results
 */
export const runReport = async (reportId: string): Promise<void> => {
  try {
    // First, get the report
    const { data: report, error: reportError } = await supabase
      .from('reports')
      .select('*')
      .eq('id', reportId)
      .single();
    
    if (reportError) throw reportError;
    if (!report) throw new Error("Report not found");
    
    // Generate example report data based on report type
    const resultData = generateReportData(report.type);
    
    // Create a result record
    const { error: resultError } = await supabase
      .from('report_results')
      .insert([{
        report_id: reportId,
        result_data: resultData
      }]);
    
    if (resultError) throw resultError;
    
    // Update the report's last_run_at timestamp
    const { error: updateError } = await supabase
      .from('reports')
      .update({ last_run_at: new Date().toISOString() })
      .eq('id', reportId);
    
    if (updateError) throw updateError;
    
  } catch (error) {
    console.error("Error running report:", error);
    toast.error("Failed to run report");
    throw error;
  }
};

/**
 * Delete a report
 */
export const deleteReport = async (reportId: string): Promise<void> => {
  try {
    // First, delete associated results
    const { error: resultsError } = await supabase
      .from('report_results')
      .delete()
      .eq('report_id', reportId);
    
    if (resultsError) throw resultsError;
    
    // Then, delete the report
    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', reportId);
    
    if (error) throw error;
    
  } catch (error) {
    console.error("Error deleting report:", error);
    toast.error("Failed to delete report");
    throw error;
  }
};

/**
 * Generate sample report data based on report type
 */
function generateReportData(reportType: string): any {
  const now = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(now.getDate() - 30);
  
  // Generate dates for the past 30 days
  const dates = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(thirtyDaysAgo);
    date.setDate(date.getDate() + i);
    return date.toISOString().split('T')[0];
  });
  
  // Generate random data for each date
  const dailyData = dates.map(date => {
    const randomFactor = 0.7 + Math.random() * 0.6; // 0.7-1.3 range for variability
    
    return {
      date,
      value: Math.round(((reportType === 'energy_consumption' ? 42 : 
                           reportType === 'energy_production' ? 58 : 
                           reportType === 'cost_analysis' ? 85 : 35) * randomFactor) * 100) / 100
    };
  });
  
  // Common data structure
  const baseData = {
    summary: `${reportType.replace(/_/g, ' ')} analysis for the past 30 days`,
    period: {
      start: thirtyDaysAgo.toISOString(),
      end: now.toISOString()
    },
    daily_data: dailyData
  };
  
  // Customize based on report type
  switch (reportType) {
    case 'energy_consumption':
      return {
        ...baseData,
        total_consumption: Math.round(dailyData.reduce((sum, day) => sum + day.value, 0)),
        peak_consumption: Math.max(...dailyData.map(day => day.value)),
        average_daily: Math.round(dailyData.reduce((sum, day) => sum + day.value, 0) / dailyData.length * 10) / 10,
        by_source: {
          'building': 65,
          'hvac': 25,
          'lighting': 10
        },
        recommendations: [
          'Consider adjusting HVAC schedules to reduce off-hours consumption',
          'Lighting efficiency could be improved by replacing older fixtures'
        ]
      };
      
    case 'energy_production':
      return {
        ...baseData,
        total_production: Math.round(dailyData.reduce((sum, day) => sum + day.value, 0)),
        peak_production: Math.max(...dailyData.map(day => day.value)),
        average_daily: Math.round(dailyData.reduce((sum, day) => sum + day.value, 0) / dailyData.length * 10) / 10,
        by_source: {
          'solar': 75,
          'wind': 25
        },
        efficiency_rate: 0.92,
        carbon_offset: Math.round(dailyData.reduce((sum, day) => sum + day.value, 0) * 0.4)
      };
      
    case 'cost_analysis':
      return {
        ...baseData,
        total_cost: Math.round(dailyData.reduce((sum, day) => sum + day.value, 0) * 100) / 100,
        average_daily_cost: Math.round(dailyData.reduce((sum, day) => sum + day.value, 0) / dailyData.length * 100) / 100,
        by_category: {
          'grid_import': 60,
          'maintenance': 15,
          'service_fees': 25
        },
        savings_opportunities: [
          {
            description: 'Shift consumption to off-peak hours',
            potential_savings: '15%'
          },
          {
            description: 'Increase battery usage during peak pricing',
            potential_savings: '10%'
          }
        ],
        roi_analysis: {
          investment: 25000,
          annual_savings: 4800,
          payback_period: 5.2,
          roi_percentage: 19.2
        }
      };
      
    case 'device_performance':
      return {
        ...baseData,
        devices: [
          {
            id: 'device-1',
            name: 'Solar Inverter A',
            efficiency: 0.94,
            uptime: 0.996,
            issues: 1
          },
          {
            id: 'device-2',
            name: 'Battery System',
            efficiency: 0.89,
            uptime: 0.982,
            issues: 3
          },
          {
            id: 'device-3',
            name: 'Smart Meter',
            efficiency: 0.99,
            uptime: 0.999,
            issues: 0
          }
        ],
        overall_system_health: 0.92,
        maintenance_recommendations: [
          'Battery System requires maintenance check',
          'Schedule annual inspection for all devices'
        ]
      };
      
    case 'efficiency_analysis':
      return {
        ...baseData,
        system_efficiency: 0.87,
        efficiency_data: dates.map((date, index) => ({
          date,
          efficiency: 0.84 + (Math.random() * 0.08)
        })),
        by_component: {
          'solar_panels': 0.95,
          'inverters': 0.97,
          'battery': 0.88,
          'distribution': 0.96
        },
        loss_analysis: {
          'conversion': 40,
          'transmission': 25,
          'storage': 20,
          'other': 15
        },
        improvement_opportunities: [
          {
            component: 'Battery Storage',
            issue: 'Efficiency degradation',
            potential_improvement: '7%',
            recommendation: 'Schedule maintenance and calibration'
          },
          {
            component: 'Distribution System',
            issue: 'Line losses',
            potential_improvement: '3%',
            recommendation: 'Upgrade wiring and connections'
          }
        ]
      };
      
    default:
      return {
        ...baseData,
        summary: 'General system report',
        insights: [
          'System is operating within normal parameters',
          'Regular maintenance is recommended to maintain efficiency'
        ]
      };
  }
}
