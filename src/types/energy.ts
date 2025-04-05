
export interface EnergyDevice {
  id: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  capacity: number;
  location?: string;
  site_id?: string;
  description?: string;
  firmware?: string;
  firmware_version?: string;
  last_updated?: string;
  metrics?: Record<string, number> | null;
  lat?: number;
  lng?: number;
  protocol?: string;
  ip_address?: string;
  model?: string;
  manufacturer?: string;
  serialNumber?: string;
  tags?: Record<string, string>;
  installation_date?: string;
}

export type DeviceType = 
  | 'solar' 
  | 'wind' 
  | 'battery' 
  | 'grid' 
  | 'load' 
  | 'inverter' 
  | 'meter' 
  | 'ev_charger' 
  | 'generator'
  | 'hydroelectric'
  | 'storage'
  | 'controller';

export type DeviceStatus = 
  | 'online' 
  | 'offline' 
  | 'maintenance' 
  | 'error' 
  | 'warning';

export interface EnergyReading {
  id: string;
  device_id: string;
  timestamp: string;
  value: number;
  reading_type: string;
  unit: string;
  quality: number;
  power?: number;
  energy?: number;
  voltage?: number;
  current?: number;
  frequency?: number;
  temperature?: number;
  state_of_charge?: number;
  created_at: string;
}

export interface DeviceModel {
  id: string;
  name: string;
  manufacturer: string;
  model_number: string;
  device_type: string;
  capacity?: number;
  power_rating?: number;
  protocol?: string;
  firmware_version?: string;
  description?: string;
  category: string;
  support_level: 'full' | 'partial' | 'beta';
  specifications?: Record<string, any>;
  images?: string[];
  datasheets?: string[];
  manuals?: string[];
}

export interface DeviceModelReference {
  id: string;
  model_name: string;
  manufacturer: string;
  device_type: string;
  capacity?: number;
  power_rating?: number;
  has_manual: boolean;
}

export interface DeviceMetrics {
  id: string;
  device_id: string;
  timestamp: string;
  metrics: Record<string, number>;
}

export interface Site {
  id: string;
  name: string;
  location: string;
  timezone: string;
  lat?: number;
  lng?: number;
  created_at: string;
  updated_at: string;
  type?: string;
  status?: string;
  description?: string;
  address?: string;
  building_type?: string;
  energy_category?: string;
  area?: number;
  contact_person?: string;
  contact_email?: string;
  contact_phone?: string;
}
