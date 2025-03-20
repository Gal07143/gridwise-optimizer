
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useSite } from '@/contexts/SiteContext';
import { createReport } from '@/services/reports/reportService';
import { toast } from 'sonner';
import { Calendar, Zap, TrendingDown, DollarSign, BarChart, PieChart } from 'lucide-react';

const reportSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters long' }),
  description: z.string().optional(),
  type: z.string(),
  is_template: z.boolean().default(false),
  schedule: z.string().optional(),
  parameters: z.record(z.any()).optional(),
});

type ReportFormValues = z.infer<typeof reportSchema>;

interface ReportCreationFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const ReportCreationForm: React.FC<ReportCreationFormProps> = ({ onClose, onSuccess }) => {
  const { currentSite } = useSite();
  const [isScheduled, setIsScheduled] = useState(false);
  
  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      title: '',
      description: '',
      type: 'energy_consumption',
      is_template: false,
      schedule: '',
      parameters: {},
    },
  });

  const onSubmit = async (data: ReportFormValues) => {
    if (!isScheduled) {
      data.schedule = undefined;
    }
    
    try {
      // Add site_id and current user to report data
      if (!currentSite?.id) {
        toast.error('No site selected');
        return;
      }
      
      const reportData = {
        ...data,
        site_id: currentSite.id,
        created_by: 'current-user', // In a real app, this would be the actual user ID
        // Ensure required fields are present
        type: data.type || 'energy_consumption',  
        title: data.title,
      };
      
      await createReport(reportData);
      toast.success('Report created successfully');
      onSuccess();
    } catch (error) {
      console.error('Error creating report:', error);
      toast.error('Failed to create report');
    }
  };

  const reportTypeOptions = [
    { value: 'energy_consumption', label: 'Energy Consumption', icon: <TrendingDown className="h-4 w-4" /> },
    { value: 'energy_production', label: 'Energy Production', icon: <Zap className="h-4 w-4" /> },
    { value: 'cost_analysis', label: 'Cost Analysis', icon: <DollarSign className="h-4 w-4" /> },
    { value: 'device_performance', label: 'Device Performance', icon: <BarChart className="h-4 w-4" /> },
    { value: 'efficiency_analysis', label: 'Efficiency Analysis', icon: <PieChart className="h-4 w-4" /> },
  ];

  const scheduleOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
  ];

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>Create New Report</DialogTitle>
        <DialogDescription>
          Configure your report settings and parameters
        </DialogDescription>
      </DialogHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Report Title</FormLabel>
                <FormControl>
                  <Input placeholder="Monthly Energy Consumption" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Detailed analysis of energy consumption patterns" 
                    {...field} 
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Report Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a report type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {reportTypeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center">
                          <span className="mr-2">{option.icon}</span>
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Different report types provide specialized insights
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="is_template"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Save as Template</FormLabel>
                    <FormDescription>
                      Make this report available as a reusable template
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Schedule Report</FormLabel>
                <FormDescription>
                  Run this report automatically on a schedule
                </FormDescription>
              </div>
              <Switch
                checked={isScheduled}
                onCheckedChange={setIsScheduled}
              />
            </FormItem>
          </div>
          
          {isScheduled && (
            <FormField
              control={form.control}
              name="schedule"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Schedule Frequency</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select schedule frequency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {scheduleOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            {option.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The report will run automatically based on this schedule
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Create Report</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default ReportCreationForm;
