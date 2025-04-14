
export interface Equipment {
  id: string;
  name: string;
  type: string;
  manufacturer: string;
  model: string;
  serial_number: string;
  serialNumber?: string; // Alias for serial_number
  installation_date: string;
  installationDate?: string; // Alias for installation_date
  last_maintenance_date: string;
  lastMaintenanceDate?: string; // Alias for last_maintenance_date
  status: 'operational' | 'maintenance' | 'offline' | 'faulty';
  location: string;
  notes?: string;
  efficiency?: number;
  load?: number;
  isOnline?: boolean;
  energyConsumption?: number;
  carbonEmissions?: number;
  nextMaintenanceDate?: string;
  isRunning?: boolean; // Additional status field
  description?: string;
}

export interface EquipmentMetrics {
  id: string;
  equipmentId: string;
  timestamp: string;
  energy_consumption: number;
  energyConsumption?: number; // Alias for compatibility
  power: number;
  temperature: number;
  humidity?: number;
  efficiency?: number;
  runtime?: number;
  vibration?: number;
  noise_level?: number;
  load?: number;
  unit: string;
  period?: string;
}

export interface EquipmentMaintenance {
  id: string;
  equipmentId: string;
  type: string;
  description: string;
  date: string;
  technician: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  status_text?: 'in_progress' | 'overdue'; // For compatibility with existing code
  notes?: string;
  cost?: number;
  parts_replaced?: string[];
  next_maintenance_date?: string;
  duration?: number;
  scheduledDate?: string; // For compatibility with existing code
  completedDate?: string; // For compatibility with existing code
  assignedTo?: string; // For compatibility with existing code
}

export interface EquipmentParameter {
  id: string;
  equipmentId: string;
  name: string;
  value: number | string;
  unit: string;
  min_value?: number;
  max_value?: number;
  critical_low?: number;
  critical_high?: number;
  last_updated: string;
  timestamp?: string; // For compatibility with existing code
  status: 'normal' | 'warning' | 'critical';
}

export interface EquipmentAlarm {
  id: string;
  equipmentId: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  resolved: boolean;
  resolved_at?: string;
  resolved_by?: string;
  notes?: string;
  acknowledged?: boolean; // For compatibility with existing code
}

export interface CarbonEmissionsDetail {
  id: string;
  equipmentId: string;
  date: string;
  emissions: number;
  energyConsumed: number;
  emissionFactor: number;
  source: string;
  // Additional fields needed by components
  category: string;
  amount: number;
  totalEmissions: number;
  unit: string;
  timestamp: string;
}

export interface DowntimeRecord {
  id: string;
  equipmentId: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  reason: string;
  impact: 'high' | 'medium' | 'low';
  resolution?: string;
  cost?: number;
}

export interface EnergyBenchmark {
  id: string;
  equipmentId: string;
  timestamp: string;
  value: number;
  industryAverage: number;
  bestInClass: number;
  unit: string;
  actualConsumption?: number;
  expectedConsumption?: number;
  // Additional fields needed by components
  metric: string;
  percentile: number;
  period: string;
}

export interface EnergyRateStructure {
  id: string;
  name: string;
  provider: string;
  effectiveFrom: string;
  effectiveTo?: string;
  rates: Array<{
    type: 'peak' | 'off-peak' | 'standard' | 'time-of-use';
    rate: number;
    startTime?: string;
    endTime?: string;
    dayType?: 'weekday' | 'weekend' | 'holiday' | 'all';
    unit?: string;
  }>;
  // Additional fields needed by components
  rateType?: string;
  rateValue?: number;
  unit?: string;
  effectiveDate?: string;
  status?: string;
}

export interface EnergySaving {
  id: string;
  equipmentId: string;
  timestamp?: string;
  reportingPeriod: {
    start: string;
    end: string;
  };
  savedEnergy: number;
  savedCost: number;
  savedEmissions: number;
  implementationCost?: number;
  paybackPeriod?: number;
  measureType: 'operational' | 'retrofit' | 'replacement' | 'behavioral';
  description: string;
  // Additional fields needed by components
  measureId: string;
  baselinePeriod: {
    start: string;
    end: string;
  };
  baselineConsumption: number;
  reportingConsumption: number;
  verificationMethod: string;
  status: string;
}

export interface AutomatedReport {
  id: string;
  name: string;
  description?: string;
  schedule: string;
  recipients: string[];
  format: 'pdf' | 'csv' | 'html' | 'xlsx';
  lastGenerated?: string;
  nextGeneration?: string;
  status: 'active' | 'paused' | 'error';
  templateId?: string;
  parameters?: Record<string, any>;
  equipmentId?: string;
  reportType?: string;
}

export interface BMSParameter {
  id: string;
  name: string;
  bmsId: string;
  mapping: Record<string, any>;
  status?: string;
  dataType: string;
  unit: string;
  value?: any;
  timestamp?: string;
}

export interface EquipmentGroup {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  path?: string;
  equipmentIds: string[];
  tags?: string[];
  attributes?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
  type?: string;
}

export interface BMSIntegration {
  id: string;
  name: string;
  protocol: string;
  host: string;
  port: number;
  username?: string;
  password?: string;
  connectionStatus: 'connected' | 'disconnected' | 'error';
  lastSync: string;
  syncInterval?: number;
  mappings?: Record<string, string>;
  equipmentId: string;
  bmsType: string;
  syncFrequency: number;
  parameters: BMSParameter[];
}

export interface LoadForecast {
  id: string;
  equipmentId: string;
  timestamp: string;
  predictedLoad: number;
  confidenceInterval: {
    lower: number;
    upper: number;
  };
  horizon: number;
  algorithm?: string;
  accuracy?: number;
  actualLoad?: number;
  forecastType?: string;
  forecastPeriod?: string;
  value?: number;
  unit?: string;
  startTime?: string;
  endTime?: string;
  confidence?: number;
}

export interface LifecycleStage {
  id: string;
  equipmentId: string;
  stage: 'procurement' | 'installation' | 'operation' | 'maintenance' | 'overhaul' | 'decommissioning';
  startDate: string;
  endDate?: string;
  cost?: number;
  notes?: string;
  performanceMetrics?: Record<string, number>;
  status?: string;
}

export interface PredictiveMaintenance {
  id: string;
  equipmentId: string;
  component: string;
  predictedFailureDate: string;
  predictionDate?: string; // For compatibility with existing code
  predictedIssue?: string; // For compatibility with existing code
  probability: number;
  confidence?: number; // For compatibility with existing code
  severity: 'low' | 'medium' | 'high' | 'critical';
  recommendedAction: string;
  estimatedCost?: number;
  estimatedDowntime?: number;
  maintenanceHistory?: {
    date: string;
    action: string;
    technician: string;
  }[];
  lastUpdated: string;
}

export interface PerformanceScore {
  id: string;
  equipmentId: string;
  date: string;
  overall: number;
  overallScore?: number; // For compatibility with existing code
  energy_efficiency: number;
  efficiencyScore?: number; // For compatibility with existing code
  reliability: number;
  reliabilityScore?: number; // For compatibility with existing code
  maintenance: number;
  maintenanceScore?: number; // For compatibility with existing code
  notes?: string;
  benchmark?: number;
  benchmarkSource?: string;
  recommendations?: string[];
  factors?: Array<{
    name: string;
    weight: number;
    score: number;
    impact: 'positive' | 'negative' | 'neutral';
  }>; // For compatibility with existing code
}

export interface EfficiencyRecommendation {
  id: string;
  equipmentId: string;
  timestamp: string;
  description: string;
  title?: string; // For compatibility with existing code
  potentialSaving: number;
  potentialSavings?: number; // For compatibility with existing code
  unit: string;
  priority: 'low' | 'medium' | 'high';
  implementationCost?: number;
  paybackPeriod?: number;
  category: string;
  status: 'pending' | 'in-progress' | 'implemented' | 'rejected';
  implementedDate?: string;
  actualSaving?: number;
}

export interface SparePartInventory {
  id: string;
  equipmentId: string;
  name: string;
  partNumber?: string;
  quantity: number;
  minimumQuantity: number;
  location: string;
  supplier?: string;
  cost?: number;
  lastOrdered?: string;
  leadTime?: number;
  notes?: string;
  status?: string;
}

export interface MaintenanceCost {
  id: string;
  equipmentId: string;
  date: string;
  cost: number;
  maintenanceType: string;
  description?: string;
  invoice?: string;
  parts?: {
    name: string;
    quantity: number;
    unitCost: number;
  }[];
  labor?: {
    hours: number;
    rate: number;
  };
  vendor?: string;
  costCategory?: string;
  totalCost?: number;
  type?: string; // For compatibility with existing code
  amount?: number; // For compatibility with existing code
}

export type FormData = {
  id?: string;
  name: string;
  type: string;
  manufacturer: string;
  model: string;
  serial_number: string;
  serialNumber?: string; // Alias for serial_number
  installation_date: string;
  last_maintenance_date: string;
  status: 'operational' | 'maintenance' | 'offline' | 'faulty';
  location: string;
  notes?: string;
  efficiency?: number;
  load?: number;
  description?: string;
}
