
import { z } from 'zod';

export const reportValidationSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  type: z.enum([
    'energy_consumption',
    'energy_production',
    'cost_analysis',
    'device_performance',
    'efficiency_analysis'
  ]),
  timeframe: z.enum(['day', 'week', 'month', 'year']),
  schedule: z.enum(['once', 'daily', 'weekly', 'monthly']),
  recipients: z.array(z.string().email()).min(1, 'At least one recipient is required'),
  format: z.enum(['pdf', 'csv', 'excel']),
  site_id: z.string().uuid('Invalid site ID'),
});

export type ReportFormValues = z.infer<typeof reportValidationSchema>;

export const getDefaultValues = (): ReportFormValues => ({
  title: '',
  description: '',
  type: 'energy_consumption',
  timeframe: 'month',
  schedule: 'monthly',
  recipients: [],
  format: 'pdf',
  site_id: '',
});
