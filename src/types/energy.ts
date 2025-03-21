export type UserRole = 'admin' | 'installer' | 'user' | 'viewer';

export type ThemePreference = 'light' | 'dark' | 'system';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  createdAt: string;
  lastLogin?: string;
  preferences: {
    theme: ThemePreference;
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    dashboardLayout: any | null;
  };
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

export function createEmptySite(): Omit<Site, 'id' | 'created_at' | 'updated_at'> {
  return {
    name: '',
    location: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
  };
}

export type DeviceType = 'solar' | 'wind' | 'battery' | 'grid' | 'load' | 'ev_charger' | 'inverter' | 'meter';

export type DeviceStatus = 'online' | 'offline' | 'maintenance' | 'error' | 'warning';

export interface EnergyDevice {
  id: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  location: string | null;
  capacity: number;
  site_id: string | null;
  lat?: number | null;
  lng?: number | null;
  firmware?: string | null;
  description?: string | null;
  metrics?: Record<string, any>;
  created_at: string;
  last_updated: string;
  created_by?: string | null;
  installation_date?: string | null;
}

export interface EnergyReading {
  id: string;
  device_id: string;
  timestamp: string;
  power: number; // kW
  energy: number; // kWh
  voltage?: number; // V
  current?: number; // A
  frequency?: number; // Hz
  temperature?: number; // C
  state_of_charge?: number; // %
  created_at: string;
}

export interface EnergyForecast {
  id: string;
  site_id: string;
  timestamp: string;
  forecast_time: string;
  generation_forecast: number;
  consumption_forecast: number;
  temperature?: number;
  cloud_cover?: number;
  wind_speed?: number;
  weather_condition?: string;
  confidence?: number;
  source: string;
  created_at: string;
}

export interface DeviceModel {
  id: string;
  name: string;
  manufacturer: string;
  model_number: string;
  protocol: string;
  type: DeviceType;
  capacity: number;
  efficiency?: number;
  dimensions?: string;
  weight?: number;
  warranty_period?: number;
  certification?: string;
  description?: string;
  datasheet_url?: string;
  created_at: string;
  category?: string;
}

export type AlertType = 'warning' | 'critical' | 'info';
export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface Alert {
  id: string;
  device_id: string;
  type: AlertType;
  title: string;
  message: string;
  severity: AlertSeverity;
  timestamp: string;
  acknowledged: boolean;
  acknowledged_at?: string;
  acknowledged_by?: string;
  resolved_at?: string;
}

// Helper functions for type conversion between frontend and database
export const convertTypeForDatabase = (type: DeviceType): string => {
  return type;
};

export const convertStatusForDatabase = (status: DeviceStatus): string => {
  // The database enum only supports 'online', 'offline', 'maintenance', 'error'
  if (status === 'warning') {
    return 'error'; // Map 'warning' to 'error' for database compatibility
  }
  return status;
};

export const convertTypeFromDatabase = (type: string): DeviceType => {
  return type as DeviceType;
};

export const convertStatusFromDatabase = (status: string): DeviceStatus => {
  return status as DeviceStatus;
};
