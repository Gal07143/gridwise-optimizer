
import { toast } from 'sonner';
import { DeviceFormValues } from '@/components/devices/deviceValidationSchema';

export interface Device {
  id: string;
  name: string;
  type: string;
  status: string;
  capacity?: number;
  location?: string;
  description?: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  firmware?: string;
  installation_date?: string;
  lastMaintenanceDate?: string;
  latitude?: number;
  longitude?: number;
  energyCapacity?: number;
  efficiency?: number;
  maxVoltage?: number;
  minVoltage?: number;
  maxCurrent?: number;
  minCurrent?: number;
  nominalVoltage?: number;
  nominalCurrent?: number;
  communicationProtocol?: string;
  dataUpdateFrequency?: number;
}

// Mock device data
const mockDevices: Device[] = [
  {
    id: 'device-1',
    name: 'Solar Panel Array 1',
    type: 'solar',
    status: 'online',
    capacity: 10,
    location: 'Roof - North',
    description: 'Main solar panel array',
    manufacturer: 'SunPower',
    model: 'X-Series',
    installation_date: '2022-05-15T00:00:00.000Z'
  },
  {
    id: 'device-2',
    name: 'Battery Storage 1',
    type: 'battery',
    status: 'online',
    capacity: 13.5,
    location: 'Utility Room',
    description: 'Main battery storage',
    manufacturer: 'Tesla',
    model: 'Powerwall',
    installation_date: '2022-05-20T00:00:00.000Z'
  }
];

// Get all devices
export const getDevices = async (): Promise<Device[]> => {
  // This would be a real API call in production
  return mockDevices;
};

// Get device by ID
export const getDeviceById = async (id: string): Promise<Device | null> => {
  // This would be a real API call in production
  const device = mockDevices.find(device => device.id === id);
  return device || null;
};

// Create a new device
export const createDevice = async (deviceData: DeviceFormValues): Promise<Device> => {
  // This would be a real API call in production
  const newDevice: Device = {
    id: `device-${Date.now()}`,
    name: deviceData.name,
    type: deviceData.type,
    status: deviceData.status,
    capacity: deviceData.capacity,
    location: deviceData.location,
    description: deviceData.description,
    manufacturer: deviceData.manufacturer,
    model: deviceData.model,
    serialNumber: deviceData.serialNumber,
    firmware: deviceData.firmware,
    installation_date: deviceData.installation_date?.toISOString(),
    lastMaintenanceDate: deviceData.lastMaintenanceDate?.toISOString(),
    latitude: deviceData.latitude,
    longitude: deviceData.longitude,
    energyCapacity: deviceData.energyCapacity,
    efficiency: deviceData.efficiency,
    maxVoltage: deviceData.maxVoltage,
    minVoltage: deviceData.minVoltage,
    maxCurrent: deviceData.maxCurrent,
    minCurrent: deviceData.minCurrent,
    nominalVoltage: deviceData.nominalVoltage,
    nominalCurrent: deviceData.nominalCurrent,
    communicationProtocol: deviceData.communicationProtocol,
    dataUpdateFrequency: deviceData.dataUpdateFrequency,
  };

  // Add to mock devices
  mockDevices.push(newDevice);
  
  return newDevice;
};

// Update an existing device
export const updateDevice = async (id: string, deviceData: DeviceFormValues): Promise<Device | null> => {
  // This would be a real API call in production
  const deviceIndex = mockDevices.findIndex(device => device.id === id);
  
  if (deviceIndex === -1) {
    return null;
  }
  
  const updatedDevice: Device = {
    ...mockDevices[deviceIndex],
    name: deviceData.name,
    type: deviceData.type,
    status: deviceData.status,
    capacity: deviceData.capacity,
    location: deviceData.location,
    description: deviceData.description,
    manufacturer: deviceData.manufacturer,
    model: deviceData.model,
    serialNumber: deviceData.serialNumber,
    firmware: deviceData.firmware,
    installation_date: deviceData.installation_date?.toISOString(),
    lastMaintenanceDate: deviceData.lastMaintenanceDate?.toISOString(),
    latitude: deviceData.latitude,
    longitude: deviceData.longitude,
    energyCapacity: deviceData.energyCapacity,
    efficiency: deviceData.efficiency,
    maxVoltage: deviceData.maxVoltage,
    minVoltage: deviceData.minVoltage,
    maxCurrent: deviceData.maxCurrent,
    minCurrent: deviceData.minCurrent,
    nominalVoltage: deviceData.nominalVoltage,
    nominalCurrent: deviceData.nominalCurrent,
    communicationProtocol: deviceData.communicationProtocol,
    dataUpdateFrequency: deviceData.dataUpdateFrequency,
  };
  
  mockDevices[deviceIndex] = updatedDevice;
  
  return updatedDevice;
};

// Delete a device
export const deleteDevice = async (id: string): Promise<boolean> => {
  // This would be a real API call in production
  const deviceIndex = mockDevices.findIndex(device => device.id === id);
  
  if (deviceIndex === -1) {
    return false;
  }
  
  mockDevices.splice(deviceIndex, 1);
  
  return true;
};

// Alias for compatibility
export const fetchDeviceById = getDeviceById;
