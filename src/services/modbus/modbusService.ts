
import { ModbusDevice, ModbusDeviceConfig, ModbusReadingResult } from '@/types/modbus';
import { toast } from 'sonner';

// Mock data
const mockModbusDevices: ModbusDevice[] = [
  {
    id: '1',
    name: 'Inverter Gateway',
    ip: '192.168.1.100',
    port: 502,
    unit_id: 1,
    is_active: true,
    protocol: 'TCP',
    status: 'online',
    description: 'Main inverter gateway'
  },
  {
    id: '2',
    name: 'Battery BMS',
    ip: '192.168.1.101',
    port: 502,
    unit_id: 2,
    is_active: true,
    protocol: 'TCP',
    status: 'online',
    description: 'Battery management system'
  },
  {
    id: '3',
    name: 'Meter Gateway',
    ip: '192.168.1.102',
    port: 1502,
    unit_id: 1,
    is_active: false,
    protocol: 'TCP',
    status: 'offline',
    description: 'Smart meter connection'
  }
];

/**
 * Get all Modbus devices
 */
export const getAllModbusDevices = async (): Promise<ModbusDevice[]> => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 500));
  return [...mockModbusDevices];
};

/**
 * Get a Modbus device by ID
 */
export const getModbusDeviceById = async (id: string): Promise<ModbusDevice | null> => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 300));
  const device = mockModbusDevices.find(d => d.id === id) || null;
  return device;
};

/**
 * Create a new Modbus device
 */
export const createModbusDevice = async (deviceConfig: ModbusDeviceConfig): Promise<ModbusDevice> => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const newDevice: ModbusDevice = {
    ...deviceConfig,
    id: `device-${Date.now()}`,
    status: 'offline',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  // In a real app, we would save to the backend
  // For now, just console log
  console.log('Created new Modbus device:', newDevice);
  
  return newDevice;
};

/**
 * Update an existing Modbus device
 */
export const updateModbusDevice = async (id: string, updates: Partial<ModbusDeviceConfig>): Promise<ModbusDevice> => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // In a real app, we would update in the backend
  // For now, just log and return a mock response
  console.log(`Updating device ${id} with:`, updates);
  
  const device = await getModbusDeviceById(id);
  if (!device) {
    throw new Error('Device not found');
  }
  
  const updatedDevice: ModbusDevice = {
    ...device,
    ...updates,
    updated_at: new Date().toISOString()
  };
  
  return updatedDevice;
};

/**
 * Delete a Modbus device
 */
export const deleteModbusDevice = async (id: string): Promise<boolean> => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // In a real app, we would delete from the backend
  console.log(`Deleting device ${id}`);
  
  return true;
};

/**
 * Test connection to a Modbus device
 */
export const testModbusConnection = async (device: Partial<ModbusDevice>): Promise<boolean> => {
  // Simulate API latency and connection test
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate 80% success rate
  const success = Math.random() < 0.8;
  
  if (!success) {
    throw new Error(`Failed to connect to ${device.ip}:${device.port}`);
  }
  
  return success;
};

/**
 * Read a register from a Modbus device
 */
export const readRegister = async (
  deviceId: string, 
  address: number, 
  length: number = 1
): Promise<ModbusReadingResult> => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 800));
  
  try {
    // For demo purposes, generate random values based on address
    const value = Math.floor(Math.random() * 1000) / 10;
    
    return {
      value,
      address,
      success: true,
      timestamp: new Date().toISOString(),
      error: undefined
    };
  } catch (error) {
    console.error('Error reading Modbus register:', error);
    return {
      value: 0,
      address,
      success: false,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error : new Error('Unknown error')
    };
  }
};

/**
 * Write a value to a Modbus register
 */
export const writeRegister = async (
  deviceId: string, 
  address: number, 
  value: number, 
  dataType: string = 'int16'
): Promise<boolean> => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 800));
  
  try {
    // Log the operation for demonstration
    console.log(`Writing ${value} to device ${deviceId}, address ${address}, type ${dataType}`);
    
    // Simulate 90% success rate
    if (Math.random() < 0.9) {
      return true;
    } else {
      throw new Error('Simulated write failure');
    }
  } catch (error) {
    console.error('Error writing to Modbus register:', error);
    throw error;
  }
};
