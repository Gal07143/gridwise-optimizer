
export interface TelemetryData {
  id: string;
  timestamp: string;
  value: number;
  parameter: string;
  deviceId: string;
  device_id: string; // Added for compatibility
  measurement: string;
  unit: string;
  [key: string]: any;
}

export interface DateRange {
  from: Date;
  to: Date | null;
}
