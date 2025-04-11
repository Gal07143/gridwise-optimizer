
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { fetchEnergyFlowData } from '@/services/energyFlowService';
import { EnergyNode, EnergyConnection } from '@/components/dashboard/energy-flow/types';
import { useAppStore } from '@/store';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export interface EnhancedEnergyFlowProps {
  siteId?: string;
}

export const EnhancedEnergyFlow: React.FC<EnhancedEnergyFlowProps> = ({ siteId }) => {
  const { currentSite } = useAppStore();
  const effectiveSiteId = siteId || currentSite?.id || 'default';
  
  const [loading, setLoading] = useState(true);
  const [energyData, setEnergyData] = useState<{
    nodes: EnergyNode[];
    connections: EnergyConnection[];
    totalGeneration: number;
    totalConsumption: number;
  } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchEnergyFlowData(effectiveSiteId);
        setEnergyData({
          nodes: data.nodes,
          connections: data.connections,
          totalGeneration: data.totalGeneration,
          totalConsumption: data.totalConsumption
        });
      } catch (error) {
        console.error("Error loading energy flow data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    // Set up polling every 30 seconds
    const interval = setInterval(() => {
      loadData();
    }, 30000);

    return () => clearInterval(interval);
  }, [effectiveSiteId]);

  if (loading || !energyData) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  // Simple rendering for now, can be expanded with more visualization
  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="energy-flow-visualization h-[250px] relative">
          {/* Central display */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="text-xl font-bold">Energy Flow</div>
            <div className="flex gap-8 mt-4 justify-center">
              <div>
                <div className="text-green-500 text-lg font-semibold">{energyData.totalGeneration.toFixed(1)} kW</div>
                <div className="text-sm text-slate-500">Generation</div>
              </div>
              <div>
                <div className="text-red-500 text-lg font-semibold">{energyData.totalConsumption.toFixed(1)} kW</div>
                <div className="text-sm text-slate-500">Consumption</div>
              </div>
            </div>
          </div>

          {/* Nodes */}
          <div className="absolute left-0 top-0 w-full h-full">
            {energyData.nodes.map((node) => {
              // Calculate position based on node type
              let positionClass = '';
              switch (node.type) {
                case 'source':
                  positionClass = 'top-4 left-4';
                  break;
                case 'storage':
                  positionClass = 'bottom-4 left-4';
                  break;
                case 'consumption':
                  positionClass = 'bottom-4 right-4';
                  break;
                default:
                  positionClass = 'top-4 right-4';
              }

              return (
                <div key={node.id} className={`absolute ${positionClass} p-2 bg-slate-100 dark:bg-slate-800 rounded-lg`}>
                  <div className="text-sm font-medium">{node.name || node.deviceType}</div>
                  <div className="text-xs">{node.power} kW</div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedEnergyFlow;
