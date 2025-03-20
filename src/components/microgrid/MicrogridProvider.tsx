import React, { createContext, useReducer, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MicrogridDevice, MicrogridAlert, MicrogridSystemState, ControlSettings, AlertItem, MicrogridState, MicrogridAction, MicrogridContextType, CommandHistoryItem } from './types';

interface Props {
  children: ReactNode;
}

interface Action {
  type: string;
  payload?: any;
}

const initialSystemState: MicrogridSystemState = {
  mode: 'auto',
  status: 'online',
  gridConnected: true,
  lastModeChange: new Date().toISOString(),
  batteryReserve: 30,
  prioritizeRenewables: true,
  energyExport: true,
  safetyProtocols: true
};

const initialControlSettings: ControlSettings = {
  prioritizeSelfConsumption: true,
  gridExportLimit: 50,
  minBatteryReserve: 20,
  peakShavingEnabled: false,
  peakShavingThreshold: 80,
  demandResponseEnabled: false,
  economicOptimizationEnabled: true,
  weatherPredictiveControlEnabled: false
};

const initialCommandHistory: CommandHistoryItem[] = [
  {
    timestamp: new Date().toISOString(),
    command: 'System started',
    success: true,
    user: 'System'
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

const initialDevices: MicrogridDevice[] = [
  {
    id: 'device-1',
    name: 'Solar Array',
    type: 'solar',
    status: 'online',
    location: 'Roof',
    capacity: 10,
    last_updated: new Date().toISOString(),
    created_at: new Date().toISOString()
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
  systemMode: 'auto', // Changed from 'automatic' to 'auto'
  
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
  operatingMode: 'auto', // Changed from 'automatic' to 'auto'
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
      return { ...state, systemMode: action.payload };
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
    case 'LOG_COMMAND':
      return { ...state, commandHistory: [...(state.commandHistory || []), action.payload] };
    default:
      return state;
  }
};

export const MicrogridContext = createContext<MicrogridContextType>({
  state: initialState,
  dispatch: () => null,
});

export const MicrogridProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(microgridReducer, initialState);
  const [devices, setDevices] = useState<MicrogridDevice[]>(initialDevices);
  const [alerts, setAlerts] = useState<AlertItem[]>(initialAlerts);
  const [systemState, setSystemState] = useState<MicrogridSystemState>(initialSystemState);
  const [controlSettings, setControlSettings] = useState<ControlSettings>(initialControlSettings);
  const [commandHistory, setCommandHistory] = useState<CommandHistoryItem[]>(initialCommandHistory);

  return (
    <MicrogridContext.Provider value={{ state, dispatch }}>
      {children}
    </MicrogridContext.Provider>
  );
};
