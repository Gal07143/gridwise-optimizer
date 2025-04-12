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

interface DashboardStats {
  totalDevices: number;
  onlineDevices: number;
  offlineDevices: number;
  activeAlerts: number;
  averageUptime: number;
}

interface RecentActivity {
  id: string;
  deviceId: string;
  deviceName: string;
  type: 'status_change' | 'telemetry' | 'alert';
  message: string;
  timestamp: string;
}

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

const ActivityItem: React.FC<{ activity: RecentActivity }> = ({ activity }) => {
  const getIcon = () => {
    switch (activity.type) {
      case 'status_change':
        return <Server className="h-4 w-4" />;
      case 'telemetry':
        return <Activity className="h-4 w-4" />;
      case 'alert':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center space-x-4 py-2">
      <div className="rounded-full bg-muted p-2">{getIcon()}</div>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium leading-none">{activity.deviceName}</p>
        <p className="text-sm text-muted-foreground">{activity.message}</p>
      </div>
      <div className="text-sm text-muted-foreground">
        {new Date(activity.timestamp).toLocaleTimeString()}
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { devices, fetchDevices } = useDevices();
  const [stats, setStats] = useState<DashboardStats>({
    totalDevices: 0,
    onlineDevices: 0,
    offlineDevices: 0,
    activeAlerts: 0,
    averageUptime: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
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
  };

  const generateRecentActivity = (devices: Device[]) => {
    const activity: RecentActivity[] = devices.map((device) => ({
      id: Math.random().toString(36).substr(2, 9),
      deviceId: device.id,
      deviceName: device.name,
      type: device.status === 'online' ? 'status_change' : 'alert',
      message: `Device ${device.status === 'online' ? 'came online' : 'went offline'}`,
      timestamp: device.last_seen || new Date().toISOString(),
    }));

    setRecentActivity(activity.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ).slice(0, 5));
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await fetchDevices();
      toast.success('Dashboard data refreshed');
    } catch (error) {
      toast.error('Failed to refresh dashboard data');
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (devices) {
      calculateStats(devices);
      generateRecentActivity(devices);
    }
  }, [devices]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
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
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
              {recentActivity.length === 0 && (
                <p className="text-sm text-muted-foreground">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate('/devices')}
              >
                <Server className="mr-2 h-4 w-4" />
                View All Devices
                <ArrowRight className="ml-auto h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate('/analytics')}
              >
                <BarChart2 className="mr-2 h-4 w-4" />
                View Analytics
                <ArrowRight className="ml-auto h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate('/settings')}
              >
                <Clock className="mr-2 h-4 w-4" />
                Configure Settings
                <ArrowRight className="ml-auto h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard; 