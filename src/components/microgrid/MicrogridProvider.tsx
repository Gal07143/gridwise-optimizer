
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { MicrogridDevice, MicrogridAlert, MicrogridSystemState, MicrogridState, ControlSettings, CommandHistoryItem, AlertItem } from './types';
import { useSite, useSiteContext } from '@/contexts/SiteContext';
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
  
  // Add properties required by MicrogridTabContent
  microgridState: MicrogridState;
  settings: ControlSettings;
  commandHistory: CommandHistoryItem[];
  handleAcknowledgeAlert: (alertId: string) => void;
  handleModeChange: (mode: string) => void;
  handleGridConnectionToggle: () => void;
  handleBatteryDischargeToggle: () => void;
  handleSettingsChange: (setting: string, value: any) => void;
  handleSaveSettings: () => void;
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
  
  // Add the missing state objects needed by MicrogridTabContent
  const [microgridState, setMicrogridState] = useState<MicrogridState>({
    batteryChargeEnabled: true,
    batteryDischargeEnabled: true,
    gridImportEnabled: true,
    gridExportEnabled: true,
    solarProduction: 3.2,
    windProduction: 1.8,
    batteryLevel: 65,
    batteryChargeRate: 2.5,
    batterySelfConsumptionMode: true,
    systemMode: 'automatic',
    economicMode: true,
    peakShavingEnabled: true,
    demandResponseEnabled: false,
    lastUpdated: new Date().toISOString(),
    operatingMode: 'automatic',
    gridConnection: true,
    batteryCharge: 65,
    loadConsumption: 4.2,
    gridImport: 1.5,
    gridExport: 0.8,
    frequency: 50,
    voltage: 230
  });
  
  const [settings, setSettings] = useState<ControlSettings>({
    prioritizeSelfConsumption: true,
    gridExportLimit: 10,
    minBatteryReserve: 20,
    peakShavingEnabled: true,
    peakShavingThreshold: 5,
    demandResponseEnabled: false,
    economicOptimizationEnabled: true,
    weatherPredictiveControlEnabled: true
  });
  
  const [commandHistory, setCommandHistory] = useState<CommandHistoryItem[]>([
    {
      timestamp: new Date().toISOString(),
      command: "Battery discharge enabled",
      success: true,
      user: "Admin"
    },
    {
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      command: "Grid export disabled",
      success: true,
      user: "System"
    }
  ]);
  
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
      
      // Update microgrid state based on fetched data
      setMicrogridState(prev => ({
        ...prev,
        gridConnection: fetchedSystemState.gridConnected,
        operatingMode: fetchedSystemState.mode as any,
        lastUpdated: new Date().toISOString()
      }));
      
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
        
        // Add to command history
        const newCommand: CommandHistoryItem = {
          timestamp: new Date().toISOString(),
          command: command,
          success: true,
          user: "User"
        };
        setCommandHistory(prev => [newCommand, ...prev]);

        resolve(true);
      }, 500);
    });
  }, [devices, setDevices]);

  const dismissAlert = useCallback((alertId: string) => {
    // Simulate dismissing an alert
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== alertId));
    toast.success('Alert dismissed');
  }, []);

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
  
  // Add the missing handler functions needed by MicrogridTabContent
  const handleAcknowledgeAlert = useCallback((alertId: string) => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => 
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
    toast.success('Alert acknowledged');
  }, []);
  
  const handleModeChange = useCallback((mode: string) => {
    setMicrogridState(prev => ({
      ...prev,
      operatingMode: mode as any,
      lastUpdated: new Date().toISOString()
    }));
    toast.success(`Mode changed to ${mode}`);
    
    // Add to command history
    const newCommand: CommandHistoryItem = {
      timestamp: new Date().toISOString(),
      command: `Mode changed to ${mode}`,
      success: true,
      user: "User"
    };
    setCommandHistory(prev => [newCommand, ...prev]);
  }, []);
  
  const handleGridConnectionToggle = useCallback(() => {
    setMicrogridState(prev => ({
      ...prev,
      gridConnection: !prev.gridConnection,
      lastUpdated: new Date().toISOString()
    }));
    
    const newState = !microgridState.gridConnection;
    toast.success(`Grid connection ${newState ? 'enabled' : 'disabled'}`);
    
    // Add to command history
    const newCommand: CommandHistoryItem = {
      timestamp: new Date().toISOString(),
      command: `Grid connection ${newState ? 'enabled' : 'disabled'}`,
      success: true,
      user: "User"
    };
    setCommandHistory(prev => [newCommand, ...prev]);
  }, [microgridState.gridConnection]);
  
  const handleBatteryDischargeToggle = useCallback(() => {
    setMicrogridState(prev => ({
      ...prev,
      batteryDischargeEnabled: !prev.batteryDischargeEnabled,
      lastUpdated: new Date().toISOString()
    }));
    
    const newState = !microgridState.batteryDischargeEnabled;
    toast.success(`Battery discharge ${newState ? 'enabled' : 'disabled'}`);
    
    // Add to command history
    const newCommand: CommandHistoryItem = {
      timestamp: new Date().toISOString(),
      command: `Battery discharge ${newState ? 'enabled' : 'disabled'}`,
      success: true,
      user: "User"
    };
    setCommandHistory(prev => [newCommand, ...prev]);
  }, [microgridState.batteryDischargeEnabled]);
  
  const handleSettingsChange = useCallback((setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  }, []);
  
  const handleSaveSettings = useCallback(() => {
    toast.success('Settings saved successfully');
    
    // Add to command history
    const newCommand: CommandHistoryItem = {
      timestamp: new Date().toISOString(),
      command: "Settings updated",
      success: true,
      user: "User"
    };
    setCommandHistory(prev => [newCommand, ...prev]);
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
    // Add the missing properties and functions needed by MicrogridTabContent
    microgridState,
    settings,
    commandHistory,
    handleAcknowledgeAlert,
    handleModeChange,
    handleGridConnectionToggle, 
    handleBatteryDischargeToggle,
    handleSettingsChange,
    handleSaveSettings
  };

  return (
    <MicrogridContext.Provider value={value}>
      {children}
    </MicrogridContext.Provider>
  );
};
