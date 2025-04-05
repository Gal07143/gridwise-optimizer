import { DeviceModel } from '@/types/energy';

// Add this function to fix the error
export const getCategoryName = (categoryId: string): string => {
  const categories: Record<string, string> = {
    'solar': 'Solar Generation',
    'battery': 'Energy Storage',
    'inverter': 'Power Conversion',
    'wind': 'Wind Generation',
    'hydroelectric': 'Hydroelectric Generation',
    'grid': 'Grid Connection',
    'load': 'Load Management',
    'meter': 'Metering & Monitoring',
    'controller': 'System Controllers',
    'ev_charger': 'EV Charging'
  };
  
  return categories[categoryId] || 'Uncategorized';
};

// Mock function to get all device models
export async function getAllDeviceModels(): Promise<DeviceModel[]> {
  // This is a mock implementation - would call an API in a real app
  return mockDeviceModels;
}

// Mock function to get a device model by ID
export async function getDeviceModelById(id: string): Promise<DeviceModel | null> {
  const model = mockDeviceModels.find(m => m.id === id);
  return model || null;
}

// Mock function to get device models by category
export async function getDeviceModelsByCategory(category: string): Promise<DeviceModel[]> {
  return mockDeviceModels.filter(m => m.category === category);
}

// Mock function to search device models
export async function searchDeviceModels(query: string): Promise<DeviceModel[]> {
  const lowercaseQuery = query.toLowerCase();
  return mockDeviceModels.filter(m => 
    m.name.toLowerCase().includes(lowercaseQuery) ||
    m.manufacturer.toLowerCase().includes(lowercaseQuery) ||
    m.model_number.toLowerCase().includes(lowercaseQuery)
  );
}

// Mock device models data
const mockDeviceModels: DeviceModel[] = [
  {
    id: '1',
    name: 'SolarEdge SE5000H',
    manufacturer: 'SolarEdge',
    model_number: 'SE5000H',
    device_type: 'inverter',
    category: 'inverter',
    description: 'High efficiency single phase inverter with HD-Wave technology',
    power_rating: 5000,
    specifications: {
      efficiency: 99.2,
      inputVoltage: '200-480V',
      outputVoltage: '240V',
      mpptRange: '150-480V',
      weight: 9.5,
      dimensions: '450 x 370 x 174 mm'
    },
    protocol: 'Modbus TCP',
    support_level: 'full',
    has_manual: true,
    firmware_version: '3.2242',
    release_date: '2020-05-15',
    images: [
      '/assets/images/devices/solaredge-se5000h.png'
    ]
  },
  {
    id: '2',
    name: 'Tesla Powerwall 2',
    manufacturer: 'Tesla',
    model_number: 'PW2',
    device_type: 'battery',
    category: 'battery',
    description: 'Rechargeable home battery system for energy storage',
    capacity: 13.5,
    specifications: {
      efficiency: 90,
      inputVoltage: '350-450V',
      outputVoltage: '240V',
      power: 7,
      weight: 114,
      dimensions: '1150 x 755 x 155 mm',
      warranty: '10 years'
    },
    protocol: 'Tesla API',
    support_level: 'partial',
    has_manual: true,
    firmware_version: '20.49.0',
    release_date: '2019-11-15',
    images: [
      '/assets/images/devices/tesla-powerwall.png'
    ]
  },
  {
    id: '3',
    name: 'Fronius Symo 10.0-3-M',
    manufacturer: 'Fronius',
    model_number: 'Symo 10.0-3-M',
    device_type: 'inverter',
    category: 'inverter',
    description: 'Three-phase inverter with power categories from 3.0 to 20.0 kW',
    power_rating: 10000,
    specifications: {
      efficiency: 98.1,
      inputVoltage: '200-1000V',
      outputVoltage: '400V',
      mpptRange: '200-800V',
      weight: 33.8,
      dimensions: '725 x 510 x 225 mm'
    },
    protocol: 'Modbus TCP, Sunspec',
    support_level: 'full',
    has_manual: true,
    firmware_version: '3.23.4-2',
    release_date: '2021-02-10',
    images: [
      '/assets/images/devices/fronius-symo.png'
    ]
  },
  {
    id: '4',
    name: 'SMA Sunny Boy 7.7-US',
    manufacturer: 'SMA',
    model_number: 'Sunny Boy 7.7-US',
    device_type: 'inverter',
    category: 'inverter',
    description: 'Transformerless PV inverter with Secure Power Supply',
    power_rating: 7700,
    specifications: {
      efficiency: 97.5,
      inputVoltage: '150-600V',
      outputVoltage: '240V',
      mpptRange: '150-480V',
      weight: 55,
      dimensions: '621 x 470 x 176 mm'
    },
    protocol: 'Modbus RTU, Webconnect',
    support_level: 'full',
    has_manual: true,
    firmware_version: '3.01.02.R',
    release_date: '2020-09-22',
    images: [
      '/assets/images/devices/sma-sunny-boy.png'
    ]
  }
];

export default {
  getAllDeviceModels,
  getDeviceModelById,
  getDeviceModelsByCategory,
  searchDeviceModels
};
