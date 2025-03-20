
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { EnergyNode, NodeConnection } from './types';
import { fetchEnergyFlowData } from '@/services/energyFlowService';
import { toast } from 'sonner';
import { useSiteContext } from '@/contexts/SiteContext';

// Refresh interval in milliseconds (15 seconds)
const REFRESH_INTERVAL = 15000;

interface EnergyFlowContextType {
  nodes: EnergyNode[];
  connections: NodeConnection[];
  isLoading: boolean;
  error: Error | null;
  lastUpdated: Date | null;
  refreshData: () => void;
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
  const { activeSite } = useSiteContext();
  const [nodes, setNodes] = useState<EnergyNode[]>([]);
  const [connections, setConnections] = useState<NodeConnection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await fetchEnergyFlowData(activeSite?.id || 'default');
      
      setNodes(data.nodes);
      setConnections(data.connections);
      setLastUpdated(new Date());
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
  };

  return (
    <EnergyFlowContext.Provider value={value}>
      {children}
    </EnergyFlowContext.Provider>
  );
};
