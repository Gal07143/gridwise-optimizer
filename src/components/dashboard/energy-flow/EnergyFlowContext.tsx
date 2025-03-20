import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { EnergyNode, EnergyConnection } from './types';
import { fetchRealtimeReadingsFromDevice } from '@/services/devices/readingsService';

// Initial data matching the design
const INITIAL_NODES: EnergyNode[] = [
  { id: 'solar', label: 'Solar Power', type: 'source', power: 16.4, status: 'active', deviceId: 'solar-1', deviceType: 'solar' },
  { id: 'wind', label: 'Wind Power', type: 'source', power: 8.2, status: 'active', deviceId: 'wind-1', deviceType: 'wind' },
  { id: 'battery', label: 'Battery Storage', type: 'storage', power: 120, status: 'active', deviceId: 'battery-1', deviceType: 'battery' },
  { id: 'building', label: 'Main Building', type: 'consumption', power: 11.1, status: 'active', deviceId: 'load-1', deviceType: 'load' },
  { id: 'devices', label: 'Devices', type: 'consumption', power: 2.8, status: 'active', deviceId: 'devices-1', deviceType: 'load' },
];

const INITIAL_CONNECTIONS: EnergyConnection[] = [
  { from: 'solar', to: 'battery', value: 6.6, active: true },
  { from: 'solar', to: 'building', value: 9.8, active: true },
  { from: 'wind', to: 'battery', value: 3.5, active: true },
  { from: 'wind', to: 'building', value: 4.7, active: true },
  { from: 'battery', to: 'devices', value: 2.8, active: true },
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
  batteryPercentage: 73.6,
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
    .filter(node => node.type === 'source')
    .reduce((sum, node) => sum + node.power, 0);
    
  const totalConsumption = nodes
    .filter(node => node.type === 'consumption')
    .reduce((sum, node) => sum + node.power, 0);
    
  // Fixed battery percentage to match design
  const batteryPercentage = 73.6;
  
  // Self-consumption rate: percentage of renewable energy consumed on-site
  const selfConsumptionRate = totalGeneration > 0 
    ? Math.min(100, ((totalConsumption) / totalGeneration) * 100)
    : 0;
    
  // Grid dependency rate: percentage of consumption that comes from the grid
  const gridDependencyRate = 0; // No grid in this design
  
  // Simulating live data updates with small fluctuations
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        // Simulate fetching real device data
        const updatedNodes = [...nodes];
        
        for (let i = 0; i < updatedNodes.length; i++) {
          const node = updatedNodes[i];
          
          // Small random fluctuation (±3%)
          const fluctuation = 1 + (Math.random() - 0.5) * 0.06;
          
          // Apply time-of-day effects for solar
          if (node.id === 'solar') {
            const hour = new Date().getHours();
            const isDaytime = hour >= 7 && hour <= 19;
            const isPeak = hour >= 10 && hour <= 15;
            
            if (!isDaytime) {
              node.power = 0.1; // Minimal at night
            } else if (isPeak) {
              // Keep close to 16.4 kW during peak hours
              node.power = 16.4 * fluctuation;
            } else {
              // Lower during non-peak daylight hours
              node.power = 16.4 * fluctuation * 0.7;
            }
          } else if (node.id !== 'battery') { // Don't fluctuate battery
            node.power = Math.max(0, node.power * fluctuation);
          }
        }
        
        // Update connection values to maintain consistent flow
        const updatedConnections = [...connections];
        
        // Solar connections
        const solarNode = updatedNodes.find(n => n.id === 'solar');
        if (solarNode) {
          const solarTotal = solarNode.power;
          const solarToBattery = updatedConnections.find(c => c.from === 'solar' && c.to === 'battery');
          const solarToBuilding = updatedConnections.find(c => c.from === 'solar' && c.to === 'building');
          
          if (solarToBattery && solarToBuilding) {
            solarToBattery.value = solarTotal * 0.4;
            solarToBuilding.value = solarTotal * 0.6;
          }
        }
        
        // Wind connections
        const windNode = updatedNodes.find(n => n.id === 'wind');
        if (windNode) {
          const windTotal = windNode.power;
          const windToBattery = updatedConnections.find(c => c.from === 'wind' && c.to === 'battery');
          const windToBuilding = updatedConnections.find(c => c.from === 'wind' && c.to === 'building');
          
          if (windToBattery && windToBuilding) {
            windToBattery.value = windTotal * 0.43;
            windToBuilding.value = windTotal * 0.57;
          }
        }
        
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
