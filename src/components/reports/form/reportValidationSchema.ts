
import { z } from 'zod';

export const reportSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title must be less than 100 characters"),
  description: z.string().optional(),
  type: z.enum(["energy_consumption", "energy_production", "cost_analysis", "device_performance", "efficiency_analysis"]),
  is_template: z.boolean().default(false),
  schedule: z.string().optional(),
  parameters: z.record(z.any()).optional(),
  template_id: z.string().optional()
});

export type ReportFormValues = z.infer<typeof reportSchema>;

export const getDefaultValues = (): ReportFormValues => ({
  title: '',
  description: '',
  type: 'energy_consumption',
  is_template: false,
  parameters: {}
});
