
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSite } from '@/contexts/SiteContext';
import { createReport } from '@/services/reports/reportService';
import { toast } from 'sonner';
import { reportSchema, ReportFormValues, getDefaultValues } from './reportValidationSchema';

interface UseReportFormProps {
  onSuccess: () => void;
}

export const useReportForm = ({ onSuccess }: UseReportFormProps) => {
  const { currentSite } = useSite();
  const [isScheduled, setIsScheduled] = useState(false);
  
  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: getDefaultValues(),
    mode: 'onChange',
  });

  const handleSubmit = async (data: ReportFormValues) => {
    if (!isScheduled) {
      data.schedule = undefined;
    }
    
    try {
      if (!currentSite?.id) {
        toast.error('No site selected');
        return;
      }
      
      const reportData = {
        site_id: currentSite.id,
        created_by: 'current-user', // In a real app, this would be the actual user ID
        type: data.type || 'energy_consumption',  
        title: data.title,
        description: data.description,
        is_template: data.is_template,
        schedule: data.schedule,
        parameters: data.parameters || {},
      };
      
      await createReport(reportData);
      toast.success('Report created successfully');
      onSuccess();
    } catch (error) {
      console.error('Error creating report:', error);
      toast.error('Failed to create report');
    }
  };

  return {
    form,
    isScheduled,
    setIsScheduled,
    onSubmit: form.handleSubmit(handleSubmit)
  };
};
