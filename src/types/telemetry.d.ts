
export interface TelemetryData {
  id: string;
  deviceId?: string;
  device_id?: string; // For compatibility with backend
  timestamp: Date | string;
  parameter?: string;
  measurement?: string; // For compatibility with device telemetry
  value?: number;
  unit?: string;
  data?: Record<string, any>;
  temperature?: number;
  voltage?: number;
  current?: number;
  powerFactor?: number;
  frequency?: number;
  vibration?: number;
  noiseLevel?: number;
  errorCount?: number;
  uptime?: number;
  loadFactor?: number;
  [key: string]: any; // Allow for additional properties
}

export interface DeviceTelemetry {
  [deviceId: string]: TelemetryData[];
}

export interface TelemetryResponse {
  data: TelemetryData[];
  error: any | null;
}

export interface HistoricalTelemetryFilter {
  deviceId: string;
  parameters?: string[];
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  aggregation?: 'hour' | 'day' | 'week' | 'month' | 'none';
}

export interface AggregatedTelemetry {
  timestamp: Date;
  value: number;
  min: number;
  max: number;
  avg: number;
  count: number;
  unit: string;
}

export interface DeviceTelemetryMap {
  [deviceId: string]: TelemetryData[];
}
