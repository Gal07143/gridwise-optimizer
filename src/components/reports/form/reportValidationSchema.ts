
import * as z from 'zod';

export const reportSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters long' }),
  description: z.string().optional(),
  type: z.string(),
  is_template: z.boolean().default(false),
  schedule: z.string().optional(),
  parameters: z.record(z.any()).optional(),
});

export type ReportFormValues = z.infer<typeof reportSchema>;

export const getDefaultValues = () => ({
  title: '',
  description: '',
  type: 'energy_consumption',
  is_template: false,
  schedule: '',
  parameters: {},
});
