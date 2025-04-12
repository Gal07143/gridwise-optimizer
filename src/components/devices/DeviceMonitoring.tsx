import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Activity, AlertTriangle, Battery, Zap } from 'lucide-react';
import { format } from 'date-fns';
import { useWebSocket } from '@/hooks/useWebSocket';

interface DeviceMetrics {
  timestamp: string;
  power: number;
  energy: number;
  voltage: number;
  current: number;
  temperature: number;
  efficiency: number;
}

interface DeviceAlert {
  id: string;
  deviceId: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: string;
}

interface DeviceMonitoringProps {
  deviceId: string;
}

const DeviceMonitoring: React.FC<DeviceMonitoringProps> = ({ deviceId }) => {
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('1h');
  const [metrics, setMetrics] = useState<DeviceMetrics[]>([]);
  const [alerts, setAlerts] = useState<DeviceAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { lastMessage, sendMessage } = useWebSocket(
    `ws://your-api-endpoint/devices/${deviceId}/metrics`
  );

  useEffect(() => {
    // Load historical data based on time range
    const loadMetrics = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/devices/${deviceId}/metrics?timeRange=${timeRange}`
        );
        const data = await response.json();
        setMetrics(data);
      } catch (err) {
        setError('Failed to load metrics');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadMetrics();
  }, [deviceId, timeRange]);

  useEffect(() => {
    if (lastMessage) {
      try {
        const data = JSON.parse(lastMessage);
        setMetrics((prev) => [...prev.slice(-99), data]);
      } catch (err) {
        console.error('Failed to parse WebSocket message:', err);
      }
    }
  }, [lastMessage]);

  const getAlertBadge = (type: DeviceAlert['type']) => {
    switch (type) {
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'warning':
        return <Badge variant="warning">Warning</Badge>;
      case 'info':
        return <Badge variant="secondary">Info</Badge>;
    }
  };

  if (error) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="text-center text-red-500">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Device Monitoring</h2>
        <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1h">Last Hour</SelectItem>
            <SelectItem value="24h">Last 24 Hours</SelectItem>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Power Output</p>
                <p className="text-2xl font-bold">
                  {metrics[metrics.length - 1]?.power.toFixed(2)} kW
                </p>
              </div>
              <Zap className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Energy Today</p>
                <p className="text-2xl font-bold">
                  {metrics[metrics.length - 1]?.energy.toFixed(2)} kWh
                </p>
              </div>
              <Battery className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Efficiency</p>
                <p className="text-2xl font-bold">
                  {metrics[metrics.length - 1]?.efficiency.toFixed(1)}%
                </p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Temperature</p>
                <p className="text-2xl font-bold">
                  {metrics[metrics.length - 1]?.temperature.toFixed(1)}°C
                </p>
              </div>
              <AlertTriangle
                className={`h-8 w-8 ${
                  metrics[metrics.length - 1]?.temperature > 75
                    ? 'text-red-500'
                    : metrics[metrics.length - 1]?.temperature > 60
                    ? 'text-yellow-500'
                    : 'text-green-500'
                }`}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Card>
        <CardHeader>
          <CardTitle>Power Output Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics}>
                <defs>
                  <linearGradient id="power" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(value) => format(new Date(value), 'HH:mm')}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(value) =>
                    format(new Date(value), 'yyyy-MM-dd HH:mm:ss')
                  }
                />
                <Area
                  type="monotone"
                  dataKey="power"
                  stroke="#0ea5e9"
                  fillOpacity={1}
                  fill="url(#power)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Voltage & Current</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={(value) => format(new Date(value), 'HH:mm')}
                  />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip
                    labelFormatter={(value) =>
                      format(new Date(value), 'yyyy-MM-dd HH:mm:ss')
                    }
                  />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="voltage"
                    stroke="#2563eb"
                    name="Voltage (V)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="current"
                    stroke="#16a34a"
                    name="Current (A)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Temperature & Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={(value) => format(new Date(value), 'HH:mm')}
                  />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip
                    labelFormatter={(value) =>
                      format(new Date(value), 'yyyy-MM-dd HH:mm:ss')
                    }
                  />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="temperature"
                    stroke="#dc2626"
                    name="Temperature (°C)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="efficiency"
                    stroke="#eab308"
                    name="Efficiency (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No recent alerts
              </p>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between border-b py-2 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    {getAlertBadge(alert.type)}
                    <span>{alert.message}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(alert.timestamp), 'MMM d, HH:mm')}
                  </span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeviceMonitoring; 