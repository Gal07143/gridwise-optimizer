
// Core device types
export enum DeviceType {
  BATTERY = 'battery',
  INVERTER = 'inverter',
  SOLAR = 'solar',
  METER = 'meter',
  CHARGER = 'charger',
  LOAD = 'load',
  GENERATOR = 'generator',
  HVAC = 'hvac',
  GATEWAY = 'gateway',
  OTHER = 'other'
}

// Device status enum
export enum DeviceStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  ERROR = 'error',
  MAINTENANCE = 'maintenance',
  UNKNOWN = 'unknown'
}

// Energy device interface
export interface EnergyDevice {
  id: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  model?: string;
  manufacturer?: string;
  serial_number?: string;
  firmware_version?: string;
  installation_date?: string;
  last_communication?: string;
  location?: string;
  capacity?: number; // Added missing properties
  firmware?: string;
  description?: string;
  metadata?: Record<string, any>;
  isOnline?: boolean;
  efficiency?: number;
  load?: number;
}

// Energy reading interface
export interface EnergyReading {
  device_id: string;
  timestamp: string;
  power: number;
  energy?: number;
  voltage?: number;
  current?: number;
  frequency?: number;
  temperature?: number;
  state_of_charge?: number;
  power_factor?: number;
  metadata?: Record<string, any>;
}

// Forecast data
export interface ProcessedForecastData {
  timestamps: string[];
  consumption: number[];
  generation: number[];
  net: number[];
}

// Forecast metrics
export interface ForecastMetrics {
  accuracy: number;
  rmse: number;
  reliability: number;
}

// System recommendation
export interface SystemRecommendation {
  id: string;
  title: string;
  description: string;
  impact: string;
  priority: 'high' | 'medium' | 'low';
  action_required: boolean;
  timestamp: string;
}
