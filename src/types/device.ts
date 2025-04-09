
export interface Device {
  id: string;
  name: string;
  type: string;
  status: string;
  capacity: number;
  location?: string;
  description?: string;
  firmware?: string;
  protocol?: string;
  created_at?: string;
  updated_at?: string;
  last_updated?: string;
  site_id: string;
  metrics?: Record<string, any>;
}

export interface DeviceModel {
  id: string;
  manufacturer: string;
  model: string;
  category: string;
  protocol?: string;
  firmware_version?: string;
  supported: boolean;
  description?: string;
  images: string[];
}
