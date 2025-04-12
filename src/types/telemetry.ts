export interface TelemetryData {
  timestamp: string;
  deviceId: string;
  temperature: number;
  humidity: number;
  power: number;
  voltage: number;
  current: number;
  frequency: number;
  powerFactor: number;
  energy: number;
  cost: number;
  optimizedCost?: number;
  batteryLevel?: number;
  batteryHealth?: number;
  solarGeneration?: number;
  gridImport?: number;
  gridExport?: number;
  status: 'active' | 'inactive' | 'error' | 'maintenance';
  metadata?: Record<string, any>;
}

export interface TelemetryFilter {
  startTime?: string;
  endTime?: string;
  deviceId?: string;
  status?: string[];
  limit?: number;
  offset?: number;
}

export interface TelemetryAggregate {
  min: number;
  max: number;
  avg: number;
  sum: number;
  count: number;
}

export interface TelemetryStats {
  [key: string]: TelemetryAggregate;
} 