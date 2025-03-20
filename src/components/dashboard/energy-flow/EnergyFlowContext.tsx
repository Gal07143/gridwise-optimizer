
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { EnergyNode, NodeConnection } from './types';
import { fetchEnergyFlowData } from '@/services/energyFlowService';
import { toast } from 'sonner';
import { useSite } from '@/contexts/SiteContext';

// Refresh interval in milliseconds (15 seconds)
const REFRESH_INTERVAL = 15000;

interface EnergyFlowContextType {
  nodes: EnergyNode[];
  connections: NodeConnection[];
  isLoading: boolean;
  error: Error | null;
  lastUpdated: Date | null;
  refreshData: () => void;
  // Add the missing properties used in EnergyFlowChart
  totalGeneration: number;
  totalConsumption: number;
  batteryPercentage: number;
  selfConsumptionRate: number;
  gridDependencyRate: number;
}

const EnergyFlowContext = createContext<EnergyFlowContextType | undefined>(undefined);

export const useEnergyFlow = () => {
  const context = useContext(EnergyFlowContext);
  if (context === undefined) {
    throw new Error('useEnergyFlow must be used within an EnergyFlowProvider');
  }
  return context;
};

export const EnergyFlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentSite: activeSite } = useSite();
  const [nodes, setNodes] = useState<EnergyNode[]>([]);
  const [connections, setConnections] = useState<NodeConnection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  // Add state for the new required properties
  const [totalGeneration, setTotalGeneration] = useState(0);
  const [totalConsumption, setTotalConsumption] = useState(0);
  const [batteryPercentage, setBatteryPercentage] = useState(0);
  const [selfConsumptionRate, setSelfConsumptionRate] = useState(0);
  const [gridDependencyRate, setGridDependencyRate] = useState(0);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await fetchEnergyFlowData(activeSite?.id || 'default');
      
      setNodes(data.nodes);
      setConnections(data.connections);
      setLastUpdated(new Date());
      
      // Calculate metrics from the nodes
      let genTotal = 0;
      let consTotal = 0;
      let batteryLevel = 0;
      
      data.nodes.forEach(node => {
        if (node.type === 'source' && node.deviceType !== 'grid') {
          genTotal += node.power;
        } else if (node.type === 'consumption') {
          consTotal += node.power;
        } else if (node.type === 'storage' && node.deviceType === 'battery') {
          batteryLevel = node.batteryLevel || 0;
        }
      });
      
      // Calculate grid dependency and self-consumption
      const gridNode = data.nodes.find(n => n.deviceType === 'grid');
      const gridPower = gridNode ? gridNode.power : 0;
      
      setTotalGeneration(genTotal);
      setTotalConsumption(consTotal);
      setBatteryPercentage(batteryLevel);
      
      // Calculate self-consumption rate (what percentage of generated renewable energy is consumed on-site)
      const selfConsRate = consTotal > 0 ? Math.min(100, (genTotal / consTotal) * 100) : 0;
      setSelfConsumptionRate(selfConsRate);
      
      // Calculate grid dependency rate (what percentage of consumption comes from the grid)
      const gridDepRate = consTotal > 0 ? Math.min(100, (gridPower / consTotal) * 100) : 0;
      setGridDependencyRate(gridDepRate);
      
    } catch (err) {
      console.error('Error loading energy flow data:', err);
      setError(err instanceof Error ? err : new Error('Failed to load energy flow data'));
      toast.error('Failed to load energy flow data');
    } finally {
      setIsLoading(false);
    }
  }, [activeSite?.id]);

  // Refresh data on component mount and when activeSite changes
  useEffect(() => {
    loadData();
    
    // Set up periodic refresh
    const intervalId = setInterval(() => {
      loadData();
    }, REFRESH_INTERVAL);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [loadData]);

  const refreshData = useCallback(() => {
    loadData();
    toast.success('Energy flow data refreshed');
  }, [loadData]);

  const value = {
    nodes,
    connections,
    isLoading,
    error,
    lastUpdated,
    refreshData,
    // Add the new properties to the context value
    totalGeneration,
    totalConsumption,
    batteryPercentage,
    selfConsumptionRate,
    gridDependencyRate,
  };

  return (
    <EnergyFlowContext.Provider value={value}>
      {children}
    </EnergyFlowContext.Provider>
  );
};
