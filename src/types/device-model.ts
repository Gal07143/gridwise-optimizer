
export interface DeviceModel {
  id: string;
  name: string;
  manufacturer: string;
  model_number: string;
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
  support_level?: string;
  connectivity?: Record<string, any>;
  // Compatibility field for some components
  model_name?: string;
  images?: Record<string, any>;
  has_manual?: boolean;
  manuals?: Record<string, any>;
  datasheets?: Record<string, any>;
  videos?: Record<string, any>;
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
  support_level?: string;
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

export type SupportLevel = 'full' | 'partial' | 'beta' | 'community' | 'none';
