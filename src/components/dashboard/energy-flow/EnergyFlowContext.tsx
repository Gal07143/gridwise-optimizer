
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { EnergyFlowState, EnergyFlowContextType } from './types';

// Initial state
const initialFlow: EnergyFlowState = {
  timestamp: new Date(),
  grid: {
    powerImport: 0,
    powerExport: 0,
  },
  solar: {
    production: 0,
    curtailment: 0,
  },
  battery: {
    charging: 0,
    discharging: 0,
    stateOfCharge: 50,
    capacity: 10,
  },
  home: {
    consumption: 0,
  },
};

// Create context
const EnergyFlowContext = createContext<EnergyFlowContextType | null>(null);

interface EnergyFlowProviderProps {
  children: ReactNode;
}

// Provider component
export const EnergyFlowProvider: React.FC<EnergyFlowProviderProps> = ({ children }) => {
  const [flow, setFlow] = useState<EnergyFlowState>(initialFlow);
  const [history, setHistory] = useState<EnergyFlowState[]>([]);

  const updateFlow = (newFlow: EnergyFlowState) => {
    setFlow(newFlow);
    setHistory((prev) => [...prev, newFlow].slice(-48)); // Keep last 48 entries (24 hours if updated every 30min)
  };

  return (
    <EnergyFlowContext.Provider
      value={{
        flow,
        history,
        updateFlow,
      }}
    >
      {children}
    </EnergyFlowContext.Provider>
  );
};

// Hook for using energy flow context
export const useEnergyFlow = () => {
  const context = useContext(EnergyFlowContext);
  if (!context) {
    throw new Error('useEnergyFlow must be used within an EnergyFlowProvider');
  }
  return context;
};
