
// File: src/types/energy.ts
export type DeviceCategory = 'inverter' | 'meter' | 'battery' | 'solar' | 'load' | 'sensor' | 'evCharger' | 'wind';

export type DeviceType = 
  | 'solar_inverter' 
  | 'battery_inverter' 
  | 'hybrid_inverter' 
  | 'ev_charger' 
  | 'smart_meter' 
  | 'battery_system' 
  | 'solar_panel'
  | 'energy_meter'
  | 'smart_plug'
  | 'weather_station'
  | 'wind_turbine'
  | 'light' // Additional types
  | 'hydro';

export type DeviceStatus = 
  | 'online' 
  | 'offline' 
  | 'maintenance' 
  | 'error' 
  | 'warning' 
  | 'standby'
  | 'idle' // Additional statuses
  | 'active'
  | 'charging'
  | 'discharging';

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
  tags?: string[];
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

export type UserRole = 'admin' | 'user' | 'viewer' | 'manager';

export interface Site {
  id: string;
  name: string;
  location: string;
  lat?: number;
  lng?: number;
  timezone?: string;
  created_at?: string;
  updated_at?: string;
  type?: string;
  status?: string;
  
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
