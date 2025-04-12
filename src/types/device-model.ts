
export interface DeviceModel {
  id: string;
  manufacturer: string;
  model: string;
  name: string;
  model_number: string;
  device_type: string;
  category: string;
  protocol?: string;
  firmware_version?: string;
  supported: boolean;
  description?: string;
  images?: string[];
  power_rating?: number;
  capacity?: number;
  has_manual?: boolean;
  has_datasheet?: boolean;
  has_video?: boolean;
  specifications?: any;
  support_level?: string;
}

export const categoryNames: Record<string, string> = {
  'inverters': 'Inverters',
  'batteries': 'Batteries',
  'ev-chargers': 'EV Chargers',
  'solar-panels': 'Solar Panels',
  'meters': 'Smart Meters',
  'controllers': 'System Controllers',
  'sensors': 'Sensors & IoT Devices',
  'heating': 'Heat Pumps & HVAC',
  'lighting': 'Smart Lighting',
  'load-control': 'Load Controllers'
};
