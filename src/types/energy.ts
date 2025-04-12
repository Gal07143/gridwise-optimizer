export type WeatherCondition = 'Clear' | 'Cloudy' | 'Rainy' | 'Sunny' | 'Partially cloudy' | 'Overcast' | 'Stormy';

export interface WeatherForecast {
  timestamp: string;
  temperature: number;
  weather_condition: WeatherCondition;
  cloud_cover: number;
  wind_speed: number;
  precipitation?: number;
  humidity?: number;
  pressure?: number;
  solar_irradiance?: number;
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
  frequency?: number;
  power_factor?: number;
  temperature?: number;
  state_of_charge?: number;
  created_at?: string;
}

export interface ForecastMetrics {
  totalGeneration: number;
  totalConsumption: number;
  netEnergy: number;
  peakGeneration: number;
  peakConsumption: number;
  selfConsumptionRate: number;
  confidence?: number;
}

export interface ProcessedForecastData {
  timestamp: string;
  production: number;
  consumption: number;
  balance?: number;
}

export type DeviceType = 
  | 'solar' 
  | 'battery' 
  | 'grid' 
  | 'ev_charger' 
  | 'meter' 
  | 'inverter' 
  | 'load' 
  | 'generator' 
  | 'wind' 
  | 'hydro' 
  | 'home'
  | 'sensor'
  | 'light';

export type DeviceStatus = 
  | 'online' 
  | 'offline' 
  | 'error' 
  | 'warning' 
  | 'maintenance' 
  | 'inactive' 
  | 'active'
  | 'idle'
  | 'charging'
  | 'discharging';

export interface EnergyDevice {
  id: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  location?: string;
  manufacturer?: string;
  model?: string;
  power?: number;
  capacity?: number;
  last_reading?: number;
  last_reading_unit?: string;
  installation_date?: string;
  firmware_version?: string;
  firmware?: string;
  serial_number?: string;
  description?: string;
  site_id?: string;
  protocol?: string;
  metrics?: Record<string, any>;
  last_updated?: string;
  created_at?: string;
  updated_at?: string;
  current_output?: number;
  tags?: string[];
}

export interface Site {
  id: string;
  name: string;
  location: string;
  timezone?: string;
  created_at?: string;
  updated_at?: string;
  owner_id?: string;
  status?: string;
  type?: string;
  image_url?: string;
  description?: string;
  address?: string;
}

export interface TelemetryData {
  id?: string;
  timestamp: string;
  device_id: string;
  value: number;
  unit: string;
  type?: string;
}

export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  type: string;
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  site_id?: string;
  potential_savings?: string;
  confidence?: number;
  applied?: boolean;
  applied_at?: string;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'acknowledged' | 'resolved';
  created_at: string;
  resolved_at?: string;
  device_id?: string;
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

export interface Tariff {
  id: string;
  name: string;
  provider: string;
  rate_type: 'fixed' | 'time_of_use' | 'demand' | 'dynamic';
  base_rate: number;
  currency: string;
  peak_rate?: number;
  off_peak_rate?: number;
  peak_hours_start?: string;
  peak_hours_end?: string;
  weekend_different?: boolean;
  site_id?: string;
  created_at?: string;
  updated_at?: string;
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
  created_at?: string;
  updated_at?: string;
}

export interface SystemRecommendation {
  id: string;
  title: string;
  description: string;
  type: string;
  impact: 'low' | 'medium' | 'high';
  implementation_difficulty: 'easy' | 'medium' | 'hard';
  estimated_savings?: number;
  roi_months?: number;
  created_at: string;
}
