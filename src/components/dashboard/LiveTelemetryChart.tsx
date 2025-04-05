
import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface LiveTelemetryChartProps {
  deviceId: string;
  metric?: string;
  unit?: string;
  height?: number;
  showCard?: boolean;
  title?: string;
}

interface TelemetryData {
  timestamp: string;
  value: number;
  formattedTime?: string;
  readings?: any[];
  latestValue?: number;
  [key: string]: any; // Allow for dynamic properties
}

const LiveTelemetryChart: React.FC<LiveTelemetryChartProps> = ({
  deviceId,
  metric = 'power',
  unit = 'W',
  height = 300,
  showCard = false,
  title,
}) => {
  const [data, setData] = useState<TelemetryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [latestValue, setLatestValue] = useState<number | null>(null);

  useEffect(() => {
    // Mock function to simulate telemetry data
    const fetchTelemetryData = async () => {
      try {
        setLoading(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Generate mock data
        const now = new Date();
        const mockData: TelemetryData[] = [];
        
        for (let i = 12; i >= 0; i--) {
          const timestamp = new Date(now.getTime() - i * 5 * 60000); // 5 minutes intervals
          mockData.push({
            timestamp: timestamp.toISOString(),
            formattedTime: format(timestamp, 'HH:mm'),
            value: Math.floor(Math.random() * 1000) + 500, // Random value between 500-1500
          });
        }
        
        setData(mockData);
        setLatestValue(mockData[mockData.length - 1].value);
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching telemetry data:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch telemetry data'));
        setLoading(false);
      }
    };
    
    fetchTelemetryData();
    
    // Set up polling interval
    const intervalId = setInterval(fetchTelemetryData, 60000); // Update every minute
    
    return () => clearInterval(intervalId);
  }, [deviceId, metric]);

  const renderChart = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <Skeleton className="h-[200px] w-full" />
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-red-500">Error loading telemetry data: {error.message}</p>
        </div>
      );
    }
    
    if (!data || data.length === 0) {
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">No telemetry data available</p>
        </div>
      );
    }
    
    // Access readings and latestValue safely using optional chaining
    const chartData = data.map(item => ({
      ...item,
      readings: item.readings || [],
      latestValue: item.latestValue || item.value
    }));
    
    return (
      <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={chartData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="formattedTime" 
            tick={{ fontSize: 12 }}
          />
          <YAxis
            width={40}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `${value}`}
            domain={['auto', 'auto']}
          />
          <Tooltip
            formatter={(value: any) => [`${value} ${unit}`, metric]}
            labelFormatter={(label) => `Time: ${label}`}
          />
          <ReferenceLine y={0} stroke="#666" />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ stroke: '#2563eb', strokeWidth: 1, fill: '#2563eb', r: 3 }}
            activeDot={{ r: 5, stroke: '#2563eb', strokeWidth: 1, fill: '#2563eb' }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  const chartContent = renderChart();
  
  if (showCard) {
    return (
      <Card className="w-full h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{title || `${metric.charAt(0).toUpperCase() + metric.slice(1)} Telemetry`}</CardTitle>
        </CardHeader>
        <CardContent>
          {latestValue !== null && (
            <div className="mb-4">
              <span className="text-2xl font-bold">
                {latestValue} {unit}
              </span>
            </div>
          )}
          {chartContent}
        </CardContent>
      </Card>
    );
  }
  
  return chartContent;
};

export default LiveTelemetryChart;
