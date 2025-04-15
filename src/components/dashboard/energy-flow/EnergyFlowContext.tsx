
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { EnergyFlowState } from './types';

export const defaultFlowState: EnergyFlowState = {
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
  }
};

export interface EnergyFlowContextType {
  flow: EnergyFlowState;
  history: EnergyFlowState[];
  updateFlow: (newFlow: Partial<EnergyFlowState>) => void;
}

const EnergyFlowContext = createContext<EnergyFlowContextType | undefined>(undefined);

export const useEnergyFlow = () => {
  const context = useContext(EnergyFlowContext);
  if (!context) {
    throw new Error('useEnergyFlow must be used within an EnergyFlowProvider');
  }
  return context;
};

interface EnergyFlowProviderProps {
  children: ReactNode;
  initialState?: EnergyFlowState;
}

export const EnergyFlowProvider: React.FC<EnergyFlowProviderProps> = ({ 
  children, 
  initialState = defaultFlowState 
}) => {
  const [flow, setFlow] = useState<EnergyFlowState>(initialState);
  const [history, setHistory] = useState<EnergyFlowState[]>([initialState]);

  const updateFlow = (newFlow: Partial<EnergyFlowState>) => {
    const updatedFlow = {
      ...flow,
      ...newFlow,
      timestamp: new Date(),
    };
    
    setFlow(updatedFlow);
    setHistory(prev => [...prev, updatedFlow].slice(-100)); // Keep last 100 entries
  };

  return (
    <EnergyFlowContext.Provider value={{
      flow,
      history,
      updateFlow
    }}>
      {children}
    </EnergyFlowContext.Provider>
  );
};
