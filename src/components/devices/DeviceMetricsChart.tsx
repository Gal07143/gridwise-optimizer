import React, { useState, useEffect, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { fetchDeviceMetrics } from '@/lib/api';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

interface DeviceMetricsChartProps {
  deviceId: string;
}

type ChartType = 'line' | 'area' | 'composed';
type TimeRange = '24h' | '7d' | '30d';

const DeviceMetricsChart: React.FC<DeviceMetricsChartProps> = ({ deviceId }) => {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  const [chartType, setChartType] = useState<ChartType>('line');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['temperature', 'humidity']);

  const availableMetrics = useMemo(() => [
    { id: 'temperature', name: 'Temperature', color: '#8884d8' },
    { id: 'humidity', name: 'Humidity', color: '#82ca9d' },
    { id: 'pressure', name: 'Pressure', color: '#ffc658' },
    { id: 'voltage', name: 'Voltage', color: '#ff7300' },
  ], []);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        setLoading(true);
        const data = await fetchDeviceMetrics(deviceId, timeRange);
        setMetrics(data);
        setError(null);
      } catch (err) {
        setError('Failed to load metrics data');
        console.error('Error loading metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, [deviceId, timeRange]);

  const formatXAxis = (tickItem: string) => {
    return format(new Date(tickItem), timeRange === '24h' ? 'HH:mm' : 'MMM dd');
  };

  const renderChart = () => {
    const ChartComponent = chartType === 'line' ? LineChart : 
                          chartType === 'area' ? LineChart : 
                          ComposedChart;

    return (
      <ResponsiveContainer width="100%" height={400}>
        <ChartComponent data={metrics}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={formatXAxis}
            interval="preserveStartEnd"
          />
          <YAxis />
          <Tooltip
            labelFormatter={(label) => format(new Date(label), 'PPpp')}
            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
          />
          <Legend />
          {selectedMetrics.map((metricId) => {
            const metric = availableMetrics.find(m => m.id === metricId);
            if (!metric) return null;

            return chartType === 'area' ? (
              <Area
                key={metric.id}
                type="monotone"
                dataKey={metric.id}
                name={metric.name}
                stroke={metric.color}
                fill={metric.color}
                fillOpacity={0.3}
              />
            ) : (
              <Line
                key={metric.id}
                type="monotone"
                dataKey={metric.id}
                name={metric.name}
                stroke={metric.color}
                dot={false}
              />
            );
          })}
        </ChartComponent>
      </ResponsiveContainer>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Device Metrics</CardTitle>
        <div className="flex flex-wrap gap-4">
          <Select value={timeRange} onValueChange={(value: TimeRange) => setTimeRange(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>

          <Select value={chartType} onValueChange={(value: ChartType) => setChartType(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select chart type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="line">Line Chart</SelectItem>
              <SelectItem value="area">Area Chart</SelectItem>
              <SelectItem value="composed">Composed Chart</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex flex-wrap gap-2">
            {availableMetrics.map((metric) => (
              <Button
                key={metric.id}
                variant={selectedMetrics.includes(metric.id) ? "default" : "outline"}
                onClick={() => {
                  setSelectedMetrics(prev =>
                    prev.includes(metric.id)
                      ? prev.filter(id => id !== metric.id)
                      : [...prev, metric.id]
                  );
                }}
                className="h-8"
              >
                {metric.name}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[400px] text-red-500">
            {error}
          </div>
        ) : (
          renderChart()
        )}
      </CardContent>
    </Card>
  );
};

export default DeviceMetricsChart; 