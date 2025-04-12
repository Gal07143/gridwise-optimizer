import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDevices } from '@/contexts/DeviceContext';
import { Device, TelemetryData } from '@/contexts/DeviceContext';
import { toast } from 'react-hot-toast';
import {
  Activity,
  AlertCircle,
  ArrowRight,
  BarChart2,
  Clock,
  RefreshCw,
  Server,
  Zap,
} from 'lucide-react';

interface AnalyticsStats {
  totalDevices: number;
  onlineDevices: number;
  offlineDevices: number;
  activeAlerts: number;
  averageUptime: number;
}

interface DeviceTypeStats {
  type: string;
  count: number;
  percentage: number;
}

interface ProtocolStats {
  protocol: string;
  count: number;
  percentage: number;
}

interface TelemetryStats {
  deviceId: string;
  deviceName: string;
  lastUpdate: string;
  dataPoints: number;
}

/**
 * StatsCard component for displaying analytics statistics
 */
const StatsCard: React.FC<{
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}> = ({ title, value, description, icon, trend }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
      {trend && (
        <div className={`mt-2 text-xs ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
        </div>
      )}
    </CardContent>
  </Card>
);

/**
 * DeviceTypeChart component for displaying device type distribution
 */
const DeviceTypeChart: React.FC<{ stats: DeviceTypeStats[] }> = ({ stats }) => (
  <Card>
    <CardHeader>
      <CardTitle>Device Types</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {stats.map((stat) => (
          <div key={stat.type} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Server className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{stat.type}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">{stat.count}</span>
              <span className="text-sm font-medium">{stat.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

/**
 * ProtocolChart component for displaying protocol distribution
 */
const ProtocolChart: React.FC<{ stats: ProtocolStats[] }> = ({ stats }) => (
  <Card>
    <CardHeader>
      <CardTitle>Protocols</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {stats.map((stat) => (
          <div key={stat.protocol} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{stat.protocol}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">{stat.count}</span>
              <span className="text-sm font-medium">{stat.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

/**
 * TelemetryStats component for displaying telemetry data statistics
 */
const TelemetryStats: React.FC<{ stats: TelemetryStats[] }> = ({ stats }) => (
  <Card>
    <CardHeader>
      <CardTitle>Telemetry Data</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {stats.map((stat) => (
          <div key={stat.deviceId} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{stat.deviceName}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">{stat.dataPoints} points</span>
              <span className="text-sm font-medium">
                {new Date(stat.lastUpdate).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

/**
 * TimeRangeSelector component for selecting the time range for analytics
 */
const TimeRangeSelector: React.FC<{
  selectedRange: string;
  onRangeChange: (range: string) => void;
}> = ({ selectedRange, onRangeChange }) => (
  <div className="flex space-x-2">
    {['1h', '6h', '24h', '7d', '30d'].map((range) => (
      <Button
        key={range}
        variant={selectedRange === range ? 'default' : 'outline'}
        size="sm"
        onClick={() => onRangeChange(range)}
      >
        {range}
      </Button>
    ))}
  </div>
);

/**
 * Analytics component for displaying system analytics and statistics
 */
const Analytics: React.FC = () => {
  const navigate = useNavigate();
  const { devices, deviceTelemetry, fetchDevices } = useDevices();
  const [stats, setStats] = useState<AnalyticsStats>({
    totalDevices: 0,
    onlineDevices: 0,
    offlineDevices: 0,
    activeAlerts: 0,
    averageUptime: 0,
  });
  const [deviceTypeStats, setDeviceTypeStats] = useState<DeviceTypeStats[]>([]);
  const [protocolStats, setProtocolStats] = useState<ProtocolStats[]>([]);
  const [telemetryStats, setTelemetryStats] = useState<TelemetryStats[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const calculateStats = (devices: Device[]) => {
    const onlineDevices = devices.filter((device) => device.status === 'online');
    const offlineDevices = devices.filter((device) => device.status === 'offline');
    const totalDevices = devices.length;
    const activeAlerts = devices.filter((device) => device.status === 'offline').length;
    const averageUptime = totalDevices > 0 ? (onlineDevices.length / totalDevices) * 100 : 0;

    setStats({
      totalDevices,
      onlineDevices: onlineDevices.length,
      offlineDevices: offlineDevices.length,
      activeAlerts,
      averageUptime: Math.round(averageUptime),
    });

    // Calculate device type distribution
    const typeCount = devices.reduce((acc, device) => {
      acc[device.type] = (acc[device.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const deviceTypeStats = Object.entries(typeCount).map(([type, count]) => ({
      type,
      count,
      percentage: Math.round((count / totalDevices) * 100),
    }));

    setDeviceTypeStats(deviceTypeStats);

    // Calculate protocol distribution
    const protocolCount = devices.reduce((acc, device) => {
      acc[device.protocol] = (acc[device.protocol] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const protocolStats = Object.entries(protocolCount).map(([protocol, count]) => ({
      protocol,
      count,
      percentage: Math.round((count / totalDevices) * 100),
    }));

    setProtocolStats(protocolStats);
  };

  const calculateTelemetryStats = (telemetry: Record<string, TelemetryData[]>) => {
    const stats = Object.entries(telemetry).map(([deviceId, data]) => {
      const device = devices.find((d) => d.id === deviceId);
      return {
        deviceId,
        deviceName: device?.name || 'Unknown Device',
        lastUpdate: data[0]?.timestamp || new Date().toISOString(),
        dataPoints: data.length,
      };
    });

    setTelemetryStats(stats);
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await fetchDevices();
      toast.success('Analytics data refreshed');
    } catch (error) {
      toast.error('Failed to refresh analytics data');
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (devices) {
      calculateStats(devices);
    }
  }, [devices]);

  useEffect(() => {
    if (deviceTelemetry) {
      calculateTelemetryStats(deviceTelemetry);
    }
  }, [deviceTelemetry, devices]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <div className="flex items-center space-x-4">
          <TimeRangeSelector
            selectedRange={selectedTimeRange}
            onRangeChange={setSelectedTimeRange}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Devices"
          value={stats.totalDevices}
          description="All registered devices"
          icon={<Server className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Online Devices"
          value={stats.onlineDevices}
          description="Currently active devices"
          icon={<Zap className="h-4 w-4 text-green-500" />}
          trend={{ value: stats.averageUptime, isPositive: true }}
        />
        <StatsCard
          title="Offline Devices"
          value={stats.offlineDevices}
          description="Inactive devices"
          icon={<AlertCircle className="h-4 w-4 text-red-500" />}
        />
        <StatsCard
          title="Active Alerts"
          value={stats.activeAlerts}
          description="Current alerts"
          icon={<BarChart2 className="h-4 w-4 text-yellow-500" />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <DeviceTypeChart stats={deviceTypeStats} />
        <ProtocolChart stats={protocolStats} />
      </div>

      <TelemetryStats stats={telemetryStats} />
    </div>
  );
};

export default Analytics; 