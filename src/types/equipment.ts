
// Basic Equipment Types
export interface Equipment {
  id: string;
  name: string;
  type: string;
  model: string;
  manufacturer: string;
  serial_number: string;
  installation_date: string;
  last_maintenance_date: string;
  status: 'operational' | 'maintenance' | 'fault' | 'offline';
  location: string;
  notes?: string;
  capacity?: number;
  efficiency?: number;
  operational_hours?: number;
  warranty_expiry?: string;
}

export interface EquipmentMetrics {
  id: string;
  equipment_id: string;
  timestamp: string;
  power: number;
  energy: number;
  temperature: number;
  vibration?: number;
  humidity?: number;
  pressure?: number;
  flow_rate?: number;
}

export interface EquipmentMaintenance {
  id: string;
  equipment_id: string;
  maintenance_type: 'routine' | 'repair' | 'overhaul' | 'inspection';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'overdue';
  scheduled_date: string;
  completed_date?: string;
  technician?: string;
  cost?: number;
  description: string;
  parts_replaced?: string[];
}

export interface EquipmentParameter {
  id: string;
  equipment_id: string;
  name: string;
  value: number | string | boolean;
  unit?: string;
  min_value?: number;
  max_value?: number;
  is_critical: boolean;
}

export interface EquipmentAlarm {
  id: string;
  equipment_id: string;
  parameter: string;
  threshold: number;
  condition: 'above' | 'below' | 'equal' | 'not_equal';
  status: 'active' | 'cleared' | 'acknowledged';
  severity: 'high' | 'medium' | 'low';
  triggered_at: string;
  cleared_at?: string;
  acknowledged_by?: string;
  message: string;
}

export interface PredictiveMaintenance {
  id: string;
  equipment_id: string;
  component: string;
  failure_probability: number;
  estimated_time_to_failure: number; // in hours
  recommendation: string;
  impact_level: 'high' | 'medium' | 'low';
  last_updated: string;
}

export interface PerformanceScore {
  id: string;
  equipment_id: string;
  timestamp: string;
  efficiency_score: number;
  reliability_score: number;
  maintenance_score: number;
  overall_score: number;
  benchmark: number;
}

export interface EfficiencyRecommendation {
  id: string;
  equipment_id: string;
  recommendation: string;
  potential_savings: number;
  implementation_cost: number;
  payback_period: number;
  difficulty: 'easy' | 'medium' | 'hard';
  priority: 'high' | 'medium' | 'low';
}

export interface LoadForecast {
  id: string;
  equipment_id: string;
  timestamp: string;
  predicted_load: number;
  confidence: number;
  actual_load?: number;
  deviation?: number;
}

export interface LifecycleStage {
  id: string;
  equipment_id: string;
  stage: 'installation' | 'operation' | 'maintenance' | 'degradation' | 'end-of-life';
  start_date: string;
  end_date?: string;
  notes: string;
  expected_remaining_life: number; // in months
}

export interface SparePartInventory {
  id: string;
  part_number: string;
  name: string;
  description: string;
  compatible_equipment: string[];
  quantity: number;
  reorder_level: number;
  unit_cost: number;
  supplier: string;
  last_ordered?: string;
  location: string;
}

export interface MaintenanceCost {
  id: string;
  equipment_id: string;
  year: number;
  month: number;
  labor_cost: number;
  parts_cost: number;
  downtime_cost: number;
  total_cost: number;
}

export interface AutomatedReport {
  id: string;
  name: string;
  equipmentId: string;
  reportType: string;
  format: string;
  schedule: string;
  parameters: Record<string, any>;
  recipients: string[];
  status?: 'scheduled' | 'generating' | 'sent' | 'failed';
  lastGenerated?: string;
  nextGeneration?: string;
}
