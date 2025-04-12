import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMicrogrid } from '@/components/microgrid/MicrogridProvider';

interface EnergyFlowState {
  direction: 'import' | 'export' | 'neutral';
  power: number;
  efficiency: number;
  timestamp: string;
}

interface EnergyFlowContextType {
  flow: EnergyFlowState;
  history: EnergyFlowState[];
  updateFlow: (newFlow: Partial<EnergyFlowState>) => void;
}

const EnergyFlowContext = createContext<EnergyFlowContextType>({
  flow: {
    direction: 'neutral',
    power: 0,
    efficiency: 1,
    timestamp: new Date().toISOString(),
  },
  history: [],
  updateFlow: () => {},
});

export const useEnergyFlow = () => useContext(EnergyFlowContext);

interface EnergyFlowProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component for energy flow visualization
 * Manages power flow direction, magnitude, and historical data
 */
export const EnergyFlowProvider: React.FC<EnergyFlowProviderProps> = ({ children }) => {
  const { totalPower, gridStatus } = useMicrogrid();
  const [flow, setFlow] = useState<EnergyFlowState>({
    direction: 'neutral',
    power: 0,
    efficiency: 1,
    timestamp: new Date().toISOString(),
  });
  const [history, setHistory] = useState<EnergyFlowState[]>([]);

  useEffect(() => {
    // Update flow based on microgrid state
    const direction: EnergyFlowState['direction'] = totalPower > 0 ? 'export' : totalPower < 0 ? 'import' : 'neutral';
    const newFlow: EnergyFlowState = {
      direction,
      power: Math.abs(totalPower),
      efficiency: 0.95, // Example efficiency value
      timestamp: new Date().toISOString(),
    };

    setFlow(newFlow);
    setHistory(prev => [...prev.slice(-9), newFlow]); // Keep last 10 readings
  }, [totalPower]);

  const updateFlow = (newFlow: Partial<EnergyFlowState>) => {
    setFlow(prev => ({
      ...prev,
      ...newFlow,
      timestamp: new Date().toISOString(),
    }));
  };

  return (
    <EnergyFlowContext.Provider value={{ flow, history, updateFlow }}>
      {children}
    </EnergyFlowContext.Provider>
  );
}; 