
export interface EnergyDevice {
  id: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  site_id: string;
  created_at?: string;
  last_updated?: string;
  metadata?: Record<string, any>;
  manufacturer?: string;
  model?: string;
  firmware_version?: string;
  installation_date?: string;
  metrics?: Record<string, any>;
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
  power_factor?: number;
  temperature?: number;
  state_of_charge?: number;
  created_at?: string;
}

export interface OptimizationSettings {
  priority: 'cost' | 'self_consumption' | 'carbon' | 'peak_shaving';
  battery_strategy: 'charge_from_solar' | 'time_of_use' | 'backup_only';
  ev_charging_time: string;
  ev_departure_time: string;
  peak_shaving_enabled: boolean;
  max_grid_power?: number;
  energy_export_limit?: number;
  
  // Added fields that were missing
  min_soc?: number;
  max_soc?: number;
  time_window_start?: string;
  time_window_end?: string;
  objective?: 'cost' | 'self_consumption' | 'carbon' | 'peak_shaving';
  
  // Backward compatibility fields
  minBatterySoc?: number;
  maxBatterySoc?: number;
  priority_device_ids?: string[];
  evTargetSoc?: number;
}

export interface OptimizationResult {
  id?: string;
  schedule: {
    battery?: {
      charge: {
        start: string;
        end: string;
        power: number;
      }[];
      discharge: {
        start: string;
        end: string;
        power: number;
      }[];
    };
    ev_charging?: {
      vehicle_id: string;
      start: string;
      end: string;
      power: number;
    }[];
  };
  savings: {
    cost: number;
    co2: number;
  };
  site_id?: string;
}

export interface EnergyForecast {
  id: string;
  timestamp: string;
  site_id: string;
  forecasted_load: number;
  forecasted_generation: number;
  forecasted_battery_soc: number;
  confidence: number;
  created_at: string;
  weather_condition?: string;
  temperature?: number;
}

export interface DeviceModel {
  id: string;
  name: string;
  description?: string;
  manufacturer: string;
  type: DeviceType;
  capabilities: string[];
  support_level?: 'full' | 'partial' | 'experimental';
  integration_notes?: string;
  model: string;
  supported: boolean;
}

export interface DeviceControlAction {
  deviceId: string;
  action: string;
  parameters: Record<string, any>;
}

export interface DeviceControlResult {
  success: boolean;
  message: string;
  data?: any;
}

export interface ChartDataPoint {
  timestamp: string | number;
  value: number;
  [key: string]: any;
}

export interface ChartSeries {
  name: string;
  data: ChartDataPoint[];
  color?: string;
}

export interface WeatherForecast {
  timestamp: string;
  condition: string;
  temperature: number;
  humidity: number;
  wind_speed: number;
  precipitation_probability: number;
  cloud_cover: number;
  solar_irradiance: number;
}
