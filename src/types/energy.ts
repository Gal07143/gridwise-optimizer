
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
  | 'light'
  | 'heat_pump';

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
  | 'discharging'
  | 'curtailed';

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
  status?: 'active' | 'inactive' | 'maintenance';
  type?: string;
  image_url?: string;
  description?: string;
  address?: string;
  contact_person?: string;
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
  timestamp?: string;
  acknowledged?: boolean;
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
  generation_forecast?: number;
  consumption_forecast?: number;
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
  priority?: 'low' | 'medium' | 'high';
  potential_savings?: string;
  implementation_effort?: string;
  confidence?: number;
}

export interface DeviceModel {
  id: string;
  name: string;
  model_number: string;
  manufacturer: string;
  device_type: DeviceType;
  capacity?: number;
  power_rating?: number;
  description?: string;
  warranty?: string;
  dimensions?: string;
  images?: string[];
  datasheets?: string[];
  firmware_version?: string;
  release_date?: string;
  support_level?: 'full' | 'partial' | 'limited';
}

export interface GridSignal {
  id: string;
  timestamp: string;
  signal_type: 'curtailment' | 'demand_response' | 'price_signal' | 'grid_congestion';
  value: number;
  unit: string;
  valid_from: string;
  valid_until: string;
  source: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  affected_devices?: string[];
  area_code?: string;
  grid_operator?: string;
}

export interface Device {
  id: string;
  name: string;
  type: string;
  status: string;
  location?: string;
  capacity: number;
  site_id?: string;
  firmware?: string;
  manufacturer?: string;
  model?: string;
}

export interface HeatPumpSettings {
  mode: 'auto' | 'heating' | 'cooling' | 'off';
  target_temperature: number;
  min_temperature: number;
  max_temperature: number;
  energy_priority: 'comfort' | 'efficiency' | 'balanced';
  schedule: HeatPumpSchedule[];
  boost_mode_enabled: boolean;
  boost_duration_minutes: number;
}

export interface HeatPumpSchedule {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday' | 'weekday' | 'weekend';
  start_time: string; // HH:MM format
  end_time: string; // HH:MM format
  target_temperature: number;
}

export interface EVChargingSettings {
  charging_strategy: 'immediate' | 'scheduled' | 'dynamic' | 'smart';
  min_soc: number; // Minimum state of charge
  target_soc: number;
  max_power: number;
  ready_by_time: string; // HH:MM format
  price_threshold: number; // Only charge when price is below this threshold
  use_solar_surplus: boolean;
  priority_over_home_battery: boolean;
}
