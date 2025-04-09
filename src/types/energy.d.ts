export interface EnergyDataPoint {
  timestamp: string;
  value: number;
  unit: string;
}

export interface EnergyMeasurement {
  id: string;
  type: 'consumption' | 'production' | 'storage' | 'import' | 'export';
  value: number;
  unit: 'kWh' | 'Wh' | 'MWh';
  timestamp: string;
  device_id?: string;
  site_id: string;
}

export interface EnergyFlowPoint {
  source: string;
  target: string;
  value: number;
  color?: string;
}

export interface EnergyFlowData {
  nodes: EnergyNode[];
  links: EnergyFlowPoint[];
  timestamp?: string;
}

export interface EnergyNode {
  id: string;
  type: 'producer' | 'consumer' | 'storage' | 'grid';
  name: string;
  value: number;
  unit?: string;
  status?: 'active' | 'inactive' | 'error';
  color?: string;
  icon?: string;
}

export type DeviceType = 'solar' | 'wind' | 'battery' | 'grid' | 'load' | 'ev_charger' | 'inverter' | 'meter';
export type DeviceStatus = 'online' | 'offline' | 'maintenance' | 'error' | 'warning';

export interface EnergyDevice {
  id: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  capacity: number;
  current_output?: number;
  last_updated?: string;
  created_at: string;
  firmware?: string;
  model?: string;
  manufacturer?: string;
  location?: string;
  site_id: string;
  description?: string;
  protocol?: string;
  metrics?: Record<string, any>;
}

export interface EnergyReading {
  id: string;
  device_id: string;
  timestamp: string;
  power: number;
  energy: number;
  voltage?: number;
  current?: number;
  frequency?: number;
  temperature?: number;
  state_of_charge?: number;
  created_at?: string;
}
