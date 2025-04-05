
import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useTelemetryHistory } from '@/hooks/useTelemetryHistory';

export type TelemetryMetric = 'power' | 'voltage' | 'current' | 'temperature' | 'state_of_charge';

export interface LiveTelemetryChartProps {
  deviceId: string;
  metric: TelemetryMetric;
  unit: string;
  height?: number;
  title?: string;
  showLegend?: boolean;
}

const METRIC_COLORS: Record<TelemetryMetric, string> = {
  power: '#10b981',
  voltage: '#3b82f6',
  current: '#f97316',
  temperature: '#ef4444',
  state_of_charge: '#8b5cf6',
};

const UNITS: Record<string, string> = {
  power: 'W',
  voltage: 'V',
  current: 'A',
  temperature: '°C',
  state_of_charge: '%',
  energy: 'kWh'
};

const LiveTelemetryChart: React.FC<LiveTelemetryChartProps> = ({
  deviceId,
  metric,
  unit,
  height = 300,
  title,
  showLegend = false
}) => {
  const { telemetry, isLoading, error } = useTelemetryHistory(deviceId, metric);
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-4">
          <CardTitle>{title || `Live ${metric} data`}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div style={{ height }} className="flex items-center justify-center bg-muted/20">
            <div className="animate-pulse flex flex-col items-center">
              <Activity className="h-10 w-10 text-muted" />
              <p className="mt-2 text-muted-foreground">Loading telemetry data...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="pb-4">
          <CardTitle>{title || `Live ${metric} data`}</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex flex-col items-center justify-center text-center space-y-3" style={{ height: height - 80 }}>
            <AlertCircle className="h-10 w-10 text-destructive" />
            <div>
              <p className="font-medium">Failed to load telemetry data</p>
              <p className="text-sm text-muted-foreground">{error.message}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = telemetry?.readings || [];
  const latestValue = telemetry?.latestValue;
  const displayUnit = unit || UNITS[metric] || '';

  return (
    <Card>
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <CardTitle>{title || `Live ${metric} data`}</CardTitle>
          {latestValue !== undefined && (
            <Badge variant="secondary" className="text-sm py-1">
              Latest: {latestValue} {displayUnit}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 20,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="time"
                tickFormatter={(time) => format(new Date(time), 'HH:mm')}
              />
              <YAxis
                tickFormatter={(value) => `${Math.round(value)}`}
                unit={displayUnit}
              />
              <Tooltip
                formatter={(value: number) => [`${value} ${displayUnit}`, metric]}
                labelFormatter={(time) => format(new Date(time), 'HH:mm:ss')}
              />
              {showLegend && <Legend />}
              <Line
                type="monotone"
                dataKey="value"
                stroke={METRIC_COLORS[metric] || '#3b82f6'}
                name={metric}
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
