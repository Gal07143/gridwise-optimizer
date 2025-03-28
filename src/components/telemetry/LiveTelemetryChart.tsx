
import React from 'react';
import { useTelemetryHistory } from '@/hooks/useTelemetryHistory';
import TelemetryChart from './TelemetryChart';
import { formatTelemetryData } from './telemetryUtils';

interface LiveTelemetryChartProps {
  deviceId: string;
  metric: 'power' | 'voltage' | 'current' | 'temperature' | 'state_of_charge';
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
  const { data, loading, error } = useTelemetryHistory(deviceId, 60); // last 60 minutes
  
  // Format the data for the chart
  const formattedData = formatTelemetryData(data, metric);

  return (
    <TelemetryChart
      data={formattedData}
      metric={metric}
      unit={unit}
      height={height}
      showSource={showSource}
      loading={loading}
      error={error}
    />
  );
};

export default LiveTelemetryChart;
