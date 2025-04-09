
import { Device } from '@/types/device';
import { EnergyDevice, DeviceType, DeviceStatus } from '@/types/energy';

// Helper function to convert between types
function convertEnergyDeviceToDevice(energyDevice: EnergyDevice): Device {
  return {
    id: energyDevice.id,
    name: energyDevice.name,
    type: energyDevice.type,
    status: energyDevice.status,
    capacity: energyDevice.capacity,
    location: energyDevice.location,
    description: energyDevice.description,
    firmware: energyDevice.firmware,
    protocol: energyDevice.protocol,
    created_at: energyDevice.created_at,
    updated_at: energyDevice.updated_at,
    last_updated: energyDevice.last_updated || energyDevice.updated_at,
    site_id: energyDevice.site_id,
    metrics: energyDevice.metrics,
    model: energyDevice.model,
    installation_date: energyDevice.installation_date
  };
}

export async function getDeviceById(id: string): Promise<Device> {
  // Mock implementation returning a sample device
  const energyDevice: EnergyDevice = {
    id,
    name: `Device ${id}`,
    type: 'solar' as DeviceType,
    status: 'online' as DeviceStatus,
    capacity: 10,
    location: 'Main Building',
    description: 'Sample device description',
    firmware: 'v1.0.0',
    protocol: 'modbus',
    created_at: new Date().toISOString(),
    last_updated: new Date().toISOString(),
    site_id: 'site-1',
    metrics: {
      efficiency: 95,
      temperature: 32
    }
  };
  
  return convertEnergyDeviceToDevice(energyDevice);
}

export async function updateDevice(id: string, deviceData: Partial<Device>): Promise<Device> {
  // Mock implementation
  const device = await getDeviceById(id);
  return {
    ...device,
    ...deviceData,
    id
  };
}

export async function createDevice(deviceData: Omit<Device, "id">): Promise<Device> {
  // Mock implementation
  return {
    id: `device-${Math.random().toString(36).substr(2, 9)}`,
    ...deviceData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_updated: new Date().toISOString()
  };
}
