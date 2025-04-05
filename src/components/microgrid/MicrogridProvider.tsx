import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

// Types
export interface MicrogridState {
  mode: 'auto' | 'manual';
  isGridConnected: boolean;
  batteryLevel: number;
  batteryCharging: boolean;
  solarProduction: number;
  gridImport: number;
  gridExport: number;
  homeConsumption: number;
  batteryInput: number;
  batteryOutput: number;
  batteryReserve: number;
  status: 'online' | 'offline' | 'maintenance' | 'fault';
  alerts: MicrogridAlert[];
}

export interface MicrogridAlert {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: Date;
  acknowledged: boolean;
}

interface MicrogridContextType {
  microgridState: MicrogridState;
  minBatteryReserve: number;
  setMinBatteryReserve: (value: number) => void;
  acknowledgeAlert: (id: string) => void;
  toggleGridConnection: () => void;
  setMicrogridMode: (mode: 'auto' | 'manual') => void;
  updateBatteryReserve: (percentage: number) => void;
}

const defaultState: MicrogridState = {
  mode: 'auto',
  isGridConnected: true,
  batteryLevel: 65,
  batteryCharging: true,
  solarProduction: 2.4,
  gridImport: 1.2,
  gridExport: 0,
  homeConsumption: 3.1,
  batteryInput: 0.5,
  batteryOutput: 0,
  batteryReserve: 20,
  status: 'online',
  alerts: []
};

const MicrogridContext = createContext<MicrogridContextType>({
  microgridState: defaultState,
  minBatteryReserve: 20,
  setMinBatteryReserve: () => {},
  acknowledgeAlert: () => {},
  toggleGridConnection: () => {},
  setMicrogridMode: () => {},
  updateBatteryReserve: () => {}
});

export const useMicrogrid = () => useContext(MicrogridContext);

const MicrogridProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<MicrogridState>(defaultState);
  const [minBatteryReserve, setMinBatteryReserve] = useState(20);

  const acknowledgeAlert = (id: string) => {
    setState(prev => ({
      ...prev,
      alerts: prev.alerts.map(alert => 
        alert.id === id ? { ...alert, acknowledged: true } : alert
      )
    }));
  };

  const toggleGridConnection = () => {
    if (!state.isGridConnected && state.batteryLevel < 30) {
      toast.warning("Cannot disconnect from grid when battery level is below 30%");
      return;
    }
    
    setState(prev => ({
      ...prev,
      isGridConnected: !prev.isGridConnected
    }));
    
    toast.info(`Grid connection ${state.isGridConnected ? 'disabled' : 'enabled'}`);
  };

  const setMicrogridMode = (mode: 'auto' | 'manual') => {
    setState(prev => ({
      ...prev,
      mode
    }));
    
    toast.info(`Microgrid mode set to ${mode}`);
  };

  const updateBatteryReserve = (percentage: number) => {
    setState(prev => ({
      ...prev,
      batteryReserve: percentage
    }));
  };

  return (
    <MicrogridContext.Provider 
      value={{ 
        microgridState: state, 
        minBatteryReserve,
        setMinBatteryReserve,
        acknowledgeAlert,
        toggleGridConnection,
        setMicrogridMode,
        updateBatteryReserve
      }}
    >
      {children}
    </MicrogridContext.Provider>
  );
};

export default MicrogridProvider;
