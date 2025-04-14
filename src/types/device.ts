
export interface Device {
  id: string;
  name: string;
  type: string;
  model?: string;
  manufacturer?: string;
  status: 'online' | 'offline' | 'error' | 'maintenance';
  lastSeen?: string;
  location?: string;
  firmware?: string;
  capacity?: number;
  description?: string;
  [key: string]: any;
}

export interface TelemetryData {
  timestamp: string;
  value: number;
  parameter: string;
  deviceId: string;
  device_id: string; // Added for compatibility
  unit: string;
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
