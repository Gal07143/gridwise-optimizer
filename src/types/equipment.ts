export interface Equipment {
  id: string;
  name: string;
  description?: string;
  type: string;
  status: EquipmentStatus;
  parameters: EquipmentParameter[];
  location?: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  installationDate?: Date;
  lastMaintenanceDate?: Date;
  nextMaintenanceDate?: Date;
  efficiency?: number;
  load?: number;
  carbonEmissions?: number;
  cost?: number;
  energyConsumption?: number;
  isOnline: boolean;
  isRunning: boolean;
  alarms: EquipmentAlarm[];
  createdAt: Date;
  updatedAt: Date;
  parentEquipmentId?: string;
  groupId?: string;
  performanceScore?: number;
  procurementDate?: Date;
  warrantyExpirationDate?: Date;
  expectedLifespan?: number;
  disposalDate?: Date;
  energyRateStructure?: EnergyRateStructure;
  sparePartsInventory?: SparePartInventory[];
  maintenanceCosts?: MaintenanceCost[];
  downtimeRecords?: DowntimeRecord[];
  energyBenchmarks?: EnergyBenchmark[];
  energySavings?: EnergySaving[];
  bmsIntegration?: BMSIntegration;
}

export type EquipmentStatus = 'active' | 'inactive' | 'maintenance' | 'fault' | 'offline';

export interface EquipmentParameter {
  id: string;
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  minValue?: number;
  maxValue?: number;
  threshold?: number;
}

export interface EquipmentAlarm {
  id: string;
  type: AlarmType;
  message: string;
  severity: AlarmSeverity;
  timestamp: Date;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
}

export type AlarmType = 
  | 'temperature_high'
  | 'temperature_low'
  | 'pressure_high'
  | 'pressure_low'
  | 'vibration_high'
  | 'efficiency_low'
  | 'load_high'
  | 'maintenance_required'
  | 'fault_detected'
  | 'offline';

export type AlarmSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface EquipmentMetrics {
  efficiency: number;
  load: number;
  carbonEmissions: number;
  cost: number;
  energyConsumption: number;
  timestamp: Date;
}

export interface EquipmentMaintenance {
  id: string;
  equipmentId: string;
  type: MaintenanceType;
  description: string;
  scheduledDate: Date;
  completedDate?: Date;
  status: MaintenanceStatus;
  assignedTo?: string;
  notes?: string;
  cost?: number;
  partsUsed?: string[];
  predictiveMaintenanceScore?: number;
}

export type MaintenanceType = 
  | 'preventive'
  | 'corrective'
  | 'predictive'
  | 'emergency';

export type MaintenanceStatus = 
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'overdue';

export interface EnergyRateStructure {
  id: string;
  name: string;
  description?: string;
  rates: EnergyRate[];
  effectiveDate: Date;
  expirationDate?: Date;
}

export interface EnergyRate {
  id: string;
  type: 'peak' | 'off-peak' | 'shoulder' | 'base';
  rate: number;
  unit: string;
  startTime?: string;
  endTime?: string;
  daysOfWeek?: number[];
}

export interface CarbonEmissionsDetail {
  id: string;
  equipmentId: string;
  timestamp: Date;
  directEmissions: number;
  indirectEmissions: number;
  embodiedEmissions: number;
  totalEmissions: number;
  source: string;
}

export interface PredictiveMaintenance {
  id: string;
  equipmentId: string;
  parameterId: string;
  algorithm: string;
  predictionDate: Date;
  confidence: number;
  predictedIssue: string;
  recommendedAction: string;
  historicalAccuracy: number;
}

export interface PerformanceScore {
  id: string;
  equipmentId: string;
  timestamp: Date;
  overallScore: number;
  efficiencyScore: number;
  reliabilityScore: number;
  maintenanceScore: number;
  energyScore: number;
  factors: PerformanceFactor[];
}

export interface PerformanceFactor {
  name: string;
  weight: number;
  score: number;
  impact: 'positive' | 'negative' | 'neutral';
}

export interface EfficiencyRecommendation {
  id: string;
  equipmentId: string;
  title: string;
  description: string;
  potentialSavings: number;
  implementationCost: number;
  paybackPeriod: number;
  priority: 'low' | 'medium' | 'high';
  category: 'operational' | 'technical' | 'behavioral';
  status: 'proposed' | 'approved' | 'implemented' | 'rejected';
}

export interface LoadForecast {
  id: string;
  equipmentId: string;
  timestamp: Date;
  forecastPeriod: 'hourly' | 'daily' | 'weekly' | 'monthly';
  forecastHorizon: number;
  predictedLoad: number;
  confidenceInterval: {
    lower: number;
    upper: number;
  };
  actualLoad?: number;
  accuracy?: number;
}

export interface LifecycleStage {
  id: string;
  equipmentId: string;
  stage: 'procurement' | 'installation' | 'operation' | 'maintenance' | 'upgrade' | 'disposal';
  startDate: Date;
  endDate?: Date;
  cost: number;
  notes?: string;
}

export interface SparePartInventory {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  minimumQuantity: number;
  location: string;
  cost: number;
  supplier?: string;
  lastRestocked: Date;
  nextRestockDate?: Date;
}

export interface MaintenanceCost {
  id: string;
  equipmentId: string;
  maintenanceId: string;
  date: Date;
  laborCost: number;
  partsCost: number;
  otherCosts: number;
  totalCost: number;
  costCategory: 'preventive' | 'corrective' | 'predictive' | 'emergency';
}

export interface DowntimeRecord {
  id: string;
  equipmentId: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  reason: string;
  category: 'planned' | 'unplanned' | 'maintenance' | 'failure';
  impact: 'low' | 'medium' | 'high' | 'critical';
  resolvedBy?: string;
}

export interface EnergyBenchmark {
  id: string;
  equipmentId: string;
  metric: string;
  value: number;
  unit: string;
  industryAverage: number;
  percentile: number;
  period: string;
  timestamp: Date;
}

export interface AutomatedReport {
  id: string;
  equipmentId: string;
  reportType: string;
  schedule: string;
  lastGenerated: Date;
  status: string;
  parameters: Record<string, any>;
}

export interface EquipmentGroup {
  id: string;
  name: string;
  description: string;
  parentId: string | null;
  equipmentIds: string[];
  type: 'FUNCTIONAL' | 'LOCATION' | 'SYSTEM';
  createdAt: Date;
  updatedAt: Date;
}

export interface EnergySaving {
  id: string;
  equipmentId: string;
  measureId: string;
  baselinePeriod: {
    start: Date;
    end: Date;
  };
  reportingPeriod: {
    start: Date;
    end: Date;
  };
  baselineConsumption: number;
  reportingConsumption: number;
  savedEnergy: number;
  savedCost: number;
  savedEmissions: number;
  verificationMethod: string;
  status: string;
}

// 15. Integration with Building Management Systems
export interface BMSIntegration {
  id: string;
  equipmentId: string;
  bmsType: string;
  connectionStatus: string;
  lastSync: Date;
  syncFrequency: string;
  parameters: BMSParameter[];
  credentials?: {
    username: string;
    password: string;
    apiKey?: string;
  };
}

export interface BMSParameter {
  id: string;
  name: string;
  bmsId: string;
  dataType: string;
  unit: string;
  mapping: Record<string, any>;
} 