
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
  refreshData: () => void;
}

const EnergyFlowContext = createContext<EnergyFlowContextType>({
  nodes: INITIAL_NODES,
  connections: INITIAL_CONNECTIONS,
  totalGeneration: 0,
  totalConsumption: 0,
  batteryPercentage: 73.6,
  selfConsumptionRate: 0,
  gridDependencyRate: 0,
  refreshData: () => {},
});

export const useEnergyFlow = () => useContext(EnergyFlowContext);

interface EnergyFlowProviderProps {
  children: ReactNode;
}

export const EnergyFlowProvider: React.FC<EnergyFlowProviderProps> = ({ children }) => {
  const [nodes, setNodes] = useState(INITIAL_NODES);
  const [connections, setConnections] = useState(INITIAL_CONNECTIONS);
  const [batteryPercentage, setBatteryPercentage] = useState(73.6);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  
  // Calculate derived metrics
  const totalGeneration = nodes
    .filter(node => node.type === 'source')
    .reduce((sum, node) => sum + node.power, 0);
    
  const totalConsumption = nodes
    .filter(node => node.type === 'consumption')
    .reduce((sum, node) => sum + node.power, 0);
    
  // Self-consumption rate: percentage of renewable energy consumed on-site
  const selfConsumptionRate = totalGeneration > 0 
    ? Math.min(100, ((totalConsumption) / totalGeneration) * 100)
    : 0;
    
  // Grid dependency rate: percentage of consumption that comes from the grid
  const gridDependencyRate = 0; // No grid in this design
  
  const refreshData = () => {
    setLastUpdate(new Date());
  };

  // Update flow based on time of day and realistic patterns
  const updateEnergyFlowBasedOnTime = () => {
    try {
      const now = new Date();
      const hour = now.getHours();
      
      // Solar power depends on time of day
      const isDaytime = hour >= 6 && hour <= 20;
      const isPeakSun = hour >= 10 && hour <= 16;
      
      // Apply small random fluctuations for realism
      const randomFactor = () => 0.95 + Math.random() * 0.1; // 0.95-1.05 range
      
      // Update nodes with realistic values
      const updatedNodes = [...nodes];
      
      // Update solar node
      const solarNode = updatedNodes.find(n => n.id === 'solar');
      if (solarNode) {
        if (!isDaytime) {
          solarNode.power = 0.1; // Minimal at night
        } else if (isPeakSun) {
          solarNode.power = 16.4 * randomFactor(); // Peak production
        } else {
          const morningOrEvening = (hour >= 6 && hour < 10) || (hour > 16 && hour <= 20);
          solarNode.power = morningOrEvening ? 8.2 * randomFactor() : 0.5; // Lower during early/late hours
        }
      }
      
      // Update wind node (more random than solar)
      const windNode = updatedNodes.find(n => n.id === 'wind');
      if (windNode) {
        const windCondition = Math.random(); // Random wind condition
        if (windCondition < 0.2) {
          windNode.power = 2.1 * randomFactor(); // Low wind 20% of time
        } else if (windCondition < 0.7) {
          windNode.power = 8.2 * randomFactor(); // Normal wind 50% of time
        } else {
          windNode.power = 12.5 * randomFactor(); // High wind 30% of time
        }
      }
      
      // Update battery
      // Battery charging during excess generation, discharging when needed
      const batteryNode = updatedNodes.find(n => n.id === 'battery');
      if (batteryNode) {
        // Simulate battery percentage changing based on charge/discharge
        const excessGeneration = Math.max(0, totalGeneration - totalConsumption);
        const batteryChange = excessGeneration > 0 ? 0.02 : -0.03; // Charge slower than discharge
        
        setBatteryPercentage(prev => {
          const newValue = Math.max(5, Math.min(95, prev + batteryChange));
          return Number(newValue.toFixed(1));
        });
      }
      
      // Update consumption nodes with small variations
      const buildingNode = updatedNodes.find(n => n.id === 'building');
      if (buildingNode) {
        // Building consumption peaks in morning and evening
        const isMorningPeak = hour >= 7 && hour <= 9;
        const isEveningPeak = hour >= 18 && hour <= 21;
        
        if (isMorningPeak || isEveningPeak) {
          buildingNode.power = 13.5 * randomFactor(); // Peak consumption
        } else if (hour >= 22 || hour <= 5) {
          buildingNode.power = 4.8 * randomFactor(); // Night (low consumption)
        } else {
          buildingNode.power = 11.1 * randomFactor(); // Normal daytime usage
        }
      }
      
      const devicesNode = updatedNodes.find(n => n.id === 'devices');
      if (devicesNode) {
        // Devices usage varies less
        devicesNode.power = 2.8 * randomFactor();
      }
      
      // Update connections to maintain flow consistency
      const updatedConnections = [...connections];
      
      // Update solar connections
      const solarToBattery = updatedConnections.find(c => c.from === 'solar' && c.to === 'battery');
      const solarToBuilding = updatedConnections.find(c => c.from === 'solar' && c.to === 'building');
      
      if (solarNode && solarToBattery && solarToBuilding) {
        // Distribute solar power: 40% to battery, 60% to building
        solarToBattery.value = Number((solarNode.power * 0.4).toFixed(1));
        solarToBuilding.value = Number((solarNode.power * 0.6).toFixed(1));
        solarToBattery.active = solarNode.power > 0.5;
        solarToBuilding.active = solarNode.power > 0.5;
      }
      
      // Update wind connections
      const windToBattery = updatedConnections.find(c => c.from === 'wind' && c.to === 'battery');
      const windToBuilding = updatedConnections.find(c => c.from === 'wind' && c.to === 'building');
      
      if (windNode && windToBattery && windToBuilding) {
        // Distribute wind power: 43% to battery, 57% to building
        windToBattery.value = Number((windNode.power * 0.43).toFixed(1));
        windToBuilding.value = Number((windNode.power * 0.57).toFixed(1));
        windToBattery.active = windNode.power > 0.5;
        windToBuilding.active = windNode.power > 0.5;
      }
      
      // Update battery to devices connection
      const batteryToDevices = updatedConnections.find(c => c.from === 'battery' && c.to === 'devices');
      if (devicesNode && batteryToDevices) {
        batteryToDevices.value = Number(devicesNode.power.toFixed(1));
        batteryToDevices.active = batteryPercentage > 10; // Only active if battery has charge
      }
      
      setNodes(updatedNodes);
      setConnections(updatedConnections);
      
    } catch (error) {
      console.error("Error updating energy flow data:", error);
    }
  };
  
  // Update data periodically and when lastUpdate changes
  useEffect(() => {
    updateEnergyFlowBasedOnTime();
    
    const interval = setInterval(() => {
      updateEnergyFlowBasedOnTime();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [lastUpdate, totalGeneration, totalConsumption, batteryPercentage]);

  return (
    <EnergyFlowContext.Provider 
      value={{ 
        nodes, 
        connections, 
        totalGeneration,
        totalConsumption,
        batteryPercentage,
        selfConsumptionRate,
        gridDependencyRate,
        refreshData
      }}
    >
      {children}
    </EnergyFlowContext.Provider>
  );
};
