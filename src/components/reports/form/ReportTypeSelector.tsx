
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
import { 
  BarChart, 
  TrendingDown, 
  Zap, 
  DollarSign, 
  PieChart 
} from 'lucide-react';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { reportTemplates } from '@/data/reportTemplates';
import { cn } from '@/lib/utils';

const reportTypeOptions = [
  { value: 'energy_consumption', label: 'Energy Consumption', icon: <TrendingDown className="h-4 w-4" /> },
  { value: 'energy_production', label: 'Energy Production', icon: <Zap className="h-4 w-4" /> },
  { value: 'cost_analysis', label: 'Cost Analysis', icon: <DollarSign className="h-4 w-4" /> },
  { value: 'device_performance', label: 'Device Performance', icon: <BarChart className="h-4 w-4" /> },
  { value: 'efficiency_analysis', label: 'Efficiency Analysis', icon: <PieChart className="h-4 w-4" /> },
];

const ReportTypeSelector = () => {
  const form = useFormContext();
  const watchedType = form.watch('type');
  const currentTemplates = reportTemplates.filter(template => template.type === watchedType);
  
  const handleTemplateSelect = (templateId: string) => {
    const template = reportTemplates.find(t => t.id === templateId);
    if (template) {
      form.setValue('title', template.title);
      form.setValue('description', template.description);
      form.setValue('parameters', template.parameters || {});
      form.setValue('template_id', templateId);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 font-medium">
        <BarChart className="h-5 w-5" />
        <h3>Report Type</h3>
      </div>
      
      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Select Report Type</FormLabel>
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
      
      {watchedType && currentTemplates.length > 0 && (
        <FormField
          control={form.control}
          name="template_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Report Templates</FormLabel>
              <FormDescription className="mb-3">
                Select from pre-configured templates or customize your own
              </FormDescription>
              
              <RadioGroup 
                onValueChange={(value) => {
                  field.onChange(value);
                  handleTemplateSelect(value);
                }}
                value={field.value}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {currentTemplates.map((template) => (
                  <div key={template.id}>
                    <RadioGroupItem
                      value={template.id}
                      id={template.id}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={template.id}
                      className={cn(
                        "flex flex-col h-full rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground",
                        "[&:has([data-state=checked])]:border-primary cursor-pointer",
                        "peer-data-[state=checked]:border-primary"
                      )}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {React.createElement(template.icon || BarChart, { 
                          className: "h-4 w-4 text-primary" 
                        })}
                        <span className="font-medium">{template.title}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export default ReportTypeSelector;
