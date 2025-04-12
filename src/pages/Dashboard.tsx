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
  activeDevices: number;
  offlineDevices: number;
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
  const { devices, loading, error } = useDevices();
  const [stats, setStats] = useState<DashboardStats>({
    totalDevices: 0,
    activeDevices: 0,
    offlineDevices: 0,
    averageUptime: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (devices) {
      const active = devices.filter(d => d.status === 'online').length;
      const offline = devices.filter(d => d.status === 'offline').length;
      const uptime = devices.reduce((acc, d) => acc + (d.last_seen ? 100 : 0), 0) / devices.length;

      setStats({
        totalDevices: devices.length,
        activeDevices: active,
        offlineDevices: offline,
        averageUptime: uptime,
      });
    }
  }, [devices]);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      // Refresh logic here
      toast.success('Dashboard refreshed successfully');
    } catch (err) {
      toast.error('Failed to refresh dashboard');
    } finally {
      setIsRefreshing(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button onClick={handleRefresh}>Refresh</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <h3 className="text-lg font-semibold">Total Devices</h3>
          <p className="text-2xl">{stats.totalDevices}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold">Active Devices</h3>
          <p className="text-2xl text-green-600">{stats.activeDevices}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold">Offline Devices</h3>
          <p className="text-2xl text-red-600">{stats.offlineDevices}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold">Average Uptime</h3>
          <p className="text-2xl">{stats.averageUptime.toFixed(1)}%</p>
        </Card>
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