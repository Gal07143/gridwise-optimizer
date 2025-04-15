
export interface TelemetryData {
  id: string;
  deviceId: string;
  timestamp: Date;
  parameter?: string;
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
