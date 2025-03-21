
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
    description: 'High-efficiency solar inverter',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Tesla Powerwall',
    manufacturer: 'Tesla',
    type: 'battery',
    description: 'Home battery storage system',
    created_at: new Date().toISOString()
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
      description: 'High-efficiency solar inverter',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Tesla Powerwall',
      manufacturer: 'Tesla',
      type: 'battery',
      description: 'Home battery storage system',
      created_at: new Date().toISOString()
    },
    {
      id: '3',
      name: 'Fronius Symo',
      manufacturer: 'Fronius',
      type: 'inverter',
      description: 'Three-phase inverter for commercial applications',
      created_at: new Date().toISOString()
    },
    {
      id: '4',
      name: 'Enphase Microinverter',
      manufacturer: 'Enphase',
      type: 'inverter',
      description: 'Module-level power electronics',
      created_at: new Date().toISOString()
    },
    {
      id: '5',
      name: 'SMA Sunny Boy',
      manufacturer: 'SMA',
      type: 'inverter',
      description: 'String inverter for residential applications',
      created_at: new Date().toISOString()
    },
    {
      id: '6',
      name: 'LG Chem RESU',
      manufacturer: 'LG Chem',
      type: 'battery',
      description: 'Residential energy storage unit',
      created_at: new Date().toISOString()
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

// Add the missing getDeviceModelById function
export const getDeviceModelById = async (id: string): Promise<DeviceModel | null> => {
  try {
    const query = `SELECT * FROM device_models WHERE id = $1`;
    const result = await executeSql<DeviceModel>(query, [id]);
    
    if (Array.isArray(result) && result.length > 0) {
      return result[0];
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching device model:', error);
    toast.error('Failed to fetch device model');
    return null;
  }
};
