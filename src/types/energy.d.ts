
export type DeviceType = string;
export type DeviceStatus = string;
export type DeviceModelCategory = string;
export type SupportLevel = 'none' | 'full' | 'partial' | 'beta' | 'community';

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  description?: string;
  location?: string;
  capacity: number;
  metrics?: Record<string, any> | null;
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
  model_name?: string;
}

export interface EnergyDevice extends Device {
  energy_sources?: string[];
  peak_power?: number;
  control_mode?: string;
  efficiency?: number;
  rated_voltage?: number;
  rated_current?: number;
}

export interface DeviceModel {
  id: string;
  name: string;
  manufacturer: string;
  model_number: string;
  model_name?: string;
  device_type: string;
  category?: string;
  description?: string;
  power_rating?: number;
  capacity?: number;
  specifications?: Record<string, any>;
  release_date?: string;
  firmware_version?: string;
  protocol: string;
  support_level: SupportLevel;
  images?: string[];
  has_manual?: boolean;
  has_datasheet?: boolean;
  has_video?: boolean;
  datasheets?: string[];
  certifications?: string[];
  firmware_versions?: string[];
}

export interface Site {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  timezone: string;
  lat: number;
  lng: number;
  created_at: string;
  updated_at: string;
  status?: 'active' | 'inactive' | 'maintenance';
  description?: string;
  site_type?: string;
  tags?: string[];
  main_image_url?: string;
  organization_id?: string;
  location?: string;
  type?: string;
  building_type?: string;
  area?: number;
  contact_person?: string;
  contact_phone?: string;
  contact_email?: string;
}

export interface EnergyReading {
  id: string;
  device_id: string;
  timestamp: string;
  value: number;
  reading_type: string;
  unit: string;
  quality: number;
  power: number;
  energy: number;
  voltage?: number;
  current?: number;
  frequency?: number;
  temperature?: number;
  state_of_charge?: number;
  created_at: string;
}

export interface Alert {
  id: string;
  title?: string;
  message: string;
  severity: string;
  timestamp: string;
  acknowledged: boolean;
  acknowledged_at?: string;
  acknowledged_by?: string;
  device_id: string;
  resolved_at?: string;
  type?: string;
  source?: string;
  status?: string;
  site_id?: string;
  device_name?: string;
  site_name?: string;
  resolved_by?: string;
  resolved?: boolean;
  alert_source?: string;
  ack_by?: string;
  ack_at?: string;
  alert_type?: string;
  assignedTo?: string;
  category?: string;
  metadata?: Record<string, any>;
}

export interface TelemetryData {
  timestamp: string;
  value: number;
  deviceId: string;
  metricId: string;
}

export interface EnergyForecast {
  id: string;
  timestamp: string;
  forecast_type: string;
  value: number;
  confidence: number;
  unit: string;
  site_id?: string;
  device_id?: string;
  source?: string;
  created_at: string;
  updated_at: string;
}

export type UserRole = 'viewer' | 'user' | 'admin' | 'manager' | 'installer' | 'operator';
