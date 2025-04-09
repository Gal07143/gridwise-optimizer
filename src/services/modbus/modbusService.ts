
import { toast } from 'sonner';
import { ModbusDevice, ModbusDeviceConfig, ModbusReadingResult } from '@/types/modbus';

const mockModbusDevices: ModbusDevice[] = [
  {
    id: 'md-001',
    name: 'Inverter Gateway',
    ip_address: '192.168.1.100',
    port: 502,
    unit_id: 1,
    status: 'online',
    protocol: 'TCP',
    description: 'Main solar inverter connection',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_active: true
  },
  {
    id: 'md-002',
    name: 'Battery System',
    ip_address: '192.168.1.101',
    port: 502,
    unit_id: 2,
    status: 'online',
    protocol: 'TCP',
    description: 'Energy storage system',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_active: true
  }
];

export const getModbusDevices = async (): Promise<ModbusDevice[]> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockModbusDevices);
    }, 500);
  });
};

export const getModbusDeviceById = async (deviceId: string): Promise<ModbusDevice | null> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const device = mockModbusDevices.find(d => d.id === deviceId);
      resolve(device || null);
    }, 300);
  });
};

export const createModbusDevice = async (device: ModbusDeviceConfig): Promise<ModbusDevice> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const newDevice: ModbusDevice = {
        id: `md-${Math.floor(Math.random() * 1000)}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'offline',
        is_active: true,
        ...device
      };
      resolve(newDevice);
    }, 500);
  });
};

export const updateModbusDevice = async (deviceId: string, updates: Partial<ModbusDeviceConfig>): Promise<ModbusDevice> => {
  // In a real app, this would be an API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const deviceIndex = mockModbusDevices.findIndex(d => d.id === deviceId);
      if (deviceIndex === -1) {
        reject(new Error('Device not found'));
        return;
      }
      
      const updatedDevice = {
        ...mockModbusDevices[deviceIndex],
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      resolve(updatedDevice);
    }, 500);
  });
};

export const deleteModbusDevice = async (deviceId: string): Promise<boolean> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
};

export const testModbusConnection = async (device: ModbusDeviceConfig): Promise<{success: boolean, message: string}> => {
  // In a real app, this would actually try to connect to the device
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate success most of the time, but occasional failures
      const success = Math.random() > 0.2;
      if (success) {
        resolve({
          success: true,
          message: `Successfully connected to ${device.name} at ${device.ip_address}:${device.port}`
        });
      } else {
        resolve({
          success: false,
          message: `Failed to connect to ${device.ip_address}:${device.port}. Check your settings and try again.`
        });
      }
    }, 1500);
  });
};

export const readRegister = async (deviceId: string, address: number, length: number = 1): Promise<ModbusReadingResult> => {
  // In a real app, this would connect to the device and read the register
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate successful reading most of the time
      const success = Math.random() > 0.1;
      
      if (success) {
        // Generate a random value based on the register address for consistency
        const baseValue = (address % 100) * 2.5;
        const value = Number((baseValue + Math.random() * 10).toFixed(2));
        
        resolve({
          address,
          value,
          formattedValue: `${value}`,
          timestamp: new Date().toISOString(),
          success: true
        });
      } else {
        resolve({
          address,
          value: 0,
          formattedValue: '',
          timestamp: new Date().toISOString(),
          success: false,
          error: new Error('Failed to read register')
        });
      }
    }, 1000);
  });
};

export const writeRegister = async (
  deviceId: string, 
  address: number, 
  value: number, 
  type: 'coil' | 'holding_register' = 'holding_register'
): Promise<{success: boolean, error?: string}> => {
  // In a real app, this would connect to the device and write to the register
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate successful writing most of the time
      const success = Math.random() > 0.15;
      
      if (success) {
        toast.success(`Successfully wrote ${value} to register ${address}`);
        resolve({
          success: true
        });
      } else {
        const error = 'Failed to write to register. Check device connectivity.';
        toast.error(error);
        resolve({
          success: false,
          error
        });
      }
    }, 1200);
  });
};
