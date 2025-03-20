
import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormControl,
  FormDescription,
} from "@/components/ui/form";
import { Switch } from '@/components/ui/switch';
import { Settings } from 'lucide-react';

interface ReportConfigOptionsProps {
  isScheduled: boolean;
  setIsScheduled: (value: boolean) => void;
}

const ReportConfigOptions: React.FC<ReportConfigOptionsProps> = ({ 
  isScheduled, 
  setIsScheduled 
}) => {
  const form = useFormContext();
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 font-medium">
        <Settings className="h-5 w-5" />
        <h3>Report Configuration</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="is_template"
          render={({ field }) => (
            <FormItem className="flex flex-col space-y-2 p-4 border rounded-md">
              <div className="font-medium">Save as Template</div>
              <FormDescription>
                Make this report available as a reusable template
              </FormDescription>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </div>
            </FormItem>
          )}
        />
        
        <FormItem className="flex flex-col space-y-2 p-4 border rounded-md">
          <div className="font-medium">Schedule Report</div>
          <FormDescription>
            Run this report automatically on a schedule
          </FormDescription>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
            </div>
            <Switch
              checked={isScheduled}
              onCheckedChange={setIsScheduled}
            />
          </div>
        </FormItem>
      </div>
    </div>
  );
};

export default ReportConfigOptions;
