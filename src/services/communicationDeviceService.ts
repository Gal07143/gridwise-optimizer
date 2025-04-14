
// Basic implementation of CommunicationDeviceService

export interface CommunicationDevice {
  id: string;
  name: string;
  type: string;
  manufacturer: string;
  model: string;
  protocol: string;
  ip_address?: string;
  port?: number;
  mac_address?: string;
  serial_number?: string;
  firmware_version?: string;
  status: 'online' | 'offline' | 'warning' | 'error';
  last_seen?: string;
}

export async function getCommunicationDevices(): Promise<CommunicationDevice[]> {
  // This would normally fetch from an API
  return [
    {
      id: '1',
      name: 'Gateway 1',
      type: 'gateway',
      manufacturer: 'Cisco',
      model: 'IoT 1000',
      protocol: 'modbus',
      ip_address: '192.168.1.100',
      port: 502,
      status: 'online',
      last_seen: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Controller 1',
      type: 'controller',
      manufacturer: 'Siemens',
      model: 'S7-1200',
      protocol: 'modbus',
      ip_address: '192.168.1.101',
      port: 502,
      status: 'online',
      last_seen: new Date().toISOString()
    }
  ];
}
