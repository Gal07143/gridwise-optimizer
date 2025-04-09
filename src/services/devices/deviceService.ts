
import { Device } from '@/types/device';

export async function getDeviceById(id: string): Promise<Device> {
  // Mock implementation returning a sample device
  return {
    id,
    name: `Device ${id}`,
    type: 'solar',
    status: 'online',
    capacity: 10,
    location: 'Main Building',
    description: 'Sample device description',
    firmware: 'v1.0.0',
    protocol: 'modbus',
    created_at: new Date().toISOString(),
    site_id: 'site-1',
    metrics: {
      efficiency: 95,
      temperature: 32
    }
  };
}
