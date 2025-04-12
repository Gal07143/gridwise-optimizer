import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { format, subHours } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Device } from '@/types/device';

interface DeviceMonitoringProps {
  device: Device;
}

interface MetricData {
  timestamp: string;
  value: number;
}

const DeviceMonitoring: React.FC<DeviceMonitoringProps> = ({ device }) => {
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h' | '7d'>('1h');
  const [selectedMetric, setSelectedMetric] = useState<'power' | 'efficiency' | 'temperature'>('power');
  const [metricData, setMetricData] = useState<MetricData[]>([]);

  // Generate mock data for the selected time range
  useEffect(() => {
    const generateMockData = () => {
      const now = new Date();
      const data: MetricData[] = [];
      const points = 60; // One point per minute for 1h
      
      for (let i = points; i >= 0; i--) {
        const timestamp = subHours(now, i / points).toISOString();
        let value: number;
        
        switch (selectedMetric) {
          case 'power':
            // Generate power data between 0 and device capacity
            value = Math.random() * device.capacity;
            break;
          case 'efficiency':
            // Generate efficiency data between 85% and 98%
            value = 85 + Math.random() * 13;
            break;
          case 'temperature':
            // Generate temperature data between 25°C and 45°C
            value = 25 + Math.random() * 20;
            break;
          default:
            value = 0;
        }
        
        data.push({ timestamp, value });
      }
      
      setMetricData(data);
    };

    generateMockData();
    // Simulate real-time updates
    const interval = setInterval(generateMockData, 5000);
    
    return () => clearInterval(interval);
  }, [device.capacity, selectedMetric, timeRange]);

  const getMetricUnit = () => {
    switch (selectedMetric) {
      case 'power':
        return 'kW';
      case 'efficiency':
        return '%';
      case 'temperature':
        return '°C';
      default:
        return '';
    }
  };

  const getMetricColor = () => {
    switch (selectedMetric) {
      case 'power':
        return '#3b82f6'; // blue
      case 'efficiency':
        return '#10b981'; // green
      case 'temperature':
        return '#f59e0b'; // amber
      default:
        return '#6b7280'; // gray
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Select
          value={selectedMetric}
          onValueChange={(value: 'power' | 'efficiency' | 'temperature') => 
            setSelectedMetric(value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select metric" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="power">Power Output</SelectItem>
            <SelectItem value="efficiency">Efficiency</SelectItem>
            <SelectItem value="temperature">Temperature</SelectItem>
          </SelectContent>
        </Select>

        <Tabs value={timeRange} onValueChange={(v: '1h' | '6h' | '24h' | '7d') => setTimeRange(v)}>
          <TabsList>
            <TabsTrigger value="1h">1H</TabsTrigger>
            <TabsTrigger value="6h">6H</TabsTrigger>
            <TabsTrigger value="24h">24H</TabsTrigger>
            <TabsTrigger value="7d">7D</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            {selectedMetric === 'power' ? 'Power Output' :
             selectedMetric === 'efficiency' ? 'System Efficiency' :
             'System Temperature'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metricData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(value) => format(new Date(value), 'HH:mm')}
                />
                <YAxis
                  domain={selectedMetric === 'power' ? [0, device.capacity] :
                         selectedMetric === 'efficiency' ? [80, 100] :
                         [20, 50]}
                  unit={getMetricUnit()}
                />
                <Tooltip
                  labelFormatter={(value) => format(new Date(value), 'HH:mm:ss')}
                  formatter={(value: number) => [
                    `${value.toFixed(2)} ${getMetricUnit()}`,
                    selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)
                  ]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  name={selectedMetric === 'power' ? 'Power Output' :
                        selectedMetric === 'efficiency' ? 'Efficiency' :
                        'Temperature'}
                  stroke={getMetricColor()}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Current Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metricData[metricData.length - 1]?.value.toFixed(2)} {getMetricUnit()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(metricData.reduce((acc, curr) => acc + curr.value, 0) / metricData.length).toFixed(2)} {getMetricUnit()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Peak Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.max(...metricData.map(d => d.value)).toFixed(2)} {getMetricUnit()}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DeviceMonitoring; 