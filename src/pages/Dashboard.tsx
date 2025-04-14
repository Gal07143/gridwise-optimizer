
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useDevices } from '@/contexts/DeviceContext';
import { toast } from 'react-hot-toast';
import {
  Activity,
  AlertCircle,
  ArrowRight,
  BarChart2,
  Battery,
  BatteryCharging,
  Cable,
  ChevronRight,
  Clock,
  Gauge,
  Home,
  LineChart,
  Lightbulb,
  MonitorSmartphone,
  Mountain,
  Power,
  RefreshCw,
  Server,
  Zap,
  Navigation,
  Thermometer,
  Sun,
  Wifi,
} from 'lucide-react';
import { format } from 'date-fns';

interface DashboardStats {
  totalDevices: number;
  activeDevices: number;
  offlineDevices: number;
  averageUptime: number;
  energyGeneration: number;
  energyConsumption: number;
  gridImport: number;
  gridExport: number;
  batteryLevel: number;
  batteryStatus: 'charging' | 'discharging' | 'idle';
}

interface RecentActivity {
  id: string;
  deviceId: string;
  deviceName: string;
  type: 'status_change' | 'telemetry' | 'alert';
  message: string;
  timestamp: string;
}

const StatusCard: React.FC<{
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}> = ({ title, value, description, icon, iconBg, iconColor, trend }) => (
  <Card>
    <CardHeader className="pb-2">
      <div className="flex justify-between">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`p-2 rounded-lg ${iconBg}`}>
          {React.cloneElement(icon as React.ReactElement, { className: `h-4 w-4 ${iconColor}` })}
        </div>
      </div>
    </CardHeader>
    <CardContent className="pt-1">
      <div className="text-2xl font-bold">{value}</div>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
      {trend && (
        <div className={`mt-2 text-xs flex items-center ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          <span className="text-xs text-muted-foreground ml-1">vs. last period</span>
        </div>
      )}
    </CardContent>
  </Card>
);

const EnergyFlowCard: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Energy Flow</CardTitle>
        <CardDescription className="text-xs">Live energy distribution</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] relative bg-slate-50 dark:bg-slate-900 rounded-md p-4">
          {/* Solar */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
            <div className="bg-amber-100 p-2 rounded-full">
              <Sun className="h-5 w-5 text-amber-500" />
            </div>
            <div className="text-xs font-medium mt-1">Solar</div>
            <div className="text-xs">4.2 kW</div>
            <div className="h-6 w-0.5 bg-amber-300 mt-1"></div>
          </div>
          
          {/* Home */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="bg-blue-100 p-2 rounded-full mb-1">
              <Home className="h-5 w-5 text-blue-500" />
            </div>
            <div className="text-xs font-medium">Home</div>
            <div className="text-xs">2.8 kW</div>
          </div>
          
          {/* Battery */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
            <div className="h-6 w-0.5 bg-purple-300 mb-1"></div>
            <div className="bg-purple-100 p-2 rounded-full">
              <Battery className="h-5 w-5 text-purple-500" />
            </div>
            <div className="text-xs font-medium mt-1">Battery</div>
            <div className="text-xs">78% · Charging</div>
          </div>
          
          {/* Grid */}
          <div className="absolute top-1/2 right-4 transform -translate-y-1/2 flex flex-col items-center">
            <div className="h-0.5 w-6 bg-red-300 absolute left-0 top-1/2 transform -translate-x-full -translate-y-1/2"></div>
            <div className="bg-red-100 p-2 rounded-full">
              <Wifi className="h-5 w-5 text-red-500" />
            </div>
            <div className="text-xs font-medium mt-1">Grid</div>
            <div className="text-xs">0.4 kW Import</div>
          </div>
          
          {/* Connecting lines */}
          <svg className="absolute inset-0 w-full h-full z-0" viewBox="0 0 400 200">
            <defs>
              <marker id="arrowhead" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
                <polygon points="0 0, 4 2, 0 4" fill="currentColor" />
              </marker>
            </defs>
            
            {/* Solar to Home */}
            <path 
              d="M200,40 L200,90" 
              stroke="#fcd34d" 
              strokeWidth="2" 
              fill="none" 
              markerEnd="url(#arrowhead)" 
            />
            
            {/* Home to Battery */}
            <path 
              d="M200,110 L200,160" 
              stroke="#a78bfa" 
              strokeWidth="2" 
              fill="none" 
              markerEnd="url(#arrowhead)" 
            />
            
            {/* Grid to Home */}
            <path 
              d="M320,100 L230,100" 
              stroke="#f87171" 
              strokeWidth="2" 
              fill="none" 
              markerEnd="url(#arrowhead)" 
            />
          </svg>
        </div>
      </CardContent>
    </Card>
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
    energyGeneration: 5.2,
    energyConsumption: 2.8,
    gridImport: 0.4,
    gridExport: 2.8,
    batteryLevel: 78,
    batteryStatus: 'charging'
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([
    {
      id: '1',
      deviceId: 'inv-001',
      deviceName: 'Main Inverter',
      type: 'status_change',
      message: 'Device is now online',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString()
    },
    {
      id: '2',
      deviceId: 'bat-001',
      deviceName: 'Battery Storage',
      type: 'telemetry',
      message: 'Battery level at 78%, charging',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString()
    },
    {
      id: '3',
      deviceId: 'pv-002',
      deviceName: 'South Roof Array',
      type: 'alert',
      message: 'High temperature warning',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString()
    }
  ]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (devices) {
      const active = devices.filter(d => d.status === 'online').length;
      const offline = devices.filter(d => d.status === 'offline').length;
      const uptime = devices.reduce((acc, d) => acc + (d.lastSeen ? 100 : 0), 0) / devices.length;

      setStats(prev => ({
        ...prev,
        totalDevices: devices.length,
        activeDevices: active,
        offlineDevices: offline,
        averageUptime: uptime,
      }));
    }
  }, [devices]);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      // Refresh logic here
      setTimeout(() => {
        setIsRefreshing(false);
        toast.success('Dashboard refreshed successfully');
      }, 1000);
    } catch (err) {
      toast.error('Failed to refresh dashboard');
      setIsRefreshing(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Energy Management Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and optimize your energy systems
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            disabled={isRefreshing}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">Actions</Button>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="energy">Energy</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatusCard
              title="Energy Generation"
              value={`${stats.energyGeneration} kW`}
              description="Current solar production"
              icon={<Sun />}
              iconBg="bg-amber-100"
              iconColor="text-amber-500"
              trend={{ value: 12, isPositive: true }}
            />
            
            <StatusCard
              title="Energy Consumption"
              value={`${stats.energyConsumption} kW`}
              description="Current household usage"
              icon={<Lightbulb />}
              iconBg="bg-blue-100"
              iconColor="text-blue-500"
              trend={{ value: 3, isPositive: false }}
            />
            
            <StatusCard
              title="Battery Status"
              value={`${stats.batteryLevel}%`}
              description={stats.batteryStatus === 'charging' ? 'Charging' : 
                           stats.batteryStatus === 'discharging' ? 'Discharging' : 'Idle'}
              icon={<Battery />}
              iconBg="bg-purple-100"
              iconColor="text-purple-500"
              trend={stats.batteryStatus === 'charging' ? { value: 5, isPositive: true } : undefined}
            />
            
            <StatusCard
              title="Grid Exchange"
              value={stats.gridExport > 0 ? `${stats.gridExport} kW` : `${stats.gridImport} kW`}
              description={stats.gridExport > 0 ? "Exporting to grid" : "Importing from grid"}
              icon={<Cable />}
              iconBg="bg-red-100"
              iconColor="text-red-500"
              trend={stats.gridExport > 0 ? { value: 25, isPositive: true } : undefined}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <EnergyFlowCard className="lg:col-span-2" />
            
            <Card className="lg:row-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Device Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Solar Inverter</span>
                      <Badge variant="success">Online</Badge>
                    </div>
                    <div className="flex items-center">
                      <Progress value={85} className="h-2" />
                      <span className="ml-2 text-sm">85%</span>
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                      <span>3.8 kW</span>
                      <span>4.5 kW</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Battery System</span>
                      <Badge variant="success">Online</Badge>
                    </div>
                    <div className="flex items-center">
                      <Progress value={78} className="h-2" indicatorClassName="bg-purple-500" />
                      <span className="ml-2 text-sm">78%</span>
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                      <span>7.8 kWh</span>
                      <span>10.0 kWh</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Grid Connection</span>
                      <Badge variant="success">Online</Badge>
                    </div>
                    <div className="flex items-center">
                      <Progress value={40} className="h-2" indicatorClassName="bg-red-500" />
                      <span className="ml-2 text-sm">0.4 kW</span>
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                      <span>Import</span>
                      <span>5.0 kW Max</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Smart Meter</span>
                      <Badge variant="success">Online</Badge>
                    </div>
                    <div className="flex items-center">
                      <Progress value={100} className="h-2" />
                      <span className="ml-2 text-sm">100%</span>
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                      <span>Connected</span>
                      <span>1.2 MB/day</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">EV Charger</span>
                      <Badge variant="warning">Standby</Badge>
                    </div>
                    <div className="flex items-center">
                      <Progress value={0} className="h-2" indicatorClassName="bg-yellow-500" />
                      <span className="ml-2 text-sm">0 kW</span>
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                      <span>Ready</span>
                      <span>11 kW Max</span>
                    </div>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/devices')}>
                  View All Devices
                </Button>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Today's Energy Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: "Generated", value: "24.5 kWh", icon: <Sun className="h-4 w-4" />, color: "text-amber-500" },
                    { label: "Consumed", value: "18.3 kWh", icon: <Lightbulb className="h-4 w-4" />, color: "text-blue-500" },
                    { label: "Imported", value: "4.2 kWh", icon: <ArrowRight className="h-4 w-4" />, color: "text-red-500" },
                    { label: "Exported", value: "10.4 kWh", icon: <ArrowRight className="h-4 w-4 rotate-180" />, color: "text-green-500" },
                  ].map((item, i) => (
                    <div key={i} className="text-center p-3 rounded-lg border">
                      <div className={`flex justify-center mb-1 ${item.color}`}>
                        {item.icon}
                      </div>
                      <div className="text-lg font-semibold">{item.value}</div>
                      <div className="text-xs text-muted-foreground">{item.label}</div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6">
                  <div className="flex justify-between text-sm font-medium mb-2">
                    <span>Self-sufficiency</span>
                    <span>77%</span>
                  </div>
                  <Progress value={77} className="h-2" indicatorClassName="bg-green-500" />
                  
                  <div className="flex justify-between text-sm font-medium mt-4 mb-2">
                    <span>Self-consumption</span>
                    <span>58%</span>
                  </div>
                  <Progress value={58} className="h-2" indicatorClassName="bg-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Recent Activity</CardTitle>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <span className="text-xs">View All</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0">
                      <div className={`rounded-full p-2 ${
                        activity.type === 'status_change' ? 'bg-blue-100 text-blue-700' : 
                        activity.type === 'alert' ? 'bg-red-100 text-red-700' : 
                        'bg-green-100 text-green-700'
                      }`}>
                        {activity.type === 'status_change' ? <Server className="h-4 w-4" /> : 
                         activity.type === 'alert' ? <AlertCircle className="h-4 w-4" /> : 
                         <Activity className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="font-medium text-sm">{activity.deviceName}</p>
                          <time className="text-xs text-muted-foreground">
                            {format(new Date(activity.timestamp), 'HH:mm')}
                          </time>
                        </div>
                        <p className="text-sm text-muted-foreground">{activity.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Weather Impact</CardTitle>
                <CardDescription>Current weather conditions affecting solar production</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-6">
                  <div className="text-center">
                    <Sun className="h-10 w-10 mx-auto text-amber-500" />
                    <div className="mt-1 font-medium">Sunny</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold">23°C</div>
                    <div className="text-xs text-muted-foreground">Feels like 25°C</div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm">Wind</div>
                    <div className="font-medium">6 km/h</div>
                    <div className="text-xs text-muted-foreground">South</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Solar Irradiance</span>
                      <span className="font-medium">840 W/m²</span>
                    </div>
                    <Progress value={84} className="h-1.5" indicatorClassName="bg-amber-500" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Cloud Coverage</span>
                      <span className="font-medium">12%</span>
                    </div>
                    <Progress value={12} className="h-1.5" indicatorClassName="bg-blue-500" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Production Impact</span>
                      <span className="font-medium text-green-600">+15%</span>
                    </div>
                    <Progress value={15} max={20} className="h-1.5" indicatorClassName="bg-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Savings & Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-2">
                    <div className="text-3xl font-bold text-green-600">€32.45</div>
                    <div className="text-sm text-muted-foreground">Saved today</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="text-center p-3 border rounded-lg">
                      <div className="text-muted-foreground mb-1">Carbon Offset</div>
                      <div className="text-xl font-semibold">15.2 kg</div>
                      <div className="text-xs text-muted-foreground">CO₂ equivalent</div>
                    </div>
                    
                    <div className="text-center p-3 border rounded-lg">
                      <div className="text-muted-foreground mb-1">Trees Equivalent</div>
                      <div className="text-xl font-semibold">0.7</div>
                      <div className="text-xs text-muted-foreground">Daily absorption</div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4 mt-4">
                    <div className="text-sm mb-2">Monthly Projection</div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Savings</span>
                      <span className="font-medium">€968.50</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-muted-foreground">Carbon Offset</span>
                      <span className="font-medium">456 kg CO₂</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="devices">
          <div className="pt-6">
            <Card>
              <CardHeader>
                <CardTitle>Device Management</CardTitle>
                <CardDescription>Manage and monitor all your energy devices</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate('/devices')}>View Devices Dashboard</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="energy">
          <div className="pt-6">
            <Card>
              <CardHeader>
                <CardTitle>Energy Management</CardTitle>
                <CardDescription>Access detailed energy management controls</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate('/energy-management')}>
                  Go to Energy Management
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="pt-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>Detailed analytics and reporting</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate('/analytics')}>View Analytics Dashboard</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="pt-6">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Configure system settings</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate('/settings')}>Open Settings</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
