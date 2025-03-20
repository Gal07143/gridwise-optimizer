
import React from 'react';

interface ForecastMetrics {
  totalGeneration: number;
  totalConsumption: number;
  netEnergy: number; // Required here
  peakGeneration: number;
  peakConsumption: number;
  confidence?: number;
}

interface ForecastMetricsPanelProps {
  metrics: ForecastMetrics;
}

const ForecastMetricsPanel = ({ metrics }: ForecastMetricsPanelProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 mt-2 mb-4">
      <div className="glass-panel p-2 rounded-lg">
        <div className="text-xs text-muted-foreground">Forecast Production</div>
        <div className="text-lg font-semibold">{metrics.totalGeneration.toFixed(1)} kWh</div>
      </div>
      <div className="glass-panel p-2 rounded-lg">
        <div className="text-xs text-muted-foreground">Forecast Consumption</div>
        <div className="text-lg font-semibold">{metrics.totalConsumption.toFixed(1)} kWh</div>
      </div>
      <div className="glass-panel p-2 rounded-lg">
        <div className="text-xs text-muted-foreground">Net Energy</div>
        <div className={`text-lg font-semibold ${metrics.netEnergy >= 0 ? 'text-energy-green' : 'text-energy-red'}`}>
          {metrics.netEnergy > 0 ? '+' : ''}{metrics.netEnergy.toFixed(1)} kWh
        </div>
      </div>
      <div className="glass-panel p-2 rounded-lg">
        <div className="text-xs text-muted-foreground">Peak Times</div>
        <div className="flex justify-between">
          <div className="text-xs">
            <span className="text-energy-green">Gen: </span>
            <span className="font-medium">{metrics.peakGeneration.toFixed(1)} kW</span>
          </div>
          <div className="text-xs">
            <span className="text-energy-purple">Use: </span>
            <span className="font-medium">{metrics.peakConsumption.toFixed(1)} kW</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForecastMetricsPanel;
