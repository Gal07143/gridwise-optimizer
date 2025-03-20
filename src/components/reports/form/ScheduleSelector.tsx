
import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from 'lucide-react';

const scheduleOptions = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
];

interface ScheduleSelectorProps {
  isScheduled: boolean;
}

const ScheduleSelector: React.FC<ScheduleSelectorProps> = ({ isScheduled }) => {
  const form = useFormContext();
  
  if (!isScheduled) return null;
  
  return (
    <div className="space-y-4 pt-4 border-t">
      <div className="flex items-center gap-2 font-medium">
        <Calendar className="h-5 w-5" />
        <h3>Schedule Settings</h3>
      </div>
      
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
                    {option.label}
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
    </div>
  );
};

export default ScheduleSelector;
