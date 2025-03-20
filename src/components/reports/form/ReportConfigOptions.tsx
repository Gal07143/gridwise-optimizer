
import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
} from "@/components/ui/form";
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <Settings className="mr-2 h-5 w-5 text-primary" />
          Report Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
};

export default ReportConfigOptions;
