
import React, { createContext, useContext, useState, useEffect } from 'react';
import { EnergyNode, EnergyConnection, EnergyFlowData } from './types';
import { useSiteContext } from '@/contexts/SiteContext';

// Default implementation of useEnergyFlow
interface EnergyFlowContextValue {
  nodes: EnergyNode[];
  connections: EnergyConnection[];
  totalGeneration: number;
  totalConsumption: number;
  batteryPercentage: number;
  selfConsumptionRate: number;
  gridDependencyRate: number;
  refreshData: () => void;
  isLoading: boolean;
  energyFlowData: EnergyFlowData;
  setEnergyFlowData: (data: EnergyFlowData) => void;
  selectedNode: EnergyNode | null;
  setSelectedNode: (node: EnergyNode | null) => void;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
}

const EnergyFlowContext = createContext<EnergyFlowContextValue | undefined>(undefined);

// Sample nodes and connections for initial state
const sampleNodes: EnergyNode[] = [
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
    label: 'Battery Storage',
    type: 'storage',
    power: 3.2,
    status: 'active',
    deviceType: 'battery',
    batteryLevel: 68
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
    label: 'Household',
    type: 'consumption',
    power: 4.2,
    status: 'active',
    deviceType: 'load'
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

const sampleConnections: EnergyConnection[] = [
  { from: 'solar', to: 'battery', value: 3.2, active: true },
  { from: 'solar', to: 'home', value: 2.3, active: true },
  { from: 'wind', to: 'battery', value: 0.8, active: true },
  { from: 'wind', to: 'home', value: 1.3, active: true },
  { from: 'battery', to: 'ev', value: 3.8, active: true },
  { from: 'grid', to: 'home', value: 0.6, active: true }
];

export const EnergyFlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activeSite } = useSiteContext();
  const [energyFlowData, setEnergyFlowData] = useState<EnergyFlowData>({
    nodes: sampleNodes,
    links: sampleConnections,
  });
  const [selectedNode, setSelectedNode] = useState<EnergyNode | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Calculated metrics
  const totalGeneration = energyFlowData.nodes
    .filter(node => node.type === 'source')
    .reduce((sum, node) => sum + node.power, 0);
    
  const totalConsumption = energyFlowData.nodes
    .filter(node => node.type === 'consumption')
    .reduce((sum, node) => sum + node.power, 0);
    
  const batteryNode = energyFlowData.nodes.find(n => n.deviceType === 'battery');
  const batteryPercentage = batteryNode?.batteryLevel || 0;
  
  // Self-consumption rate: how much of generated energy is used directly
  const selfConsumptionRate = totalGeneration > 0 
    ? (Math.min(totalGeneration, totalConsumption) / totalGeneration) * 100 
    : 0;
    
  // Grid dependency rate: how much energy comes from the grid
  const gridNode = energyFlowData.nodes.find(n => n.deviceType === 'grid');
  const gridPower = gridNode?.power || 0;
  const gridDependencyRate = totalConsumption > 0 
    ? (gridPower / totalConsumption) * 100 
    : 0;
  
  const refreshData = () => {
    setIsLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Apply small random changes to power values to simulate real-time updates
      const updatedNodes = energyFlowData.nodes.map(node => ({
        ...node,
        power: Math.max(0.1, node.power * (0.9 + Math.random() * 0.2))
      }));
      
      setEnergyFlowData({
        ...energyFlowData,
        nodes: updatedNodes
      });
      
      setIsLoading(false);
    }, 1000);
  };
  
  return (
    <EnergyFlowContext.Provider
      value={{
        nodes: energyFlowData.nodes,
        connections: energyFlowData.links,
        totalGeneration,
        totalConsumption,
        batteryPercentage,
        selfConsumptionRate,
        gridDependencyRate,
        refreshData,
        isLoading,
        energyFlowData,
        setEnergyFlowData,
        selectedNode,
        setSelectedNode,
        isModalOpen,
        setIsModalOpen,
      }}
    >
      {children}
    </EnergyFlowContext.Provider>
  );
};

export const useEnergyFlow = (): EnergyFlowContextValue => {
  const context = useContext(EnergyFlowContext);
  if (!context) {
    throw new Error('useEnergyFlow must be used within an EnergyFlowProvider');
  }
  return context;
};

export default EnergyFlowContext;
