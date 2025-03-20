
import { supabase } from "@/integrations/supabase/client";
import { Report, ReportResult } from "@/types/energy";
import { toast } from "sonner";

/**
 * Get all reports
 */
export const getAllReports = async (options?: {
  createdBy?: string;
  siteId?: string;
  isTemplate?: boolean;
}): Promise<Report[]> => {
  try {
    let query = supabase
      .from('reports')
      .select('*');
    
    if (options?.createdBy) {
      query = query.eq('created_by', options.createdBy);
    }
    
    if (options?.siteId) {
      query = query.eq('site_id', options.siteId);
    }
    
    if (options?.isTemplate !== undefined) {
      query = query.eq('is_template', options.isTemplate);
    }
    
    query = query.order('created_at', { ascending: false });
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
    
  } catch (error) {
    console.error("Error fetching reports:", error);
    toast.error("Failed to fetch reports");
    return [];
  }
};

/**
 * Get a report by ID
 */
export const getReportById = async (id: string): Promise<Report | null> => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
    
  } catch (error) {
    console.error(`Error fetching report ${id}:`, error);
    toast.error("Failed to fetch report details");
    return null;
  }
};

/**
 * Create a new report
 */
export const createReport = async (report: Omit<Report, 'id' | 'created_at' | 'last_run_at'>): Promise<Report | null> => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .insert([report])
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success("Report created successfully");
    return data;
    
  } catch (error) {
    console.error("Error creating report:", error);
    toast.error("Failed to create report");
    return null;
  }
};

/**
 * Update a report
 */
export const updateReport = async (id: string, updates: Partial<Report>): Promise<Report | null> => {
  try {
    // Remove fields that shouldn't be updated directly
    const { id: _id, created_at, created_by, last_run_at, ...updateData } = updates as any;
    
    const { data, error } = await supabase
      .from('reports')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success("Report updated successfully");
    return data;
    
  } catch (error) {
    console.error(`Error updating report ${id}:`, error);
    toast.error("Failed to update report");
    return null;
  }
};

/**
 * Delete a report
 */
export const deleteReport = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    toast.success("Report deleted successfully");
    return true;
    
  } catch (error) {
    console.error(`Error deleting report ${id}:`, error);
    toast.error("Failed to delete report");
    return false;
  }
};

/**
 * Run a report and save the results
 */
export const runReport = async (reportId: string): Promise<ReportResult | null> => {
  try {
    // First, get the report
    const report = await getReportById(reportId);
    if (!report) {
      throw new Error("Report not found");
    }
    
    // Update the last run time
    await supabase
      .from('reports')
      .update({ last_run_at: new Date().toISOString() })
      .eq('id', reportId);
    
    // Generate realistic result data based on report type
    let resultData: any = {};
    
    if (report.type === 'energy_production') {
      resultData = generateProductionReportData();
    } else if (report.type === 'energy_consumption') {
      resultData = generateConsumptionReportData();
    } else if (report.type === 'cost_analysis') {
      resultData = generateCostReportData();
    } else if (report.type === 'device_performance') {
      resultData = generatePerformanceReportData();
    } else if (report.type === 'efficiency_analysis') {
      resultData = generateEfficiencyReportData();
    } else {
      resultData = generateGenericReportData();
    }
    
    // Save the result
    const { data, error } = await supabase
      .from('report_results')
      .insert([{
        report_id: reportId,
        result_data: resultData
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success("Report generated successfully");
    return data;
    
  } catch (error) {
    console.error(`Error running report ${reportId}:`, error);
    toast.error("Failed to generate report");
    return null;
  }
};

/**
 * Get recent report results
 */
export const getReportResults = async (reportId: string, limit = 10): Promise<ReportResult[]> => {
  try {
    const { data, error } = await supabase
      .from('report_results')
      .select('*')
      .eq('report_id', reportId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
    
  } catch (error) {
    console.error(`Error fetching results for report ${reportId}:`, error);
    toast.error("Failed to fetch report results");
    return [];
  }
};

// Helper functions to generate sample report data
const generateProductionReportData = () => {
  const days = 30;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const chartData = Array.from({ length: days }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    return {
      date: date.toISOString().split('T')[0],
      value: Math.round(150 + Math.random() * 100)
    };
  });
  
  return {
    period: 'Last 30 days',
    total_production: chartData.reduce((sum, item) => sum + item.value, 0),
    by_source: {
      solar: Math.round(3500 + Math.random() * 1500),
      wind: Math.round(1000 + Math.random() * 800),
      battery: Math.round(200 + Math.random() * 300)
    },
    peak_production: (25 + Math.random() * 5).toFixed(1),
    peak_time: "12:30 PM on Jun 15",
    system_efficiency: Math.round(85 + Math.random() * 10),
    efficiency_rating: "Excellent",
    chart_data: chartData,
    by_time_of_day: {
      morning: Math.round(25 + Math.random() * 5),
      afternoon: Math.round(45 + Math.random() * 10),
      evening: Math.round(20 + Math.random() * 5),
      night: Math.round(3 + Math.random() * 2)
    },
    weather_impact: [
      { date: "06/01", sunny: 95, cloudy: 65, rainy: 45 },
      { date: "06/02", sunny: 98, cloudy: 68, rainy: 42 },
      { date: "06/03", sunny: 90, cloudy: 62, rainy: 38 },
      { date: "06/04", sunny: 92, cloudy: 64, rainy: 40 },
      { date: "06/05", sunny: 96, cloudy: 66, rainy: 44 }
    ],
    trend_percentage: Math.round(Math.random() * 20 - 5)
  };
};

const generateConsumptionReportData = () => {
  const days = 30;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const chartData = Array.from({ length: days }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    return {
      date: date.toISOString().split('T')[0],
      value: Math.round(100 + Math.random() * 50)
    };
  });
  
  return {
    period: 'Last 30 days',
    total_consumption: chartData.reduce((sum, item) => sum + item.value, 0),
    average_daily: (chartData.reduce((sum, item) => sum + item.value, 0) / days).toFixed(1),
    peak: {
      value: (7 + Math.random() * 3).toFixed(1),
      time: `${Math.floor(17 + Math.random() * 3)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
      date: `2023-06-${Math.floor(10 + Math.random() * 20)}`
    },
    trend_percentage: Math.round(Math.random() * 16 - 8),
    efficiency_rating: "Good",
    by_device_type: {
      'lighting': Math.round(10 + Math.random() * 5),
      'climate': Math.round(30 + Math.random() * 10),
      'appliances': Math.round(20 + Math.random() * 8),
      'electronics': Math.round(15 + Math.random() * 6),
      'other': Math.round(10 + Math.random() * 5)
    },
    by_time_of_day: {
      'morning': Math.round(20 + Math.random() * 8),
      'afternoon': Math.round(30 + Math.random() * 10),
      'evening': Math.round(35 + Math.random() * 10),
      'night': Math.round(8 + Math.random() * 5)
    },
    consumption_data: chartData,
    recommendations: [
      "Switch to LED lighting to reduce consumption by up to 15%",
      "Program smart thermostats to reduce HVAC usage during peak hours",
      "Consider upgrading to Energy Star appliances for better efficiency",
      "Use smart power strips to eliminate phantom power consumption"
    ]
  };
};

const generateCostReportData = () => {
  const days = 30;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const chartData = Array.from({ length: days }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    return {
      date: date.toISOString().split('T')[0],
      value: Math.round(15 + Math.random() * 10)
    };
  });
  
  const totalCost = chartData.reduce((sum, item) => sum + item.value, 0);
  const previousTotal = totalCost * (1 + (Math.random() * 0.2 - 0.1));
  
  return {
    period: 'Last 30 days',
    total_cost: totalCost,
    previous_total: previousTotal,
    average_daily: (totalCost / days).toFixed(2),
    days_in_period: days,
    cost_per_kwh: 0.22 + (Math.random() * 0.08 - 0.04),
    national_average: 0.24,
    by_source: {
      'grid': Math.round(60 + Math.random() * 15),
      'solar': Math.round(0),
      'battery': Math.round(10 + Math.random() * 5),
      'other': Math.round(15 + Math.random() * 10)
    },
    by_category: {
      'demand_charges': Math.round(30 + Math.random() * 10),
      'energy_charges': Math.round(40 + Math.random() * 10),
      'fixed_charges': Math.round(15 + Math.random() * 5),
      'taxes': Math.round(5 + Math.random() * 2)
    },
    cost_data: chartData,
    saving_tips: [
      "Shift energy-intensive activities to off-peak hours",
      "Consider adding additional solar capacity to reduce grid dependency",
      "Optimize battery charging to minimize peak demand charges",
      "Replace older appliances with energy-efficient models"
    ],
    cost_forecast: [
      { month: "Jul", projected: Math.round(145 + Math.random() * 15), previous: Math.round(165 + Math.random() * 15) },
      { month: "Aug", projected: Math.round(140 + Math.random() * 15), previous: Math.round(160 + Math.random() * 15) },
      { month: "Sep", projected: Math.round(150 + Math.random() * 15), previous: Math.round(155 + Math.random() * 15) },
      { month: "Oct", projected: Math.round(160 + Math.random() * 15), previous: Math.round(170 + Math.random() * 15) },
      { month: "Nov", projected: Math.round(165 + Math.random() * 15), previous: Math.round(175 + Math.random() * 15) },
      { month: "Dec", projected: Math.round(170 + Math.random() * 15), previous: Math.round(180 + Math.random() * 15) }
    ],
    tariff_plan: "Time-of-Use",
    base_rate: (0.15 + Math.random() * 0.05).toFixed(2),
    peak_rate: (0.22 + Math.random() * 0.06).toFixed(2),
    off_peak_rate: (0.08 + Math.random() * 0.04).toFixed(2),
    demand_charge: (10 + Math.random() * 5).toFixed(2)
  };
};

const generatePerformanceReportData = () => {
  return {
    period: 'Last 7 days',
    system_health: Math.round(85 + Math.random() * 10),
    devices: Array.from({ length: 5 }, (_, i) => ({
      id: `device-${i + 1}`,
      name: `Device ${i + 1}`,
      efficiency: Math.round(80 + Math.random() * 15),
      uptime: Math.round(90 + Math.random() * 9),
      energy_produced: Math.round(Math.random() * 1000)
    })),
    performance_history: Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - 6 + i);
      return {
        date: `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`,
        efficiency: Math.round(85 + Math.random() * 10),
        uptime: Math.round(95 + Math.random() * 5)
      };
    }),
    total_alerts: Math.floor(Math.random() * 5),
    critical_alerts: Math.random() > 0.7 ? 1 : 0,
    warning_alerts: Math.floor(Math.random() * 3),
    info_alerts: Math.floor(Math.random() * 3),
    maintenance_items: [
      {
        title: "Solar Inverter Inspection",
        description: "Efficiency dropping below optimal levels. Schedule inspection of inverter settings and connections.",
        priority: "high",
        due_date: "Within 7 days"
      },
      {
        title: "Panel Cleaning",
        description: "Recommended panel cleaning to restore optimal efficiency. Current dust build-up reducing output by 5-8%.",
        priority: "medium",
        due_date: "Within 30 days"
      },
      {
        title: "Routine Battery Inspection",
        description: "Scheduled routine maintenance for battery system. All metrics currently within normal parameters.",
        priority: "low",
        due_date: "Within 90 days"
      }
    ],
    overall_rating: Math.round(85 + Math.random() * 10),
    solar_health: Math.round(90 + Math.random() * 8),
    battery_health: Math.round(85 + Math.random() * 8),
    inverter_health: Math.round(92 + Math.random() * 7),
    control_system_health: Math.round(95 + Math.random() * 5),
    monitoring_health: Math.round(96 + Math.random() * 4),
    reliability_score: Math.round(93 + Math.random() * 7)
  };
};

const generateEfficiencyReportData = () => {
  return {
    period: 'Last 30 days',
    overall_efficiency: Math.round(85 + Math.random() * 10),
    energy_used: Math.round(3000 + Math.random() * 1000),
    energy_lost: Math.round(300 + Math.random() * 200),
    efficiency_percentage: Math.round(85 + Math.random() * 10),
    efficiency_trend: Math.round(Math.random() * 10 - 3),
    by_component: {
      'solar_panels': Math.round(85 + Math.random() * 10),
      'inverters': Math.round(92 + Math.random() * 7),
      'battery': Math.round(90 + Math.random() * 8),
      'distribution': Math.round(95 + Math.random() * 4)
    },
    loss_analysis: {
      'conversion': Math.round(40 + Math.random() * 10),
      'transmission': Math.round(25 + Math.random() * 8),
      'storage': Math.round(20 + Math.random() * 7),
      'other': Math.round(10 + Math.random() * 5)
    },
    improvement_opportunities: [
      {
        area: "Solar Panel Orientation",
        potential_gain: "3-5%",
        description: "Adjusting panel angles could improve morning sun exposure",
        cost_estimate: "Medium"
      },
      {
        area: "Inverter Upgrade",
        potential_gain: "7-10%",
        description: "Newer models offer higher conversion efficiency",
        cost_estimate: "High"
      },
      {
        area: "Battery Management",
        potential_gain: "2-4%",
        description: "Optimize charging/discharging cycles",
        cost_estimate: "Low"
      }
    ],
    efficiency_data: Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - 29 + i);
      return {
        date: date.toISOString().split('T')[0],
        value: Math.round(80 + Math.random() * 15)
      };
    })
  };
};

const generateGenericReportData = () => {
  const days = 30;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return {
    period: 'Last 30 days',
    summary: 'Generic report results',
    data: Array.from({ length: 10 }, (_, i) => ({
      key: `metric-${i + 1}`,
      value: Math.round(Math.random() * 1000)
    })),
    chart_data: Array.from({ length: days }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      return {
        date: date.toISOString().split('T')[0],
        value: Math.round(Math.random() * 1000)
      };
    })
  };
};
