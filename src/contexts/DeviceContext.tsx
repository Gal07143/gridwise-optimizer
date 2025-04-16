
import React, { createContext, useContext, ReactNode } from 'react';
import { EnergyDevice } from '@/types/energy';
import { useDevices, setDeviceContextInstance } from '@/hooks/useDevices';

// Define the context type
interface DeviceContextType {
  devices: EnergyDevice[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  deviceTelemetry: Record<string, any[]>;
  selectedDevice: EnergyDevice | null;
  selectDevice: (device: EnergyDevice) => void;
  fetchDeviceTelemetry: (deviceId: string) => Promise<void>;
  createDevice: (deviceData: Partial<EnergyDevice>) => Promise<EnergyDevice>;
}

// Create the context with a default empty value
const DeviceContext = createContext<DeviceContextType | null>(null);

// Provider component
export const DeviceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Use the hook to get device-related functionality
  const deviceContextValue = useDevices();
  
  // Set the context instance for the hook to use
  setDeviceContextInstance(deviceContextValue);
  
  return (
    <DeviceContext.Provider value={deviceContextValue}>
      {children}
    </DeviceContext.Provider>
  );
};

// Custom hook to use the device context
export const useDevicesContext = (): DeviceContextType => {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error('useDevicesContext must be used within a DeviceProvider');
  }
  return context;
};
