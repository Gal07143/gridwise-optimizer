
import React, { createContext, useContext, useState, useEffect } from 'react';
import { EnergyNode, EnergyConnection } from './types';
import { fetchEnergyFlowData } from '@/services/energyFlowService';
import { toast } from 'sonner';
import { useSiteContext } from '@/contexts/SiteContext';

export interface EnergyFlowContextType {
  nodes: EnergyNode[];
  connections: EnergyConnection[];
  isLoading: boolean;
  lastUpdated: string | null;
  refreshData: () => void;
  sendCommand: (command: string, params: any) => Promise<boolean>;
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

export const EnergyFlowProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const { activeSite } = useSiteContext();
  const [nodes, setNodes] = useState<EnergyNode[]>([]);
  const [connections, setConnections] = useState<EnergyConnection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [totalGeneration, setTotalGeneration] = useState(0);
  const [totalConsumption, setTotalConsumption] = useState(0);
  const [batteryPercentage, setBatteryPercentage] = useState(0);
  const [selfConsumptionRate, setSelfConsumptionRate] = useState(0);
  const [gridDependencyRate, setGridDependencyRate] = useState(0);

  const loadData = async () => {
    if (!activeSite) return;
    
    setIsLoading(true);
    try {
      const data = await fetchEnergyFlowData(activeSite.id);
      setNodes(data.nodes);
      setConnections(data.connections);
      setLastUpdated(data.timestamp);
      setTotalGeneration(data.totalGeneration);
      setTotalConsumption(data.totalConsumption);
      setBatteryPercentage(data.batteryPercentage);
      setSelfConsumptionRate(data.selfConsumptionRate);
      setGridDependencyRate(data.gridDependencyRate);
    } catch (error) {
      console.error('Error loading energy flow data:', error);
      toast.error('Failed to load energy flow data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeSite) {
      loadData();
      
      // Refresh data every minute
      const intervalId = setInterval(() => {
        loadData();
      }, 60000);
      
      return () => clearInterval(intervalId);
    }
  }, [activeSite]);

  const refreshData = () => {
    loadData();
    toast.success('Energy flow data refreshed');
  };

  const sendCommand = async (command: string, params: any): Promise<boolean> => {
    // Implementation for sending commands to the system
    console.log(`Sending command: ${command}`, params);
    toast.success(`Command "${command}" sent successfully`);
    // Refresh data after command
    setTimeout(() => loadData(), 1000);
    return true;
  };

  const value = {
    nodes,
    connections,
    isLoading,
    lastUpdated,
    refreshData,
    sendCommand,
    totalGeneration,
    totalConsumption,
    batteryPercentage,
    selfConsumptionRate,
    gridDependencyRate
  };

  return (
    <EnergyFlowContext.Provider value={value}>
      {children}
    </EnergyFlowContext.Provider>
  );
};
