
import { DeviceType } from '@/types/energy';

export interface DeviceModelCategory {
  id: string;
  name: string;
  icon: string;
  description?: string;
}

export interface DeviceManufacturer {
  id: string;
  name: string;
  website?: string;
  logo_url?: string;
  country?: string;
}

export interface DeviceSpecification {
  key: string;
  name: string;
  value: string | number;
  unit?: string;
}

export interface DeviceModelReference {
  id: string;
  manufacturer: string;
  model_name: string;
  model_number: string;
  device_type: DeviceType;
  category: string;
  description?: string;
  specifications?: DeviceSpecification[];
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
  image_url?: string;
}

export const deviceCategories: DeviceModelCategory[] = [
  { id: 'inverter', name: 'Inverters', icon: 'Activity', description: 'Solar and battery inverters for energy conversion' },
  { id: 'battery', name: 'Batteries', icon: 'Battery', description: 'Energy storage systems and batteries' },
  { id: 'solar', name: 'Solar Panels', icon: 'Sun', description: 'Photovoltaic panels and modules' },
  { id: 'meter', name: 'Energy Meters', icon: 'Gauge', description: 'Power and energy measurement devices' },
  { id: 'ev_charger', name: 'EV Chargers', icon: 'Zap', description: 'Electric vehicle charging stations' },
  { id: 'controller', name: 'Controllers', icon: 'Cpu', description: 'System controllers and gateways' },
  { id: 'sensor', name: 'Sensors', icon: 'Thermometer', description: 'Environmental and electrical sensors' },
  { id: 'generator', name: 'Generators', icon: 'Power', description: 'Backup power generators' },
  { id: 'wind', name: 'Wind Turbines', icon: 'Wind', description: 'Wind energy generation systems' },
  { id: 'hydro', name: 'Hydro', icon: 'Droplets', description: 'Hydroelectric generation equipment' }
];

export const getDeviceCategoryById = (categoryId: string): DeviceModelCategory | undefined => {
  return deviceCategories.find(category => category.id === categoryId);
};
