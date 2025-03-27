
// Mock service for communication devices

export interface CommunicationDevice {
  id: string;
  name: string;
  type: 'modem' | 'gateway' | 'router' | 'access_point' | 'repeater';
  model: string;
  manufacturer: string;
  ip_address?: string;
  mac_address?: string;
  protocol: string;
  status: 'online' | 'offline' | 'error' | 'maintenance';
  firmware_version?: string;
  last_seen?: string;
  connection_type?: string;
  bandwidth?: string;
  location?: string;
}

// Mock data for communication devices
const mockCommunicationDevices: CommunicationDevice[] = [
  {
    id: '1',
    name: 'Main Gateway',
    type: 'gateway',
    model: 'EG8245H',
    manufacturer: 'Huawei',
    ip_address: '192.168.1.1',
    mac_address: '00:1A:2B:3C:4D:5E',
    protocol: 'Ethernet/LTE',
    status: 'online',
    firmware_version: 'v2.5.3',
    last_seen: new Date().toISOString(),
    connection_type: 'Fiber',
    bandwidth: '1Gbps',
    location: 'Main Control Room'
  },
  {
    id: '2',
    name: 'Field Modem 1',
    type: 'modem',
    model: 'TL-MR6400',
    manufacturer: 'TP-Link',
    ip_address: '192.168.1.25',
    mac_address: 'A1:B2:C3:D4:E5:F6',
    protocol: '4G LTE',
    status: 'online',
    firmware_version: 'v1.2.0',
    last_seen: new Date(Date.now() - 15 * 60000).toISOString(),
    connection_type: 'Cellular',
    bandwidth: '150Mbps',
    location: 'Solar Array A'
  },
  {
    id: '3',
    name: 'Substation Router',
    type: 'router',
    model: 'RB2011UiAS-RM',
    manufacturer: 'MikroTik',
    ip_address: '192.168.2.1',
    mac_address: 'FF:EE:DD:CC:BB:AA',
    protocol: 'Ethernet',
    status: 'online',
    firmware_version: 'v6.48.4',
    last_seen: new Date(Date.now() - 5 * 60000).toISOString(),
    connection_type: 'Ethernet',
    bandwidth: '1Gbps',
    location: 'Substation B'
  },
  {
    id: '4',
    name: 'Battery Storage WiFi',
    type: 'access_point',
    model: 'UAP-AC-PRO',
    manufacturer: 'Ubiquiti',
    ip_address: '192.168.3.10',
    mac_address: '11:22:33:44:55:66',
    protocol: 'WiFi',
    status: 'error',
    firmware_version: 'v4.3.28',
    last_seen: new Date(Date.now() - 2 * 3600000).toISOString(),
    connection_type: 'WiFi',
    bandwidth: '1300Mbps',
    location: 'Battery Storage'
  },
  {
    id: '5',
    name: 'Remote Inverter Modem',
    type: 'modem',
    model: 'AirLink RV55',
    manufacturer: 'Sierra Wireless',
    ip_address: '192.168.4.5',
    mac_address: 'AA:BB:CC:DD:EE:FF',
    protocol: 'LTE-Advanced',
    status: 'offline',
    firmware_version: 'v4.14.0',
    last_seen: new Date(Date.now() - 48 * 3600000).toISOString(),
    connection_type: 'Cellular',
    bandwidth: '300Mbps',
    location: 'Remote Inverter Station'
  }
];

export const getCommunicationDevices = async (filters?: {
  type?: string;
  search?: string;
  status?: string;
}): Promise<CommunicationDevice[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let devices = [...mockCommunicationDevices];
  
  // Apply filters
  if (filters) {
    if (filters.type && filters.type !== 'all') {
      devices = devices.filter(device => device.type === filters.type);
    }
    
    if (filters.status) {
      devices = devices.filter(device => device.status === filters.status);
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      devices = devices.filter(device => 
        device.name.toLowerCase().includes(searchLower) ||
        device.manufacturer.toLowerCase().includes(searchLower) ||
        device.model.toLowerCase().includes(searchLower) ||
        (device.ip_address && device.ip_address.includes(filters.search || ''))
      );
    }
  }
  
  return devices;
};

export const getCommunicationDeviceById = async (id: string): Promise<CommunicationDevice | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const device = mockCommunicationDevices.find(d => d.id === id);
  return device || null;
};

export const addCommunicationDevice = async (device: Omit<CommunicationDevice, 'id'>): Promise<CommunicationDevice> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const newDevice: CommunicationDevice = {
    ...device,
    id: Math.random().toString(36).substring(2, 11),
    last_seen: new Date().toISOString()
  };
  
  // In a real app, we would add to the database
  // mockCommunicationDevices.push(newDevice);
  
  return newDevice;
};

export const updateCommunicationDevice = async (id: string, updates: Partial<CommunicationDevice>): Promise<CommunicationDevice> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const deviceIndex = mockCommunicationDevices.findIndex(d => d.id === id);
  if (deviceIndex === -1) {
    throw new Error('Device not found');
  }
  
  const updatedDevice = {
    ...mockCommunicationDevices[deviceIndex],
    ...updates
  };
  
  // In a real app, we would update the database
  // mockCommunicationDevices[deviceIndex] = updatedDevice;
  
  return updatedDevice;
};

export const deleteCommunicationDevice = async (id: string): Promise<void> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const deviceIndex = mockCommunicationDevices.findIndex(d => d.id === id);
  if (deviceIndex === -1) {
    throw new Error('Device not found');
  }
  
  // In a real app, we would remove from the database
  // mockCommunicationDevices.splice(deviceIndex, 1);
};
