
import { ModbusRegister, ModbusRegisterMap, ModbusRegisterDefinition } from '@/types/modbus';

// Get registers associated with a device
export const getModbusRegistersByDeviceId = async (deviceId: string): Promise<ModbusRegister[]> => {
  // In a real app, this would fetch from an API or database
  return [
    {
      id: `reg-${deviceId}-1`,
      device_id: deviceId,
      register_address: 40001,
      register_name: 'Voltage',
      register_type: 'holding',
      data_type: 'float32',
      register_length: 2,
      scaleFactor: 0.1,
      unit: 'V',
      description: 'AC Voltage',
      access: 'read'
    },
    {
      id: `reg-${deviceId}-2`,
      device_id: deviceId,
      register_address: 40003,
      register_name: 'Current',
      register_type: 'holding',
      data_type: 'float32',
      register_length: 2,
      scaleFactor: 0.01,
      unit: 'A',
      description: 'AC Current',
      access: 'read'
    },
    {
      id: `reg-${deviceId}-3`,
      device_id: deviceId,
      register_address: 40005,
      register_name: 'Power',
      register_type: 'holding',
      data_type: 'float32',
      register_length: 2,
      scaleFactor: 1,
      unit: 'W',
      description: 'AC Power',
      access: 'read'
    },
    {
      id: `reg-${deviceId}-4`,
      device_id: deviceId,
      register_address: 40007,
      register_name: 'Temperature',
      register_type: 'holding',
      data_type: 'float32',
      register_length: 2,
      scaleFactor: 0.1,
      unit: '°C',
      description: 'Device Temperature',
      access: 'read'
    },
    {
      id: `reg-${deviceId}-5`,
      device_id: deviceId,
      register_address: 40009,
      register_name: 'Operating Mode',
      register_type: 'holding',
      data_type: 'uint16',
      register_length: 1,
      scaleFactor: 1,
      description: 'Device Operating Mode',
      access: 'read/write'
    }
  ];
};

// Get default register map
export const getDefaultRegisterMap = (deviceId?: string): ModbusRegisterMap => {
  return {
    device_id: deviceId || '',
    name: 'Default Register Map',
    description: 'Default register map for Modbus device',
    registers: [
      {
        name: 'Voltage',
        address: 40001,
        registerType: 'holding',
        dataType: 'float32',
        access: 'read',
        description: 'AC Voltage'
      },
      {
        name: 'Current',
        address: 40003,
        registerType: 'holding',
        dataType: 'float32',
        access: 'read',
        description: 'AC Current'
      },
      {
        name: 'Power',
        address: 40005,
        registerType: 'holding',
        dataType: 'float32',
        access: 'read',
        description: 'AC Power'
      }
    ]
  };
};

// Create a new register
export const createModbusRegister = async (register: Omit<ModbusRegister, 'id'>): Promise<ModbusRegister> => {
  // In a real app, this would create a register in the database
  const newRegister: ModbusRegister = {
    id: `reg-${Date.now()}`,
    device_id: register.device_id,
    register_address: register.register_address,
    register_name: register.register_name,
    register_type: register.register_type,
    data_type: register.data_type,
    register_length: register.register_length,
    scaleFactor: register.scaleFactor,
    unit: register.unit,
    description: register.description,
    access: register.access
  };
  
  console.log('Created Modbus register:', newRegister);
  
  return newRegister;
};
