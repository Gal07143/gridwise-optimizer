
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
    
    // This is where you would normally have more complex logic to generate report data
    // For now, we'll create a simple placeholder result
    
    // Update the last run time
    await supabase
      .from('reports')
      .update({ last_run_at: new Date().toISOString() })
      .eq('id', reportId);
    
    // Generate a sample result based on report type
    let resultData: any = {};
    
    if (report.type === 'energy_production') {
      resultData = {
        period: 'Last 30 days',
        total_production: Math.round(Math.random() * 10000),
        by_source: {
          solar: Math.round(Math.random() * 6000),
          wind: Math.round(Math.random() * 4000)
        },
        chart_data: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          value: Math.round(Math.random() * 400)
        }))
      };
    } else if (report.type === 'device_performance') {
      resultData = {
        period: 'Last 7 days',
        devices: Array.from({ length: 5 }, (_, i) => ({
          id: `device-${i + 1}`,
          name: `Device ${i + 1}`,
          efficiency: Math.round(80 + Math.random() * 15),
          uptime: Math.round(90 + Math.random() * 9),
          energy_produced: Math.round(Math.random() * 1000)
        }))
      };
    } else {
      resultData = {
        period: 'Custom',
        summary: 'Custom report results',
        data: Array.from({ length: 10 }, (_, i) => ({
          key: `metric-${i + 1}`,
          value: Math.round(Math.random() * 1000)
        }))
      };
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
