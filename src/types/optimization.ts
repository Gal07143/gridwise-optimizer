
export interface OptimizationParams {
  siteId: string;
  deviceId?: string;
  startDate: string;
  endDate: string;
  targetMetric: 'cost' | 'self_consumption' | 'carbon' | 'grid_stability';
  constraints?: OptimizationConstraints;
}

export interface OptimizationConstraints {
  minBatteryLevel?: number;
  maxGridImport?: number;
  evChargingTimes?: {
    start: string;
    end: string;
    targetSoC: number;
  }[];
  peakShavingThreshold?: number;
}

export interface OptimizationResult {
  id: string;
  siteId: string;
  createdAt: string;
  status: 'running' | 'completed' | 'failed';
  targetMetric: string;
  schedule: SchedulePoint[];
  metrics: OptimizationMetrics;
  parameters: Record<string, any>;
}

export interface SchedulePoint {
  timestamp: string;
  deviceId?: string;
  deviceType?: string;
  power: number; // Positive for discharge/generation, negative for charge/consumption
  stateOfCharge?: number;
  gridImport?: number;
  gridExport?: number;
}

export interface OptimizationMetrics {
  totalCost: number;
  costSavings: number;
  selfConsumption: number;
  peakPower: number;
  carbonEmissions: number;
  carbonSavings: number;
  gridStability: number;
}
