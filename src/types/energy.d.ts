export type UserRole = 'admin' | 'viewer' | 'operator' | 'installer' | 'user';

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

export interface UserPreferences {
  theme: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  dashboardLayout: any;
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

export const createEmptySite = (): Omit<Site, 'id' | 'created_at' | 'updated_at'> => ({
  name: "New Site",
  location: "Unknown",
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
});

export interface EnergyDevice {
  id: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  site_id: string;
  metrics: Record<string, number> | null;
  location?: string;
  description?: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  firmwareVersion?: string;
  installationDate?: string;
  lastMaintenanceDate?: string;
  latitude?: number;
  longitude?: number;
  powerRating?: number;
  energyCapacity?: number;
  efficiency?: number;
  maxVoltage?: number;
  minVoltage?: number;
  maxCurrent?: number;
  minCurrent?: number;
  nominalVoltage?: number;
  nominalCurrent?: number;
  communicationProtocol?: string;
  dataUpdateFrequency?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type DeviceType =
  | 'solar'
  | 'wind'
  | 'battery'
  | 'grid'
  | 'load'
  | 'ev_charger'
  | 'generator'
  | 'hydro';

export type DeviceStatus =
  | 'online'
  | 'offline'
  | 'idle'
  | 'active'
  | 'charging'
  | 'discharging'
  | 'maintenance'
  | 'error';
