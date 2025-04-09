
// Extend the existing energy.ts file with SystemRecommendation type
export type DeviceStatus = 'online' | 'offline' | 'maintenance' | 'error' | 'warning' | 'idle' | 'active' | 'charging' | 'discharging';

export type DeviceType = 'solar' | 'battery' | 'wind' | 'grid' | 'load' | 'ev_charger' | 'inverter' | 'meter' | 'light' | 'generator' | 'hydro';

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
  value: number;
  unit: string;
  power?: number;
  energy?: number;
  voltage?: number;
  current?: number;
  temperature?: number;
  state_of_charge?: number;
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
}

export interface DeviceModel {
  id: string;
  manufacturer: string;
  model: string;
  name?: string;
  model_number?: string;
  device_type?: string;
  category: string;
  protocol?: string;
  firmware_version?: string;
  supported?: boolean;
  description?: string;
  images?: string[];
  power_rating?: number;
  capacity?: number;
  has_manual?: boolean;
  has_datasheet?: boolean;
  has_video?: boolean;
}
