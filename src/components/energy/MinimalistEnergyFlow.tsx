
import React, { useEffect, useState } from 'react';
import { EnergyFlowChart } from '@/components/dashboard/EnergyFlowChart';
import { fetchEnergyFlowData } from '@/services/energyFlowService';
import { EnergyFlowData } from '@/components/dashboard/energy-flow/types';

interface MinimalistEnergyFlowProps {
  siteId?: string;
  className?: string;
  height?: string;
}

const MinimalistEnergyFlow: React.FC<MinimalistEnergyFlowProps> = ({
  siteId,
  className = '',
  height = '200px'
}) => {
  const [flowData, setFlowData] = useState<EnergyFlowData | null>(null);
  
  useEffect(() => {
    fetchEnergyFlowData(siteId)
      .then(data => setFlowData(data))
      .catch(err => console.error('Error loading energy flow data:', err));
    
    const interval = setInterval(() => {
      fetchEnergyFlowData(siteId)
        .then(data => setFlowData(data))
        .catch(err => console.error('Error loading energy flow data:', err));
    }, 60000); // Refresh every 60 seconds
    
    return () => clearInterval(interval);
  }, [siteId]);

  if (!flowData) {
    return (
      <div className={`${className} flex items-center justify-center`} style={{ height }}>
        <div className="animate-pulse rounded-full h-12 w-12 bg-primary/30"></div>
      </div>
    );
  }

  return (
    <div className={className} style={{ height }}>
      <EnergyFlowChart 
        nodes={flowData.nodes} 
        connections={flowData.connections} 
        animationDelay="0.3s"
      />
    </div>
  );
};

export default MinimalistEnergyFlow;
