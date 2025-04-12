
import React from 'react';
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
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatValueWithUnit } from './telemetryUtils';

interface TelemetryChartProps {
  data: any[];
  metric: string;
  unit: string;
  height?: number;
  showSource?: boolean;
  loading?: boolean;
  error?: Error;
}

const TelemetryChart: React.FC<TelemetryChartProps> = ({
  data,
  metric,
  unit,
  height = 200,
  showSource = false,
  loading = false,
  error
}) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const formatValue = (value: number) => {
    return formatValueWithUnit(value, unit);
  };

  if (error) {
    return (
      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-lg font-medium flex items-center">
            {metric.charAt(0).toUpperCase() + metric.slice(1)} Telemetry
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[200px] text-center">
          <div>
            <p className="text-red-500 mb-2">Failed to load telemetry data</p>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading && (!data || data.length === 0)) {
    return (
      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-lg font-medium">
            {metric.charAt(0).toUpperCase() + metric.slice(1)} Telemetry
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[200px]">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle className="text-lg font-medium flex justify-between items-center">
          <span>{metric.charAt(0).toUpperCase() + metric.slice(1)} Telemetry</span>
          {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height: `${height}px` }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={formatTime}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tickFormatter={formatValue}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleString()}
                formatter={(value: any) => [formatValueWithUnit(value, unit), metric]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                name={`${metric.charAt(0).toUpperCase() + metric.slice(1)} (${unit})`}
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TelemetryChart;
