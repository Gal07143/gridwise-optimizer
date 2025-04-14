
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
}

export interface CarbonEmissionsDetail {
  id: string;
  equipmentId: string;
  date: string;
  emissions: number;
  energyConsumed: number;
  emissionFactor: number;
  source: string;
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
  }>;
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
}
