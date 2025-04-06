
export type DeviceType = string;
export type DeviceStatus = string;
export type DeviceModelCategory = string;
export type SupportLevel = 'none' | 'full' | 'partial' | 'beta';

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
  datasheets?: string[];
  certifications?: string[];
  firmware_versions?: string[];
}

export interface Site {
  id: string;
  name: string;
  location: string;
  timezone: string;
  lat: number;
  lng: number;
  created_at: string;
  updated_at: string;
  type: string;
  status: string;
  address?: string;
  description?: string;
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

export type UserRole = 'viewer' | 'user' | 'admin' | 'manager' | 'installer' | 'operator';
