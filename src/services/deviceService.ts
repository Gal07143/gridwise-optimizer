
import { Device } from '@/types/device';
import { nanoid } from 'nanoid';

// Mock devices for development
const mockDevices: Device[] = [
  {
    id: "device-001",
    name: "Solar Inverter 5kW",
    type: "solar",
    status: "online",
    description: "Main solar inverter for the rooftop array",
    location: "Roof",
    capacity: 5000,
    firmware: "v2.3.4",
    installation_date: "2022-06-15",
    last_updated: new Date().toISOString(),
    created_at: "2022-06-15T14:30:00Z",
    model: "SolarEdge SE5000H",
    manufacturer: "SolarEdge",
  },
  {
    id: "device-002",
    name: "Battery Storage System",
    type: "battery",
    status: "online",
    description: "13.5kWh Lithium-ion battery storage system",
    location: "Garage",
    capacity: 13500,
    firmware: "v3.1.2",
    installation_date: "2022-06-15",
    last_updated: new Date().toISOString(),
    created_at: "2022-06-15T15:45:00Z",
    model: "Powerwall 2",
    manufacturer: "Tesla",
  },
  {
    id: "device-003",
    name: "Smart Meter",
    type: "meter",
    status: "online",
    description: "Grid connection smart meter",
    location: "Utility Room",
    capacity: 0,
    firmware: "v1.8.5",
    installation_date: "2022-06-14",
    last_updated: new Date().toISOString(),
    created_at: "2022-06-14T10:15:00Z",
    model: "EM115",
    manufacturer: "Schneider Electric",
  },
  {
    id: "device-004",
    name: "EV Charging Station",
    type: "ev_charger",
    status: "idle",
    description: "11kW EV charging station",
    location: "Driveway",
    capacity: 11000,
    firmware: "v2.0.1",
    installation_date: "2022-07-22",
    last_updated: new Date().toISOString(),
    created_at: "2022-07-22T11:20:00Z",
    model: "Wallbox Pulsar Plus",
    manufacturer: "Wallbox",
  }
];

// In-memory store for devices
let devices = [...mockDevices];

export const getAllDevices = async (): Promise<Device[]> => {
  return [...devices];
};

export const getDeviceById = async (id: string): Promise<Device | null> => {
  return devices.find(device => device.id === id) || null;
};

export const getDevicesBySiteId = async (siteId: string): Promise<Device[]> => {
  return devices.filter(device => device.site_id === siteId);
};

export const getDevicesByType = async (type: string): Promise<Device[]> => {
  return devices.filter(device => device.type === type);
};

export const createDevice = async (deviceData: Omit<Device, 'id' | 'created_at' | 'last_updated'>): Promise<Device> => {
  const newDevice: Device = {
    ...deviceData,
    id: `device-${nanoid(8)}`,
    created_at: new Date().toISOString(),
    last_updated: new Date().toISOString()
  };
  
  devices.push(newDevice);
  return newDevice;
};

export const updateDevice = async (id: string, deviceData: Partial<Device>): Promise<Device | null> => {
  const deviceIndex = devices.findIndex(device => device.id === id);
  if (deviceIndex === -1) return null;
  
  const updatedDevice = {
    ...devices[deviceIndex],
    ...deviceData,
    last_updated: new Date().toISOString()
  };
  
  devices[deviceIndex] = updatedDevice;
  return updatedDevice;
};

export const deleteDevice = async (id: string): Promise<boolean> => {
  const initialLength = devices.length;
  devices = devices.filter(device => device.id !== id);
  return initialLength > devices.length;
};

export type { Device };
