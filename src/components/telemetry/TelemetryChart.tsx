
import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { format, parseISO } from 'date-fns';
import { Loader2, AlertCircle } from 'lucide-react';
import { getMetricColor } from './telemetryUtils';
import { TelemetryMetric } from './LiveTelemetryChart';

interface ChartData {
  timestamp: string;
  value: number;
}

interface TelemetryChartProps {
  data: ChartData[];
  metric: TelemetryMetric;
  unit: string;
  height?: number;
  loading?: boolean;
  error?: Error | null;
  showSource?: boolean;
}

const TelemetryChart: React.FC<TelemetryChartProps> = ({
  data,
  metric,
  unit,
  height = 200,
  loading = false,
  error = null,
  showSource = false
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="mt-2 text-sm text-muted-foreground">Loading telemetry data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="flex flex-col items-center text-center">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <span className="mt-2 text-sm font-medium text-destructive">Error loading data</span>
          <span className="text-xs text-muted-foreground mt-1 max-w-xs">
            {error.message}
          </span>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="flex flex-col items-center text-center">
          <span className="text-sm text-muted-foreground">No data available</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height, width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
          <XAxis
            dataKey="timestamp"
            tickFormatter={(timestamp) => {
              const date = parseISO(timestamp);
              return format(date, 'HH:mm');
            }}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            unit={` ${unit}`}
            tick={{ fontSize: 12 }}
            width={45}
          />
          <Tooltip
            formatter={(value: number) => [`${value} ${unit}`, metric]}
            labelFormatter={(timestamp) => {
              const date = parseISO(timestamp);
              return format(date, 'dd MMM yyyy, HH:mm:ss');
            }}
            contentStyle={{
              backgroundColor: 'var(--background)',
              borderColor: 'var(--border)',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
            }}
          />
          {showSource && <Legend />}
          <Line
            type="monotone"
            dataKey="value"
            stroke={getMetricColor(metric)}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5 }}
            name={metric.charAt(0).toUpperCase() + metric.slice(1).replace('_', ' ')}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TelemetryChart;
