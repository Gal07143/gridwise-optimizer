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
  | 'light'
  | 'sensor'; 

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
  description?: string;
  timezone: string;
  lat?: number;
  lng?: number;
  created_at?: string;
  updated_at?: string;
  type?: string;
  status?: 'active' | 'inactive' | 'maintenance';
}

export interface EnergyDevice {
  id: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  site_id: string;
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
  protocol?: string;
  updated_at?: string;
  current_output?: number;
  model?: string;
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
  support_level: "none" | "partial" | "full" | "beta" | "community";
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
  model_name?: string; // Add model_name
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
  source?: string; // Add source property
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
  error?: Error;
}

export interface ConnectionStatusResult {
  status: 'connected' | 'disconnected' | 'connecting' | 'error';
  message?: string;
  isOnline?: boolean;
  isConnected?: boolean;
  isConnecting?: boolean;
  lastOnline?: Date | null;
  lastOffline?: Date | null;
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
  potential_savings?: string; // For backward compatibility
  implementation_effort?: string;
  impact: 'low' | 'medium' | 'high';
  type: 'energy' | 'cost' | 'maintenance' | 'carbon';
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'applied' | 'dismissed';
  confidence: number;
}

export interface ModbusRegisterDefinition {
  id: string;
  device_id?: string;
  name: string;
  address: number;
  registerType: "input" | "holding";
  dataType: "int16" | "uint16" | "int32" | "uint32" | "float32";
  access: "read" | "write" | "read/write";
  scaleFactor?: number;
  scaling_factor?: number; // For backward compatibility
  unit?: string;
  description?: string;
  register_address?: number;
  register_name?: string;
  register_length?: number;
}

export interface ModbusRegisterMap {
  registers: ModbusRegisterDefinition[];
}

export interface ModbusDeviceConfig {
  id?: string;
  name: string;
  ip: string;
  port: number;
  unit_id: number;
  protocol: "tcp" | "rtu";
  is_active?: boolean;
  description?: string;
  site_id?: string;
}

export interface EnergyFlowContextType {
  nodes: EnergyNode[];
  connections: EnergyConnection[];
  totalGeneration: number;
  totalConsumption: number;
  batteryPercentage: number;
  selfConsumptionRate: number;
  gridDependencyRate: number;
  refreshData: () => void;
  isLoading: boolean;
}

export interface EnergyFlowState {
  nodes: EnergyNode[];
  connections: EnergyConnection[];
  isLoading: boolean;
}

export interface EnergyNode {
  id: string;
  label: string;
  type: 'source' | 'storage' | 'consumption';
  power: number;
  status: 'active' | 'inactive' | 'warning' | 'error';
  deviceType: string;
  batteryLevel?: number;
}

export interface EnergyConnection {
  from: string;
  to: string;
  value: number;
  active: boolean;
  color?: string;
}

export interface UserPreference {
  id: string;
  user_id?: string;
  min_soc: number;
  max_soc: number;
  priority_device_ids: string[];
  time_window_start: string;
  time_window_end: string;
}

// Define optimization settings
export interface OptimizationSettings {
  min_soc?: number;
  max_soc?: number;
  minBatterySoc?: number;
  maxBatterySoc?: number;
  priority_device_ids?: string[];
  time_window_start?: string;
  time_window_end?: string;
  evTargetSoc?: number;
  evDepartureTime?: string;
  objective?: string;
}
