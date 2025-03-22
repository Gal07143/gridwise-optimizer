
export type DeviceType = 
  | 'battery' 
  | 'solar' 
  | 'wind' 
  | 'grid' 
  | 'load'
  | 'ev_charger'
  | 'inverter'
  | 'meter';

export type DeviceStatus = 
  | 'online' 
  | 'offline' 
  | 'maintenance' 
  | 'error'
  | 'warning';

export interface EnergyDevice {
  id: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  location?: string;
  capacity: number;
  site_id?: string;
  firmware?: string;
  installation_date?: string;
  last_updated: string;
  lat?: number;
  lng?: number;
  metrics?: Record<string, number> | null;
  description?: string;
}
