
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { EnergyNode, EnergyConnection } from './types';

// Initial data
const INITIAL_NODES: EnergyNode[] = [
  { id: 'solar', label: 'Solar Power', type: 'source', power: 75.2, status: 'active' },
  { id: 'wind', label: 'Wind Power', type: 'source', power: 45.8, status: 'active' },
  { id: 'grid', label: 'Grid', type: 'source', power: 32.1, status: 'active' },
  { id: 'battery', label: 'Battery Storage', type: 'storage', power: 120, status: 'active' },
  { id: 'building', label: 'Main Building', type: 'consumption', power: 102.7, status: 'active' },
  { id: 'ev', label: 'EV Charging', type: 'consumption', power: 48.3, status: 'active' },
];

const INITIAL_CONNECTIONS: EnergyConnection[] = [
  { from: 'solar', to: 'battery', value: 35.2, active: true },
  { from: 'solar', to: 'building', value: 40.0, active: true },
  { from: 'wind', to: 'building', value: 25.8, active: true },
  { from: 'wind', to: 'battery', value: 20, active: true },
  { from: 'grid', to: 'building', value: 32.1, active: true },
  { from: 'battery', to: 'ev', value: 48.3, active: true },
];

interface EnergyFlowContextType {
  nodes: EnergyNode[];
  connections: EnergyConnection[];
}

const EnergyFlowContext = createContext<EnergyFlowContextType>({
  nodes: INITIAL_NODES,
  connections: INITIAL_CONNECTIONS,
});

export const useEnergyFlow = () => useContext(EnergyFlowContext);

interface EnergyFlowProviderProps {
  children: ReactNode;
}

export const EnergyFlowProvider: React.FC<EnergyFlowProviderProps> = ({ children }) => {
  const [nodes, setNodes] = useState(INITIAL_NODES);
  const [connections, setConnections] = useState(INITIAL_CONNECTIONS);
  
  // Simulating live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setNodes(prevNodes => {
        return prevNodes.map(node => ({
          ...node,
          power: Math.max(0, node.power * (1 + (Math.random() - 0.5) * 0.08)) // +/- 4% change
        }));
      });
      
      setConnections(prevConnections => {
        return prevConnections.map(conn => ({
          ...conn,
          value: Math.max(0, conn.value * (1 + (Math.random() - 0.5) * 0.1)) // +/- 5% change
        }));
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <EnergyFlowContext.Provider value={{ nodes, connections }}>
      {children}
    </EnergyFlowContext.Provider>
  );
};
