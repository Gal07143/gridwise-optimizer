
import React, { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';
import { EnergyFlowContextType, EnergyFlowState, EnergyNode, EnergyConnection } from './types';

// Mock initial data
const initialNodes: EnergyNode[] = [
  {
    id: 'solar',
    label: 'Solar Panels',
    type: 'source',
    power: 5.5,
    status: 'active',
    deviceType: 'solar'
  },
  {
    id: 'wind',
    label: 'Wind Turbine',
    type: 'source',
    power: 2.1,
    status: 'active',
    deviceType: 'wind'
  },
  {
    id: 'battery',
    label: 'Battery',
    type: 'storage',
    power: 3.2,
    status: 'active',
    deviceType: 'battery',
    batteryLevel: 62
  },
  {
    id: 'grid',
    label: 'Power Grid',
    type: 'source',
    power: 1.5,
    status: 'active',
    deviceType: 'grid'
  },
  {
    id: 'home',
    label: 'Home',
    type: 'consumption',
    power: 4.2,
    status: 'active',
    deviceType: 'home'
  },
  {
    id: 'ev',
    label: 'EV Charger',
    type: 'consumption',
    power: 3.8,
    status: 'active',
    deviceType: 'ev'
  }
];

const initialConnections: EnergyConnection[] = [
  { from: 'solar', to: 'battery', value: 3.2, active: true },
  { from: 'solar', to: 'home', value: 2.3, active: true },
  { from: 'wind', to: 'battery', value: 0.8, active: true },
  { from: 'wind', to: 'home', value: 1.3, active: true },
  { from: 'battery', to: 'ev', value: 3.8, active: true },
  { from: 'grid', to: 'home', value: 0.6, active: true }
];

// Create the context
const EnergyFlowContext = createContext<EnergyFlowContextType | null>(null);

// Reducer for state management
type EnergyFlowAction = 
  | { type: 'SET_NODES'; payload: EnergyNode[] }
  | { type: 'SET_CONNECTIONS'; payload: EnergyConnection[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'REFRESH_DATA' };

const energyFlowReducer = (state: EnergyFlowState, action: EnergyFlowAction): EnergyFlowState => {
  switch (action.type) {
    case 'SET_NODES':
      return { ...state, nodes: action.payload };
    case 'SET_CONNECTIONS':
      return { ...state, connections: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'REFRESH_DATA':
      return { 
        ...state, 
        isLoading: true,
      };
    default:
      return state;
  }
};

// Provider component
export const EnergyFlowProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [state, dispatch] = useReducer(energyFlowReducer, {
    nodes: initialNodes,
    connections: initialConnections,
    isLoading: false
  });

  // Calculate derived metrics
  const totalGeneration = state.nodes
    .filter(node => node.type === 'source')
    .reduce((sum, node) => sum + node.power, 0);
    
  const totalConsumption = state.nodes
    .filter(node => node.type === 'consumption')
    .reduce((sum, node) => sum + node.power, 0);
    
  const batteryNode = state.nodes.find(n => n.deviceType === 'battery');
  const batteryPercentage = batteryNode?.batteryLevel || 0;
  
  const selfConsumptionRate = totalGeneration > 0 
    ? Math.min(100, (Math.min(totalGeneration, totalConsumption) / totalGeneration) * 100)
    : 0;
    
  const gridNode = state.nodes.find(n => n.deviceType === 'grid');
  const gridPower = gridNode?.power || 0;
  const gridDependencyRate = totalConsumption > 0 
    ? Math.min(100, (gridPower / totalConsumption) * 100)
    : 0;

  // Refresh data function
  const refreshData = useCallback(() => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    // Simulate API call with random data updates
    setTimeout(() => {
      const updatedNodes = state.nodes.map(node => {
        // Add some random variation to power values
        const variation = (Math.random() - 0.5) * (node.power * 0.2);
        const newPower = Math.max(0.1, node.power + variation);
        
        // For battery, update the level too
        if (node.deviceType === 'battery') {
          let newLevel = (batteryNode?.batteryLevel || 50) + (Math.random() - 0.5) * 5;
          newLevel = Math.min(100, Math.max(0, newLevel));
          return { ...node, power: newPower, batteryLevel: Math.round(newLevel) };
        }
        
        return { ...node, power: Number(newPower.toFixed(1)) };
      });
      
      // Update connections based on new node powers
      const updatedConnections = state.connections.map(conn => {
        const sourceNode = updatedNodes.find(n => n.id === conn.from);
        const targetNode = updatedNodes.find(n => n.id === conn.to);
        
        // Determine a reasonable value for the connection
        let newValue = conn.value;
        if (sourceNode && targetNode) {
          // Simple logic: distribute source's power among its connections
          const outgoingConnections = state.connections.filter(c => c.from === sourceNode.id).length;
          if (outgoingConnections > 0) {
            newValue = (sourceNode.power / outgoingConnections) * (0.8 + Math.random() * 0.4);
          }
        }
        
        return { ...conn, value: Number(newValue.toFixed(1)) };
      });
      
      dispatch({ type: 'SET_NODES', payload: updatedNodes });
      dispatch({ type: 'SET_CONNECTIONS', payload: updatedConnections });
      dispatch({ type: 'SET_LOADING', payload: false });
    }, 800);
  }, [state.nodes, state.connections, batteryNode]);

  return (
    <EnergyFlowContext.Provider
      value={{
        nodes: state.nodes,
        connections: state.connections,
        totalGeneration,
        totalConsumption,
        batteryPercentage,
        selfConsumptionRate,
        gridDependencyRate,
        refreshData,
        isLoading: state.isLoading
      }}
    >
      {children}
    </EnergyFlowContext.Provider>
  );
};

// Custom hook to use the energy flow context
export const useEnergyFlow = (): EnergyFlowContextType => {
  const context = useContext(EnergyFlowContext);
  if (!context) {
    throw new Error('useEnergyFlow must be used within an EnergyFlowProvider');
  }
  return context;
};
