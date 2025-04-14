
export type DeviceType = 'solar' | 'battery' | 'inverter' | 'meter' | 'ev_charger' | 'load' | 'grid' | 'generator' | 'wind' | 'other';

export type DeviceStatus = 'online' | 'offline' | 'warning' | 'error' | 'maintenance';

export interface EnergyDevice {
  id: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  location?: string;
  capacity?: number;
  firmware?: string;
  description?: string;
  manufacturer?: string;
  model?: string;
  installation_date?: string;
  last_maintenance?: string;
  site_id?: string;
  ip_address?: string;
  mac_address?: string;
  last_seen?: string;
  serial_number?: string;
}

export interface ConsumptionData {
  timestamp: string;
  value: number;
  unit: string;
}

export interface DeviceState {
  power: number;
  energy: number;
  voltage: number;
  current: number;
  frequency: number;
  temperature: number;
  state_of_charge?: number;
  state_of_health?: number;
}

// Define the Site interface to avoid conflicts with site.ts
export interface SiteEnergy {
  id: string;
  name: string;
  address: string;
  timezone: string;
  geo_location?: {
    latitude: number;
    longitude: number;
  };
  active: boolean;
  created_at: string;
  updated_at: string;
}

// Add these types for useForecast.ts
export interface ProcessedForecastData {
  timestamp: string;
  production: number;
  consumption: number;
  balance: number;
}

export interface ForecastMetrics {
  totalConsumption: number;
  totalGeneration?: number;
  peakLoad: number;
  minLoad: number;
  averageProduction: number;
  selfConsumptionRate: number;
  gridDependenceRate: number;
  netEnergy?: number;
}

// Add EnergyReading interface for useLiveTelemetry
export interface EnergyReading {
  timestamp: string;
  value: number;
  type: string;
  deviceId: string;
  unit: string;
}

// Add SystemRecommendation for usePredictions
export interface SystemRecommendation {
  id: string;
  timestamp: string;
  type: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  impact: number;
  implemented: boolean;
  savings?: number;
  category?: string;
}

// Import Site type from site.ts for compatibility
import { Site } from './site';
export { Site };
