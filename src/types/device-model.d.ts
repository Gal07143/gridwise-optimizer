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
  protocol?: string;
  support_level: 'none' | 'full' | 'partial' | 'beta' | 'community'; // Update support_level to include 'beta' and 'community'
  images?: string[] | Record<string, any>;
  has_manual?: boolean;
  has_datasheet?: boolean;
  has_video?: boolean;
  datasheets?: string[];
  firmware_versions?: string[];
  model_name?: string; // Add model_name property
  certifications?: string[];
  model?: string; // Add for compatibility
  supported?: boolean; // Add for compatibility
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

export interface DeviceModelCategory {
  id: string;
  name: string;
  description?: string;
  device_count?: number;
  image_url?: string;
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

export type SupportLevel = 'none' | 'full' | 'partial' | 'beta' | 'community';
