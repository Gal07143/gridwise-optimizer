
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnergyFlowChart } from '@/components/dashboard/EnergyFlowChart';
import { fetchEnergyFlowData } from '@/services/energyFlowService';
import { EnergyFlowData } from '@/components/dashboard/energy-flow/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface EnhancedEnergyFlowProps {
  siteId?: string;
  className?: string;
  title?: string;
  hideHeader?: boolean;
}

const EnhancedEnergyFlow: React.FC<EnhancedEnergyFlowProps> = ({
  siteId,
  className = '',
  title = 'Energy Flow',
  hideHeader = false
}) => {
  const [flowData, setFlowData] = useState<EnergyFlowData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await fetchEnergyFlowData(siteId);
        setFlowData(data);
      } catch (err) {
        console.error('Error loading energy flow data:', err);
        setError('Failed to load energy flow visualization');
      } finally {
        setLoading(false);
      }
    };

    loadData();
    const interval = setInterval(loadData, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, [siteId]);

  if (error) {
    return (
      <Card className={className}>
        {!hideHeader && (
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
        )}
        <CardContent className="flex items-center justify-center p-6 text-center">
          <div>
            <p className="text-red-500">{error}</p>
            <button 
              className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-md"
              onClick={() => {
                setLoading(true);
                fetchEnergyFlowData(siteId)
                  .then(data => {
                    setFlowData(data);
                    setError(null);
                  })
                  .catch(err => {
                    setError('Failed to load energy flow visualization');
                    console.error(err);
                  })
                  .finally(() => setLoading(false));
              }}
            >
              Retry
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      {!hideHeader && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        {loading && !flowData ? (
          <div className="flex items-center justify-center h-80">
            <LoadingSpinner size="lg" text="Loading energy flow data..." />
          </div>
        ) : (
          <div className="w-full h-80">
            {flowData && (
              <EnergyFlowChart 
                nodes={flowData.nodes} 
                connections={flowData.connections} 
                animationDelay="0.5s"
              />
            )}
          </div>
        )}
        
        {flowData && (
          <div className="grid grid-cols-3 gap-4 mt-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">Generation</p>
              <p className="text-lg font-semibold">{flowData.totalGeneration.toFixed(1)} kW</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Consumption</p>
              <p className="text-lg font-semibold">{flowData.totalConsumption.toFixed(1)} kW</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Battery</p>
              <p className="text-lg font-semibold">{flowData.batteryPercentage}%</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedEnergyFlow;
