
import { DeviceModel } from "@/hooks/useDeviceModels";

export interface Device {
  id: string;
  name: string;
  type: string;
  status: 'online' | 'offline' | 'maintenance' | 'error';
  capacity?: number;
  location?: string;
  installation_date?: string;
  last_maintenance?: string;
  firmware?: string;
  description?: string;
  manufacturer?: string;
  model?: string;
  serial_number?: string;
}

// Mock data
const devices: Device[] = [
  {
    id: 'dev-001',
    name: 'Main Battery Pack',
    type: 'battery',
    status: 'online',
    capacity: 13.5,
    location: 'Basement',
    installation_date: '2023-01-15',
    last_maintenance: '2023-10-10',
    firmware: 'v2.3.4',
    description: 'Primary energy storage system',
    manufacturer: 'Tesla',
    model: 'Powerwall 2',
    serial_number: 'TPS-12345-678'
  },
  {
    id: 'dev-002',
    name: 'Solar Array South',
    type: 'solar',
    status: 'online',
    capacity: 7.2,
    location: 'Roof South',
    installation_date: '2023-01-15',
    last_maintenance: '2023-09-05',
    firmware: 'v1.8.2',
    description: 'South-facing solar panel array',
    manufacturer: 'SunPower',
    model: 'X-Series',
    serial_number: 'SP-78901-234'
  },
  {
    id: 'dev-003',
    name: 'EV Charger',
    type: 'charger',
    status: 'online',
    capacity: 11,
    location: 'Garage',
    installation_date: '2023-02-20',
    last_maintenance: '2023-11-15',
    firmware: 'v3.1.0',
    description: 'Electric vehicle charging station',
    manufacturer: 'ChargePoint',
    model: 'Home Flex',
    serial_number: 'CP-34567-890'
  },
  {
    id: 'dev-004',
    name: 'Wind Turbine 1',
    type: 'wind',
    status: 'maintenance',
    capacity: 3.5,
    location: 'North Yard',
    installation_date: '2023-03-10',
    last_maintenance: '2023-12-01',
    firmware: 'v1.2.5',
    description: 'Small wind turbine for supplemental power',
    manufacturer: 'Bergey',
    model: 'Excel 10',
    serial_number: 'BW-56789-012'
  },
  {
    id: 'dev-005',
    name: 'Smart Meter',
    type: 'meter',
    status: 'online',
    location: 'Utility Room',
    installation_date: '2023-01-15',
    last_maintenance: '2023-08-20',
    firmware: 'v4.0.1',
    description: 'Main power consumption meter',
    manufacturer: 'Landis+Gyr',
    model: 'E650',
    serial_number: 'LG-90123-456'
  },
  {
    id: 'dev-006',
    name: 'HVAC Controller',
    type: 'hvac',
    status: 'offline',
    location: 'Living Room',
    installation_date: '2023-04-05',
    last_maintenance: '2023-10-25',
    firmware: 'v2.4.3',
    description: 'Smart HVAC control system',
    manufacturer: 'Nest',
    model: 'Learning Thermostat',
    serial_number: 'NT-23456-789'
  }
];

// Mock device models for testing
const deviceModels: DeviceModel[] = [
  {
    id: 'mod-001',
    name: 'Powerwall 2',
    manufacturer: 'Tesla',
    category: 'batteries',
    capacity: 13.5,
    releaseDate: '2020-06-15',
    connectivity: ['Wi-Fi', 'Ethernet'],
    certifications: ['UL', 'IEC', 'CE'],
    dimensions: '1150 x 755 x 155 mm',
    weight: '125 kg',
    powerRating: '7 kW peak / 5 kW continuous',
    voltage: '220-240V',
    description: 'Home battery system that stores energy from solar or the grid.',
    imageUrl: 'https://www.tesla.com/sites/default/files/powerwall/PW2_Standalone_V03_Desktop.jpg'
  },
  {
    id: 'mod-002',
    name: 'X-Series SPR-X22-370',
    manufacturer: 'SunPower',
    category: 'inverters',
    capacity: 0.37,
    releaseDate: '2021-03-20',
    connectivity: ['Modbus', 'RS485'],
    certifications: ['IEC', 'CE'],
    dimensions: '1046 x 1690 x 40 mm',
    weight: '19 kg',
    powerRating: '370W',
    voltage: '65.8V',
    description: 'High-efficiency solar panel with industry-leading power output.',
    imageUrl: 'https://us.sunpower.com/sites/default/files/2019-05/x-series-residential-solar-panels.png'
  },
  {
    id: 'mod-003',
    name: 'Home Flex',
    manufacturer: 'ChargePoint',
    category: 'ev-chargers',
    capacity: 50,
    releaseDate: '2022-01-10',
    connectivity: ['Wi-Fi', 'Bluetooth', 'Cellular'],
    certifications: ['UL', 'Energy Star'],
    dimensions: '413 x 176 x 188 mm',
    weight: '8.5 kg',
    powerRating: '50A/12kW',
    voltage: '240V',
    description: 'Flexible home EV charging station with adjustable amperage.',
    imageUrl: 'https://www.chargepoint.com/sites/default/files/inline-images/cp-home-product-photo.png'
  },
  {
    id: 'mod-004',
    name: 'Sunny Boy 7.7-US',
    manufacturer: 'SMA',
    category: 'inverters',
    capacity: 7.7,
    releaseDate: '2021-09-05',
    connectivity: ['Ethernet', 'Speedwire'],
    certifications: ['UL 1741', 'IEEE 1547'],
    dimensions: '490 x 665 x 195 mm',
    weight: '26 kg',
    powerRating: '7700W',
    voltage: '600V',
    description: 'Residential string inverter with SMA Smart Connected service.',
    imageUrl: 'https://www.sma-america.com/fileadmin/content/global/Products/Images/Residential/Sunny_Boy_US/SMA_Sunny_Boy_Residential_Inverter_Product_Image.jpg'
  },
  {
    id: 'mod-005',
    name: 'Excel 10',
    manufacturer: 'Bergey',
    category: 'controllers',
    capacity: 10,
    releaseDate: '2022-05-15',
    connectivity: ['RS485'],
    certifications: ['AWEA', 'IEC 61400-2'],
    dimensions: '7m rotor diameter',
    weight: '545 kg',
    powerRating: '10 kW',
    voltage: '240V',
    description: 'Small wind turbine for residential and small business applications.',
    imageUrl: 'https://bergey.com/wp-content/uploads/Excel-10-Install-Colorado.jpg'
  },
  {
    id: 'mod-006',
    name: 'E650 S4x',
    manufacturer: 'Landis+Gyr',
    category: 'meters',
    releaseDate: '2021-11-01',
    connectivity: ['Cellular', 'RF Mesh'],
    certifications: ['ANSI C12.20', 'UL'],
    dimensions: '178 x 244 x 66 mm',
    weight: '1.5 kg',
    voltage: '120-480V',
    description: 'Advanced grid meter with powerful computing platform.',
    imageUrl: 'https://www.landisgyr.com/webfoo/wp-content/uploads/2015/12/E650-S4x-1024x1024.jpg'
  }
];

export const getDevices = async (): Promise<Device[]> => {
  // Simulate API request
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(devices);
    }, 500);
  });
};

export const getDeviceById = async (id: string): Promise<Device | null> => {
  // Simulate API request
  return new Promise((resolve) => {
    setTimeout(() => {
      const device = devices.find(d => d.id === id);
      resolve(device || null);
    }, 500);
  });
};

export const getDeviceModelById = async (id: string): Promise<DeviceModel | null> => {
  // Simulate API request
  return new Promise((resolve) => {
    setTimeout(() => {
      const deviceModel = deviceModels.find(d => d.id === id);
      resolve(deviceModel || null);
    }, 500);
  });
};

export const getDeviceModelsByCategory = async (category: string): Promise<DeviceModel[]> => {
  // Simulate API request
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredDevices = deviceModels.filter(d => d.category === category);
      resolve(filteredDevices);
    }, 500);
  });
};

export const getAllDeviceModels = async (): Promise<DeviceModel[]> => {
  // Simulate API request
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(deviceModels);
    }, 500);
  });
};
