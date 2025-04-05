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
  | 'ev_charger'
  | 'inverter'
  | 'meter'
  | 'light'
  | 'generator'
  | 'hydro';

export type DeviceStatus = 
  | 'online' 
  | 'offline' 
  | 'maintenance' 
  | 'error'
  | 'warning'
  | 'idle'
  | 'active'
  | 'charging'
  | 'discharging';

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

export interface EnergyForecast {
  id: string;
  timestamp: string;
  site_id: string;
  forecast_time: string;
  generation_forecast: number;
  consumption_forecast: number;
  confidence?: number;
  source?: string;
  weather_condition?: string;
  temperature?: number;
  cloud_cover?: number;
  wind_speed?: number;
}

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  capacity: number;
  site_id?: string;
  lat?: number;
  lng?: number;
  location?: string;
  description?: string;
  protocol?: string;
  ip_address?: string;
  last_updated?: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  tags?: Record<string, any>;
  firmware?: string;
  firmware_version?: string;
}

export type UserRole = 'admin' | 'user' | 'viewer' | 'manager';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  preferences?: Record<string, any>;
}
