
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLiveTelemetry } from '@/hooks/useLiveTelemetry';

export type TelemetryMetric = 'power' | 'current' | 'voltage' | 'temperature' | 'state_of_charge' | 'energy';

export interface LiveTelemetryChartProps {
  deviceId: string;
  metric: TelemetryMetric;
  height: number;
  title?: string;
  unit?: string;
}

const metricUnits = {
  power: 'W',
  current: 'A',
  voltage: 'V',
  temperature: '°C',
  state_of_charge: '%',
  energy: 'kWh'
};

const metricColors = {
  power: '#10b981',
  current: '#6366f1',
  voltage: '#f59e0b',
  temperature: '#ef4444',
  state_of_charge: '#8b5cf6',
  energy: '#0ea5e9'
};

const LiveTelemetryChart: React.FC<LiveTelemetryChartProps> = ({
  deviceId,
  metric,
  height,
  title,
  unit = metricUnits[metric]
}) => {
  const { data, isLoading, error } = useLiveTelemetry(deviceId, metric);
  
  // Error state
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title || `${metric.charAt(0).toUpperCase() + metric.slice(1)}`}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40 text-muted-foreground">
            Error loading data: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title || `${metric.charAt(0).toUpperCase() + metric.slice(1)}`}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40 animate-pulse bg-muted rounded-md"></div>
        </CardContent>
      </Card>
    );
  }
  
  // Format data for chart
  const chartData = data.map(point => ({
    timestamp: new Date(point.timestamp).toLocaleTimeString(),
    value: point.value
  }));
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title || `${metric.charAt(0).toUpperCase() + metric.slice(1)}`}</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height: height || 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tick={{ fontSize: 12 }}
                tickFormatter={(val) => {
                  return val.split(':')[0] + ':' + val.split(':')[1];
                }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                unit={unit ? ` ${unit}` : ''}
              />
              <Tooltip
                formatter={(value: number) => [`${value} ${unit}`, metric]}
                labelFormatter={(label) => `Time: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={metricColors[metric] || '#8884d8'}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveTelemetryChart;
