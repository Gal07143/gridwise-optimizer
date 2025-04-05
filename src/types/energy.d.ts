
export type DeviceType = string;

export type DeviceStatus = 'online' | 'offline' | 'maintenance' | 'error' | 'warning' | 'idle' | 'active' | 'charging' | 'discharging';

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  capacity: number;
  location?: string;
  site_id?: string;
  firmware?: string;
  metrics?: Record<string, number> | null;
  last_updated?: string;
  description?: string;
  installation_date?: string;
  created_at?: string;
  // Additional properties needed for compatibility
  protocol?: string;
  model?: string;
  manufacturer?: string;
  serialNumber?: string;
  ip_address?: string;
  lat?: number;
  lng?: number;
  tags?: string[];
}

export interface EnergyDevice extends Device {
  // Any energy-specific device properties
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  status: 'new' | 'acknowledged' | 'resolved';
  created_at: string;
  updated_at?: string;
  device_id?: string;
  site_id?: string;
  device_name?: string;
  site_name?: string;
  acknowledged_by?: string;
  resolved_by?: string;
  acknowledged_at?: string;
  resolved_at?: string;
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
  protocol: string;
  support_level: 'none' | 'full' | 'partial' | 'beta';
  images?: string[];
  has_manual?: boolean;
  has_datasheet?: boolean;
  has_video?: boolean;
  datasheets?: string[];
  firmware_versions?: string[];
}

export interface EnergyReading {
  id: string;
  device_id: string;
  timestamp: string;
  created_at?: string;
  metric: string; 
  value: number;
  unit: string;
  is_forecast?: boolean;
}

export interface TelemetryData {
  readings: EnergyReading[];
  latestValue: number;
  unit: string;
  deviceId: string;
  metric: string;
  timestamp?: string;
}
