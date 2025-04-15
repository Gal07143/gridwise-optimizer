import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

// Export these types so they can be used elsewhere
export interface TelemetryData {
  deviceId: string;
  timestamp: Date;
  temperature?: number;
  voltage?: number;
  current?: number;
  powerFactor?: number;
  frequency?: number;
  vibration?: number;
  noiseLevel?: number;
  errorCount?: number;
  uptime?: number;
  loadFactor?: number;
  [key: string]: any; // Allow for additional properties
}

export interface Device {
  id: string;
  name: string;
  type: string;
  protocol: DeviceProtocol;
  status: DeviceStatus;
  last_seen: string | null;
  mqtt_topic: string;
  http_endpoint?: string;
  ip_address?: string;
  port?: number;
  slave_id?: number;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export type DeviceStatus = 'online' | 'offline';
export type DeviceProtocol = 'mqtt' | 'http' | 'modbus';

export interface DeviceCommand {
  command: string;
  parameters?: Record<string, any>;
  timestamp?: string;
}

interface DeviceContextState {
  devices: Device[];
  loading: boolean;
  error: string | null;
  selectedDevice: Device | null;
  deviceTelemetry: Record<string, TelemetryData[]>;
}

interface DeviceContextOperations {
  fetchDevices: () => Promise<void>;
  addDevice: (device: Omit<Device, 'id'>) => Promise<void>;
  updateDevice: (id: string, updates: Partial<Device>) => Promise<void>;
  deleteDevice: (id: string) => Promise<void>;
  sendCommand: (deviceId: string, command: DeviceCommand) => Promise<void>;
  selectDevice: (device: Device | null) => void;
  fetchDeviceTelemetry: (deviceId: string) => Promise<void>;
}

// Define the context type
type DeviceContextType = DeviceContextState & DeviceContextOperations;

// Create the context with a meaningful default value to help with type checking
const DeviceContext = createContext<DeviceContextType | null>(null);

// Create the provider component
export const DeviceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [deviceTelemetry, setDeviceTelemetry] = useState<Record<string, TelemetryData[]>>({});

  // Fetch all devices
  const fetchDevices = async () => {
    try {
      setLoading(true);
      // In a real application, you would fetch data from an API
      // For now, let's simulate a network request
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Mock data
      const mockDevices: Device[] = [
        {
          id: '1',
          name: 'Temperature Sensor',
          type: 'sensor',
          protocol: 'mqtt',
          status: 'online',
          last_seen: new Date().toISOString(),
          mqtt_topic: 'devices/sensors/temp1',
        },
        {
          id: '2',
          name: 'Smart Meter',
          type: 'meter',
          protocol: 'modbus',
          status: 'offline',
          last_seen: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          mqtt_topic: '',
          ip_address: '192.168.1.100',
          port: 502,
          slave_id: 1,
        },
      ];
      
      setDevices(mockDevices);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch devices';
      setError(errorMessage);
      toast.error('Failed to load devices', {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  // Add a new device
  const addDevice = async (device: Omit<Device, 'id'>) => {
    try {
      setLoading(true);
      // Simulate API request
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Generate a random ID
      const newDevice: Device = {
        ...device,
        id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      setDevices((prev) => [...prev, newDevice]);
      toast.success('Device added successfully', {
        description: `${newDevice.name} has been added to your devices.`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add device';
      setError(errorMessage);
      toast.error('Failed to add device', {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  // Update a device
  const updateDevice = async (id: string, updates: Partial<Device>) => {
    try {
      setLoading(true);
      // Simulate API request
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      setDevices((prev) =>
        prev.map((device) =>
          device.id === id
            ? { ...device, ...updates, updated_at: new Date().toISOString() }
            : device
        )
      );
      
      // If the selected device is being updated, update it too
      if (selectedDevice && selectedDevice.id === id) {
        setSelectedDevice((prev) =>
          prev ? { ...prev, ...updates, updated_at: new Date().toISOString() } : null
        );
      }
      
      toast.success('Device updated successfully', {
        description: `Your device has been updated.`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update device';
      setError(errorMessage);
      toast.error('Failed to update device', {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete a device
  const deleteDevice = async (id: string) => {
    try {
      setLoading(true);
      // Simulate API request
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      setDevices((prev) => prev.filter((device) => device.id !== id));
      
      // If the selected device is being deleted, clear it
      if (selectedDevice && selectedDevice.id === id) {
        setSelectedDevice(null);
      }
      
      toast.success('Device deleted successfully', {
        description: `The device has been removed.`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete device';
      setError(errorMessage);
      toast.error('Failed to delete device', {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  // Send a command to a device
  const sendCommand = async (deviceId: string, command: DeviceCommand) => {
    try {
      setLoading(true);
      // Simulate API request
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // In a real application, you would send the command to the device
      console.log(`Sending command to device ${deviceId}:`, command);
      
      toast.success('Command sent successfully', {
        description: `Command ${command.command} has been sent to the device.`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send command';
      setError(errorMessage);
      toast.error('Failed to send command', {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  // Select a device
  const selectDevice = (device: Device | null) => {
    setSelectedDevice(device);
    if (device) {
      fetchDeviceTelemetry(device.id);
    }
  };

  // Fetch telemetry data for a device
  const fetchDeviceTelemetry = async (deviceId: string) => {
    try {
      setLoading(true);
      // Simulate API request
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Generate mock telemetry data
      const now = new Date();
      const mockTelemetry: TelemetryData[] = Array.from({ length: 24 }, (_, i) => {
        const timestamp = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000);
        return {
          deviceId,
          timestamp,
          temperature: 20 + Math.random() * 5,
          voltage: 220 + Math.random() * 10,
          current: 5 + Math.random() * 2,
          powerFactor: 0.8 + Math.random() * 0.2,
          frequency: 50 + Math.random() * 0.5,
          vibration: Math.random() * 0.5,
          noiseLevel: 30 + Math.random() * 10,
          errorCount: Math.floor(Math.random() * 5),
          uptime: 3600 * 24 * (1 + Math.random()),
          loadFactor: 0.6 + Math.random() * 0.3,
        };
      });
      
      setDeviceTelemetry((prev) => ({
        ...prev,
        [deviceId]: mockTelemetry,
      }));
      
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch telemetry data';
      setError(errorMessage);
      toast.error('Failed to load telemetry data', {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  // Load devices when the component mounts
  useEffect(() => {
    fetchDevices();
  }, []);

  // Provide the context value
  const contextValue: DeviceContextType = {
    devices,
    loading,
    error,
    selectedDevice,
    deviceTelemetry,
    fetchDevices,
    addDevice,
    updateDevice,
    deleteDevice,
    sendCommand,
    selectDevice,
    fetchDeviceTelemetry,
  };

  return (
    <DeviceContext.Provider value={contextValue}>
      {children}
    </DeviceContext.Provider>
  );
};

// Custom hook to use the device context
export const useDevices = (): DeviceContextType => {
  const context = useContext(DeviceContext);
  if (context === null) {
    throw new Error('useDevices must be used within a DeviceProvider');
  }
  return context;
};

export default DeviceContext;
