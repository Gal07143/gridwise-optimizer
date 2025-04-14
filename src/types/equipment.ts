
export interface Equipment {
  id: string;
  name: string;
  type: string;
  manufacturer: string;
  model: string;
  serial_number: string;
  installation_date: string;
  last_maintenance_date: string;
  status: 'operational' | 'maintenance' | 'offline' | 'faulty';
  location: string;
  notes?: string;
  efficiency?: number;
  load?: number;
  isOnline?: boolean;
  energyConsumption?: number;
  carbonEmissions?: number;
  nextMaintenanceDate?: string;
  serialNumber?: string; // Alias for serial_number
  installationDate?: string; // Alias for installation_date
  lastMaintenanceDate?: string; // Alias for last_maintenance_date
  isRunning?: boolean; // Additional status field
  description?: string;
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

// Add missing interfaces that are referenced in components
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
  equipmentId?: string; // Missing field
  reportType?: string; // Missing field
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
  type?: string; // Missing field
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
  lastSync?: string;
  syncInterval?: number;
  mappings?: Record<string, string>;
  equipmentId: string;
  bmsType?: string; // Missing field
  syncFrequency?: number; // Missing field
  parameters?: BMSParameter[]; // Missing field
}

export type FormData = {
  id?: string;
  name: string;
  type: string;
  manufacturer: string;
  model: string;
  serial_number: string;
  installation_date: string;
  last_maintenance_date: string;
  status: 'operational' | 'maintenance' | 'offline' | 'faulty';
  location: string;
  notes?: string;
  efficiency?: number;
  load?: number;
  description?: string;
  serialNumber?: string; // Alias for serial_number
}
