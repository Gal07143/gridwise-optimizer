
import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const ReportBasicInfoFields = () => {
  const form = useFormContext();
  
  return (
    <div className="space-y-4">
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
            <FormControl>
              <Textarea 
                placeholder="Detailed analysis of energy consumption patterns" 
                className="min-h-[100px]"
                {...field} 
                value={field.value || ''}
              />
            </FormControl>
            <FormDescription>
              Add optional details about the purpose and content of this report
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ReportBasicInfoFields;
