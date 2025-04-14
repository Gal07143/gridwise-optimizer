
export interface Device {
  id: string;
  name: string;
  type: string;
  model?: string;
  manufacturer?: string;
  status: 'online' | 'offline' | 'error' | 'maintenance';
  [key: string]: any;
}

export interface TelemetryData {
  timestamp: string;
  value: number;
  parameter: string;
  deviceId: string;
  [key: string]: any;
}

export interface EnergyMetrics {
  generation: number;
  consumption: number;
  export: number;
  import: number;
  selfConsumption: number;
  timestamp: string;
}

export interface ForecastData {
  timestamp: string;
  value: number;
  type: 'generation' | 'consumption' | 'export' | 'import';
  confidence?: number;
}
