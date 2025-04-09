
export interface EnergyDataPoint {
  timestamp: string;
  value: number;
  unit: string;
}

export interface EnergyMeasurement {
  id: string;
  type: 'consumption' | 'production' | 'storage' | 'import' | 'export';
  value: number;
  unit: 'kWh' | 'Wh' | 'MWh';
  timestamp: string;
  device_id?: string;
  site_id: string;
}

export interface EnergyFlowPoint {
  source: string;
  target: string;
  value: number;
  color?: string;
}

export interface EnergyFlowData {
  nodes: EnergyNode[];
  links: EnergyFlowPoint[];
  timestamp?: string;
}

export interface EnergyNode {
  id: string;
  type: 'producer' | 'consumer' | 'storage' | 'grid';
  name: string;
  value: number;
  unit?: string;
  status?: 'active' | 'inactive' | 'error';
  color?: string;
  icon?: string;
  power?: number;
  deviceType?: string;
  batteryLevel?: number;
  position?: { x: number; y: number };
  data?: { 
    power?: number; 
    energy?: number; 
    status?: string; 
    capacity?: number; 
  };
  label?: string;
}

export type DeviceType = 'solar' | 'wind' | 'battery' | 'grid' | 'load' | 'ev_charger' | 'inverter' | 'meter';
export type DeviceStatus = 'online' | 'offline' | 'maintenance' | 'error' | 'warning';

export interface EnergyDevice {
  id: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  capacity: number;
  current_output?: number;
  last_updated?: string;
  created_at: string;
  firmware?: string;
  model?: string;
  manufacturer?: string;
  location?: string;
  site_id: string;
  description?: string;
  protocol?: string;
  metrics?: Record<string, any>;
  updated_at?: string;
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
  created_at?: string;
}

export interface Alert {
  id: string;
  site_id: string;
  device_id?: string;
  timestamp: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  category: 'system' | 'device' | 'security' | 'performance';
  acknowledged: boolean;
  resolved: boolean;
  title: string;
  resolution_steps?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SystemRecommendation {
  id: string;
  site_id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  potential_savings: number;
  confidence: number;
  created_at: string;
  applied: boolean;
  applied_at?: string;
  status?: string;
  type?: string;
  impact?: string;
}

export interface EnergyForecast {
  id: string;
  site_id: string;
  forecast_type: 'generation' | 'consumption' | 'price';
  value: number;
  timestamp: string;
  created_at: string;
  confidence?: number;
  weather_condition?: string;
}

export interface OptimizationSettings {
  priority: 'cost' | 'self_consumption' | 'carbon';
  battery_strategy: 'charge_from_solar' | 'time_of_use' | 'backup_only';
  ev_charging_time: string;
  ev_departure_time: string;
  peak_shaving_enabled: boolean;
  max_grid_power?: number;
  energy_export_limit?: number;
  min_soc?: number;
  max_soc?: number;
  time_window_end?: string;
  objective?: string;
  minBatterySoc?: number;
  maxBatterySoc?: number;
}

export interface OptimizationResult {
  id: string;
  timestamp: string;
  created_at: string;
  settings: OptimizationSettings;
  projected_savings: number;
  co2_reduction: number;
  battery_cycles_saved: number;
  peak_reduction: number;
  site_id?: string;
}

export interface BatterySchedule {
  time: string;
  action: 'charge' | 'discharge' | 'hold';
  power: number;
  soc_after: number;
  reason: string;
}
