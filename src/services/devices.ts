
// This file needs to be updated to fix the device models with category property

import { toast } from 'sonner';
import { executeSql } from './sqlExecutor';
import { DeviceModel } from '@/types/energy';

// Mock data for device models since we're now using SQL execution
const deviceModels: DeviceModel[] = [
  {
    id: '1',
    name: 'SolarEdge Inverter',
    manufacturer: 'SolarEdge',
    type: 'inverter',
    version: '1.0.0',
    description: 'High-efficiency solar inverter',
    created_at: new Date().toISOString(),
    last_updated: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Tesla Powerwall',
    manufacturer: 'Tesla',
    type: 'battery',
    version: '2.0.0',
    description: 'Home battery storage system',
    created_at: new Date().toISOString(),
    last_updated: new Date().toISOString()
  }
];

// Get device models with category
export const getDeviceModelsWithCategory = async (category?: string): Promise<DeviceModel[]> => {
  try {
    // Build SQL query
    let query = `
      SELECT * FROM device_models
      WHERE 1=1
    `;

    const params: any[] = [];

    if (category && category !== 'all') {
      query += ` AND category = $1`;
      params.push(category);
    }

    query += ` ORDER BY name ASC`;

    // Execute SQL via edge function
    const result = await executeSql<DeviceModel>(query, params);
    
    if (Array.isArray(result)) {
      return result;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching device models:', error);
    toast.error('Failed to fetch device models');
    return deviceModels; // Return mock data as fallback
  }
};

export const getMockDeviceModels = (): DeviceModel[] => {
  return [
    {
      id: '1',
      name: 'SolarEdge Inverter',
      manufacturer: 'SolarEdge',
      type: 'inverter',
      version: '1.0.0',
      description: 'High-efficiency solar inverter',
      created_at: new Date().toISOString(),
      last_updated: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Tesla Powerwall',
      manufacturer: 'Tesla',
      type: 'battery',
      version: '2.0.0',
      description: 'Home battery storage system',
      created_at: new Date().toISOString(),
      last_updated: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Fronius Symo',
      manufacturer: 'Fronius',
      type: 'inverter',
      version: '3.0.0',
      description: 'Three-phase inverter for commercial applications',
      created_at: new Date().toISOString(),
      last_updated: new Date().toISOString()
    },
    {
      id: '4',
      name: 'Enphase Microinverter',
      manufacturer: 'Enphase',
      type: 'inverter',
      version: '1.5.0',
      description: 'Module-level power electronics',
      created_at: new Date().toISOString(),
      last_updated: new Date().toISOString()
    },
    {
      id: '5',
      name: 'SMA Sunny Boy',
      manufacturer: 'SMA',
      type: 'inverter',
      version: '2.1.0',
      description: 'String inverter for residential applications',
      created_at: new Date().toISOString(),
      last_updated: new Date().toISOString()
    },
    {
      id: '6',
      name: 'LG Chem RESU',
      manufacturer: 'LG Chem',
      type: 'battery',
      version: '1.2.0',
      description: 'Residential energy storage unit',
      created_at: new Date().toISOString(),
      last_updated: new Date().toISOString()
    }
  ];
};

// Function to get device categories
export const getDeviceCategories = async (): Promise<string[]> => {
  try {
    const query = `
      SELECT DISTINCT category 
      FROM device_models 
      WHERE category IS NOT NULL
      ORDER BY category
    `;
    
    const results = await executeSql<{category: string}>(query);
    
    if (Array.isArray(results)) {
      return results.map(row => row.category);
    }
    
    return ['inverter', 'battery', 'meter', 'solar', 'wind'];
  } catch (error) {
    console.error('Error fetching device categories:', error);
    return ['inverter', 'battery', 'meter', 'solar', 'wind'];
  }
};
