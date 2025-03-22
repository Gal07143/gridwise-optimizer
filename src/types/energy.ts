// Device-related Types
export type DeviceType = 
  | 'battery'
  | 'solar'
  | 'wind'
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

export interface EnergyDevice {
  id: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  location?: string;
  capacity: number;
  site_id?: string;
  firmware?: string;
  installation_date?: string;
  last_updated: string;
  lat?: number;
  lng?: number;
  metrics?: Record<string, number> | null;
  description?: string;
  created_by?: string;
}

// Site
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

export const createEmptySite = (): Omit<Site, 'id' | 'created_at' | 'updated_at'> => ({
  name: 'New Site',
  location: 'Unknown',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
});

// User & Roles
export type UserRole = 'admin' | 'viewer' | 'operator' | 'installer' | 'user';
export type ThemePreference = 'light' | 'dark' | 'system';

export interface UserPreferences {
  theme: ThemePreference;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  dashboardLayout: any;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: string;
  lastLogin: string;
  preferences: UserPreferences;
  sites?: Site[];
}

// Forecasting
export interface EnergyForecast {
  id: string;
  site_id: string;
  timestamp: string;
  forecast_time: string;
  generation_forecast?: number;
  consumption_forecast?: number;
  temperature?: number;
  cloud_cover?: number;
  wind_speed?: number;
  weather_condition?: string;
  confidence?: number;
  source?: string;
  created_at?: string;
}

// Energy Readings
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
  created_at?: string;
}

// Device Models
export interface DeviceModel {
  id: string;
  manufacturer: string;
  model_name: string;
  name?: string;
  device_type: DeviceType;
  description?: string;
  specifications?: Record<string, any>;
  compatible_with?: string[];
  firmware_versions?: string[];
  created_at: string;
  updated_at?: string;
  category?: string;
}

// Alerts
export type AlertType = 
  | 'system'
  | 'device'
  | 'security'
  | 'performance'
  | 'forecast'
  | 'warning'
  | 'critical'
  | 'info';

export type AlertSeverity = 
  | 'critical'
  | 'high'
  | 'medium'
  | 'low'
  | 'info';

export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  source: string;
  source_id?: string;
  timestamp: string;
  acknowledged: boolean;
  resolved: boolean;
  device_id?: string;
  acknowledged_at?: string;
  acknowledged_by?: string;
  resolved_at?: string;
}
