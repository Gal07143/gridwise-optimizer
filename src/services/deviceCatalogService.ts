import { DeviceType } from '@/types/energy';
import { DeviceModel } from '@/types/device';
import axios from 'axios';

// Define a category type to match what's needed in the app
export interface DeviceCategory {
  id: string;
  name: string;
  icon: string;
  description?: string;
}

// Sample data for device categories
const deviceCategories: DeviceCategory[] = [
  { id: 'solar', name: 'Solar Panels', icon: 'Sun', description: 'PV panels and solar generation equipment' },
  { id: 'battery', name: 'Batteries', icon: 'Battery', description: 'Energy storage systems' },
  { id: 'inverter', name: 'Inverters', icon: 'Workflow', description: 'DC/AC conversion devices' },
  { id: 'ev_charger', name: 'EV Chargers', icon: 'Plug', description: 'Electric vehicle charging stations' },
  { id: 'meter', name: 'Meters', icon: 'Activity', description: 'Energy measurement devices' },
  { id: 'load', name: 'Loads', icon: 'Power', description: 'Consumption devices' },
  { id: 'controller', name: 'Controllers', icon: 'Cpu', description: 'System controllers and gateways' },
  { id: 'wind', name: 'Wind Turbines', icon: 'Wind', description: 'Wind energy generation equipment' },
  { id: 'hydro', name: 'Hydro Generation', icon: 'Droplets', description: 'Hydroelectric generation systems' },
];

/**
 * Get all device categories
 */
export function getAllCategories(): DeviceCategory[] {
  return deviceCategories;
}

/**
 * Get a specific device category by ID
 */
export function getDeviceCategoryById(id: string): DeviceCategory | undefined {
  return deviceCategories.find(cat => cat.id === id);
}

/**
 * Get the name of a device category by ID
 */
export function getCategoryName(id: string): string {
  const category = deviceCategories.find(cat => cat.id === id);
  return category ? category.name : id;
}

/**
 * Get all device models from the API
 */
export async function getAllDeviceModels(): Promise<DeviceModel[]> {
  try {
    const response = await axios.get('/api/device-models');
    return response.data;
  } catch (error) {
    console.error('Error fetching device models:', error);
    // Return sample data for development
    return sampleDeviceModels;
  }
}

/**
 * Get device models by category
 */
export async function getDeviceModelsByCategory(categoryId: string): Promise<DeviceModel[]> {
  try {
    const response = await axios.get(`/api/device-models?category=${categoryId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching models for category ${categoryId}:`, error);
    // Filter sample data by category
    return sampleDeviceModels.filter(model => model.device_type === categoryId);
  }
}

/**
 * Get device models by type
 */
export async function getDeviceModelsByType(deviceType: DeviceType): Promise<DeviceModel[]> {
  try {
    const response = await axios.get(`/api/device-models?type=${deviceType}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching models for type ${deviceType}:`, error);
    // Filter sample data by type
    return sampleDeviceModels.filter(model => model.device_type === deviceType);
  }
}

/**
 * Get a specific device model by ID
 */
export async function getDeviceModelById(id: string): Promise<DeviceModel | null> {
  try {
    const response = await axios.get(`/api/device-models/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching model with ID ${id}:`, error);
    // Find in sample data
    const model = sampleDeviceModels.find(model => model.id === id);
    return model || null;
  }
}

// Sample data for development
const sampleDeviceModels: DeviceModel[] = [
  {
    id: "1",
    name: "SunPower X-Series",
    manufacturer: "SunPower",
    model_number: "SPR-X22-370",
    device_type: "solar",
    category: "solar",
    description: "High-efficiency solar panel",
    power_rating: 370,
    specifications: {
      efficiency: 22.7,
      dimensions: "1046mm x 1690mm x 40mm",
      weight: 18.6,
      cellType: "Monocrystalline"
    },
    protocol: "Modbus",
    support_level: "full",
    release_date: "2021-03-15",
    firmware_version: "3.2.1",
    created_at: "2023-01-01T00:00:00Z"
  },
  {
    id: "2",
    name: "Tesla Powerwall 2",
    manufacturer: "Tesla",
    model_number: "1464926-00-B",
    device_type: "battery",
    category: "battery",
    description: "Home battery system for solar energy storage",
    capacity: 13.5,
    power_rating: 7,
    specifications: {
      voltage: 240,
      weight: 114,
      dimensions: "1150mm x 755mm x 155mm",
      roundTripEfficiency: 90
    },
    protocol: "Modbus TCP",
    support_level: "full",
    release_date: "2020-05-20",
    firmware_version: "21.44.1",
    created_at: "2023-01-02T00:00:00Z"
  },
  {
    id: "3",
    name: "SMA Sunny Boy",
    manufacturer: "SMA",
    model_number: "SB7.7-1SP-US-41",
    device_type: "inverter",
    category: "inverter",
    description: "Grid-tied string inverter",
    power_rating: 7.7,
    specifications: {
      efficiency: 97.5,
      inputVoltage: "220-480",
      warranty: "10 years",
      dimensions: "490mm x 665mm x 225mm"
    },
    protocol: "SunSpec Modbus",
    support_level: "full",
    release_date: "2022-01-15",
    firmware_version: "3.15.22",
    created_at: "2023-01-03T00:00:00Z"
  },
  {
    id: "4",
    name: "ChargePoint Home Flex",
    manufacturer: "ChargePoint",
    model_number: "CPH50",
    device_type: "ev_charger",
    category: "ev_charger",
    description: "Flexible home charging station",
    power_rating: 12,
    specifications: {
      voltage: "240V",
      amperage: "50A",
      cableLength: "23 feet",
      connectivity: "WiFi, Bluetooth",
      weatherRating: "NEMA 3R"
    },
    protocol: "OCPP 1.6J",
    support_level: "partial",
    release_date: "2021-08-10",
    firmware_version: "8.4.3",
    created_at: "2023-01-04T00:00:00Z"
  }
];

export default {
  getAllCategories,
  getDeviceCategoryById,
  getCategoryName,
  getAllDeviceModels,
  getDeviceModelsByCategory,
  getDeviceModelsByType,
  getDeviceModelById
};
