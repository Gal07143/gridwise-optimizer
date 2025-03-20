
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
import { TrendingDown, Zap, DollarSign, BarChart, PieChart } from 'lucide-react';

const reportTypeOptions = [
  { value: 'energy_consumption', label: 'Energy Consumption', icon: <TrendingDown className="h-4 w-4" /> },
  { value: 'energy_production', label: 'Energy Production', icon: <Zap className="h-4 w-4" /> },
  { value: 'cost_analysis', label: 'Cost Analysis', icon: <DollarSign className="h-4 w-4" /> },
  { value: 'device_performance', label: 'Device Performance', icon: <BarChart className="h-4 w-4" /> },
  { value: 'efficiency_analysis', label: 'Efficiency Analysis', icon: <PieChart className="h-4 w-4" /> },
];

const ReportTypeSelector = () => {
  const form = useFormContext();
  
  return (
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
  );
};

export default ReportTypeSelector;
