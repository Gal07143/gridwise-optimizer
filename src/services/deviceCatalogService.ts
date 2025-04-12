
import { DeviceModel } from '@/types/device-model';

export async function getDeviceModels(): Promise<DeviceModel[]> {
  // In a real app this would fetch from an API
  // For demo purposes, we'll return mock data
  return mockDeviceModels;
}

export async function getDeviceModelsByCategory(categoryId: string): Promise<DeviceModel[]> {
  // Filter mock data by category
  return mockDeviceModels.filter(model => model.category === categoryId);
}

export async function getDeviceModelById(modelId: string): Promise<DeviceModel | null> {
  return mockDeviceModels.find(model => model.id === modelId) || null;
}

// Mock device data
const mockDeviceModels: DeviceModel[] = [
  {
    id: 'tesla-powerwall-2',
    name: 'Tesla Powerwall 2',
    manufacturer: 'Tesla',
    model: 'Powerwall 2',
    model_number: 'PW2',
    device_type: 'battery',
    category: 'batteries',
    protocol: 'ModbusTCP',
    firmware_version: '21.44.1',
    supported: true,
    description: 'Home battery system that stores energy from solar or the grid and makes it available when you need it.',
    images: ['/assets/devices/powerwall.png'],
    power_rating: 7,
    capacity: 13.5,
    has_manual: true,
    has_datasheet: true,
    has_video: true,
    specifications: {
      capacity: '13.5 kWh',
      power: '7 kW peak / 5 kW continuous',
      efficiency: '90%',
      dimensions: '1150mm x 755mm x 155mm',
      weight: '114 kg',
      installation: 'Indoor/outdoor wall-mounted',
      warranty: '10 years'
    }
  },
  {
    id: 'lg-chem-resu10h',
    name: 'LG Chem RESU 10H',
    manufacturer: 'LG Chem',
    model: 'RESU 10H',
    model_number: 'RESU10H',
    device_type: 'battery',
    category: 'batteries',
    protocol: 'CAN',
    firmware_version: '3.2.0',
    supported: true,
    description: 'High voltage battery for residential energy storage with a capacity of 9.8 kWh.',
    images: ['/assets/devices/lg-chem-resu.png'],
    power_rating: 5,
    capacity: 9.8,
    has_manual: true,
    has_datasheet: true,
    has_video: false,
    specifications: {
      capacity: '9.8 kWh',
      power: '5 kW continuous',
      efficiency: '94.3%',
      dimensions: '452mm x 664mm x 120mm',
      weight: '97 kg',
      installation: 'Indoor/outdoor wall-mounted',
      warranty: '10 years'
    }
  },
  {
    id: 'sma-sunny-boy',
    name: 'SMA Sunny Boy 6.0',
    manufacturer: 'SMA',
    model: 'Sunny Boy 6.0',
    model_number: 'SB6.0-1SP-US-40',
    device_type: 'inverter',
    category: 'inverters',
    protocol: 'ModbusRTU',
    firmware_version: '2.3.9',
    supported: true,
    description: 'Residential string inverter with SMA Smart Connected service and secure power supply.',
    images: ['/assets/devices/sma-sunny-boy.png'],
    power_rating: 6.0,
    has_manual: true,
    has_datasheet: true,
    has_video: false,
    specifications: {
      max_power: '6.0 kW',
      efficiency: '97.6%',
      mppt_ranges: '2',
      dimensions: '435mm x 470mm x 225mm',
      weight: '22 kg',
      installation: 'Indoor/outdoor wall-mounted',
      warranty: '5 years (extendable to 10/15)'
    }
  },
  {
    id: 'fronius-symo',
    name: 'Fronius Symo 10.0',
    manufacturer: 'Fronius',
    model: 'Symo 10.0',
    model_number: 'Symo 10.0-3-M',
    device_type: 'inverter',
    category: 'inverters',
    protocol: 'SunSpec',
    firmware_version: '4.2.1',
    supported: true,
    description: 'Commercial three-phase inverter with power categories from 10.0 to 20.0 kW.',
    images: ['/assets/devices/fronius-symo.png'],
    power_rating: 10.0,
    has_manual: true,
    has_datasheet: true,
    has_video: true,
    specifications: {
      max_power: '10.0 kW',
      efficiency: '98.1%',
      mppt_ranges: '2',
      dimensions: '725mm x 510mm x 225mm',
      weight: '34 kg',
      installation: 'Indoor/outdoor wall-mounted',
      warranty: '5 years (extendable to 10)'
    }
  }
];
