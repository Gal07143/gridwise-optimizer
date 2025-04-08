
export type DeviceType = 'inverter' | 'battery' | 'solar' | 'wind' | 'ev_charger' | 'meter' | 'grid' | 'load';
export type DeviceStatus = 'online' | 'offline' | 'warning' | 'error' | 'maintenance';
export type SupportLevel = 'none' | 'partial' | 'full' | 'beta';

export interface Site {
  id: string;
  name: string;
  location: string;
  timezone: string;
  lat?: number;
  lng?: number;
  status?: 'active' | 'inactive' | 'maintenance';
  created_at?: string;
  updated_at?: string;
}

export interface EnergyDevice {
  id: string;
  site_id?: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  description?: string;
  firmware_version?: string;
  location?: string;
  capacity: number;
  connection_info?: Record<string, any>;
  protocol?: string;
  config?: Record<string, any>;
  metrics?: Record<string, number>;
  lat?: number;
  lng?: number;
  installation_date?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  last_seen?: string;
}

export interface EnergyReading {
  id: string;
  device_id: string;
  timestamp: string;
  value: number;
  unit: string;
  power: number;
  energy: number;
  voltage?: number;
  current?: number;
  frequency?: number;
  temperature?: number;
  state_of_charge?: number;
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

export interface Tariff {
  id: number;
  timestamp: string;
  price_eur_kwh: number;
  source?: string;
  type?: string;
}

export interface OptimizationResult {
  id: number;
  site_id?: string;
  timestamp_start?: string;
  timestamp_end?: string;
  user_id?: string;
  schedule_json?: Record<string, any>;
  cost_estimate?: number;
  source_data_hash?: string;
}

export interface UserPreference {
  id: string;
  user_id?: string;
  min_soc?: number;
  max_soc?: number;
  time_window_start?: string;
  time_window_end?: string;
  priority_device_ids?: string[];
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
  applied: boolean;
  applied_at?: string;
  applied_by?: string;
  created_at: string;
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
  forecast: boolean;
  source?: string;
}

export interface Alert {
  id: string;
  device_id: string;
  type: string;
  severity?: string;
  message: string;
  acknowledged: boolean;
  acknowledged_by?: string;
  acknowledged_at?: string;
  resolved_at?: string;
  timestamp: string;
  source?: string;
}

export interface DeviceModel {
  id: string;
  name: string;
  manufacturer: string;
  model_number: string;
  device_type: string;
  category?: string;
  description?: string;
  power_rating?: number;
  capacity?: number;
  weight?: number;
  dimensions?: string;
  connectivity?: Record<string, any>;
  specifications?: Record<string, any>;
  release_date?: string;
  warranty?: string;
  support_level: "none" | "partial" | "full";
  protocol?: string;
  firmware_version?: string;
  images?: string[];
  manuals?: Record<string, any>;
  datasheets?: Record<string, any>;
  videos?: Record<string, any>;
  certifications?: string[];
  compatible_with?: string[];
  created_at?: string;
  updated_at?: string;
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
  inserted_at?: string;
  updated_at?: string;
}

export interface ModbusRegisterDefinition {
  id: string;
  device_id?: string;
  name: string;
  address: number;
  registerType: "input" | "holding";
  dataType: "int16" | "uint16" | "int32" | "uint32" | "float32";
  access: "read" | "write" | "read-write";
  scaleFactor?: number;
  unit?: string;
  description?: string;
}

export interface ModbusReadingResult {
  address: number;
  value: number;
  formattedValue: string;
  timestamp: string;
  success: boolean;
  error?: string;
}

// Energy Flow types
export interface EnergyNode {
  id: string;
  label: string;
  type: 'source' | 'storage' | 'consumption';
  power: number; // kW, negative for consumption
  status: 'active' | 'warning' | 'error' | 'inactive';
  deviceType: string;
  batteryLevel?: number; // % for storage
}

export interface EnergyConnection {
  from: string;
  to: string;
  value: number; // kW
  active: boolean;
}

export interface EnergyFlowState {
  nodes: EnergyNode[];
  connections: EnergyConnection[];
  isLoading: boolean;
}

export interface EnergyFlowContextType extends EnergyFlowState {
  totalGeneration: number;
  totalConsumption: number;
  batteryPercentage: number;
  selfConsumptionRate: number;
  gridDependencyRate: number;
  refreshData: () => Promise<void>;
  isLoading: boolean;
}

export interface EnergyNodeProps {
  node: EnergyNode;
  isSelected?: boolean;
  onClick?: () => void;
}
