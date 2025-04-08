
import { ModbusRegisterMap, ModbusRegisterDefinition } from '@/types/modbus';

// Mock data for Modbus register definitions
const mockModbusRegisterMaps: Record<string, ModbusRegisterDefinition[]> = {
  '1': [
    {
      id: 'reg-1',
      name: 'Output Power',
      address: 40001,
      registerType: 'holding',
      dataType: 'float32',
      access: 'read',
      description: 'Current output power in watts',
      unit: 'W',
      scaleFactor: 1,
      register_address: 40001,
      register_name: 'Output Power',
      register_length: 2
    },
    {
      id: 'reg-2',
      name: 'DC Input Voltage',
      address: 40003,
      registerType: 'holding',
      dataType: 'float32',
      access: 'read',
      description: 'Input DC voltage',
      unit: 'V',
      scaleFactor: 0.1,
      register_address: 40003,
      register_name: 'DC Input Voltage',
      register_length: 2
    },
    {
      id: 'reg-3',
      name: 'AC Output Current',
      address: 40005,
      registerType: 'holding',
      dataType: 'float32',
      access: 'read',
      description: 'Output current',
      unit: 'A',
      scaleFactor: 0.01,
      register_address: 40005,
      register_name: 'AC Output Current',
      register_length: 2
    },
    {
      id: 'reg-4',
      name: 'Device Temperature',
      address: 40007,
      registerType: 'holding',
      dataType: 'int16',
      access: 'read',
      description: 'Internal temperature',
      unit: '°C',
      scaleFactor: 0.1,
      register_address: 40007,
      register_name: 'Device Temperature',
      register_length: 1
    }
  ],
  '2': [
    {
      id: 'reg-5',
      name: 'State of Charge',
      address: 30001,
      registerType: 'input',
      dataType: 'uint16',
      access: 'read',
      description: 'Battery state of charge',
      unit: '%',
      scaleFactor: 1,
      register_address: 30001,
      register_name: 'State of Charge',
      register_length: 1
    },
    {
      id: 'reg-6',
      name: 'Battery Voltage',
      address: 30002,
      registerType: 'input',
      dataType: 'float32',
      access: 'read',
      description: 'Battery voltage',
      unit: 'V',
      scaleFactor: 0.1,
      register_address: 30002,
      register_name: 'Battery Voltage',
      register_length: 2
    },
    {
      id: 'reg-7',
      name: 'Battery Current',
      address: 30004,
      registerType: 'input',
      dataType: 'float32',
      access: 'read',
      description: 'Battery current',
      unit: 'A',
      scaleFactor: 0.1,
      register_address: 30004,
      register_name: 'Battery Current',
      register_length: 2
    }
  ]
};

/**
 * Get all register definitions for a specific Modbus device
 */
export const getModbusRegistersByDeviceId = async (deviceId: string): Promise<ModbusRegisterDefinition[]> => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return mock data for the device or empty array if not found
  return mockModbusRegisterMaps[deviceId] || [];
};

/**
 * Add a new register definition to a device's register map
 */
export const addModbusRegister = async (
  deviceId: string, 
  registerDefinition: Omit<ModbusRegisterDefinition, 'id'>
): Promise<ModbusRegisterDefinition> => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Generate a new ID
  const newRegister: ModbusRegisterDefinition = {
    ...registerDefinition,
    id: `reg-${Date.now()}`,
    register_address: registerDefinition.address,
    register_name: registerDefinition.name,
    register_length: registerDefinition.dataType.includes('32') ? 2 : 1
  };
  
  // In a real app, we would save to the backend
  console.log(`Adding register to device ${deviceId}:`, newRegister);
  
  // Ensure the device exists in our mock data
  if (!mockModbusRegisterMaps[deviceId]) {
    mockModbusRegisterMaps[deviceId] = [];
  }
  
  // Add the new register to our mock data
  mockModbusRegisterMaps[deviceId].push(newRegister);
  
  return newRegister;
};

/**
 * Update an existing register definition
 */
export const updateModbusRegister = async (
  deviceId: string,
  registerId: string,
  updates: Partial<ModbusRegisterDefinition>
): Promise<ModbusRegisterDefinition> => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // In a real app, we would update in the backend
  console.log(`Updating register ${registerId} for device ${deviceId}:`, updates);
  
  // Find the register in our mock data
  const registerIndex = mockModbusRegisterMaps[deviceId]?.findIndex(r => r.id === registerId);
  if (registerIndex === undefined || registerIndex === -1) {
    throw new Error('Register not found');
  }
  
  // Update the register
  const updatedRegister: ModbusRegisterDefinition = {
    ...mockModbusRegisterMaps[deviceId][registerIndex],
    ...updates,
    // Update the deprecated fields for compatibility
    register_address: updates.address || mockModbusRegisterMaps[deviceId][registerIndex].address,
    register_name: updates.name || mockModbusRegisterMaps[deviceId][registerIndex].name,
    register_length: updates.dataType?.includes('32') ? 2 : 1
  };
  
  mockModbusRegisterMaps[deviceId][registerIndex] = updatedRegister;
  
  return updatedRegister;
};

/**
 * Delete a register definition
 */
export const deleteModbusRegister = async (deviceId: string, registerId: string): Promise<boolean> => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // In a real app, we would delete from the backend
  console.log(`Deleting register ${registerId} from device ${deviceId}`);
  
  // Find the register in our mock data
  const registerIndex = mockModbusRegisterMaps[deviceId]?.findIndex(r => r.id === registerId);
  if (registerIndex === undefined || registerIndex === -1) {
    throw new Error('Register not found');
  }
  
  // Remove the register
  mockModbusRegisterMaps[deviceId].splice(registerIndex, 1);
  
  return true;
};

/**
 * Get a complete register map for a device
 */
export const getModbusRegisterMap = async (deviceId: string): Promise<ModbusRegisterMap> => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const registers = await getModbusRegistersByDeviceId(deviceId);
  
  return {
    id: `map-${deviceId}`,
    name: `Device ${deviceId} Register Map`,
    device_id: deviceId,
    registers: registers,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
};
