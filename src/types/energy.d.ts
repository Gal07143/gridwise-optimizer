
// File: src/types/energy.d.ts
export type DeviceCategory = 'inverter' | 'meter' | 'battery' | 'solar' | 'load' | 'sensor' | 'evCharger' | 'wind';

// Changed to string type to allow string literals to be assignable to DeviceType
export type DeviceType = string;

// Unified device statuses
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
  
  // Add missing properties
  protocol?: string;
  ip_address?: string;
  last_seen?: string;
  model?: string;
  manufacturer?: string;
  serialNumber?: string;
  lat?: number;
  lng?: number;
  tags?: string[] | Record<string, any>;
  
  // Add value property for readings
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
  
  // Additional properties needed for consistency
  firstName?: string;
  lastName?: string;
  lastLogin?: string;
  createdAt?: string;
}

export type UserRole = 'admin' | 'user' | 'viewer' | 'manager' | 'operator' | 'installer';

export interface Site {
  id: string;
  name: string;
  location: string;
  lat?: number;
  lng?: number;
  timezone: string;
  created_at: string;
  updated_at: string;
  type: string;
  status: string;
  
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
  value?: number;
  reading_type?: string;
  unit?: string;
  quality?: number;
  created_at?: string;
  readings?: any[];
  latestValue?: number;
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

// Add Alert interface that was missing
export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  timestamp: string;
  acknowledged: boolean;
  acknowledged_at?: string;
  device_id?: string;
  site_id?: string;
  resolved_at?: string;
  source?: string;
  type?: string;
  acknowledged_by?: string;
}
