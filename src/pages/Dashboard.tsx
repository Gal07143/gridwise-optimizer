import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  BatteryCharging, 
  Bolt, 
  ExternalLink, 
  Info, 
  Zap, 
  AlertTriangle, 
  TrendingUp,
  TrendingDown,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useSiteContext } from '@/contexts/SiteContext';
import { useAuth } from '@/contexts/AuthContext';
import { formatTimestamp } from '@/lib/utils';
import DashboardCard from '@/components/dashboard/DashboardCard';
import LiveChart from '@/components/dashboard/LiveChart';
import AlertTable from '@/components/alerts/AlertTable';
import { getRandomColor } from '@/lib/utils';
import { fetchDevicesBySite } from '@/services/deviceService';
import { getAlertSummary } from '@/services/alertService';

const energyData = [
  { time: '00:00', value: 4 },
  { time: '03:00', value: 2 },
  { time: '06:00', value: 5 },
  { time: '09:00', value: 12 },
  { time: '12:00', value: 25 },
  { time: '15:00', value: 20 },
  { time: '18:00', value: 18 },
  { time: '21:00', value: 10 },
  { time: '24:00', value: 5 },
];

const loadData = [
  { time: '00:00', value: 15 },
  { time: '03:00', value: 12 },
  { time: '06:00', value: 18 },
  { time: '09:00', value: 25 },
  { time: '12:00', value: 32 },
  { time: '15:00', value: 30 },
  { time: '18:00', value: 35 },
  { time: '21:00', value: 28 },
  { time: '24:00', value: 20 },
];

const batteryData = [
  { time: '00:00', value: 75 },
  { time: '03:00', value: 70 },
  { time: '06:00', value: 65 },
  { time: '09:00', value: 60 },
  { time: '12:00', value: 75 },
  { time: '15:00', value: 85 },
  { time: '18:00', value: 80 },
  { time: '21:00', value: 75 },
  { time: '24:00', value: 80 },
];

const Dashboard = () => {
  const { user } = useAuth();
  const { currentSite } = useSiteContext();
  const [devices, setDevices] = useState<any[]>([]);
  const [alertSummary, setAlertSummary] = useState({
    total: 0,
    critical: 0,
    warning: 0,
    info: 0,
    unacknowledged: 0
  });
  const [isLoadingDevices, setIsLoadingDevices] = useState(true);
  const [isLoadingAlerts, setIsLoadingAlerts] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const loadDevices = async () => {
      if (currentSite) {
        try {
          setIsLoadingDevices(true);
          const siteDevices = await fetchDevicesBySite(currentSite.id);
          setDevices(siteDevices);
        } catch (error) {
          console.error('Failed to fetch devices:', error);
        } finally {
          setIsLoadingDevices(false);
        }
      }
    };

    const loadAlertSummary = async () => {
      try {
        setIsLoadingAlerts(true);
        const summary = await getAlertSummary();
        setAlertSummary(summary);
      } catch (error) {
        console.error('Failed to fetch alert summary:', error);
      } finally {
        setIsLoadingAlerts(false);
      }
    };

    loadDevices();
    loadAlertSummary();

    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, [currentSite]);

  const deviceCards = [
    {
      title: "Solar Panels",
      status: "online",
      primaryMetric: { value: "3.6 kW", label: "Current Output" },
      secondaryMetric: { value: "25.8 kWh", label: "Today's Generation" },
      chartData: energyData,
      chartColor: "rgba(250, 204, 21, 0.8)",
      icon: <Zap className="h-4 w-4" />,
      trend: { value: "+12%", up: true }
    },
    {
      title: "Battery Storage",
      status: "online",
      primaryMetric: { value: "78%", label: "State of Charge" },
      secondaryMetric: { value: "8.4 kWh", label: "Stored Energy" },
      chartData: batteryData,
      chartColor: "rgba(14, 165, 233, 0.8)",
      icon: <BatteryCharging className="h-4 w-4" />,
      trend: { value: "Charging", up: true }
    },
    {
      title: "Home Load",
      status: "online",
      primaryMetric: { value: "2.8 kW", label: "Current Consumption" },
      secondaryMetric: { value: "32.5 kWh", label: "Today's Usage" },
      chartData: loadData,
      chartColor: "rgba(239, 68, 68, 0.8)",
      icon: <Bolt className="h-4 w-4" />,
      trend: { value: "-8%", up: false }
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-1">
          {currentSite ? currentSite.name : 'Welcome'} Dashboard
        </h1>
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">
            {formatTimestamp(currentTime.toISOString(), "EEEE, MMMM d, yyyy • h:mm a")}
          </p>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-1">
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Link to="/settings">
              <Button variant="outline" size="sm" className="gap-1">
                <ExternalLink className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {deviceCards.map((device, i) => (
          <Card key={i} className="card-hover">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center mb-1">
                    <Badge 
                      variant="outline" 
                      className={`mr-2 ${device.status === 'online' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'}`}
                    >
                      {device.status}
                    </Badge>
                    <CardTitle className="text-base font-medium inline-flex items-center">
                      {device.title}
                    </CardTitle>
                  </div>
                  <CardDescription>{device.secondaryMetric.label}</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-xl font-semibold">{device.primaryMetric.value}</div>
                  <div className="text-sm text-muted-foreground">{device.primaryMetric.label}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="h-[100px] -mx-2">
                <LiveChart 
                  data={device.chartData} 
                  height={100} 
                  color={device.chartColor}
                  type="area"
                  gradientFrom={device.chartColor}
                  gradientTo={`${device.chartColor.slice(0, -4)}0.05)`}
                />
              </div>
              <div className="flex justify-between items-center mt-2 pt-2 border-t">
                <div>
                  <span className="font-medium">{device.secondaryMetric.value}</span>
                </div>
                <div className={`flex items-center text-sm ${device.trend.up ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {device.trend.up ? 
                    <TrendingUp className="h-3 w-3 mr-1" /> : 
                    <TrendingDown className="h-3 w-3 mr-1" />
                  }
                  {device.trend.value}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DashboardCard
          title="Grid Status"
          icon={<Activity size={18} />}
          className="col-span-1"
          badge="Connected"
        >
          <div className="p-4 flex flex-col items-center justify-center h-full">
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <Bolt className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></div>
            </div>
            <h3 className="text-xl font-semibold mb-1">Connected</h3>
            <p className="text-sm text-center text-muted-foreground">
              Grid is operating normally with stable frequency and voltage levels
            </p>
            
            <div className="grid grid-cols-2 gap-3 w-full mt-4">
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Importing</div>
                <div className="text-lg font-semibold">0.4 kW</div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Frequency</div>
                <div className="text-lg font-semibold">50.02 Hz</div>
              </div>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard
          title="System Health"
          icon={<Info size={18} />}
          className="col-span-1"
        >
          <div className="space-y-4 p-2">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Battery Efficiency</span>
                <span className="text-sm font-medium">92%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
            
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Solar Performance</span>
                <span className="text-sm font-medium">86%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '86%' }}></div>
              </div>
            </div>
            
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Grid Utilization</span>
                <span className="text-sm font-medium">23%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '23%' }}></div>
              </div>
            </div>
            
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">System Uptime</span>
                <span className="text-sm font-medium">99.8%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '99.8%' }}></div>
              </div>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Notifications"
          icon={<AlertTriangle size={18} />}
          className="col-span-1"
          badge={isLoadingAlerts ? "Loading..." : `${alertSummary.total} Total`}
        >
          <div className="space-y-3 p-2">
            <Link to="/alerts" className="block">
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/40">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="mr-3 p-2 bg-red-500 rounded-full text-white">
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">Critical Alerts</div>
                      <div className="text-xs text-muted-foreground">Require immediate attention</div>
                    </div>
                  </div>
                  <Badge variant="destructive">{alertSummary.critical}</Badge>
                </div>
              </div>
            </Link>
            
            <Link to="/alerts" className="block">
              <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800/40">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="mr-3 p-2 bg-yellow-500 rounded-full text-white">
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">Warnings</div>
                      <div className="text-xs text-muted-foreground">System issues detected</div>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300">
                    {alertSummary.warning}
                  </Badge>
                </div>
              </div>
            </Link>
            
            <Link to="/alerts" className="block">
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/40">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="mr-3 p-2 bg-blue-500 rounded-full text-white">
                      <Info className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">Informational</div>
                      <div className="text-xs text-muted-foreground">System updates & notices</div>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                    {alertSummary.info}
                  </Badge>
                </div>
              </div>
            </Link>
            
            <div className="text-center pt-1">
              <Link to="/alerts">
                <Button variant="link" size="sm" className="text-xs">
                  View All Notifications
                </Button>
              </Link>
            </div>
          </div>
        </DashboardCard>
      </div>

      <Tabs defaultValue="timeline" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="alerts">Recent Alerts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="timeline" className="animate-in">
          <Card>
            <CardHeader>
              <CardTitle>System Timeline</CardTitle>
              <CardDescription>Recent events and activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative space-y-3 ml-3 pb-2">
                <div className="absolute top-0 bottom-0 left-0 w-0.5 bg-slate-200 dark:bg-slate-700"></div>
                
                {[
                  { 
                    time: '09:45 AM', 
                    title: 'Battery Started Charging', 
                    description: 'The battery storage system began charging from solar generation',
                    category: 'system',
                    icon: <BatteryCharging className="h-4 w-4" />
                  },
                  { 
                    time: '08:30 AM', 
                    title: 'Solar Generation Peak', 
                    description: 'Solar panels reached maximum output of 4.2kW',
                    category: 'event',
                    icon: <Zap className="h-4 w-4" />
                  },
                  { 
                    time: '07:15 AM', 
                    title: 'System Self-Test', 
                    description: 'Automatic system diagnostics completed successfully',
                    category: 'maintenance',
                    icon: <Activity className="h-4 w-4" />
                  },
                ].map((item, i) => (
                  <div key={i} className="relative flex items-start gap-4 pb-8">
                    <div className="absolute left-0 -translate-x-1/2 w-3 h-3 rounded-full bg-primary"></div>
                    
                    <div className="ml-4">
                      <div className="text-xs text-muted-foreground mb-1">
                        {item.time} • Today
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium flex items-center gap-1">
                          <span className="text-primary">{item.icon}</span>
                          {item.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="devices" className="animate-in">
          <Card>
            <CardHeader>
              <CardTitle>Connected Devices</CardTitle>
              <CardDescription>All energy system components</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {isLoadingDevices ? (
                  Array(3).fill(0).map((_, i) => (
                    <div key={i} className="rounded-lg border p-4 animate-pulse bg-slate-50 dark:bg-slate-800">
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
                      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-6"></div>
                      <div className="flex justify-between">
                        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
                        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
                      </div>
                    </div>
                  ))
                ) : devices.length > 0 ? (
                  devices.map((device) => (
                    <Link 
                      key={device.id} 
                      to={`/devices/${device.id}`}
                      className="rounded-lg border p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{device.name}</h3>
                        <Badge 
                          variant="outline" 
                          className={device.status === 'online' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'}
                        >
                          {device.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {device.description || `${device.type} device`}
                      </p>
                      <div className="flex justify-between text-sm">
                        <span>
                          {device.capacity} {device.type === 'battery' ? 'kWh' : 'kW'}
                        </span>
                        <span className="text-muted-foreground">
                          {formatTimestamp(device.last_updated || device.created_at, 'MMM d, yyyy')}
                        </span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-3 py-8 text-center text-muted-foreground">
                    <p>No devices found for this site.</p>
                    <Link to="/devices/add">
                      <Button variant="link">Add a device</Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="alerts" className="animate-in">
          <Card>
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
              <CardDescription>System notifications and warnings</CardDescription>
            </CardHeader>
            <CardContent>
              <AlertTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
