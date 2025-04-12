export interface Device {
  id: string;
  name: string;
  type: 'sensor' | 'actuator' | 'controller';
  status: 'online' | 'offline' | 'maintenance';
  location: string;
  lastSeen: string;
  metadata: {
    manufacturer: string;
    model: string;
    serialNumber: string;
    firmwareVersion: string;
    [key: string]: any;
  };
  settings: {
    enabled: boolean;
    autoUpdate: boolean;
    alertThresholds?: {
      min?: number;
      max?: number;
    };
    [key: string]: any;
  };
  createdAt: string;
  updatedAt: string;
}

export interface DeviceModel {
  id: string;
  name: string;
  manufacturer: string;
  model: string;
  model_number: string;
  device_type: string;
  category: string;
  protocol?: string;
  firmware_version?: string;
  supported: boolean;
  description?: string;
  images?: string[];
  has_manual?: boolean;
  has_datasheet?: boolean;
  has_video?: boolean;
  power_rating?: number;
  capacity?: number;
  created_at?: string;
  updated_at?: string;
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
