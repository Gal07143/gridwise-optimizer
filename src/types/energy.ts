
export interface EnergyDevice {
  id: string;
  name: string;
  type: string;
  capacity: number;
  status: 'online' | 'offline' | 'maintenance' | 'error' | 'warning';
  description?: string;
  location?: string;
  site_id?: string;
  lat?: number;
  lng?: number;
  firmware?: string;
  protocol?: string;
  created_at?: Date;
  updated_at?: Date;
  last_updated?: Date;
  installation_date?: Date;
  metrics?: Record<string, any>;
  config?: Record<string, any>;
  connection_info?: Record<string, any>;
  tags?: string[];
}

export interface EnergySite {
  id: string;
  name: string;
  location: string;
  timezone: string;
  lat?: number;
  lng?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface EnergyTariff {
  id: string;
  name: string;
  description?: string;
  peak_rate: number;
  off_peak_rate: number;
  shoulder_rate?: number;
  peak_hours: string[];
  off_peak_hours: string[];
  shoulder_hours?: string[];
  valid_from: Date;
  valid_to?: Date;
  created_at?: Date;
  updated_at?: Date;
}

export interface EnergyConsumption {
  timestamp: Date;
  value: number;
  unit: string;
  device_id?: string;
  site_id?: string;
  category?: string;
  source?: string;
}

export interface EnergyProduction {
  timestamp: Date;
  value: number;
  unit: string;
  device_id?: string;
  site_id?: string;
  source?: string;
}

export interface BatteryStatus {
  timestamp: Date;
  state_of_charge: number;
  power: number;
  status: 'charging' | 'discharging' | 'idle' | 'error';
  temperature?: number;
  voltage?: number;
  current?: number;
}
