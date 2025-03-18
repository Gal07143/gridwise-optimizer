// Types for the Energy Management System

export type DeviceType = 'solar' | 'wind' | 'battery' | 'grid' | 'load' | 'ev_charger';
export type DeviceStatus = 'online' | 'offline' | 'maintenance' | 'error';
export type AlertType = 'warning' | 'critical' | 'info';
export type UserRole = 'admin' | 'operator' | 'viewer';
export type ThemePreference = 'light' | 'dark' | 'system';

export interface EnergyDevice {
  id: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  location: string | null;
  capacity: number; // in kW or kWh
  site_id?: string | null;
  firmware?: string | null;
  description?: string | null;
  lat?: number | null;
  lng?: number | null;
  metrics?: Record<string, number> | null;
  last_updated: string;
  created_at: string;
  created_by?: string | null;
  installation_date?: string | null;
}

export interface EnergyReading {
  id: string;
  device_id: string;
  timestamp: string;
  power: number; // in kW
  energy: number; // in kWh
  voltage?: number | null;
  current?: number | null;
  frequency?: number | null;
  temperature?: number | null;
  state_of_charge?: number | null; // for batteries, in percentage
  created_at: string;
}

export interface Alert {
  id: string;
  device_id: string;
  type: AlertType;
  message: string;
  timestamp: string;
  acknowledged: boolean;
  acknowledged_by?: string | null;
  acknowledged_at?: string | null;
  resolved_at?: string | null;
}

export interface User {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  role: UserRole;
  createdAt: string;
  lastLogin?: string | null;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: ThemePreference;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  dashboardLayout?: any;
}

export interface Site {
  id: string;
  name: string;
  location: string;
  timezone: string;
  lat?: number | null;
  lng?: number | null;
  created_at: string;
  updated_at: string;
}

export interface MaintenanceRecord {
  id: string;
  device_id: string;
  maintenance_type: string;
  description?: string | null;
  scheduled_date?: string | null;
  completed_date?: string | null;
  performed_by?: string | null;
  notes?: string | null;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Report {
  id: string;
  title: string;
  description?: string | null;
  type: string;
  parameters?: any;
  created_by: string;
  created_at: string;
  last_run_at?: string | null;
  schedule?: string | null;
  site_id?: string | null;
  is_template: boolean;
}

export interface ReportResult {
  id: string;
  report_id: string;
  result_data: any;
  created_at: string;
  file_url?: string | null;
}

export interface WeatherData {
  id: string;
  site_id: string;
  timestamp: string;
  temperature?: number | null;
  humidity?: number | null;
  wind_speed?: number | null;
  wind_direction?: number | null;
  cloud_cover?: number | null;
  precipitation?: number | null;
  source?: string | null;
  forecast: boolean;
}

export interface PowerQualityReading {
  id: string;
  device_id: string;
  timestamp: string;
  frequency: number; // in Hz
  voltage: number; // in V
  current?: number | null; // in A
  active_power?: number | null; // in kW
  reactive_power?: number | null; // in kVAR
  apparent_power?: number | null; // in kVA
  power_factor?: number | null; // unitless (0-1)
  voltage_thd?: number | null; // Total Harmonic Distortion in %
  current_thd?: number | null; // Total Harmonic Distortion in %
  voltage_imbalance?: number | null; // in %
  harmonics?: Record<string, number> | null; // Harmonic values by order
  created_at: string;
}

export interface BatteryHealthData {
  id: string;
  device_id: string;
  timestamp: string;
  state_of_charge: number; // in percentage
  state_of_health: number; // in percentage
  temperature: number; // in Celsius
  cycle_count: number; // count
  dc_internal_resistance?: number | null; // in mOhm
  capacity_actual?: number | null; // in kWh
  capacity_remaining?: number | null; // in kWh
  charge_current_limit?: number | null; // in A
  discharge_current_limit?: number | null; // in A
  charge_voltage_limit?: number | null; // in V
  discharge_voltage_limit?: number | null; // in V
  cell_imbalance?: number | null; // in mV
  created_at: string;
}

export interface EnergyForecast {
  id: string;
  site_id: string;
  timestamp: string;
  forecast_time: string;
  generation_forecast: number; // in kWh
  consumption_forecast: number; // in kWh
  weather_condition?: string | null;
  temperature?: number | null; // in Celsius
  cloud_cover?: number | null; // in percentage
  wind_speed?: number | null; // in m/s
  confidence?: number | null; // in percentage
  source: string; // 'model', 'historical', etc.
  created_at: string;
}

// Add validation utility functions
export const isValidDeviceType = (type: string): type is DeviceType => {
  return ['solar', 'wind', 'battery', 'grid', 'load', 'ev_charger'].includes(type as DeviceType);
};

export const isValidDeviceStatus = (status: string): status is DeviceStatus => {
  return ['online', 'offline', 'maintenance', 'error'].includes(status as DeviceStatus);
};

// Site management utilities
export const createEmptySite = (): Omit<Site, 'id' | 'created_at' | 'updated_at'> => {
  return {
    name: 'Default Site',
    location: 'Default Location',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
};
