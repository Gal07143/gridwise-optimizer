
import React from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

// Rate period validation schema
const ratePeriodSchema = z.object({
  id: z.string().optional(),
  period: z.enum(['Peak', 'Shoulder', 'Off-Peak']),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Start time must be in format HH:MM",
  }),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "End time must be in format HH:MM",
  }),
  rate: z.number().min(0, {
    message: "Rate must be a positive number",
  }),
});

export type RatePeriod = z.infer<typeof ratePeriodSchema>;

interface TariffFormProps {
  initialValues?: RatePeriod;
  onSubmit: (values: RatePeriod) => void;
  onCancel: () => void;
}

const TariffForm = ({ initialValues, onSubmit, onCancel }: TariffFormProps) => {
  const isEditMode = !!initialValues;
  
  const defaultValues: RatePeriod = initialValues || {
    period: 'Off-Peak',
    startTime: '00:00',
    endTime: '00:00',
    rate: 0.10,
  };

  const form = useForm<RatePeriod>({
    resolver: zodResolver(ratePeriodSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="period"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Period Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select period type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Peak">Peak</SelectItem>
                  <SelectItem value="Shoulder">Shoulder</SelectItem>
                  <SelectItem value="Off-Peak">Off-Peak</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                The type of rate period (affects pricing)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <Input
                    type="time"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <Input
                    type="time"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="rate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rate ($/kWh)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {isEditMode ? 'Update' : 'Add'} Rate Period
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TariffForm;
