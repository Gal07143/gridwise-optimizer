
import { ModbusDevice, ModbusDeviceConfig, ModbusReadingResult } from '@/types/energy';

// Mock modbus devices
const mockModbusDevices: ModbusDevice[] = [
  {
    id: 'device-1',
    name: 'Inverter 1',
    address: '192.168.1.100',
    port: 502,
    unit_id: 1,
    protocol: 'tcp',
    description: 'Main solar inverter',
    site_id: 'site-1',
    created_at: '2023-01-15T12:00:00Z',
    updated_at: '2023-01-15T12:00:00Z'
  },
  {
    id: 'device-2',
    name: 'Battery Controller',
    address: '192.168.1.101',
    port: 502,
    unit_id: 2,
    protocol: 'tcp',
    description: 'Battery management system',
    site_id: 'site-1',
    created_at: '2023-01-16T10:30:00Z',
    updated_at: '2023-01-16T10:30:00Z'
  }
];

/**
 * Get all modbus devices
 */
export const getAllModbusDevices = async (): Promise<ModbusDevice[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockModbusDevices]);
    }, 500);
  });
};

/**
 * Get a specific modbus device by ID
 */
export const getModbusDeviceById = async (deviceId: string): Promise<ModbusDevice | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const device = mockModbusDevices.find(d => d.id === deviceId);
      resolve(device || null);
    }, 300);
  });
};

/**
 * Create a new modbus device
 */
export const createModbusDevice = async (deviceConfig: Omit<ModbusDeviceConfig, 'id'>): Promise<ModbusDevice> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newDevice: ModbusDevice = {
        ...deviceConfig,
        id: `device-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      mockModbusDevices.push(newDevice);
      resolve(newDevice);
    }, 500);
  });
};

/**
 * Update a modbus device
 */
export const updateModbusDevice = async (
  deviceId: string,
  updates: Partial<ModbusDeviceConfig>
): Promise<ModbusDevice | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockModbusDevices.findIndex(d => d.id === deviceId);
      if (index === -1) {
        resolve(null);
        return;
      }
      
      const updatedDevice = {
        ...mockModbusDevices[index],
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      mockModbusDevices[index] = updatedDevice;
      resolve(updatedDevice);
    }, 500);
  });
};

/**
 * Delete a modbus device
 */
export const deleteModbusDevice = async (deviceId: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockModbusDevices.findIndex(d => d.id === deviceId);
      if (index === -1) {
        resolve(false);
        return;
      }
      
      mockModbusDevices.splice(index, 1);
      resolve(true);
    }, 500);
  });
};

/**
 * Read a register from a modbus device
 */
export const readRegister = async (
  deviceId: string,
  registerAddress: number,
  length = 1,
  registerType: 'coil' | 'discrete_input' | 'input_register' | 'holding_register' = 'holding_register'
): Promise<ModbusReadingResult> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate a 10% chance of error
      if (Math.random() < 0.1) {
        reject(new Error('Communication error with modbus device'));
        return;
      }
      
      // Generate a random value based on register type
      let value: number | boolean | string;
      if (registerType === 'coil' || registerType === 'discrete_input') {
        value = Math.random() > 0.5;
      } else {
        value = Math.floor(Math.random() * 1000);
      }
      
      resolve({
        timestamp: new Date().toISOString(),
        register_address: registerAddress,
        value,
        raw_value: value,
        device_id: deviceId,
        register_id: `reg-${registerAddress}`,
        register_name: `Register ${registerAddress}`,
        unit: 'unit'
      });
    }, 500);
  });
};

/**
 * Write to a register on a modbus device
 */
export const writeRegister = async (
  deviceId: string,
  registerAddress: number,
  value: number | boolean,
  registerType: 'coil' | 'holding_register' = 'holding_register'
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate a 15% chance of error
      if (Math.random() < 0.15) {
        reject(new Error('Communication error while writing to modbus device'));
        return;
      }
      
      // In a real implementation, this would actually write to the device
      console.log(`Writing ${value} to ${registerType} ${registerAddress} on device ${deviceId}`);
      resolve(true);
    }, 700);
  });
};

