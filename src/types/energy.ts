
// File: src/types/energy.ts
export type DeviceCategory = 'inverter' | 'meter' | 'battery' | 'solar' | 'load' | 'sensor' | 'evCharger' | 'wind';

// Make DeviceType a string instead of a specific union to resolve type compatibility
export type DeviceType = string;

// Make DeviceStatus a string instead of a specific union to resolve type compatibility
export type DeviceStatus = string;

export interface EnergyDevice {
  id: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  location?: string;
  capacity: number;
  firmware?: string;
  description?: string;
  installation_date?: string;
  site_id?: string | null;
  metrics?: Record<string, number> | null;
  created_at?: string;
  last_updated?: string;
  created_by?: string;
  
  // Add missing properties referenced in errors
  protocol?: string;
  ip_address?: string;
  last_seen?: string;
  model?: string;
  manufacturer?: string;
  serialNumber?: string;
  lat?: number;
  lng?: number;
  tags?: string[] | Record<string, any>;
  value?: number;
  reading_type?: string;
  unit?: string;
  quality?: number;
}

export type Device = EnergyDevice;

export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role?: UserRole;
  created_at?: string;
  updated_at?: string;
  preferences?: Record<string, any>;
}

// Include installer and operator roles since they're used in the app
export type UserRole = 'admin' | 'user' | 'viewer' | 'manager' | 'installer' | 'operator';

export interface Site {
  id: string;
  name: string;
  location: string;
  lat?: number;
  lng?: number;
  timezone: string; // Make timezone required to match site.ts
  created_at: string; // Make required to match site.ts
  updated_at: string; // Make required to match site.ts
  type: string; // Make required to match site.ts
  status: string; // Make required to match site.ts
  
  // Additional site properties
  address?: string;
  description?: string;
  energy_category?: string;
  building_type?: string;
  area?: number;
  contact_person?: string;
  contact_phone?: string;
  contact_email?: string;
}

// Add missing Alert interface
export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  status: 'new' | 'acknowledged' | 'resolved';
  timestamp: string;
  created_at?: string;
  updated_at?: string;
  device_id?: string;
  site_id?: string;
  device_name?: string;
  site_name?: string;
  acknowledged_by?: string;
  resolved_by?: string;
  acknowledged_at?: string;
  resolved_at?: string;
  acknowledged: boolean;
  resolved: boolean;
  source?: string;
  alert_source?: string;
  assignedTo?: string;
  category?: string;
  metadata?: Record<string, any>;
  type?: string;
}

export interface EnergyReading {
  id: string;
  device_id: string;
  timestamp: string;
  power: number;
  energy: number;
  voltage?: number;
  current?: number;
  frequency?: number;
  temperature?: number;
  state_of_charge?: number;
  created_at?: string;
  
  // Add missing value property that's referenced in errors
  value?: number;
  reading_type?: string;
  unit?: string;
  quality?: number;
}

export interface DateRange {
  from: Date;
  to: Date;
}

export interface EnergyAggregation {
  timestamp: string;
  interval: 'hour' | 'day' | 'week' | 'month';
  device_id?: string;
  site_id?: string;
  energy_produced?: number;
  energy_consumed?: number;
  peak_power?: number;
  average_power?: number;
}

// Add EnergyForecast for forecast functionality
export interface EnergyForecast {
  id: string;
  site_id: string;
  forecast_time: string;
  timestamp: string;
  created_at: string;
  generation_forecast: number;
  consumption_forecast: number;
  confidence?: number;
  weather_condition?: string;
  temperature?: number;
  cloud_cover?: number;
  wind_speed?: number;
  source?: string;
}

// Add TelemetryData interface
export interface TelemetryData {
  readings: EnergyReading[];
  latestValue: number;
  unit: string;
  deviceId: string;
  metric: string;
  timestamp?: string;
}

// Add DeviceModel interface that was referenced
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
  firmware_versions?: string[]; // Add this property that was referenced
  protocol: string;
  support_level: 'none' | 'full' | 'partial' | 'beta'; // Include 'beta' in the union
  images?: string[];
  has_manual?: boolean;
  has_datasheet?: boolean;
  has_video?: boolean;
  datasheets?: string[];
}
