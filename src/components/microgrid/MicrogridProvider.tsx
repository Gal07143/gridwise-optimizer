
import React, { createContext, useContext, useReducer, useState } from 'react';
import { MicrogridContextType, MicrogridState, MicrogridAction } from './types';

// Initial state for the microgrid
const initialMicrogridState: MicrogridState = {
  batteryCharge: 75,
  batteryCharging: true,
  batteryCurrent: 10.5,
  batteryCapacity: 100,
  solarOutput: 3.2,
  solarConnected: true,
  solarEfficiency: 92,
  windOutput: 1.5,
  windConnected: true,
  windSpeed: 12,
  gridPower: 5.0,
  gridConnection: true,
  gridConnected: true,
  loadDemand: 8.5,
  loadConnected: true,
  buildingEfficiency: 87,
  timestamp: new Date(),
  systemMode: 'auto',
  solarProduction: 3.2,
  windProduction: 1.5,
  batteryLevel: 75,
  batteryDischargeEnabled: false,
  batteryChargeEnabled: true,
  loadConsumption: 8.5,
  gridImport: 5.0,
  gridExport: 0,
  frequency: 50,
  voltage: 230,
  lastUpdated: new Date().toISOString(),
  operatingMode: 'auto',
  batteryChargeRate: 2.5,
  gridImportEnabled: true,
  gridExportEnabled: false,
  batterySelfConsumptionMode: true,
  economicMode: false,
  peakShavingEnabled: true,
  demandResponseEnabled: false
};

// Reducer function for the microgrid state
function microgridReducer(state: MicrogridState, action: MicrogridAction): MicrogridState {
  switch (action.type) {
    case 'SET_MODE':
      return {
        ...state,
        systemMode: action.payload as 'auto' | 'manual' | 'eco' | 'backup'
      };
    case 'TOGGLE_GRID_CONNECTION':
      return {
        ...state,
        gridConnection: !state.gridConnection
      };
    case 'UPDATE_BATTERY':
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
}

// Create the context
const MicrogridContext = createContext<MicrogridContextType>({
  state: initialMicrogridState,
  dispatch: () => {}
});

// Provider component
export const MicrogridProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(microgridReducer, initialMicrogridState);
  const [batteryReserve, setBatteryReserve] = useState(20);

  const handleModeChange = (mode: string) => {
    dispatch({ type: 'SET_MODE', payload: mode });
  };
  
  const handleGridConnectionToggle = () => {
    dispatch({ type: 'TOGGLE_GRID_CONNECTION' });
  };
  
  const updateBatteryReserve = (value: number) => {
    setBatteryReserve(value);
    // You might also want to update some state in the microgrid based on this
  };

  return (
    <MicrogridContext.Provider value={{ 
      state, 
      dispatch, 
      batteryReserve,
      handleModeChange,
      handleGridConnectionToggle,
      updateBatteryReserve
    }}>
      {children}
    </MicrogridContext.Provider>
  );
};

// Custom hook to use the microgrid context
export const useMicrogrid = () => useContext(MicrogridContext);

export default MicrogridProvider;
