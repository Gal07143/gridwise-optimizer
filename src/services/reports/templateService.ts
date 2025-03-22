
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
export const getReportTemplateById = async (id: string): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('id', id)
      .eq('is_template', true)
      .single();
    
    if (error) throw error;
    return data;
    
  } catch (error) {
    console.error(`Error fetching template ${id}:`, error);
    toast.error("Failed to load report template");
    return null;
  }
};

/**
 * Create a new report based on a template
 */
export const createReportFromTemplate = async (
  templateId: string, 
  siteId: string, 
  customizations: any
): Promise<any> => {
  try {
    // First get the template
    const template = await getReportTemplateById(templateId);
    
    if (!template) {
      throw new Error("Template not found");
    }
    
    // Create a new report based on the template
    const newReport = {
      site_id: siteId,
      created_by: 'current-user',
      type: customizations.type || template.type,
      title: customizations.title || template.title,
      description: customizations.description || template.description,
      is_template: false,
      schedule: customizations.schedule,
      parameters: customizations.parameters || template.parameters || {},
    };
    
    const { data, error } = await supabase
      .from('reports')
      .insert([newReport])
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
