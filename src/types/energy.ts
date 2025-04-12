// Extend the existing energy.ts file with SystemRecommendation type
export type DeviceStatus = 'online' | 'offline' | 'maintenance' | 'error' | 'warning' | 'idle' | 'active' | 'charging' | 'discharging';

export type DeviceType = 'solar' | 'battery' | 'wind' | 'grid' | 'load' | 'ev_charger' | 'inverter' | 'meter' | 'light' | 'generator' | 'hydro' | 'sensor';

export interface EnergyDevice {
  id: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  capacity: number;
  current_output?: number;
  location?: string;
  description?: string;
  firmware?: string;
  firmware_version?: string;
  protocol?: string;
  site_id: string;
  created_at: string;
  last_updated: string;
  metrics?: Record<string, number> | null;
  model?: string;
  installation_date?: string;
}

export interface EnergyReading {
  id?: string;
  device_id: string;
  timestamp: string;
  value?: number;
  unit?: string;
  power?: number;
  energy?: number;
  voltage?: number;
  current?: number;
  temperature?: number;
  state_of_charge?: number;
  frequency?: number;
  created_at?: string;
}

export interface Prediction {
  id: string;
  site_id: string;
  created_at: string;
  predicted_generation: number;
  predicted_consumption: number;
  prediction_time: string;
  confidence: number;
  model_version?: string;
}

export interface SystemRecommendation {
  id: string;
  site_id?: string;
  title: string;
  description: string;
  type: string;
  priority: string;
  potential_savings?: string;
  confidence?: number;
  applied: boolean;
  applied_at?: string;
  applied_by?: string;
  created_at: string;
  implementation_effort?: string;
}

export interface DeviceModel {
  id: string;
  manufacturer: string;
  model: string;
  name: string;
  model_number: string;
  device_type: string;
  category: string;
  protocol?: string;
  firmware_version?: string;
  supported: boolean;
  description?: string;
  images?: string[];
  power_rating?: number;
  capacity?: number;
  has_manual?: boolean;
  has_datasheet?: boolean;
  has_video?: boolean;
  specifications?: any;
}

export interface Alert {
  id: string;
  device_id: string;
  type: string;
  severity: string;
  message: string;
  acknowledged: boolean;
  timestamp: string;
  source?: string;
  acknowledged_at?: string;
  acknowledged_by?: string;
  resolved_at?: string;
}

export interface TelemetryData {
  id?: string;
  timestamp: string;
  power: number;
  energy: number;
  voltage?: number;
  current?: number;
  temperature?: number;
  state_of_charge?: number;
  device_id: string;
}

export interface EnergyFlowContextType {
  state: EnergyFlowState;
  dispatch: React.Dispatch<any>;
  addNode: (node: EnergyNode) => void;
  removeNode: (id: string) => void;
  addConnection: (connection: EnergyConnection) => void;
  removeConnection: (id: string) => void;
}

export interface EnergyFlowState {
  nodes: EnergyNode[];
  connections: EnergyConnection[];
  selectedNode: string | null;
  selectedConnection: string | null;
  viewMode: 'edit' | 'view';
  autoLayout: boolean;
  theme: 'light' | 'dark';
}

export interface EnergyNode {
  id: string;
  type: DeviceType;
  name: string;
  position: { x: number; y: number };
  data?: {
    power?: number;
    energy?: number;
    status?: DeviceStatus;
    capacity?: number;
  };
}

export interface EnergyConnection {
  id: string;
  source: string;
  target: string;
  power?: number;
  energy?: number;
  direction?: 'bidirectional' | 'source-to-target' | 'target-to-source';
  status?: 'active' | 'inactive';
}

export interface OptimizationSettings {
  priority: 'cost' | 'self_consumption' | 'carbon';
  battery_strategy: 'charge_from_solar' | 'time_of_use' | 'backup_only';
  ev_charging_time: string;
  ev_departure_time: string;
  peak_shaving_enabled: boolean;
  max_grid_power?: number;
  energy_export_limit?: number;
}

export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  potential_savings: number;
  type: 'energy' | 'cost' | 'maintenance' | 'carbon';
  priority: 'low' | 'medium' | 'high';
  status: string;
  confidence: number;
  created_at: string;
}

export interface EnergyForecast {
  id: string;
  timestamp: string;
  forecast_time: string;
  site_id: string;
  generation_forecast: number;
  consumption_forecast: number;
  confidence: number;
  temperature?: number;
  cloud_cover?: number;
  wind_speed?: number;
  source?: string;
  created_at: string;
}

export interface OptimizationResult {
  id: string;
  timestamp_start: string;
  timestamp_end: string;
  schedule: any;
  cost_savings: number;
  carbon_savings: number;
  energy_savings: number;
  source: string;
}

export interface UserPreference {
  id: string;
  user_id: string;
  max_soc?: number;
  min_soc?: number;
  priority_device_ids?: string[];
  time_window_start?: string;
  time_window_end?: string;
}

export interface Site {
  id: string;
  name: string;
  location: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  timezone: string;
  lat?: number;
  lng?: number;
  created_at?: string;
  updated_at?: string;
  type?: string;
  status?: 'active' | 'inactive' | 'maintenance';
  site_type?: string;
  building_type?: string; 
  area?: number;
  tags?: Record<string, any>;
  main_image_url?: string;
  organization_id?: string;
  contact_person?: string;
  contact_email?: string;
  contact_phone?: string;
  description?: string;
}

export interface Tariff {
  id: string;
  timestamp: string;
  price_eur_kwh: number;
  type?: string;
  source?: string;
}

export interface DateRange {
  from: Date;
  to: Date;
}
