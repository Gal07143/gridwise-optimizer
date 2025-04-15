
declare module '@/types/equipment' {
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
  
  export interface AutomatedReport {
    id: string;
    name: string;
    equipmentId: string;
    reportType?: string;
    schedule: string;
    format: string;
    recipients: string[];
    lastGenerated?: string;
    status?: string;
    parameters?: Record<string, any>;
  }
  
  export type EquipmentStatus = 'offline' | 'maintenance' | 'operational' | 'fault' | 'faulty';
  
  export interface EquipmentParameter {
    name: string;
    value: number | string;
    unit?: string;
    timestamp?: string;
  }
  
  export interface Equipment {
    id: string;
    name: string;
    type: string;
    status: EquipmentStatus;
    manufacturer?: string;
    model?: string;
    serialNumber?: string;
    installationDate?: string;
    lastMaintenanceDate?: string;
    nextMaintenanceDate?: string;
    location?: string;
    description?: string;
    parameters?: EquipmentParameter[];
    isOnline?: boolean;
    load?: number;
    energyConsumption?: number;
    carbonEmissions?: number;
    warningThreshold?: number;
    criticalThreshold?: number;
  }
}
