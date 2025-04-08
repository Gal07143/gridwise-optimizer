
// Energy Data Types
export type DeviceType = 
  | 'solar' 
  | 'battery' 
  | 'ev_charger' 
  | 'grid' 
  | 'load'
  | 'inverter' 
  | 'meter'
  | 'wind' 
  | 'hydro'
  | 'generator'
  | 'light';

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

export interface Site {
  id: string;
  name: string;
  location: string;
  timezone: string;
  lat?: number;
  lng?: number;
  created_at?: string;
  updated_at?: string;
  type?: string;
}

export interface EnergyDevice {
  id: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  site_id?: string;
  capacity: number;
  location?: string;
  description?: string;
  lat?: number;
  lng?: number;
  created_at: string;
  last_updated: string;
  metrics?: Record<string, any>;
  connection_info?: Record<string, any>;
  installation_date?: string;
  firmware?: string;
  firmware_version?: string;
  tags?: string[] | Record<string, any>;
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
  value?: number;
  unit?: string;
  created_at?: string;
}

export interface DeviceModel {
  id: string;
  name: string;
  manufacturer: string;
  model_number: string;
  device_type: DeviceType;
  power_rating?: number;
  capacity?: number;
  support_level: "none" | "partial" | "full";
  category: string;
  description?: string;
  protocol?: string;
  dimensions?: string;
  weight?: number;
  release_date?: string;
  firmware_version?: string;
  warranty?: string;
  connectivity?: Record<string, any>;
  specifications?: Record<string, any>;
  images?: string[] | Record<string, any>;
  manuals?: Record<string, any>;
  datasheets?: Record<string, any>;
  videos?: Record<string, any>;
  compatible_with?: string[];
  certifications?: string[];
  has_manual?: boolean;
  has_datasheet?: boolean;
}

export interface EnergyForecast {
  id: string;
  site_id: string;
  forecast_time: string;
  timestamp: string;
  generation_forecast: number;
  consumption_forecast: number;
  temperature?: number;
  cloud_cover?: number;
  wind_speed?: number;
  weather_condition?: string;
  confidence?: number;
  created_at?: string;
}

export interface Tariff {
  id: string;
  timestamp: string;
  price_eur_kwh: number;
  type?: string;
  source?: string;
}

export interface OptimizationResult {
  id: string;
  site_id?: string;
  user_id?: string;
  timestamp_start?: string;
  timestamp_end?: string;
  schedule_json?: Record<string, any>;
  cost_estimate?: number;
  source_data_hash?: string;
}

export interface AIRecommendation {
  id: string;
  site_id?: string;
  type: string;
  priority: string;
  title: string;
  description: string;
  potential_savings?: string;
  confidence?: number;
  applied?: boolean;
  applied_at?: string;
  applied_by?: string;
  created_at?: string;
}

export interface Alert {
  id: string;
  device_id: string;
  type: string;
  timestamp: string;
  severity?: string;
  message: string;
  source?: string;
  acknowledged: boolean;
  acknowledged_by?: string;
  acknowledged_at?: string;
  resolved_at?: string;
  title?: string;
}

export interface ModbusDevice {
  id: string;
  name: string;
  ip: string;
  port: number;
  unit_id: number;
  protocol: "tcp" | "rtu";
  is_active: boolean;
  description?: string;
  address?: string;
  inserted_at?: string;
  updated_at?: string;
  created_at?: string;
}

export interface ModbusReadingResult {
  address: number;
  value: number;
  formattedValue: string;
  timestamp: string;
  success: boolean;
  error?: string | Error;
}

export interface ConnectionStatusResult {
  status: 'connected' | 'disconnected' | 'connecting' | 'error';
  message?: string;
  isOnline?: boolean;
  isConnected?: boolean;
  isConnecting?: boolean;
  connect?: () => Promise<void>;
  disconnect?: () => Promise<void>;
  retryConnection?: () => Promise<void>;
}

export interface TelemetryData {
  timestamp: string;
  value: number;
  unit?: string;
  type?: string;
  device_id?: string;
}

export interface SystemRecommendation {
  id: string;
  title: string;
  description: string;
  potentialSavings?: number;
  impact: 'low' | 'medium' | 'high';
  type: 'energy' | 'cost' | 'maintenance' | 'carbon';
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'applied' | 'dismissed';
}
