
import { z } from "zod";

export const DeviceSchema = z.object({
  name: z.string().min(1, "Device name is required"),
  type: z.string(),
  status: z.string(),
  capacity: z.number().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  manufacturer: z.string().optional(),
  model: z.string().optional(),
  serialNumber: z.string().optional(),
  firmware: z.string().optional(),
  installation_date: z.date().optional(),
  lastMaintenanceDate: z.date().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  energyCapacity: z.number().optional(),
  efficiency: z.number().optional(),
  maxVoltage: z.number().optional(),
  minVoltage: z.number().optional(),
  maxCurrent: z.number().optional(),
  minCurrent: z.number().optional(),
  nominalVoltage: z.number().optional(),
  nominalCurrent: z.number().optional(),
  communicationProtocol: z.string().optional(),
  dataUpdateFrequency: z.number().optional(),
});

export type DeviceFormValues = z.infer<typeof DeviceSchema>;
