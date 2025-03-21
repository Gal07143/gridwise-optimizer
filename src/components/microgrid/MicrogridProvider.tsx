
import React, { createContext, useContext, useReducer, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MicrogridState, MicrogridAction, MicrogridContextType, CommandHistoryItem, AlertItem } from './types';

interface Props {
  children: ReactNode;
}

const initialCommandHistory: CommandHistoryItem[] = [
  {
    id: 'cmd-1',
    timestamp: new Date().toISOString(),
    command: 'System started',
    success: true,
    user: 'System',
    details: 'Initial system boot'
  }
];

const initialAlerts: AlertItem[] = [
  {
    id: 'alert-1',
    timestamp: new Date().toISOString(),
    title: 'System Alert',
    message: 'Microgrid system initialized',
    severity: 'low',
    acknowledged: false
  }
];

const initialState: MicrogridState = {
  batteryCharge: 80,
  batteryCharging: true,
  batteryCurrent: 12.5,
  batteryCapacity: 13.5,
  solarOutput: 6.2,
  solarConnected: true,
  solarEfficiency: 0.87,
  windOutput: 2.1,
  windConnected: true,
  windSpeed: 8.2,
  gridPower: 2.0,
  gridConnection: true,
  loadDemand: 4.8,
  loadConnected: true,
  buildingEfficiency: 0.92,
  timestamp: new Date(),
  systemMode: 'auto',
  
  // Add missing properties required by components
  solarProduction: 6.2,
  windProduction: 2.1,
  batteryLevel: 80,
  batteryDischargeEnabled: true,
  batteryChargeEnabled: true,
  loadConsumption: 4.8,
  gridImport: 1.5,
  gridExport: 0.5,
  frequency: 60.0,
  voltage: 240.5,
  lastUpdated: new Date().toISOString(),
  operatingMode: 'auto',
  batteryChargeRate: 3.5,
  gridImportEnabled: true,
  gridExportEnabled: true,
  batterySelfConsumptionMode: true,
  economicMode: false,
  peakShavingEnabled: true,
  demandResponseEnabled: false
};

const microgridReducer = (state: MicrogridState, action: MicrogridAction): MicrogridState => {
  switch (action.type) {
    case 'UPDATE_TIME':
      return { ...state, timestamp: new Date() };
    case 'UPDATE_PRODUCTION':
      return { ...state, ...action.payload };
    case 'SET_SYSTEM_MODE':
      return { ...state, systemMode: action.payload, operatingMode: action.payload };
    case 'SET_BATTERY_CHARGE_ENABLED':
      return { ...state, batteryChargeEnabled: action.payload };
    case 'SET_BATTERY_DISCHARGE_ENABLED':
      return { ...state, batteryDischargeEnabled: action.payload };
    case 'SET_BATTERY_CHARGE_RATE':
      return { ...state, batteryChargeRate: action.payload };
    case 'SET_GRID_IMPORT_ENABLED':
      return { ...state, gridImportEnabled: action.payload };
    case 'SET_GRID_EXPORT_ENABLED':
      return { ...state, gridExportEnabled: action.payload };
    case 'SET_BATTERY_SELF_CONSUMPTION':
      return { ...state, batterySelfConsumptionMode: action.payload };
    case 'SET_ECONOMIC_MODE':
      return { ...state, economicMode: action.payload };
    case 'SET_PEAK_SHAVING':
      return { ...state, peakShavingEnabled: action.payload };
    case 'SET_DEMAND_RESPONSE':
      return { ...state, demandResponseEnabled: action.payload };
    default:
      return state;
  }
};

interface MicrogridContextValues extends MicrogridContextType {
  state: MicrogridState;
  alerts: AlertItem[];
  commandHistory: CommandHistoryItem[];
  settings: {
    minBatteryReserve: number;
    prioritizeSelfConsumption: boolean;
    gridExportLimit: number;
    peakShavingEnabled: boolean;
    peakShavingThreshold: number;
    demandResponseEnabled: boolean;
    economicOptimizationEnabled: boolean;
    weatherPredictiveControlEnabled: boolean;
  };
  handleAcknowledgeAlert: (alertId: string) => void;
  handleModeChange: (mode: 'auto' | 'manual' | 'eco' | 'backup') => void;
  handleGridConnectionToggle: () => void;
  handleBatteryDischargeToggle: () => void;
  handleSettingsChange: (setting: string, value: any) => void;
  handleSaveSettings: () => void;
}

export const MicrogridContext = createContext<MicrogridContextValues>({
  state: initialState,
  dispatch: () => null,
  alerts: [],
  commandHistory: [],
  settings: {
    minBatteryReserve: 20,
    prioritizeSelfConsumption: true,
    gridExportLimit: 50,
    peakShavingEnabled: false,
    peakShavingThreshold: 80,
    demandResponseEnabled: false,
    economicOptimizationEnabled: true,
    weatherPredictiveControlEnabled: false
  },
  handleAcknowledgeAlert: () => {},
  handleModeChange: () => {},
  handleGridConnectionToggle: () => {},
  handleBatteryDischargeToggle: () => {},
  handleSettingsChange: () => {},
  handleSaveSettings: () => {}
});

export const MicrogridProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(microgridReducer, initialState);
  const [alerts, setAlerts] = useState<AlertItem[]>(initialAlerts);
  const [commandHistory, setCommandHistory] = useState<CommandHistoryItem[]>(initialCommandHistory);
  const [settings, setSettings] = useState({
    minBatteryReserve: 20,
    prioritizeSelfConsumption: true,
    gridExportLimit: 50,
    peakShavingEnabled: false,
    peakShavingThreshold: 80,
    demandResponseEnabled: false,
    economicOptimizationEnabled: true,
    weatherPredictiveControlEnabled: false
  });

  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => 
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
    
    // Add to command history
    const newCommand: CommandHistoryItem = {
      id: `cmd-${Date.now()}`,
      timestamp: new Date().toISOString(),
      command: `Acknowledged alert #${alertId}`,
      success: true,
      user: 'Admin'
    };
    
    setCommandHistory(prev => [...prev, newCommand]);
  };

  const handleModeChange = (mode: 'auto' | 'manual' | 'eco' | 'backup') => {
    dispatch({ type: 'SET_SYSTEM_MODE', payload: mode });
    
    // Add to command history
    const newCommand: CommandHistoryItem = {
      id: `cmd-${Date.now()}`,
      timestamp: new Date().toISOString(),
      command: `Changed system mode to ${mode}`,
      success: true,
      user: 'Admin'
    };
    
    setCommandHistory(prev => [...prev, newCommand]);
  };

  const handleGridConnectionToggle = () => {
    dispatch({ 
      type: 'UPDATE_PRODUCTION', 
      payload: { 
        gridConnection: !state.gridConnection,
        gridImportEnabled: !state.gridConnection
      } 
    });
    
    // Add to command history
    const newCommand: CommandHistoryItem = {
      id: `cmd-${Date.now()}`,
      timestamp: new Date().toISOString(),
      command: `${state.gridConnection ? 'Disconnected' : 'Connected'} grid`,
      success: true,
      user: 'Admin'
    };
    
    setCommandHistory(prev => [...prev, newCommand]);
  };

  const handleBatteryDischargeToggle = () => {
    dispatch({ 
      type: 'SET_BATTERY_DISCHARGE_ENABLED', 
      payload: !state.batteryDischargeEnabled 
    });
    
    // Add to command history
    const newCommand: CommandHistoryItem = {
      id: `cmd-${Date.now()}`,
      timestamp: new Date().toISOString(),
      command: `${state.batteryDischargeEnabled ? 'Disabled' : 'Enabled'} battery discharge`,
      success: true,
      user: 'Admin'
    };
    
    setCommandHistory(prev => [...prev, newCommand]);
  };

  const handleSettingsChange = (setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSaveSettings = () => {
    // In a real implementation, this would save to a database
    // For now we just add to command history
    
    const newCommand: CommandHistoryItem = {
      id: `cmd-${Date.now()}`,
      timestamp: new Date().toISOString(),
      command: `Saved system settings`,
      success: true,
      user: 'Admin',
      details: JSON.stringify(settings)
    };
    
    setCommandHistory(prev => [...prev, newCommand]);
    
    // Apply some settings directly to state
    if (state.systemMode === 'manual') {
      dispatch({ 
        type: 'UPDATE_PRODUCTION', 
        payload: { 
          batterySelfConsumptionMode: settings.prioritizeSelfConsumption,
          economicMode: settings.economicOptimizationEnabled,
          peakShavingEnabled: settings.peakShavingEnabled,
          demandResponseEnabled: settings.demandResponseEnabled,
        }
      });
    }
  };

  return (
    <MicrogridContext.Provider value={{ 
      state, 
      dispatch,
      alerts,
      commandHistory,
      settings,
      handleAcknowledgeAlert,
      handleModeChange,
      handleGridConnectionToggle,
      handleBatteryDischargeToggle,
      handleSettingsChange,
      handleSaveSettings
    }}>
      {children}
    </MicrogridContext.Provider>
  );
};

// Create a hook to use the microgrid context
export const useMicrogrid = () => useContext(MicrogridContext);
