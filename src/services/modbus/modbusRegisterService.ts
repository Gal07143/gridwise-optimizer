
// Mock implementation of modbus register service

import { ModbusRegisterDefinition } from '@/types/energy';

// Mock registers for testing
const mockRegisters: ModbusRegisterDefinition[] = [
  {
    id: '1',
    device_id: 'device-1',
    register_address: 1000,
    register_type: 'holding_register',
    register_name: 'Voltage',
    register_length: 1,
    data_type: 'uint16',
    unit: 'V',
    scaling_factor: 0.1,
    description: 'Grid voltage'
  },
  {
    id: '2',
    device_id: 'device-1',
    register_address: 1001,
    register_type: 'holding_register',
    register_name: 'Current',
    register_length: 1,
    data_type: 'uint16',
    unit: 'A',
    scaling_factor: 0.01,
    description: 'Load current'
  },
  {
    id: '3',
    device_id: 'device-1',
    register_address: 1002,
    register_type: 'holding_register',
    register_name: 'Power',
    register_length: 2,
    data_type: 'int32',
    unit: 'W',
    scaling_factor: 1,
    description: 'Active power'
  },
  {
    id: '4',
    device_id: 'device-1',
    register_address: 1004,
    register_type: 'holding_register',
    register_name: 'Energy',
    register_length: 2,
    data_type: 'uint32',
    unit: 'kWh',
    scaling_factor: 0.001,
    description: 'Energy consumption'
  },
  {
    id: '5',
    device_id: 'device-1',
    register_address: 1006,
    register_type: 'holding_register',
    register_name: 'Frequency',
    register_length: 1,
    data_type: 'uint16',
    unit: 'Hz',
    scaling_factor: 0.01,
    description: 'Grid frequency'
  },
  {
    id: '6',
    device_id: 'device-1',
    register_address: 1007,
    register_type: 'holding_register',
    register_name: 'Temperature',
    register_length: 1,
    data_type: 'int16',
    unit: '°C',
    scaling_factor: 0.1,
    description: 'Device temperature'
  },
  {
    id: '7',
    device_id: 'device-1',
    register_address: 1008,
    register_type: 'coil',
    register_name: 'Status',
    register_length: 1,
    data_type: 'boolean',
    description: 'Device status'
  },
];

/**
 * Get modbus registers for a specific device
 */
export const getModbusRegistersByDeviceId = async (
  deviceId: string
): Promise<ModbusRegisterDefinition[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const registers = mockRegisters.filter(reg => reg.device_id === deviceId);
      resolve(registers);
    }, 300);
  });
};

/**
 * Get a specific register by ID
 */
export const getRegisterById = async (
  registerId: string
): Promise<ModbusRegisterDefinition | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const register = mockRegisters.find(reg => reg.id === registerId);
      resolve(register || null);
    }, 100);
  });
};

/**
 * Create a new modbus register definition
 */
export const createModbusRegister = async (
  register: Omit<ModbusRegisterDefinition, 'id'>
): Promise<ModbusRegisterDefinition> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newRegister: ModbusRegisterDefinition = {
        ...register,
        id: `register-${Date.now()}`,
      };
      mockRegisters.push(newRegister);
      resolve(newRegister);
    }, 300);
  });
};

/**
 * Update a modbus register definition
 */
export const updateModbusRegister = async (
  registerId: string,
  updates: Partial<ModbusRegisterDefinition>
): Promise<ModbusRegisterDefinition | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockRegisters.findIndex(reg => reg.id === registerId);
      if (index === -1) {
        resolve(null);
        return;
      }
      
      mockRegisters[index] = { ...mockRegisters[index], ...updates };
      resolve(mockRegisters[index]);
    }, 300);
  });
};

/**
 * Delete a modbus register definition
 */
export const deleteModbusRegister = async (registerId: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockRegisters.findIndex(reg => reg.id === registerId);
      if (index === -1) {
        resolve(false);
        return;
      }
      
      mockRegisters.splice(index, 1);
      resolve(true);
    }, 300);
  });
};

/**
 * Get default register map for a device type
 */
export const getDefaultRegisterMap = async (deviceType: string): Promise<ModbusRegisterDefinition[]> => {
  // This would normally return different maps based on device type
  // For now, just return our test registers
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockRegisters);
    }, 300);
  });
};

