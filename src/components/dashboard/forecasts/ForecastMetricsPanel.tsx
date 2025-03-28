
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
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 mt-2 mb-6">
      <div className="bg-white dark:bg-gridx-dark-gray/80 p-3 rounded-lg border border-gray-100 dark:border-gray-700/30 transition-all duration-300 hover:shadow-sm">
        <div className="text-xs text-gridx-gray dark:text-gray-400">Forecast Production</div>
        <div className="text-lg font-semibold text-gridx-green">{metrics.totalGeneration.toFixed(1)} kWh</div>
      </div>
      <div className="bg-white dark:bg-gridx-dark-gray/80 p-3 rounded-lg border border-gray-100 dark:border-gray-700/30 transition-all duration-300 hover:shadow-sm">
        <div className="text-xs text-gridx-gray dark:text-gray-400">Forecast Consumption</div>
        <div className="text-lg font-semibold text-gridx-purple">{metrics.totalConsumption.toFixed(1)} kWh</div>
      </div>
      <div className="bg-white dark:bg-gridx-dark-gray/80 p-3 rounded-lg border border-gray-100 dark:border-gray-700/30 transition-all duration-300 hover:shadow-sm">
        <div className="text-xs text-gridx-gray dark:text-gray-400">Net Energy</div>
        <div className={`text-lg font-semibold ${metrics.netEnergy >= 0 ? 'text-gridx-green' : 'text-gridx-red'}`}>
          {metrics.netEnergy > 0 ? '+' : ''}{metrics.netEnergy.toFixed(1)} kWh
        </div>
      </div>
      <div className="bg-white dark:bg-gridx-dark-gray/80 p-3 rounded-lg border border-gray-100 dark:border-gray-700/30 transition-all duration-300 hover:shadow-sm">
        <div className="text-xs text-gridx-gray dark:text-gray-400">Peak Times</div>
        <div className="flex justify-between">
          <div className="text-xs">
            <span className="text-gridx-green">Gen: </span>
            <span className="font-medium">{metrics.peakGeneration.toFixed(1)} kW</span>
          </div>
          <div className="text-xs">
            <span className="text-gridx-purple">Use: </span>
            <span className="font-medium">{metrics.peakConsumption.toFixed(1)} kW</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForecastMetricsPanel;
