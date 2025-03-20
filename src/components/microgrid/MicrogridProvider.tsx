import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { MicrogridDevice, MicrogridAlert, MicrogridSystemState } from './types';
import { useSiteContext } from '@/contexts/SiteContext';
import { toast } from 'sonner';

// Refresh interval in milliseconds (15 seconds)
const REFRESH_INTERVAL = 15000;

interface MicrogridContextType {
  devices: MicrogridDevice[];
  alerts: MicrogridAlert[];
  systemState: MicrogridSystemState;
  isLoading: boolean;
  selectedDeviceId: string | null;
  setSelectedDeviceId: (id: string | null) => void;
  refreshData: () => void;
  sendCommand: (deviceId: string, command: string, params?: any) => Promise<boolean>;
  dismissAlert: (alertId: string) => void;
  loadCommandHistory: (deviceId: string) => Promise<any[]>;
}

const MicrogridContext = createContext<MicrogridContextType | undefined>(undefined);

export const useMicrogrid = () => {
  const context = useContext(MicrogridContext);
  if (!context) {
    throw new Error('useMicrogrid must be used within a MicrogridProvider');
  }
  return context;
};

// Mock data and functions for development - will be replaced with real API calls
const fetchDevices = async (siteId: string): Promise<MicrogridDevice[]> => {
  // Simulate fetching devices from a database or API
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockDevices: MicrogridDevice[] = [
        {
          id: 'solar-panel-1',
          name: 'Solar Panel 1',
          type: 'solar',
          status: 'online',
          location: 'Roof',
          capacity: 10,
          site_id: siteId,
          last_updated: new Date().toISOString(),
          created_at: new Date().toISOString(),
        },
        {
          id: 'battery-1',
          name: 'Battery 1',
          type: 'battery',
          status: 'online',
          location: 'Basement',
          capacity: 20,
          site_id: siteId,
          last_updated: new Date().toISOString(),
          created_at: new Date().toISOString(),
        },
        {
          id: 'grid-connection',
          name: 'Grid Connection',
          type: 'grid',
          status: 'online',
          location: 'Utility Room',
          capacity: 100,
          site_id: siteId,
          last_updated: new Date().toISOString(),
          created_at: new Date().toISOString(),
        },
      ];
      resolve(mockDevices);
    }, 500);
  });
};

const fetchAlerts = async (siteId: string): Promise<MicrogridAlert[]> => {
  // Simulate fetching alerts from a database or API
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockAlerts: MicrogridAlert[] = [
        {
          id: 'alert-1',
          device_id: 'battery-1',
          type: 'warning',
          message: 'Battery SOC low',
          timestamp: new Date().toISOString(),
          acknowledged: false,
        },
      ];
      resolve(mockAlerts);
    }, 300);
  });
};

const fetchSystemState = async (siteId: string): Promise<MicrogridSystemState> => {
  // Simulate fetching system state from a database or API
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockSystemState: MicrogridSystemState = {
        mode: 'automatic',
        status: 'normal',
        gridConnected: true,
        lastModeChange: new Date().toISOString(),
        batteryReserve: 20,
        prioritizeRenewables: true,
        energyExport: true,
        safetyProtocols: true,
      };
      resolve(mockSystemState);
    }, 400);
  });
};

export const MicrogridProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activeSite } = useSiteContext();
  const [devices, setDevices] = useState<MicrogridDevice[]>([]);
  const [alerts, setAlerts] = useState<MicrogridAlert[]>([]);
  const [systemState, setSystemState] = useState<MicrogridSystemState>({
    mode: 'automatic',
    status: 'normal',
    gridConnected: true,
    lastModeChange: new Date().toISOString(),
    batteryReserve: 20,
    prioritizeRenewables: true,
    energyExport: true,
    safetyProtocols: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!activeSite) return;
    
    setIsLoading(true);
    try {
      const [fetchedDevices, fetchedAlerts, fetchedSystemState] = await Promise.all([
        fetchDevices(activeSite.id),
        fetchAlerts(activeSite.id),
        fetchSystemState(activeSite.id)
      ]);
      
      setDevices(fetchedDevices);
      setAlerts(fetchedAlerts);
      setSystemState(fetchedSystemState);
    } catch (error) {
      console.error('Error loading microgrid data:', error);
      toast.error('Failed to load microgrid data');
    } finally {
      setIsLoading(false);
    }
  }, [activeSite]);

  useEffect(() => {
    if (activeSite) {
      loadData();
      
      // Set up periodic refresh
      const intervalId = setInterval(() => {
        loadData();
      }, REFRESH_INTERVAL);
      
      return () => clearInterval(intervalId);
    }
  }, [activeSite, loadData]);

  const refreshData = useCallback(() => {
    loadData();
    toast.success('Microgrid data refreshed');
  }, [loadData]);

  const sendCommand = useCallback(async (deviceId: string, command: string, params?: any): Promise<boolean> => {
    // Simulate sending a command to a device
    return new Promise((resolve) => {
      setTimeout(() => {
        // Find the device
        const device = devices.find((d) => d.id === deviceId);
        if (!device) {
          toast.error('Device not found');
          resolve(false);
          return;
        }

        // Simulate command execution
        toast.success(`Command "${command}" sent to ${device.name}`);

        // Update device status or other properties based on the command
        const updatedDevices = devices.map((d) => {
          if (d.id === deviceId) {
            return { ...d, status: 'online' }; // Simulate device status change
          }
          return d;
        });
        setDevices(updatedDevices);

        resolve(true);
      }, 500);
    });
  }, [devices, setDevices]);

  const dismissAlert = useCallback((alertId: string) => {
    // Simulate dismissing an alert
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== alertId));
    toast.success('Alert dismissed');
  }, [alerts, setAlerts]);

  const loadCommandHistory = useCallback(async (deviceId: string): Promise<any[]> => {
    // Simulate fetching command history for a device
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockCommandHistory = [
          {
            id: 'command-1',
            device_id: deviceId,
            command: 'start',
            timestamp: new Date().toISOString(),
          },
          {
            id: 'command-2',
            device_id: deviceId,
            command: 'stop',
            timestamp: new Date().toISOString(),
          },
        ];
        resolve(mockCommandHistory);
      }, 300);
    });
  }, []);

  const value = {
    devices,
    alerts,
    systemState,
    isLoading,
    selectedDeviceId,
    setSelectedDeviceId,
    refreshData,
    sendCommand,
    dismissAlert,
    loadCommandHistory,
  };

  return (
    <MicrogridContext.Provider value={value}>
      {children}
    </MicrogridContext.Provider>
  );
};
