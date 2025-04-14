
// Define site model
export interface Site {
  id: string;
  name: string;
  location: string;
  type: 'residential' | 'commercial' | 'industrial' | 'research' | 'other';
  capacity: number;
  status: 'active' | 'inactive' | 'maintenance' | 'offline';
  createdAt: string;
  updatedAt: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  timezone?: string;
  contacts?: SiteContact[];
  metadata?: Record<string, any>;
}

// Define site contact model
export interface SiteContact {
  id: string;
  name: string;
  role: string;
  email: string;
  phone?: string;
  primary: boolean;
}

// Define energy flow data
export interface EnergyFlow {
  timestamp: string;
  sources: {
    solar?: number;
    wind?: number;
    grid?: number;
    generator?: number;
    battery?: number;
    other?: number;
  };
  consumption: {
    building?: number;
    ev?: number;
    export?: number;
    other?: number;
  };
  storage: {
    batteryLevel?: number;
    batteryCapacity?: number;
    charging?: boolean;
    chargePower?: number;
    dischargePower?: number;
  };
}

// Define tariff data
export interface Tariff {
  id: string;
  name: string;
  provider: string;
  type: 'fixed' | 'time-of-use' | 'dynamic' | 'demand';
  currency: string;
  rates: TariffRate[];
  validFrom: string;
  validUntil?: string;
  siteId: string;
}

// Define tariff rate
export interface TariffRate {
  id: string;
  name?: string;
  price: number;
  unit: 'kWh' | 'kW' | 'day';
  timeStart?: string; // 24h format HH:MM
  timeEnd?: string; // 24h format HH:MM
  daysOfWeek?: number[]; // 0-6, 0 = Sunday
  months?: number[]; // 1-12
}

// Device type and status enums
export enum DeviceType {
  SOLAR = 'solar',
  WIND = 'wind',
  BATTERY = 'battery',
  GRID = 'grid',
  LOAD = 'load',
  EV_CHARGER = 'ev_charger',
  INVERTER = 'inverter',
  METER = 'meter',
  SENSOR = 'sensor'
}

export enum DeviceStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  MAINTENANCE = 'maintenance',
  ERROR = 'error',
  STANDBY = 'standby'
}

// Energy device definition
export interface EnergyDevice {
  id: string;
  name: string;
  type: DeviceType | string;
  status: DeviceStatus | string;
  location?: string;
  capacity?: number;
  firmware?: string;
  description?: string;
  site_id?: string;
  last_updated?: Date | string;
  created_at?: Date | string;
  metadata?: Record<string, any>;
}

// Energy reading data
export interface EnergyReading {
  device_id: string;
  timestamp: string;
  power?: number;
  energy?: number;
  voltage?: number;
  current?: number;
  frequency?: number;
  power_factor?: number;
  state_of_charge?: number;
  temperature?: number;
  [key: string]: any;
}

// Forecast related types
export interface ProcessedForecastData {
  timestamp: string;
  production: number;
  consumption: number;
  balance: number;
}

export interface ForecastMetrics {
  totalGeneration: number;
  totalConsumption: number;
  netEnergy: number;
  peakGeneration: number;
  peakConsumption: number;
  selfConsumptionRate: number;
}

// System recommendation type
export interface SystemRecommendation {
  id: string;
  site_id: string;
  title: string;
  description: string;
  type: string;
  priority: 'high' | 'medium' | 'low';
  potential_savings?: number;
  created_at: string;
  applied: boolean;
  applied_at?: string;
  details?: Record<string, any>;
}
