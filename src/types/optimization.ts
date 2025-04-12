
export type OptimizationObjective = "cost" | "self_consumption" | "carbon" | "peak_shaving";
export type BatteryStrategy = "charge_from_solar" | "time_of_use" | "backup_only";
export type OptimizationPriority = OptimizationObjective; // Add this for compatibility

export interface OptimizationSettings {
  priority: OptimizationObjective;
  battery_strategy: BatteryStrategy;
  ev_charging_time: string;
  ev_departure_time: string;
  peak_shaving_enabled: boolean;
  max_grid_power?: number;
  energy_export_limit?: number;
  min_soc: number;  
  max_soc: number;
  minBatterySoc?: number; // For compatibility
  maxBatterySoc?: number; // For compatibility
  time_window_start: string;
  time_window_end: string;
  objective: OptimizationObjective;
  site_id: string;
  priority_device_ids: string[];
  evTargetSoc?: number;
}

export interface OptimizationResult {
  id: string;
  site_id?: string;
  timestamp: string;
  battery_power: number[];
  grid_power: number[];
  pv_power: number[];
  load_power: number[];
  battery_soc: number[];
  total_savings: number;
  co2_reduction: number;
  self_consumption_rate: number;
  created_at: string;
  schedule?: any;
}
