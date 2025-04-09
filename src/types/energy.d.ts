
export interface OptimizationSettings {
  priority: 'cost' | 'self_consumption' | 'carbon';
  battery_strategy: 'charge_from_solar' | 'time_of_use' | 'backup_only';
  ev_charging_time: string;
  ev_departure_time: string;
  peak_shaving_enabled: boolean;
  max_grid_power?: number;
  energy_export_limit?: number;
  
  // Extra fields for backward compatibility
  min_soc?: number;
  max_soc?: number;
  minBatterySoc?: number; 
  maxBatterySoc?: number;
  priority_device_ids?: string[];
  time_window_start?: string;
  time_window_end?: string;
  evTargetSoc?: number;
  objective?: string;
}

export interface SystemRecommendation {
  id: string;
  site_id: string;
  title: string;
  description: string;
  type: string;
  priority: 'high' | 'medium' | 'low';
  potential_savings: string;
  confidence: number;
  created_at: string;
  applied: boolean;
  applied_at?: string;
  applied_by?: string;
  status?: string;
}

export interface EnergyForecast {
  id: string;
  site_id: string;
  timestamp: string;
  consumption_forecast: number;
  generation_forecast: number;
  grid_import_forecast: number;
  grid_export_forecast: number;
  battery_soc_forecast: number;
  created_at: string;
  weather_condition?: string;
  temperature?: number;
  price_forecast?: number;
  carbon_intensity?: number;
}

export interface OptimizationResult {
  id: string;
  site_id: string;
  timestamp_start: string;
  timestamp_end: string;
  schedule_json: any;
  cost_estimate: number;
  source_data_hash?: string;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  timestamp: string;
  acknowledged: boolean;
  acknowledged_at?: string;
  acknowledged_by?: string;
  alert_source: string;
  device_id?: string;
  site_id?: string;
}

export interface AIRecommendation {
  id: string;
  site_id: string;
  type: string;
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  potential_savings: string;
  confidence: number;
  applied: boolean;
  applied_at?: string;
  applied_by?: string;
  created_at: string;
}

export interface UserPreference {
  id: string;
  user_id: string;
  theme: 'light' | 'dark' | 'system';
  notification_preferences: any;
  default_site_id?: string;
  default_view?: string;
  energy_unit_preference?: 'kWh' | 'MWh';
  carbon_unit_preference?: 'kg' | 'tons';
  currency?: string;
}

export interface EnergyReading {
  id: string;
  device_id: string;
  timestamp: string;
  power: number;
  energy?: number;
  voltage?: number;
  current?: number;
  frequency?: number;
  power_factor?: number;
  reactive_power?: number;
  apparent_power?: number;
  temperature?: number;
  status?: string;
  created_at?: string;
}

export interface DateRange {
  from: Date;
  to: Date;
}
