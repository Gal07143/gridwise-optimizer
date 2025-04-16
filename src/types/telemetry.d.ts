
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
  device_id?: string; // For compatibility with backend
  measurement?: string; // For compatibility with device telemetry
  [key: string]: any; // Allow for additional properties
}

export interface DeviceTelemetry {
  [deviceId: string]: TelemetryData[];
}
