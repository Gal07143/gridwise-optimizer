
import { DeviceType } from './energy';

export interface DeviceModel {
  id: string;
  name: string;
  manufacturer: string;
  model: string;
  model_number?: string;
  device_type: DeviceType;
  category: string;
  description?: string;
  specifications?: Record<string, any>;
  power_rating?: number;
  capacity?: number;
  protocol?: string;
  support_level: 'full' | 'beta' | 'limited' | 'unsupported';
  firmware_version?: string;
  has_manual?: boolean;
  supported: boolean;
  icon?: string;
}

export interface DeviceModelCategory {
  id: string;
  name: string;
  description?: string;
  deviceTypes: DeviceType[];
  count?: number;
  icon?: string;
}

export interface IntegrationCategory {
  id: string;
  name: string;
  type: string;
  description: string;
  logo?: string;
  supported_protocols: string[];
  device_count?: number;
}
