import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { 
  MicrogridState, 
  ControlSettings, 
  CommandHistoryItem, 
  AlertItem 
} from './types';

interface MicrogridContextType {
  microgridState: MicrogridState;
  settings: ControlSettings;
  commandHistory: CommandHistoryItem[];
  alerts: AlertItem[];
  handleModeChange: (mode: 'automatic' | 'manual' | 'island' | 'grid-connected') => void;
  handleGridConnectionToggle: (enabled: boolean) => void;
  handleBatteryDischargeToggle: (enabled: boolean) => void;
  handleSettingsChange: (setting: keyof ControlSettings, value: any) => void;
  handleSaveSettings: () => void;
  handleAcknowledgeAlert: (alertId: string) => void;
}

const MicrogridContext = createContext<MicrogridContextType | undefined>(undefined);

export const useMicrogrid = () => {
  const context = useContext(MicrogridContext);
  if (!context) {
    throw new Error('useMicrogrid must be used within a MicrogridProvider');
  }
  return context;
};

interface MicrogridProviderProps {
  children: ReactNode;
}

const MicrogridProvider: React.FC<MicrogridProviderProps> = ({ children }) => {
  // State for microgrid status and controls
  const [microgridState, setMicrogridState] = useState<MicrogridState>({
    operatingMode: 'automatic',
    gridConnection: true,
    batteryDischargeEnabled: true,
    batteryChargeEnabled: true,
    gridImportEnabled: false,
    gridExportEnabled: false,
    solarProduction: 15.2,
    windProduction: 8.4,
    batteryCharge: 72,
    batteryLevel: 72,
    batteryChargeRate: 60,
    batterySelfConsumptionMode: true,
    systemMode: 'automatic',
    economicMode: true,
    peakShavingEnabled: true,
    demandResponseEnabled: false,
    loadConsumption: 10.8,
    gridImport: 0,
    gridExport: 12.8,
    frequency: 50.02,
    voltage: 232.1,
    lastUpdated: new Date().toISOString()
  });
  
  // State for control settings
  const [settings, setSettings] = useState<ControlSettings>({
    prioritizeSelfConsumption: true,
    gridExportLimit: 15,
    minBatteryReserve: 20,
    peakShavingEnabled: true,
    peakShavingThreshold: 12,
    demandResponseEnabled: false,
    economicOptimizationEnabled: true,
    weatherPredictiveControlEnabled: true
  });
  
  // State for commands history
  const [commandHistory, setCommandHistory] = useState<CommandHistoryItem[]>([
    {
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      command: "Changed operating mode to automatic",
      success: true,
      user: "System"
    },
    {
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      command: "Battery discharge enabled",
      success: true,
      user: "Admin"
    }
  ]);
  
  // State for active alerts
  const [alerts, setAlerts] = useState<AlertItem[]>([
    {
      id: "1",
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      message: "Grid voltage fluctuation detected",
      severity: 'medium',
      acknowledged: false
    }
  ]);

  // Simulate fetching real-time data
  useEffect(() => {
    const interval = setInterval(() => {
      // In a real app, we'd fetch this data from the database or API
      setMicrogridState(prev => {
        const timeOfDay = new Date().getHours();
        const isDaytime = timeOfDay >= 7 && timeOfDay <= 19;
        const isPeakSolar = timeOfDay >= 10 && timeOfDay <= 15;
        
        // Adjust solar production based on time of day
        let newSolarProduction = isDaytime 
          ? isPeakSolar 
            ? prev.solarProduction + (Math.random() * 0.6 - 0.2) 
            : Math.max(0, prev.solarProduction + (Math.random() * 0.4 - 0.3))
          : Math.max(0, prev.solarProduction - 0.5);
        
        if (!isDaytime && newSolarProduction < 1) newSolarProduction = 0;
        
        // Wind fluctuates less predictably
        const newWindProduction = Math.max(0, prev.windProduction + (Math.random() * 0.8 - 0.4));
        
        // Load consumption variations
        const newLoadConsumption = Math.max(0, prev.loadConsumption + (Math.random() * 0.7 - 0.35));
        
        // Total generation
        const totalGeneration = newSolarProduction + newWindProduction;
        
        // Battery charge changes based on net energy
        const netEnergy = totalGeneration - newLoadConsumption;
        const batteryChargeChange = prev.batteryDischargeEnabled 
          ? netEnergy > 0 ? Math.min(0.2, netEnergy * 0.1) : -Math.min(0.3, Math.abs(netEnergy) * 0.15)
          : netEnergy > 0 ? Math.min(0.2, netEnergy * 0.1) : 0;
        
        const newBatteryCharge = Math.min(100, Math.max(0, prev.batteryCharge + batteryChargeChange));
        
        // Grid import/export
        let newGridExport = 0;
        let newGridImport = 0;
        
        if (prev.gridConnection) {
          if (netEnergy > 0) {
            newGridExport = netEnergy;
            newGridImport = 0;
          } else {
            newGridExport = 0;
            newGridImport = Math.abs(netEnergy);
          }
        }
        
        // Frequency and voltage variations
        const newFrequency = prev.gridConnection 
          ? 50 + (Math.random() * 0.1 - 0.05) 
          : 49.8 + (Math.random() * 0.4 - 0.2);
        
        const newVoltage = 230 + (Math.random() * 4 - 2);
        
        return {
          ...prev,
          solarProduction: Number(newSolarProduction.toFixed(1)),
          windProduction: Number(newWindProduction.toFixed(1)),
          batteryCharge: Number(newBatteryCharge.toFixed(1)),
          loadConsumption: Number(newLoadConsumption.toFixed(1)),
          gridExport: prev.gridConnection ? Number(newGridExport.toFixed(1)) : 0,
          gridImport: prev.gridConnection ? Number(newGridImport.toFixed(1)) : 0,
          frequency: Number(newFrequency.toFixed(2)),
          voltage: Number(newVoltage.toFixed(1)),
          lastUpdated: new Date().toISOString()
        };
      });
    }, 15000); // Changed from 3000 to 15000 (15 seconds)
    
    return () => clearInterval(interval);
  }, []);
  
  // Handle mode change
  const handleModeChange = (mode: 'automatic' | 'manual' | 'island' | 'grid-connected') => {
    setMicrogridState(prev => ({
      ...prev,
      operatingMode: mode
    }));
    
    // Add to command history
    setCommandHistory(prev => ([
      {
        timestamp: new Date().toISOString(),
        command: `Changed operating mode to ${mode}`,
        success: true,
        user: "User"
      },
      ...prev
    ]));
    
    toast.success(`Microgrid operating mode changed to ${mode}`);
  };
  
  // Handle grid connection toggle
  const handleGridConnectionToggle = (enabled: boolean) => {
    setMicrogridState(prev => ({
      ...prev,
      gridConnection: enabled,
      operatingMode: enabled ? 'grid-connected' : 'island'
    }));
    
    // Add to command history
    setCommandHistory(prev => ([
      {
        timestamp: new Date().toISOString(),
        command: enabled ? "Connected to grid" : "Disconnected from grid (island mode)",
        success: true,
        user: "User"
      },
      ...prev
    ]));
    
    toast.success(enabled ? "Connected to grid" : "Disconnected from grid (island mode)");
  };
  
  // Handle battery discharge toggle
  const handleBatteryDischargeToggle = (enabled: boolean) => {
    setMicrogridState(prev => ({
      ...prev,
      batteryDischargeEnabled: enabled
    }));
    
    // Add to command history
    setCommandHistory(prev => ([
      {
        timestamp: new Date().toISOString(),
        command: enabled ? "Battery discharge enabled" : "Battery discharge disabled",
        success: true,
        user: "User"
      },
      ...prev
    ]));
    
    toast.success(enabled ? "Battery discharge enabled" : "Battery discharge disabled");
  };
  
  // Handle settings change
  const handleSettingsChange = (setting: keyof ControlSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };
  
  // Handle saving settings
  const handleSaveSettings = () => {
    // In a real app, we'd save these to the database
    toast.success("Control settings saved successfully");
    
    // Add to command history
    setCommandHistory(prev => ([
      {
        timestamp: new Date().toISOString(),
        command: "Updated control settings",
        success: true,
        user: "User"
      },
      ...prev
    ]));
  };
  
  // Handle acknowledging an alert
  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, acknowledged: true }
          : alert
      )
    );
    
    toast.success("Alert acknowledged");
  };
  
  const contextValue: MicrogridContextType = {
    microgridState,
    settings,
    commandHistory,
    alerts,
    handleModeChange,
    handleGridConnectionToggle,
    handleBatteryDischargeToggle,
    handleSettingsChange,
    handleSaveSettings,
    handleAcknowledgeAlert
  };

  return (
    <MicrogridContext.Provider value={contextValue}>
      {children}
    </MicrogridContext.Provider>
  );
};

export default MicrogridProvider;
