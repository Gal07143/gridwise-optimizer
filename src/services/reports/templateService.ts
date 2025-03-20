
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ReportData } from "./reportService";

/**
 * Get all report templates
 */
export const getReportTemplates = async (): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('is_template', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
    
  } catch (error) {
    console.error("Error fetching report templates:", error);
    toast.error("Failed to load report templates");
    return [];
  }
};

/**
 * Get a specific report template by ID
 */
export const getReportTemplateById = async (templateId: string): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('id', templateId)
      .eq('is_template', true)
      .single();
    
    if (error) throw error;
    return data;
    
  } catch (error) {
    console.error(`Error fetching report template ${templateId}:`, error);
    toast.error("Failed to load report template");
    return null;
  }
};

/**
 * Create a report from a template
 */
export const createReportFromTemplate = async (
  templateId: string, 
  siteId: string,
  overrides: Partial<ReportData>
): Promise<any> => {
  try {
    // First, get the template
    const template = await getReportTemplateById(templateId);
    if (!template) throw new Error("Template not found");
    
    // Create a new report based on the template
    const reportData = {
      title: template.title,
      description: template.description,
      type: template.type,
      is_template: false,
      site_id: siteId,
      created_by: 'current-user',
      parameters: template.parameters,
      schedule: null,
      ...overrides
    };
    
    // Insert the new report
    const { data, error } = await supabase
      .from('reports')
      .insert([reportData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
    
  } catch (error) {
    console.error("Error creating report from template:", error);
    toast.error("Failed to create report from template");
    throw error;
  }
};
