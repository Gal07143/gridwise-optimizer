
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reportValidationSchema, ReportFormValues, getDefaultValues } from './reportValidationSchema';
import { useSiteContext } from '@/contexts/SiteContext';
import { toast } from 'sonner';
import { Site } from '@/types/site';

// Mock implementations for report services
const mockCreateReport = async (reportData: any) => {
  console.log('Creating report:', reportData);
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { id: `report-${Date.now()}`, ...reportData };
};

const mockCreateReportFromTemplate = async (templateId: string, siteId: string, data: any) => {
  console.log('Creating report from template:', { templateId, siteId, data });
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { id: `report-${Date.now()}`, template_id: templateId, site_id: siteId, ...data };
};

const mockGetReportTemplateById = async (templateId: string) => {
  console.log('Getting template by ID:', templateId);
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return mock template data
  return {
    id: templateId,
    title: `Template ${templateId}`,
    description: 'A sample report template',
    type: 'energy_consumption' as const,
    parameters: {
      timeframe: 'last_30_days',
      groupBy: 'day'
    }
  };
};

interface UseReportFormProps {
  onSuccess: () => void;
}

export const useReportForm = ({ onSuccess }: UseReportFormProps) => {
  const { activeSite } = useSiteContext();
  const [isScheduled, setIsScheduled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  
  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportValidationSchema),
    defaultValues: getDefaultValues(),
    mode: 'onChange',
  });

  useEffect(() => {
    // Use proper type assertion for the template_id field
    const templateId = form.getValues('template_id');
    
    if (templateId && templateId !== selectedTemplate) {
      setSelectedTemplate(templateId);
      
      const loadTemplateData = async () => {
        try {
          const template = await mockGetReportTemplateById(templateId);
          if (template) {
            form.setValue('title', template.title);
            form.setValue('description', template.description);
            form.setValue('type', template.type);
            form.setValue('parameters', template.parameters || {});
          }
        } catch (error) {
          console.error('Error loading template data:', error);
        }
      };
      
      loadTemplateData();
    }
  }, [form, selectedTemplate]);

  const handleSubmit = async (data: ReportFormValues) => {
    if (!activeSite?.id) {
      toast.error('No site selected');
      return;
    }
    
    // Use the correct type for schedule
    const submissionData = { ...data };
    if (!isScheduled) {
      delete submissionData.schedule;
    }
    
    try {
      setIsSubmitting(true);
      
      let result;
      
      if (submissionData.template_id) {
        result = await mockCreateReportFromTemplate(
          submissionData.template_id, 
          activeSite.id, 
          submissionData
        );
      } else {
        const reportData = {
          site_id: activeSite.id,
          created_by: 'current-user',
          type: submissionData.type,
          title: submissionData.title,
          description: submissionData.description,
          is_template: submissionData.is_template,
          schedule: submissionData.schedule,
          parameters: submissionData.parameters || {},
        };
        
        result = await mockCreateReport(reportData);
      }
      
      if (result) {
        toast.success('Report created successfully');
        onSuccess();
      } else {
        throw new Error('Failed to create report');
      }
    } catch (error) {
      console.error('Error creating report:', error);
      toast.error('Failed to create report');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isScheduled,
    setIsScheduled,
    isSubmitting,
    onSubmit: form.handleSubmit(handleSubmit)
  };
};
