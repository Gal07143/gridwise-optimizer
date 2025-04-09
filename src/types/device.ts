
export type DeviceType = 'solar' | 'wind' | 'battery' | 'grid' | 'load' | 'ev_charger' | 'inverter' | 'meter' | string;

export type DeviceStatus = 'online' | 'offline' | 'maintenance' | 'error' | 'warning' | string;

export interface DeviceMetrics {
  [key: string]: number;
}

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  description?: string;
  location?: string;
  capacity: number;
  metrics?: DeviceMetrics | null;
  site_id?: string;
  firmware?: string;
  installation_date?: string;
  last_updated?: string;
  created_at?: string;
  created_by?: string;
  lat?: number;
  lng?: number;
  protocol?: string;
  ip_address?: string;
  model?: string;
  manufacturer?: string;
  serialNumber?: string;
  tags?: string[] | Record<string, any>;
}

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
  support_level?: string;
  images?: string[] | Record<string, any>;
  has_manual?: boolean;
  created_at?: string;
  has_datasheet?: boolean;
  has_video?: boolean;
  datasheets?: Record<string, any>;
  videos?: Record<string, any>;
  firmware_versions?: string[];
  model_name?: string;
  certifications?: string[];
}

export interface DeviceModelReference {
  id: string;
  name: string;
  manufacturer: string;
  model_number: string;
  device_type: string;
  category: string; // Required in reference
  has_manual: boolean;
}

export interface DeviceFilterOptions {
  type?: DeviceType;
  status?: DeviceStatus;
  search?: string;
}

export interface DeviceFormInput {
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  description?: string;
  location?: string;
  capacity: number;
  site_id?: string;
  firmware?: string;
}
