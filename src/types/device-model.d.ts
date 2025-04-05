
export interface DeviceModel {
  id: string;
  name: string;
  manufacturer: string;
  model_number: string;
  device_type: string;
  category?: string;
  description?: string;
  power_rating?: number;
  capacity?: number;
  specifications?: Record<string, any>;
  release_date?: string;
  firmware_version?: string;
  protocol: string;
  support_level: 'none' | 'full' | 'partial' | 'beta';
  images?: string[];
  has_manual?: boolean;
  has_datasheet?: boolean;
  has_video?: boolean;
  datasheets?: string[];
  // Add missing properties
  firmware_versions?: string[];
}

export interface DeviceModelWithRequiredName {
  id: string;
  name: string;
  manufacturer: string;
  model_number: string;
  device_type: string;
  category?: string;
  protocol?: string; // Make protocol optional here
}

export const categoryNames = {
  inverter: 'Inverters',
  meter: 'Meters',
  battery: 'Batteries',
  solar: 'Solar Panels',
  load: 'Load Controllers',
  sensor: 'Sensors',
  evCharger: 'EV Chargers',
  wind: 'Wind Turbines'
};

export type SupportLevel = 'none' | 'full' | 'partial' | 'beta';
