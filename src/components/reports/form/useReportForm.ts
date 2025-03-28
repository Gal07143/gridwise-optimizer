
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSite } from '@/contexts/SiteContext';
import { toast } from 'sonner';
import { reportSchema, ReportFormValues, getDefaultValues } from './reportValidationSchema';

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
    type: 'energy_consumption',
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
  const { currentSite } = useSite();
  const [isScheduled, setIsScheduled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  
  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: getDefaultValues(),
    mode: 'onChange',
  });

  useEffect(() => {
    const templateId = form.watch('template_id');
    
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
  }, [form.watch('template_id')]);

  const handleSubmit = async (data: ReportFormValues) => {
    if (!currentSite?.id) {
      toast.error('No site selected');
      return;
    }
    
    if (!isScheduled) {
      data.schedule = undefined;
    }
    
    try {
      setIsSubmitting(true);
      
      let result;
      
      if (data.template_id) {
        result = await mockCreateReportFromTemplate(data.template_id, currentSite.id, data);
      } else {
        const reportData = {
          site_id: currentSite.id,
          created_by: 'current-user',
          type: data.type || 'energy_consumption',
          title: data.title,
          description: data.description,
          is_template: data.is_template,
          schedule: data.schedule,
          parameters: data.parameters || {},
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
