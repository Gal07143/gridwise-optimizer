
import { ModbusRegisterDefinition, ModbusRegisterMap } from '@/types/modbus';

// Sample register definitions
const sampleRegisterDefinitions: ModbusRegisterDefinition[] = [
  {
    id: 'reg-1',
    address: 40001,
    name: 'Battery Voltage',
    description: 'Current battery voltage',
    dataType: 'float32',
    scaleFactor: 0.1,
    unit: 'V',
    access: 'read',
    registerType: 'holding'
  },
  {
    id: 'reg-2',
    address: 40003,
    name: 'Battery Current',
    description: 'Current flowing in/out of battery',
    dataType: 'float32',
    scaleFactor: 0.01,
    unit: 'A',
    access: 'read',
    registerType: 'holding'
  },
  {
    id: 'reg-3',
    address: 40005,
    name: 'State of Charge',
    description: 'Battery percentage level',
    dataType: 'uint16',
    scaleFactor: 1,
    unit: '%',
    access: 'read',
    registerType: 'holding'
  },
  {
    id: 'reg-4',
    address: 40007,
    name: 'Operating Mode',
    description: 'Current operating mode',
    dataType: 'uint16',
    access: 'read/write', // Fixed access type
    registerType: 'holding'
  },
  {
    id: 'reg-5',
    address: 40009,
    name: 'Grid Power',
    description: 'Power from/to grid',
    dataType: 'float32',
    scaleFactor: 0.1,
    unit: 'kW',
    access: 'read',
    registerType: 'holding'
  },
  {
    id: 'reg-6',
    address: 40011,
    name: 'Load Power',
    description: 'Current consumption',
    dataType: 'float32',
    scaleFactor: 0.1,
    unit: 'kW',
    access: 'read',
    registerType: 'holding'
  },
  {
    id: 'reg-7',
    address: 40013,
    name: 'PV Power',
    description: 'Solar generation',
    dataType: 'float32',
    scaleFactor: 0.1,
    unit: 'kW',
    access: 'read',
    registerType: 'holding'
  }
];

export const getModbusRegistersByDeviceId = async (deviceId: string): Promise<ModbusRegisterDefinition[]> => {
  // In a real app, this would fetch from an API
  // For demo, return sample register definitions
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(sampleRegisterDefinitions);
    }, 500);
  });
};

export const getDefaultRegisterMap = (deviceId: string): ModbusRegisterMap => {
  return {
    id: `map-${deviceId}`,
    name: 'Default Register Map',
    device_id: deviceId,
    registers: []
  };
};

export const saveModbusRegisters = async (registerMap: ModbusRegisterMap): Promise<boolean> => {
  // In a real app, this would save to an API
  console.log('Saving register map:', registerMap);
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
};
