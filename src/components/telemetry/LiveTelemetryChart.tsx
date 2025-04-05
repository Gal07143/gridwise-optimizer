
import React from 'react';
import { useTelemetryHistory } from '@/hooks/useTelemetryHistory';
import TelemetryChart from './TelemetryChart';
import { formatTelemetryData } from './telemetryUtils';

export type TelemetryMetric = 'power' | 'voltage' | 'current' | 'temperature' | 'state_of_charge';

export interface LiveTelemetryChartProps {
  deviceId: string;
  metric: TelemetryMetric;
  unit: string;
  height?: number;
  showSource?: boolean;
}

interface Telemetry {
  data: any[];
  timestamps: string[];
  readings?: any[];
  latestValue?: number;
}

const LiveTelemetryChart: React.FC<LiveTelemetryChartProps> = ({ 
  deviceId, 
  metric, 
  unit, 
  height = 200,
  showSource = false
}) => {
  const { telemetry, isLoading, error, refetch } = useTelemetryHistory(deviceId, metric);
  
  // Format the data for the chart
  const formattedData = telemetry?.data ? formatTelemetryData(telemetry.data, metric) : [];

  return (
    <TelemetryChart
      data={formattedData}
      metric={metric}
      unit={unit}
      height={height}
      showSource={showSource}
      loading={isLoading}
      error={error}
    />
  );
};

export default LiveTelemetryChart;
