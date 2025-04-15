
export interface TelemetryData {
  id: string;
  device_id: string;
  timestamp: Date;
  parameter: string;
  value: number;
  unit: string;
  data: {
    [key: string]: any;
  };
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
