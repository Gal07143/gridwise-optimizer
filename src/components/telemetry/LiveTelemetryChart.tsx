
import React from 'react';
import { useTelemetryHistory } from '@/hooks/useTelemetryHistory';
import TelemetryChart from './TelemetryChart';
import { formatTelemetryData } from './telemetryUtils';

export type TelemetryMetric = 'power' | 'voltage' | 'current' | 'temperature' | 'state_of_charge' | string;

export interface LiveTelemetryChartProps {
  deviceId: string;
  metric: TelemetryMetric;
  unit: string;
  height?: number;
  showSource?: boolean;
}

const LiveTelemetryChart: React.FC<LiveTelemetryChartProps> = ({ 
  deviceId, 
  metric, 
  unit, 
  height = 200,
  showSource = false
}) => {
  const { data: telemetry, isLoading, error, refetch } = useTelemetryHistory({
    deviceId,
    parameter: metric,
    timeRange: '24h', // Adding the missing required parameter
    interval: '1h'    // Adding missing required parameter
  });
  
  // Format the data for the chart
  const formattedData = telemetry ? formatTelemetryData(telemetry) : [];

  // Convert error to proper Error object if it's a string
  const errorObject = error ? (error instanceof Error ? error : new Error(String(error))) : undefined;
  
  return (
    <TelemetryChart
      data={formattedData}
      metric={metric}
      unit={unit}
      height={height}
      showSource={showSource}
      loading={isLoading}
      error={errorObject}
    />
  );
};

export default LiveTelemetryChart;
