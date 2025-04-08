
import React, { createContext, useContext, useState, useEffect } from 'react';
import { EnergyFlowContextType, EnergyFlowState, EnergyNode, EnergyConnection } from './types';
import { useAppStore } from '@/store/appStore';

// Create context
const EnergyFlowContext = createContext<EnergyFlowContextType | undefined>(undefined);

// Initial state with mock data
const initialState: EnergyFlowState = {
  nodes: [
    {
      id: 'solar',
      label: 'Solar Panels',
      type: 'source',
      power: 5.5,
      status: 'active',
      deviceType: 'solar',
    },
    {
      id: 'wind',
      label: 'Wind Turbine',
      type: 'source',
      power: 0.8,
      status: 'active',
      deviceType: 'wind',
    },
    {
      id: 'grid',
      label: 'Power Grid',
      type: 'source',
      power: 0.6,
      status: 'active',
      deviceType: 'grid',
    },
    {
      id: 'battery',
      label: 'Battery',
      type: 'storage',
      power: 2.4,
      status: 'active',
      deviceType: 'battery',
      batteryLevel: 62,
    },
    {
      id: 'home',
      label: 'Home',
      type: 'consumption',
      power: 4.2,
      status: 'active',
      deviceType: 'home',
    },
    {
      id: 'ev',
      label: 'Electric Car',
      type: 'consumption',
      power: 0.3,
      status: 'active',
      deviceType: 'ev',
    },
  ],
  connections: [
    {
      from: 'solar',
      to: 'battery',
      value: 2.4,
      active: true,
    },
    {
      from: 'solar',
      to: 'home',
      value: 3.1,
      active: true,
    },
    {
      from: 'wind',
      to: 'battery',
      value: 0.0,
      active: false,
    },
    {
      from: 'wind',
      to: 'home',
      value: 0.8,
      active: true,
    },
    {
      from: 'battery',
      to: 'ev',
      value: 0.0,
      active: false,
    },
    {
      from: 'battery',
      to: 'home',
      value: 0.0,
      active: false,
    },
    {
      from: 'grid',
      to: 'battery',
      value: 0.0,
      active: false,
    },
    {
      from: 'grid',
      to: 'home',
      value: 0.3,
      active: true,
    },
    {
      from: 'grid',
      to: 'ev',
      value: 0.3,
      active: true,
    },
  ],
  isLoading: false,
};

export const EnergyFlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentSite } = useAppStore();
  const [state, setState] = useState<EnergyFlowState>(initialState);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate key metrics
  const totalGeneration = state.nodes
    .filter(node => node.type === 'source' && node.deviceType !== 'grid')
    .reduce((sum, node) => sum + node.power, 0);
  
  const totalConsumption = state.nodes
    .filter(node => node.type === 'consumption')
    .reduce((sum, node) => sum + node.power, 0);
  
  const batteryPercentage = state.nodes.find(node => node.deviceType === 'battery')?.batteryLevel || 0;
  
  const generationToHome = state.connections
    .filter(conn => 
      (conn.from === 'solar' || conn.from === 'wind') && 
      conn.to === 'home' && 
      conn.active
    )
    .reduce((sum, conn) => sum + conn.value, 0);
  
  const selfConsumptionRate = totalGeneration > 0 
    ? (generationToHome / totalGeneration) * 100 
    : 0;
  
  const gridToConsumption = state.connections
    .filter(conn => conn.from === 'grid' && conn.active)
    .reduce((sum, conn) => sum + conn.value, 0);
  
  const gridDependencyRate = totalConsumption > 0 
    ? (gridToConsumption / totalConsumption) * 100 
    : 0;

  // Fetch data from API or refresh data
  const refreshData = async () => {
    if (!currentSite) return;
    
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call
      // For now, we'll just simulate a delay and return the mock data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate some changes to the data
      const updatedNodes = [...state.nodes].map(node => {
        if (node.id === 'solar') {
          return { ...node, power: 5.5 + (Math.random() - 0.5) };
        } else if (node.id === 'wind') {
          return { ...node, power: 0.8 + (Math.random() - 0.5) };
        } else if (node.id === 'battery') {
          const newBatteryLevel = Math.min(100, Math.max(0, (node.batteryLevel || 0) + (Math.random() > 0.5 ? 1 : -1)));
          return { ...node, power: 2.4 + (Math.random() - 0.5), batteryLevel: newBatteryLevel };
        } else if (node.id === 'home') {
          return { ...node, power: 4.2 + (Math.random() - 0.5) };
        }
        return node;
      });
      
      setState(prev => ({
        ...prev,
        nodes: updatedNodes,
      }));
    } catch (error) {
      console.error('Error refreshing energy flow data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (currentSite) {
      refreshData();
    }
  }, [currentSite]); // eslint-disable-line react-hooks/exhaustive-deps

  const value: EnergyFlowContextType = {
    ...state,
    totalGeneration,
    totalConsumption,
    batteryPercentage,
    selfConsumptionRate,
    gridDependencyRate,
    refreshData,
    isLoading,
  };

  return (
    <EnergyFlowContext.Provider value={value}>
      {children}
    </EnergyFlowContext.Provider>
  );
};

export const useEnergyFlow = (): EnergyFlowContextType => {
  const context = useContext(EnergyFlowContext);
  if (context === undefined) {
    throw new Error('useEnergyFlow must be used within an EnergyFlowProvider');
  }
  return context;
};
