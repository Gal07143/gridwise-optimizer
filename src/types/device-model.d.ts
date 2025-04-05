
// File: src/types/device-model.d.ts
export type SupportLevel = 'full' | 'partial' | 'beta' | 'community' | 'none';

export interface DeviceModel {
  id: string;
  name: string;
  manufacturer: string;
  model_number: string;
  model_name?: string;
  device_type: string;
  category: string;
  description?: string;
  specifications?: Record<string, any>;
  power_rating?: number;
  capacity?: number;
  dimensions?: string;
  weight?: number;
  certifications?: string[];
  warranty?: string;
  release_date?: string;
  firmware_version?: string;
  protocol?: string;
  compatible_with?: string[];
  support_level?: SupportLevel;
  connectivity?: Record<string, any>;
  // Additional properties
  images?: Record<string, any>;
  has_manual?: boolean;
  manuals?: Record<string, any>;
  datasheets?: Record<string, any>;
  videos?: Record<string, any>;
  has_datasheet?: boolean;
  has_video?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DeviceModelListItem {
  id: string;
  name: string;
  manufacturer: string;
  model_number: string;
  device_type: string;
  category: string;
  power_rating?: number;
  capacity?: number;
  support_level?: SupportLevel;
}

export interface DeviceModelReference {
  id: string;
  name: string;
  manufacturer: string;
  model_number: string;
  model_name?: string;
  device_type: string;
  has_manual?: boolean;
}

export interface DeviceModelCategory {
  id: string;
  name: string;
  description?: string;
  device_count?: number;
  image_url?: string;
}

// Add CategoryNames for reference
export const categoryNames: string[] = [
  'Solar Inverters',
  'Battery Systems',
  'EV Chargers',
  'Meters',
  'Load Controllers',
  'Wind Turbines',
  'Generators',
  'HVAC Systems',
  'Building Management',
  'Smart Appliances'
];

export interface DeviceModelWithRequiredName {
  id: string;
  name: string;
  manufacturer: string;
  model_number: string;
  model_name?: string;
  device_type: string;
  category?: string;
  protocol?: string;
  support_level?: SupportLevel;
  has_manual?: boolean;
  has_datasheet?: boolean;
  has_video?: boolean;
}
