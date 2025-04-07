
export interface DeviceType {
  id: string;
  name: string;
  icon?: string;
  category?: string;
  description?: string;
}

export interface DeviceStatus {
  id: string;
  name: string;
  description?: string;
  severity?: 'info' | 'warning' | 'error' | 'success';
  icon?: string;
}

export interface EnergyDevice {
  id: string;
  name: string;
  type: string;
  status: string;
  site_id?: string;
  manufacturer?: string;
  model?: string;
  serial_number?: string;
  install_date?: string;
  last_maintenance?: string;
  next_maintenance?: string;
  firmware_version?: string;
  ip_address?: string;
  mac_address?: string;
  location?: string;
  description?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
  telemetry_prefix?: string;
}

export interface DeviceModel {
  id: string;
  name: string;
  manufacturer: string;
  type: string;
  protocol?: string;
  description?: string;
  power_rating?: number;
  voltage_rating?: number;
  current_rating?: number;
  dimensions?: string;
  weight?: number;
  efficiency?: number;
  warranty_years?: number;
  datasheet_url?: string;
  manual_url?: string;
  image_url?: string;
  firmware_version?: string;
  support_level: 'none' | 'partial' | 'full' | 'beta';
  created_at?: string;
  updated_at?: string;
  features?: string[];
  certifications?: string[];
  images?: string[] | Record<string, any>;
  has_manual?: boolean;
  has_datasheet?: boolean;
}

export interface EnergyReading {
  id?: string;
  device_id: string;
  timestamp: string;
  metric: string;
  value: number;
  unit?: string;
  created_at?: string;
}

export interface TelemetryData {
  timestamp: string;
  value: number;
  deviceId: string;
  metricId: string;
}

export interface EnergyForecast {
  id?: string;
  site_id: string;
  forecast_type: 'production' | 'consumption' | 'demand' | 'price';
  timestamp: string;
  value: number;
  confidence?: number;
  unit?: string;
  source?: string;
  created_at?: string;
}
