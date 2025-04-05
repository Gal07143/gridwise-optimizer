import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EnergyReading } from '@/types/energy';

export interface TelemetryMetric {
  name: string;
  unit: string;
  color: string;
  valueFormatter?: (value: number) => string;
}

export interface LiveTelemetryChartProps {
  deviceId: string;
  title?: string;
  height?: number;
  metric?: TelemetryMetric;
  className?: string;
  refreshInterval?: number;
}

export interface TelemetryData {
  timestamp: string;
  value: number;
  readings?: EnergyReading[];
  latestValue?: number;
}

const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

const LiveTelemetryChart: React.FC<LiveTelemetryChartProps> = ({
  deviceId,
  title = 'Live Power',
  height = 300,
  metric = {
    name: 'power',
    unit: 'W',
    color: '#10b981',
    valueFormatter: (value: number) => `${value.toFixed(1)} W`
  },
  className,
  refreshInterval = 5000
}) => {
  const [data, setData] = useState<TelemetryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchTelemetry = async () => {
    try {
      const mockData = Array.from({ length: 10 }).map((_, i) => ({
        timestamp: new Date(Date.now() - (9 - i) * 30000).toISOString(),
        value: Math.random() * 1000 + 500
      }));
      
      setData(prev => {
        const newData = [...prev, ...mockData];
        return newData.slice(-20);
      });
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching telemetry data:', err);
      setError('Failed to fetch telemetry data');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
    
    const intervalId = setInterval(() => {
      fetchTelemetry();
    }, refreshInterval);
    
    return () => clearInterval(intervalId);
  }, [deviceId, refreshInterval]);

  const latestValue = useMemo(() => {
    if (data.length === 0) return null;
    
    if (data[data.length - 1].readings) {
      return data[data.length - 1].readings?.[0]?.value;
    }
    
    if (data[data.length - 1].latestValue !== undefined) {
      return data[data.length - 1].latestValue;
    }
    
    return data[data.length - 1].value;
  }, [data]);

  if (loading && data.length === 0) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center" style={{ height }}>
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error && data.length === 0) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center" style={{ height }}>
          <div className="text-center text-muted-foreground">
            <p>Failed to load telemetry data</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => {
                setLoading(true);
                setError(null);
                fetchTelemetry();
              }}
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        {latestValue !== null && (
          <div className="flex items-center text-lg font-bold">
            {typeof metric.valueFormatter === 'function' 
              ? metric.valueFormatter(latestValue) 
              : `${latestValue} ${metric.unit}`}
            {loading && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
          </div>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <div style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,100,100,0.1)" />
              <XAxis 
                dataKey="timestamp" 
                tick={{ fontSize: 12 }} 
                tickFormatter={formatTimestamp}
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                domain={['auto', 'auto']}
                tickFormatter={(value) => `${value} ${metric.unit}`}
              />
              <Tooltip 
                formatter={(value) => [
                  `${value} ${metric.unit}`, 
                  metric.name
                ]} 
                labelFormatter={(label) => formatTimestamp(label as string)}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={metric.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveTelemetryChart;
