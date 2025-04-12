
import React from 'react';
import { Cloud, CloudSun, Droplets, Lightbulb } from 'lucide-react';
import { ForecastMetrics } from '@/hooks/useForecast';

interface ForecastMetricsPanelProps {
  metrics: ForecastMetrics;
}

const MetricBox = ({ 
  icon, 
  value, 
  label, 
  unit = 'kWh',
  iconColor = 'text-blue-500' 
}: { 
  icon: React.ReactNode; 
  value: number; 
  label: string; 
  unit?: string;
  iconColor?: string;
}) => (
  <div className="bg-card border rounded-lg p-3 flex items-center space-x-3">
    <div className={`p-2 rounded-full bg-muted/50 ${iconColor}`}>
      {icon}
    </div>
    <div>
      <p className="text-xl font-semibold">
        {value.toLocaleString(undefined, { maximumFractionDigits: 1 })} 
        <span className="text-xs ml-1 text-muted-foreground">{unit}</span>
      </p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  </div>
);

const ForecastMetricsPanel = ({ metrics }: ForecastMetricsPanelProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
      <MetricBox
        icon={<Cloud size={18} />}
        value={metrics.totalGeneration}
        label="Generation"
        iconColor="text-yellow-500"
      />
      <MetricBox
        icon={<Lightbulb size={18} />}
        value={metrics.totalConsumption}
        label="Consumption"
        iconColor="text-green-500"
      />
      <MetricBox
        icon={<CloudSun size={18} />} 
        value={metrics.selfConsumptionRate}
        label="Self-Consumption"
        unit="%"
        iconColor="text-purple-500"
      />
      <MetricBox
        icon={<Droplets size={18} />}
        value={Math.abs(metrics.netEnergy)}
        label={metrics.netEnergy >= 0 ? "Energy Surplus" : "Energy Deficit"}
        iconColor={metrics.netEnergy >= 0 ? "text-emerald-500" : "text-red-500"}
      />
    </div>
  );
};

export default ForecastMetricsPanel;
