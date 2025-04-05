
import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { MicrogridState, MicrogridAction, MicrogridContextType } from './types';

const initialState: MicrogridState = {
  batteryCharge: 78,
  batteryCharging: true,
  batteryCurrent: 12.4,
  batteryCapacity: 13.5,
  solarOutput: 3.8,
  solarConnected: true,
  solarEfficiency: 94,
  windOutput: 1.2,
  windConnected: true,
  windSpeed: 15,
  gridPower: 2.5,
  gridConnection: true,
  loadDemand: 4.5,
  loadConnected: true,
  buildingEfficiency: 87,
  timestamp: new Date(),
  systemMode: 'auto',
  
  // Additional props
  solarProduction: 3.8,
  windProduction: 1.2,
  batteryLevel: 78,
  batteryDischargeEnabled: true,
  batteryChargeEnabled: true,
  loadConsumption: 4.5,
  gridImport: 2.5,
  gridExport: 0,
  frequency: 50.0,
  voltage: 230,
  lastUpdated: new Date().toISOString(),
  operatingMode: 'auto',
  batteryChargeRate: 2.1,
  gridImportEnabled: true,
  gridExportEnabled: false,
  batterySelfConsumptionMode: true,
  economicMode: false,
  peakShavingEnabled: true,
  demandResponseEnabled: false
};

function reducer(state: MicrogridState, action: MicrogridAction): MicrogridState {
  switch (action.type) {
    case 'SET_GRID_CONNECTION':
      return { ...state, gridConnection: action.payload };
    case 'SET_SYSTEM_MODE':
      return { ...state, systemMode: action.payload };
    case 'UPDATE_BATTERY_RESERVE':
      return { ...state, batteryLevel: action.payload };
    case 'UPDATE_DATA':
      return { ...state, ...action.payload };
    default:
      return state;
  }
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
  children: React.ReactNode;
}

const MicrogridProvider: React.FC<MicrogridProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleGridConnectionToggle = useCallback(() => {
    dispatch({ type: 'SET_GRID_CONNECTION', payload: !state.gridConnection });
    return true;
  }, [state.gridConnection]);

  const handleModeChange = useCallback((mode: 'auto' | 'manual' | 'eco' | 'backup') => {
    dispatch({ type: 'SET_SYSTEM_MODE', payload: mode });
    return true;
  }, []);

  const updateBatteryReserve = useCallback((level: number) => {
    dispatch({ type: 'UPDATE_BATTERY_RESERVE', payload: level });
    return true;
  }, []);

  const value: MicrogridContextType = {
    state,
    dispatch,
    handleGridConnectionToggle, 
    handleModeChange,
    updateBatteryReserve
  };

  return (
    <MicrogridContext.Provider value={value}>
      {children}
    </MicrogridContext.Provider>
  );
};

export default MicrogridProvider;
