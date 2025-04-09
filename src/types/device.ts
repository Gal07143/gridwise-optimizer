
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
  model?: string;
  installation_date?: string;
  current_output?: number;
}

export interface DeviceModel {
  id: string;
  manufacturer: string;
  model: string;
  name?: string;
  model_number?: string;
  device_type?: string;
  category: string;
  protocol?: string;
  firmware_version?: string;
  supported: boolean;
  description?: string;
  images: string[];
  has_manual?: boolean;
  has_datasheet?: boolean;
  has_video?: boolean;
}

export interface DeviceModelReference {
  id: string;
  name: string;
  manufacturer: string;
  model_number: string;
  device_type: string;
  category: string;
  has_manual?: boolean;
}
