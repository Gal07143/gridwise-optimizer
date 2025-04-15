
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
  status: 'operational' | 'maintenance' | 'fault' | 'offline' | 'faulty';
  location: string;
  notes?: string;
  capacity?: number;
  efficiency?: number;
  operational_hours?: number;
  warranty_expiry?: string;
  // Additional properties needed by components
  isOnline?: boolean;
  load?: number;
  energyConsumption?: number;
  carbonEmissions?: number;
  warningThreshold?: number;
  criticalThreshold?: number;
  nextMaintenanceDate?: string;
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
  type?: string; // Added for backward compatibility
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'overdue';
  scheduled_date: string;
  scheduledDate?: string; // For backward compatibility
  completed_date?: string;
  completedDate?: string; // For backward compatibility
  technician?: string;
  assignedTo?: string; // For backward compatibility
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
  timestamp?: string; // Added timestamp
}

export interface EquipmentAlarm {
  id: string;
  equipment_id: string;
  parameter: string;
  threshold: number;
  condition: 'above' | 'below' | 'equal' | 'not_equal';
  status: 'active' | 'cleared' | 'acknowledged';
  severity: 'high' | 'medium' | 'low' | 'critical' | 'warning' | 'error';
  triggered_at: string;
  timestamp?: string; // Added timestamp for compatibility
  cleared_at?: string;
  acknowledged_by?: string;
  acknowledged?: boolean; // For backward compatibility
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

// Missing types that were referenced in error messages
export interface CarbonEmissionsDetail {
  id: string;
  source: string;
  amount?: number;
  totalEmissions?: number;
  unit?: string;
  date?: string;
  timestamp?: string;
  category?: string;
}

export interface DowntimeRecord {
  id: string;
  startTime: string;
  endTime?: string;
  duration: number;
  reason: string;
  impact: string;
}

export interface EnergyBenchmark {
  id: string;
  metric: string;
  value: number;
  unit: string;
  industryAverage: number;
  percentile: number;
  period: string;
}

export interface EnergyRateStructure {
  id: string;
  name: string;
  rateType?: string;
  rateValue?: number;
  effectiveFrom?: string;
  status?: string;
  unit?: string;
  rates: Array<{
    rate: number;
    unit: string;
    timeOfUse?: string;
  }>;
}

export interface EnergySaving {
  id: string;
  name: string;
  description: string;
  savingsAmount: number;
  savingsUnit: string;
  implementationDate: string;
  paybackPeriod?: number;
  status: string;
}

export interface BMSParameter {
  id: string;
  name: string;
  value: string | number;
  unit?: string;
  normal_range?: {
    min?: number;
    max?: number;
  };
  timestamp?: string;
  status?: string;
}
