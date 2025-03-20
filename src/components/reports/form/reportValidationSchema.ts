
import * as z from 'zod';

// Basic info validation schema
export const reportBasicInfoSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters long' }),
  description: z.string().optional(),
});

// Report configuration validation schema
export const reportConfigSchema = z.object({
  type: z.string(),
  is_template: z.boolean().default(false),
});

// Schedule validation schema
export const scheduleSchema = z.object({
  schedule: z.string().optional(),
});

// Parameters validation schema
export const parametersSchema = z.object({
  parameters: z.record(z.any()).optional(),
});

// Combined report schema
export const reportSchema = reportBasicInfoSchema
  .merge(reportConfigSchema)
  .merge(scheduleSchema)
  .merge(parametersSchema);

export type ReportFormValues = z.infer<typeof reportSchema>;

export const getDefaultValues = () => ({
  title: '',
  description: '',
  type: 'energy_consumption',
  is_template: false,
  schedule: '',
  parameters: {},
});
