
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { EnergyNode, EnergyConnection } from './types';
import { fetchRealtimeReadingsFromDevice } from '@/services/devices/readingsService';

// Initial data
const INITIAL_NODES: EnergyNode[] = [
  { id: 'solar', label: 'Solar Power', type: 'source', power: 75.2, status: 'active', deviceId: 'solar-1', deviceType: 'solar' },
  { id: 'wind', label: 'Wind Power', type: 'source', power: 45.8, status: 'active', deviceId: 'wind-1', deviceType: 'wind' },
  { id: 'grid', label: 'Grid', type: 'source', power: 32.1, status: 'active', deviceId: 'grid-1', deviceType: 'grid' },
  { id: 'battery', label: 'Battery Storage', type: 'storage', power: 120, status: 'active', deviceId: 'battery-1', deviceType: 'battery' },
  { id: 'building', label: 'Main Building', type: 'consumption', power: 102.7, status: 'active', deviceId: 'load-1', deviceType: 'load' },
  { id: 'ev', label: 'EV Charging', type: 'consumption', power: 48.3, status: 'active', deviceId: 'ev-1', deviceType: 'ev_charger' },
  { id: 'export', label: 'Grid Export', type: 'consumption', power: 8.1, status: 'active', deviceId: 'grid-exp-1', deviceType: 'grid' },
];

const INITIAL_CONNECTIONS: EnergyConnection[] = [
  { from: 'solar', to: 'battery', value: 35.2, active: true },
  { from: 'solar', to: 'building', value: 40.0, active: true },
  { from: 'wind', to: 'building', value: 25.8, active: true },
  { from: 'wind', to: 'battery', value: 20, active: true },
  { from: 'grid', to: 'building', value: 32.1, active: true },
  { from: 'battery', to: 'ev', value: 48.3, active: true },
  { from: 'battery', to: 'export', value: 8.1, active: true },
];

interface EnergyFlowContextType {
  nodes: EnergyNode[];
  connections: EnergyConnection[];
  totalGeneration: number;
  totalConsumption: number;
  batteryPercentage: number;
  selfConsumptionRate: number;
  gridDependencyRate: number;
}

const EnergyFlowContext = createContext<EnergyFlowContextType>({
  nodes: INITIAL_NODES,
  connections: INITIAL_CONNECTIONS,
  totalGeneration: 0,
  totalConsumption: 0,
  batteryPercentage: 0,
  selfConsumptionRate: 0,
  gridDependencyRate: 0,
});

export const useEnergyFlow = () => useContext(EnergyFlowContext);

interface EnergyFlowProviderProps {
  children: ReactNode;
}

export const EnergyFlowProvider: React.FC<EnergyFlowProviderProps> = ({ children }) => {
  const [nodes, setNodes] = useState(INITIAL_NODES);
  const [connections, setConnections] = useState(INITIAL_CONNECTIONS);
  
  // Calculate derived metrics
  const totalGeneration = nodes
    .filter(node => node.type === 'source' && node.id !== 'grid')
    .reduce((sum, node) => sum + node.power, 0);
    
  const totalConsumption = nodes
    .filter(node => node.type === 'consumption')
    .reduce((sum, node) => sum + node.power, 0);
    
  const gridImport = nodes.find(node => node.id === 'grid')?.power || 0;
  
  const batteryNode = nodes.find(node => node.id === 'battery');
  const batteryPercentage = 68; // In a real app, this would come from the device state
  
  // Self-consumption rate: percentage of renewable energy consumed on-site
  const selfConsumptionRate = totalGeneration > 0 
    ? Math.min(100, ((totalGeneration - (nodes.find(n => n.id === 'export')?.power || 0)) / totalGeneration) * 100)
    : 0;
    
  // Grid dependency rate: percentage of consumption that comes from the grid
  const gridDependencyRate = totalConsumption > 0 
    ? (gridImport / totalConsumption) * 100
    : 0;
  
  // Simulating live data updates
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        // Simulate fetching real device data
        const updatedNodes = [...nodes];
        
        for (let i = 0; i < updatedNodes.length; i++) {
          const node = updatedNodes[i];
          
          // Small random fluctuation (±5%)
          const fluctuation = 1 + (Math.random() - 0.5) * 0.1;
          
          // Apply time-of-day effects for solar
          if (node.id === 'solar') {
            const hour = new Date().getHours();
            const isDaytime = hour >= 7 && hour <= 19;
            const isPeak = hour >= 10 && hour <= 15;
            
            if (!isDaytime) {
              node.power = 0;
            } else if (isPeak) {
              node.power = node.power * fluctuation * 1.2;
            } else {
              node.power = node.power * fluctuation * 0.8;
            }
          } else {
            node.power = Math.max(0, node.power * fluctuation);
          }
        }
        
        // Update connection values based on node changes
        const updatedConnections = connections.map(conn => {
          const sourceNode = updatedNodes.find(n => n.id === conn.from);
          const targetNode = updatedNodes.find(n => n.id === conn.to);
          
          // Update connection value based on source node power
          if (sourceNode && targetNode) {
            const sourceTotalOutput = connections
              .filter(c => c.from === sourceNode.id)
              .reduce((sum, c) => sum + c.value, 0);
              
            const ratio = sourceTotalOutput > 0 ? conn.value / sourceTotalOutput : 0;
            return {
              ...conn,
              value: sourceNode.power * ratio
            };
          }
          
          return conn;
        });
        
        setNodes(updatedNodes);
        setConnections(updatedConnections);
      } catch (error) {
        console.error("Error updating energy flow data:", error);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [nodes, connections]);

  return (
    <EnergyFlowContext.Provider 
      value={{ 
        nodes, 
        connections, 
        totalGeneration,
        totalConsumption,
        batteryPercentage,
        selfConsumptionRate,
        gridDependencyRate
      }}
    >
      {children}
    </EnergyFlowContext.Provider>
  );
};
