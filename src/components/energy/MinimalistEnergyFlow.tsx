
import React, { useEffect, useState } from 'react';
import { EnergyFlowChart } from '@/components/dashboard/EnergyFlowChart';
import { fetchEnergyFlowData } from '@/services/energyFlowService';
import { EnergyFlowData } from '@/components/dashboard/energy-flow/types';
import { Skeleton } from '@/components/ui/skeleton';

interface MinimalistEnergyFlowProps {
  siteId?: string;
  className?: string;
  height?: string;
  refreshInterval?: number;
  hideLabels?: boolean;
}

const MinimalistEnergyFlow: React.FC<MinimalistEnergyFlowProps> = ({
  siteId,
  className = '',
  height = '200px',
  refreshInterval = 60000, // Default to 60 seconds
  hideLabels = false
}) => {
  const [flowData, setFlowData] = useState<EnergyFlowData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const loadData = async () => {
    try {
      setIsLoading(true);
      const data = await fetchEnergyFlowData(siteId);
      
      // If hideLabels is true, remove labels from nodes
      if (hideLabels && data) {
        data.nodes = data.nodes.map(node => ({
          ...node,
          label: undefined
        }));
      }
      
      setFlowData(data);
      setError(null);
    } catch (err) {
      console.error('Error loading energy flow data:', err);
      setError('Failed to load energy flow data');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadData();
    
    // Set up auto-refresh interval
    const interval = setInterval(loadData, refreshInterval);
    
    return () => clearInterval(interval);
  }, [siteId, refreshInterval, hideLabels]);

  if (error) {
    return (
      <div className={`${className} flex items-center justify-center`} style={{ height }}>
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  if (isLoading || !flowData) {
    return (
      <div className={`${className} flex items-center justify-center`} style={{ height }}>
        <Skeleton className="h-full w-full rounded-md opacity-50" />
      </div>
    );
  }

  return (
    <div className={className} style={{ height }}>
      <EnergyFlowChart 
        nodes={flowData.nodes} 
        connections={flowData.connections} 
        animationDelay="0.3s"
        className="h-full w-full"
      />
    </div>
  );
};

export default MinimalistEnergyFlow;
