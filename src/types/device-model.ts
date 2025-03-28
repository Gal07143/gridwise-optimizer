
import { DeviceType } from '@/types/energy';

export interface DeviceModel {
  id: string;
  manufacturer: string;
  model_name: string;
  name?: string;
  model_number: string;
  device_type: DeviceType;
  description?: string;
  specifications?: Record<string, any>;
  compatible_with?: string[];
  firmware_versions?: string[];
  created_at: string;
  updated_at?: string;
  category?: string;
  protocol: string;
  power_rating?: number;
  capacity?: number;
  release_date?: string;
  support_level: 'full' | 'partial' | 'none';
  has_manual: boolean;
  has_datasheet?: boolean;
  has_video?: boolean;
  warranty?: string;
  certifications?: string[];
}

export const categoryNames: Record<string, string> = {
  'solar': 'Solar Panels',
  'battery': 'Battery Storage',
  'inverter': 'Inverters',
  'ev_charger': 'EV Chargers',
  'meter': 'Energy Meters',
  'controller': 'System Controllers',
  'wind': 'Wind Turbines',
  'hydro': 'Hydro Generation'
};
