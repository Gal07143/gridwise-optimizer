import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { deviceService } from '@/services/deviceService';
import { 
  Device, 
  TelemetryData, 
  DeviceContextType,
  DeviceCommand,
  DeviceError,
  DeviceNotFoundError,
  DeviceOperationError,
  DeviceConnectionError,
  DeviceContextState,
  DeviceContextOperations
} from '@/types/device';

// Create the device context with proper typing
const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

/**
 * DeviceProvider component that provides device data and operations to the application
 */
export function DeviceProvider({ children }: { children: React.ReactNode }) {
  // State management with proper typing
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [deviceTelemetry, setDeviceTelemetry] = useState<Record<string, TelemetryData[]>>({});

  /**
   * Handle device errors and show appropriate toast messages
   */
  const handleDeviceError = (error: unknown) => {
    let errorMessage: string;
    if (error instanceof DeviceNotFoundError) {
      errorMessage = error.message;
    } else if (error instanceof DeviceOperationError) {
      errorMessage = error.message;
    } else if (error instanceof DeviceConnectionError) {
      errorMessage = error.message;
    } else if (error instanceof DeviceError) {
      errorMessage = error.message;
    } else {
      errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    }
    toast.error(errorMessage);
    setError(errorMessage);
  };

  /**
   * Fetch all devices from the database
   */
  const fetchDevices = async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await deviceService.fetchDevices();
      setDevices(data);
      setError(null);
    } catch (err) {
      handleDeviceError(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Add a new device to the database
   */
  const addDevice = async (device: Omit<Device, 'id'>): Promise<void> => {
    try {
      const newDevice = await deviceService.addDevice(device);
      setDevices(prev => [newDevice, ...prev]);
      toast.success('Device added successfully');
      setError(null);
    } catch (err) {
      handleDeviceError(err);
    }
  };

  /**
   * Update an existing device in the database
   */
  const updateDevice = async (id: string, updates: Partial<Device>): Promise<void> => {
    try {
      const updatedDevice = await deviceService.updateDevice(id, updates);
      setDevices(prev => prev.map(device => 
        device.id === id ? updatedDevice : device
      ));
      toast.success('Device updated successfully');
      setError(null);
    } catch (err) {
      handleDeviceError(err);
    }
  };

  /**
   * Delete a device from the database
   */
  const deleteDevice = async (id: string): Promise<void> => {
    try {
      await deviceService.deleteDevice(id);
      setDevices(prev => prev.filter(device => device.id !== id));
      toast.success('Device deleted successfully');
      setError(null);
    } catch (err) {
      handleDeviceError(err);
    }
  };

  /**
   * Send a command to a device
   */
  const sendCommand = async (deviceId: string, command: DeviceCommand): Promise<void> => {
    try {
      await deviceService.sendCommand(deviceId, command);
      toast.success('Command sent successfully');
      setError(null);
    } catch (err) {
      handleDeviceError(err);
    }
  };

  /**
   * Fetch telemetry data for a specific device
   */
  const fetchDeviceTelemetry = async (deviceId: string): Promise<void> => {
    try {
      const telemetryData = await deviceService.fetchDeviceTelemetry(deviceId);
      setDeviceTelemetry(prev => ({
        ...prev,
        [deviceId]: telemetryData,
      }));
      setError(null);
    } catch (err) {
      handleDeviceError(err);
    }
  };

  // Subscribe to real-time device updates
  useEffect(() => {
    const subscription = deviceService.subscribeToDevices((payload) => {
      if (payload.eventType === 'INSERT') {
        setDevices(prev => [payload.new as Device, ...prev]);
      } else if (payload.eventType === 'UPDATE') {
        setDevices(prev => prev.map(device => 
          device.id === payload.new.id ? { ...device, ...payload.new } : device
        ));
      } else if (payload.eventType === 'DELETE') {
        setDevices(prev => prev.filter(device => device.id !== payload.old.id));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Subscribe to real-time telemetry updates
  useEffect(() => {
    if (!selectedDevice) return;

    const subscription = deviceService.subscribeToDeviceTelemetry(
      selectedDevice.id,
      (payload) => {
        setDeviceTelemetry(prev => ({
          ...prev,
          [selectedDevice.id]: [payload.new as TelemetryData, ...(prev[selectedDevice.id] || [])].slice(0, 100),
        }));
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [selectedDevice]);

  // Combine state and operations into context value
  const contextValue: DeviceContextType = {
    // State
    devices,
    loading,
    error,
    selectedDevice,
    deviceTelemetry,
    // Operations
    fetchDevices,
    addDevice,
    updateDevice,
    deleteDevice,
    sendCommand,
    selectDevice: setSelectedDevice,
    fetchDeviceTelemetry,
  };

  return (
    <DeviceContext.Provider value={contextValue}>
      {children}
    </DeviceContext.Provider>
  );
}

/**
 * Hook for accessing the device context
 */
export function useDevices(): DeviceContextType {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error('useDevices must be used within a DeviceProvider');
  }
  return context;
} 