
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
  location: string;
  capacity: number; // in kW or kWh
  site_id?: string;
  firmware?: string;
  lat?: number;
  lng?: number;
  metrics?: Record<string, number> | null;
  last_updated: string;
  created_at: string;
  created_by?: string;
  installation_date?: string;
}

export interface EnergyReading {
  id: string;
  device_id: string;
  timestamp: string;
  power: number; // in kW
  energy: number; // in kWh
  voltage?: number;
  current?: number;
  frequency?: number;
  temperature?: number;
  state_of_charge?: number; // for batteries, in percentage
  created_at: string;
}

export interface Alert {
  id: string;
  device_id: string;
  type: AlertType;
  message: string;
  timestamp: string;
  acknowledged: boolean;
  acknowledged_by?: string;
  acknowledged_at?: string;
  resolved_at?: string;
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  createdAt: string;
  lastLogin?: string;
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
  lat?: number;
  lng?: number;
  created_at: string;
  updated_at: string;
}

export interface MaintenanceRecord {
  id: string;
  device_id: string;
  maintenance_type: string;
  description?: string;
  scheduled_date?: string;
  completed_date?: string;
  performed_by?: string;
  notes?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Report {
  id: string;
  title: string;
  description?: string;
  type: string;
  parameters?: any;
  created_by: string;
  created_at: string;
  last_run_at?: string;
  schedule?: string;
  site_id?: string;
  is_template: boolean;
}

export interface ReportResult {
  id: string;
  report_id: string;
  result_data: any;
  created_at: string;
  file_url?: string;
}

export interface WeatherData {
  id: string;
  site_id: string;
  timestamp: string;
  temperature?: number;
  humidity?: number;
  wind_speed?: number;
  wind_direction?: number;
  cloud_cover?: number;
  precipitation?: number;
  source?: string;
  forecast: boolean;
}
