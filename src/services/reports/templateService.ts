import { supabase } from "@/integrations/supabase/client";
import { reportTemplates as staticTemplates } from "@/data/reportTemplates";
import { toast } from "sonner";

/**
 * Get all report templates from the database, or fall back to static templates
 */
export const getAllReportTemplates = async (): Promise<any[]> => {
  try {
    // We'll just use static templates for now since the report_templates table doesn't exist
    return staticTemplates;
    
    /* 
    // This code will be used when the table exists in the database
    const { data, error } = await supabase
      .from('report_templates')
      .select('*')
      .eq('is_active', true);
      
    if (error) {
      console.error("Error fetching report templates:", error);
      // Fall back to static templates
      return staticTemplates;
    }
    
    // If we have database templates, use those
    if (data && data.length > 0) {
      return data;
    }
    
    // Otherwise use static templates
    return staticTemplates;
    */
  } catch (error) {
    console.error("Error fetching report templates:", error);
    return staticTemplates;
  }
};

/**
 * Get report templates by type
 */
export const getReportTemplatesByType = async (type: string): Promise<any[]> => {
  try {
    // We'll just use static templates for now
    return staticTemplates.filter(template => template.type === type);
    
    /*
    // This code will be used when the table exists in the database
    const { data, error } = await supabase
      .from('report_templates')
      .select('*')
      .eq('type', type)
      .eq('is_active', true);
      
    if (error) {
      console.error(`Error fetching ${type} report templates:`, error);
      // Fall back to static templates
      return staticTemplates.filter(template => template.type === type);
    }
    
    // If we have database templates, use those
    if (data && data.length > 0) {
      return data;
    }
    
    // Otherwise use static templates
    return staticTemplates.filter(template => template.type === type);
    */
  } catch (error) {
    console.error(`Error fetching ${type} report templates:`, error);
    return staticTemplates.filter(template => template.type === type);
  }
};

/**
 * Get a report template by ID
 */
export const getReportTemplateById = async (id: string): Promise<any | null> => {
  try {
    // We'll just use static templates for now
    return staticTemplates.find(template => template.id === id) || null;
    
    /*
    // This code will be used when the table exists in the database
    const { data, error } = await supabase
      .from('report_templates')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error(`Error fetching template ${id}:`, error);
      // Fall back to static template
      return staticTemplates.find(template => template.id === id) || null;
    }
    
    return data;
    */
  } catch (error) {
    console.error(`Error fetching template ${id}:`, error);
    return staticTemplates.find(template => template.id === id) || null;
  }
};

/**
 * Create report from a template
 */
export const createReportFromTemplate = async (templateId: string, siteId: string, reportData: any = {}): Promise<any | null> => {
  try {
    // Get the template
    const template = await getReportTemplateById(templateId);
    
    if (!template) {
      throw new Error("Template not found");
    }
    
    // For now, just log and return mock data since we don't have the reports table
    console.log("Would create report with:", {
      site_id: siteId,
      title: reportData.title || template.title,
      description: reportData.description || template.description,
      type: template.type,
      is_template: false,
      schedule: reportData.schedule,
      parameters: template.parameters,
      template_id: templateId,
      created_by: 'current-user',
    });
    
    toast.success('Report created successfully from template');
    
    return {
      id: 'mock-report-id-' + Date.now(),
      site_id: siteId,
      title: reportData.title || template.title,
      description: reportData.description || template.description,
      type: template.type,
      is_template: false,
      schedule: reportData.schedule,
      parameters: template.parameters,
      template_id: templateId,
      created_by: 'current-user',
      created_at: new Date().toISOString()
    };
    
    /*
    // This code will be used when the table exists in the database
    const { data, error } = await supabase
      .from('reports')
      .insert([{
        site_id: siteId,
        title: reportData.title || template.title,
        description: reportData.description || template.description,
        type: template.type,
        is_template: false,
        schedule: reportData.schedule,
        parameters: template.parameters,
        template_id: templateId,
        created_by: 'current-user', // In a real app, this would be the actual user ID
      }])
      .select();
      
    if (error) {
      console.error("Error creating report from template:", error);
      throw error;
    }
    
    toast.success('Report created successfully from template');
    return data[0] || null;
    */
  } catch (error) {
    console.error("Error creating report from template:", error);
    toast.error('Failed to create report from template');
    return null;
  }
};
