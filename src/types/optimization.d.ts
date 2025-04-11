
export interface OptimizationSettings {
  priority: "cost" | "self_consumption" | "carbon" | "peak_shaving";
  battery_strategy: "charge_from_solar" | "time_of_use" | "backup_only";
  ev_charging_time: string;
  ev_departure_time: string;
  peak_shaving_enabled: boolean;
  max_grid_power?: number;
  energy_export_limit?: number;
  min_soc?: number;
  max_soc?: number;
  minBatterySoc?: number; // For compatibility
  maxBatterySoc?: number; // For compatibility
  time_window_start?: string;
  time_window_end?: string;
  objective?: "cost" | "self_consumption" | "carbon" | "peak_shaving";
  site_id?: string;
  priority_device_ids?: string[];
  evTargetSoc?: number;
}

export interface OptimizationResult {
  id: string;
  created_at: string;
  schedule: Array<{
    timestamp: string;
    battery_charge_power: number;
    grid_power: number;
    load_power: number;
    pv_power: number;
    battery_soc: number;
  }>;
  settings: OptimizationSettings;
  total_cost: number;
  total_grid_import: number;
  total_grid_export: number;
  self_consumption_percent: number;
  status: 'completed' | 'failed' | 'running';
  site_id?: string;
}

export type OptimizationPriority = "cost" | "self_consumption" | "carbon" | "peak_shaving";
export type BatteryStrategy = "charge_from_solar" | "time_of_use" | "backup_only";
