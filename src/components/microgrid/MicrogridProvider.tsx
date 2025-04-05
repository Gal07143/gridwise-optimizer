
import React, { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import { MicrogridState, MicrogridAction, MicrogridContextType } from './types';

// Initial state for the microgrid
const initialState: MicrogridState = {
  batteryCharge: 75,
  batteryCharging: true,
  batteryCurrent: 12.5,
  batteryCapacity: 100,
  solarOutput: 4.2,
  solarConnected: true,
  solarEfficiency: 92,
  windOutput: 2.1,
  windConnected: true, 
  windSpeed: 15,
  gridPower: 10,
  gridConnection: true,
  loadDemand: 8.5,
  loadConnected: true,
  buildingEfficiency: 88,
  systemMode: 'auto',
  timestamp: new Date(),
  
  // Additional properties required by components
  solarProduction: 4.2,
  windProduction: 2.1,
  batteryLevel: 75,
  batteryDischargeEnabled: true,
  batteryChargeEnabled: true,
  loadConsumption: 8.5,
  gridImport: 4.0,
  gridExport: 1.8,
  frequency: 60,
  voltage: 230,
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

// Simple reducer to handle state updates
function microgridReducer(state: MicrogridState, action: MicrogridAction): MicrogridState {
  switch (action.type) {
    case 'UPDATE_BATTERY_CHARGE':
      return { ...state, batteryCharge: action.payload };
    case 'TOGGLE_BATTERY_CHARGING':
      return { ...state, batteryCharging: !state.batteryCharging };
    case 'UPDATE_SOLAR_OUTPUT':
      return { 
        ...state, 
        solarOutput: action.payload,
        solarProduction: action.payload 
      };
    case 'TOGGLE_SOLAR_CONNECTION':
      return { ...state, solarConnected: !state.solarConnected };
    case 'UPDATE_WIND_OUTPUT':
      return { 
        ...state, 
        windOutput: action.payload,
        windProduction: action.payload
      };
    case 'TOGGLE_WIND_CONNECTION':
      return { ...state, windConnected: !state.windConnected };
    case 'UPDATE_GRID_POWER':
      return { ...state, gridPower: action.payload };
    case 'TOGGLE_GRID_CONNECTION':
      return { 
        ...state, 
        gridConnection: !state.gridConnection,
        gridConnected: !state.gridConnection // Update legacy field too
      };
    case 'UPDATE_LOAD_DEMAND':
      return { 
        ...state, 
        loadDemand: action.payload,
        loadConsumption: action.payload 
      };
    case 'TOGGLE_LOAD_CONNECTION':
      return { ...state, loadConnected: !state.loadConnected };
    case 'UPDATE_SYSTEM_MODE':
      return { 
        ...state, 
        systemMode: action.payload,
        operatingMode: action.payload
      };
    case 'UPDATE_BATTERY_RESERVE':
      return { ...state, batteryLevel: action.payload };
    default:
      return state;
  }
}

// Create the context
const MicrogridContext = createContext<MicrogridContextType>({
  state: initialState,
  dispatch: () => null,
  handleGridConnectionToggle: () => {},
  handleModeChange: () => {},
  updateBatteryReserve: () => {}
});

// Hook to use the microgrid context
export const useMicrogrid = () => {
  const context = useContext(MicrogridContext);
  
  if (!context) {
    throw new Error('useMicrogrid must be used within a MicrogridProvider');
  }
  
  return context;
};

// Provider component
const MicrogridProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(microgridReducer, initialState);
  
  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      const randomChange = Math.random() * 0.2 - 0.1; // Random value between -0.1 and 0.1
      
      dispatch({ type: 'UPDATE_BATTERY_CHARGE', payload: Math.min(100, Math.max(0, state.batteryCharge + randomChange * 5)) });
      dispatch({ type: 'UPDATE_SOLAR_OUTPUT', payload: Math.max(0, state.solarOutput + randomChange * 2) });
      dispatch({ type: 'UPDATE_WIND_OUTPUT', payload: Math.max(0, state.windOutput + randomChange) });
      dispatch({ type: 'UPDATE_LOAD_DEMAND', payload: Math.max(0, state.loadDemand + randomChange * 3) });
    }, 5000);
    
    return () => clearInterval(interval);
  }, [state]);
  
  // Utility functions for components
  const handleGridConnectionToggle = () => {
    dispatch({ type: 'TOGGLE_GRID_CONNECTION' });
  };
  
  const handleModeChange = (mode: 'auto' | 'manual' | 'eco' | 'backup') => {
    dispatch({ type: 'UPDATE_SYSTEM_MODE', payload: mode });
  };
  
  const updateBatteryReserve = (level: number) => {
    dispatch({ type: 'UPDATE_BATTERY_RESERVE', payload: level });
  };
  
  const contextValue = useMemo(() => ({
    state,
    dispatch,
    handleGridConnectionToggle,
    handleModeChange,
    updateBatteryReserve
  }), [state]);
  
  return (
    <MicrogridContext.Provider value={contextValue}>
      {children}
    </MicrogridContext.Provider>
  );
};

export default MicrogridProvider;
