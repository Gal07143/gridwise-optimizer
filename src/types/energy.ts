
// Types for the Energy Management System

export interface EnergyDevice {
  id: string;
  name: string;
  type: 'solar' | 'wind' | 'battery' | 'grid' | 'load' | 'ev_charger';
  status: 'online' | 'offline' | 'maintenance' | 'error';
  location: string;
  capacity: number; // in kW or kWh
  lastUpdated: string;
  firmware: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  metrics?: Record<string, number>;
}

export interface EnergyReading {
  id: string;
  deviceId: string;
  timestamp: string;
  power: number; // in kW
  energy: number; // in kWh
  voltage?: number;
  current?: number;
  frequency?: number;
  temperature?: number;
  stateOfCharge?: number; // for batteries, in percentage
}

export interface Alert {
  id: string;
  deviceId: string;
  type: 'warning' | 'critical' | 'info';
  message: string;
  timestamp: string;
  acknowledged: boolean;
  resolvedAt?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'operator' | 'viewer';
  createdAt: string;
  lastLogin?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
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
  coordinates: {
    lat: number;
    lng: number;
  };
  devices: string[]; // Array of device IDs
  createdAt: string;
  updatedAt: string;
}
