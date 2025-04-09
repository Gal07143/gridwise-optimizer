
import { ModbusDevice, ModbusDeviceConfig, ModbusReadingResult, ModbusWriteRequest } from '@/types/modbus';

// Mock data store
let modbusDevices: ModbusDevice[] = [
  {
    id: "device-1",
    name: "Inverter ABB",
    ip_address: "192.168.1.100",
    ip: "192.168.1.100", // Add both formats for compatibility
    port: 502,
    unit_id: 1,
    protocol: 'tcp', // Fix lowercase protocol
    status: 'online',
    is_active: true,
    description: "Main solar inverter",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    site_id: "site-1"
  },
  {
    id: "device-2",
    name: "Battery BMS",
    ip_address: "192.168.1.101",
    ip: "192.168.1.101", // Add both formats for compatibility
    port: 502,
    unit_id: 1,
    protocol: 'tcp', // Fix lowercase protocol
    status: 'online',
    is_active: true,
    description: "Battery management system",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    site_id: "site-1"
  }
];

// Get all Modbus devices
export const getModbusDevices = async (): Promise<ModbusDevice[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return modbusDevices;
};

// Aliased function to match error
export const getAllModbusDevices = getModbusDevices;

// Get a specific Modbus device by ID
export const getModbusDevice = async (id: string): Promise<ModbusDevice | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  const device = modbusDevices.find(d => d.id === id);
  return device || null;
};

// Create a new Modbus device
export const createModbusDevice = async (deviceData: ModbusDeviceConfig): Promise<ModbusDevice> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const newDevice: ModbusDevice = {
    id: `device-${Date.now()}`,
    name: deviceData.name,
    ip_address: deviceData.ip || deviceData.ip_address || '',
    ip: deviceData.ip || deviceData.ip_address || '',
    port: deviceData.port,
    unit_id: deviceData.unit_id,
    protocol: deviceData.protocol,
    status: 'offline',
    is_active: deviceData.is_active || true,
    description: deviceData.description,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    site_id: deviceData.site_id
  };
  
  modbusDevices.push(newDevice);
  return newDevice;
};

// Update a Modbus device
export const updateModbusDevice = async (id: string, deviceData: Partial<ModbusDeviceConfig>): Promise<ModbusDevice | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const deviceIndex = modbusDevices.findIndex(d => d.id === id);
  if (deviceIndex === -1) return null;
  
  const updatedDevice = {
    ...modbusDevices[deviceIndex],
    ...deviceData,
    updated_at: new Date().toISOString()
  };
  
  // Ensure both formats are updated
  if (deviceData.ip) {
    updatedDevice.ip_address = deviceData.ip;
    updatedDevice.ip = deviceData.ip;
  }
  if (deviceData.ip_address) {
    updatedDevice.ip = deviceData.ip_address;
    updatedDevice.ip_address = deviceData.ip_address;
  }
  
  modbusDevices[deviceIndex] = updatedDevice as ModbusDevice;
  return updatedDevice as ModbusDevice;
};

// Delete a Modbus device
export const deleteModbusDevice = async (id: string): Promise<boolean> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  const deviceIndex = modbusDevices.findIndex(d => d.id === id);
  if (deviceIndex === -1) return false;
  
  modbusDevices.splice(deviceIndex, 1);
  return true;
};

// Read from a Modbus register
export const readRegister = async (deviceId: string, address: number, length: number = 1): Promise<ModbusReadingResult> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock reading
  const value = Math.random() * 100;
  
  return {
    address,
    value,
    formattedValue: `${value.toFixed(2)}`,
    timestamp: new Date().toISOString(),
    success: true
  };
};

// Write to a Modbus register
export const writeRegister = async (deviceId: string, address: number, value: number | boolean, dataType: string): Promise<boolean> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  console.log(`Writing ${value} to device ${deviceId}, address ${address}, type ${dataType}`);
  
  // Always return success in mock
  return true;
};
