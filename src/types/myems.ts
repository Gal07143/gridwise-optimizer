
export interface EnergyCategory {
  id: string;
  name: string;
  description?: string;
  unit: string;
  display_color?: string;
  icon?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Space {
  id: string;
  name: string;
  description?: string;
  parent_id?: string;
  parent?: Space;
  type: string; // 'site', 'building', 'floor', 'zone', 'room', etc.
  area?: number;
  area_unit?: string;
  created_at: Date;
  updated_at: Date;
  children?: Space[];
}

export interface CostCenter {
  id: string;
  name: string;
  description?: string;
  parent_id?: string;
  parent?: CostCenter;
  created_at: Date;
  updated_at: Date;
  children?: CostCenter[];
}

export interface Tenant {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  contact_person?: string;
  created_at: Date;
  updated_at: Date;
  spaces?: TenantSpace[];
}

export interface TenantSpace {
  id: string;
  tenant_id: string;
  space_id: string;
  start_date: Date;
  end_date?: Date;
  created_at: Date;
  updated_at: Date;
  tenant?: Tenant;
  space?: Space;
}

export interface VirtualMeter {
  id: string;
  name: string;
  description?: string;
  formula: string;
  device_ids: string[];
  unit: string;
  created_at: Date;
  updated_at: Date;
}

export interface EnergySavingProject {
  id: string;
  name: string;
  description?: string;
  start_date: Date;
  end_date?: Date;
  target_savings?: number;
  target_unit?: string;
  status: 'planned' | 'in-progress' | 'completed' | 'cancelled';
  investment_cost?: number;
  currency?: string;
  payback_period?: number;
  space_id?: string;
  created_at: Date;
  updated_at: Date;
  measures?: EnergySavingMeasure[];
}

export interface EnergySavingMeasure {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  implementation_date?: Date;
  actual_savings?: number;
  savings_unit?: string;
  category?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Benchmark {
  id: string;
  name: string;
  description?: string;
  category: string;
  value: number;
  unit: string;
  source?: string;
  applicable_space_types?: string[];
  created_at: Date;
  updated_at: Date;
}

export interface CarbonEmissionFactor {
  id: string;
  energy_category: string;
  region?: string;
  factor: number;
  unit: string;
  valid_from: Date;
  valid_to?: Date;
  source?: string;
  created_at: Date;
  updated_at: Date;
}

export interface ScheduledReport {
  id: string;
  report_type: string;
  name: string;
  description?: string;
  schedule: string;
  recipients?: string[];
  parameters?: Record<string, any>;
  file_format?: string;
  is_active: boolean;
  last_run_at?: Date;
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface WeatherNormalization {
  id: string;
  space_id: string;
  heating_degree_days?: number;
  cooling_degree_days?: number;
  base_temperature?: number;
  date: Date;
  created_at: Date;
  updated_at: Date;
  space?: Space;
}

export interface DashboardCustomization {
  id: string;
  user_id: string;
  dashboard_id: string;
  layout: any;
  widgets: any;
  created_at: Date;
  updated_at: Date;
}
