
import React, { useState } from 'react';
import { Server, Activity, CheckCircle, AlertTriangle, RefreshCw, Cpu, Zap, Wifi, Database, HardDrive, Clock } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useMicrogrid } from '@/components/microgrid/MicrogridProvider';
import { toast } from 'sonner';

const SystemStatus = () => {
  const { microgridState } = useMicrogrid();
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);
  
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      toast.success('System status refreshed');
    }, 1000);
  };
  
  // Mock system metrics - in a real app these would come from your backend
  const systemMetrics = {
    systemUptime: '32 days, 7 hours',
    cpuUsage: 34,
    memoryUsage: 62,
    diskSpace: 28,
    communicationStatus: 'Connected',
    lastBackup: '2023-09-18 03:00 AM',
    firmwareVersion: 'v2.3.4',
    lastUpdate: '2023-08-12',
    databaseSize: '1.8 GB',
    activeSessions: 3,
    responseTime: '124ms',
    apiRequests: '1,423/day',
  };
  
  // Mock component status
  const componentStatus = [
    { name: 'Main Controller', status: 'operational', latency: '12ms', lastRestart: '32 days ago' },
    { name: 'Database Service', status: 'operational', latency: '38ms', lastRestart: '32 days ago' },
    { name: 'Communication Interface', status: 'operational', latency: '56ms', lastRestart: '14 days ago' },
    { name: 'Data Logging Service', status: 'operational', latency: '28ms', lastRestart: '32 days ago' },
    { name: 'User Authentication', status: 'operational', latency: '45ms', lastRestart: '32 days ago' },
    { name: 'API Gateway', status: 'operational', latency: '62ms', lastRestart: '32 days ago' },
    { name: 'Reporting Engine', status: 'degraded', latency: '195ms', lastRestart: '7 days ago' },
    { name: 'Weather Service', status: 'operational', latency: '134ms', lastRestart: '21 days ago' },
  ];
  
  // Mock recent system events
  const systemEvents = [
    { timestamp: '2023-09-19 14:32:46', severity: 'info', message: 'System backup completed successfully' },
    { timestamp: '2023-09-19 10:15:22', severity: 'warning', message: 'High CPU usage detected (85%)' },
    { timestamp: '2023-09-18 23:47:10', severity: 'info', message: 'Daily analytics processing completed' },
    { timestamp: '2023-09-18 16:32:05', severity: 'error', message: 'Database connection timeout - auto-recovered' },
    { timestamp: '2023-09-18 14:30:00', severity: 'info', message: 'User login from new location' },
    { timestamp: '2023-09-18 09:22:17', severity: 'warning', message: 'Weather data fetch delayed' },
    { timestamp: '2023-09-17 22:14:05', severity: 'info', message: 'System updates scheduled for next maintenance window' },
    { timestamp: '2023-09-17 16:05:29', severity: 'info', message: 'New device detected on network' },
  ];
  
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'warning':
        return <Badge variant="warning" className="bg-orange-500">Warning</Badge>;
      default:
        return <Badge variant="outline">Info</Badge>;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'operational':
        return <Badge className="bg-green-500">Operational</Badge>;
      case 'degraded':
        return <Badge className="bg-orange-500">Degraded</Badge>;
      case 'down':
        return <Badge variant="destructive">Down</Badge>;
      case 'maintenance':
        return <Badge variant="outline" className="border-blue-500 text-blue-500">Maintenance</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  return (
    <AppLayout>
      <div className="flex flex-col gap-6 p-6 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold mb-1">System Status</h1>
            <p className="text-muted-foreground">Monitor the operational status of all system components</p>
          </div>
          
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing} className="flex items-center gap-2">
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh Status'}
          </Button>
        </div>
        
        <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="overview">System Overview</TabsTrigger>
            <TabsTrigger value="components">Component Status</TabsTrigger>
            <TabsTrigger value="events">System Events</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-primary" />
                    CPU Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemMetrics.cpuUsage}%</div>
                  <Progress value={systemMetrics.cpuUsage} className="h-2 mt-2" />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <HardDrive className="h-4 w-4 text-primary" />
                    Memory Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemMetrics.memoryUsage}%</div>
                  <Progress value={systemMetrics.memoryUsage} className="h-2 mt-2" />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Database className="h-4 w-4 text-primary" />
                    Disk Space
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemMetrics.diskSpace}%</div>
                  <Progress value={systemMetrics.diskSpace} className="h-2 mt-2" />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    System Uptime
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemMetrics.systemUptime}</div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Microgrid Status</CardTitle>
                  <CardDescription>Current operating status of the microgrid</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-muted-foreground">Operating Mode</span>
                    <span className="font-medium">{microgridState.operatingMode}</span>
                  </div>
                  
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-muted-foreground">Grid Connection</span>
                    <span className="font-medium">{microgridState.gridConnection ? 'Connected' : 'Disconnected'}</span>
                  </div>
                  
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-muted-foreground">Power Quality</span>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">Nominal</span>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-muted-foreground">Frequency</span>
                    <span className="font-medium">{microgridState.frequency.toFixed(2)} Hz</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Voltage</span>
                    <span className="font-medium">{microgridState.voltage.toFixed(1)} V</span>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/50 py-2">
                  <div className="text-xs text-muted-foreground w-full text-right">
                    Last updated: {new Date(microgridState.lastUpdated).toLocaleTimeString()}
                  </div>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>System Information</CardTitle>
                  <CardDescription>Technical details and configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-muted-foreground">Firmware Version</span>
                    <span className="font-medium">{systemMetrics.firmwareVersion}</span>
                  </div>
                  
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-muted-foreground">Last Update</span>
                    <span className="font-medium">{systemMetrics.lastUpdate}</span>
                  </div>
                  
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-muted-foreground">Database Size</span>
                    <span className="font-medium">{systemMetrics.databaseSize}</span>
                  </div>
                  
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="text-muted-foreground">Active Sessions</span>
                    <span className="font-medium">{systemMetrics.activeSessions}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Communication Status</span>
                    <div className="flex items-center">
                      <span className="font-medium mr-2">{systemMetrics.communicationStatus}</span>
                      <Wifi className="h-4 w-4 text-green-500" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/50 py-2">
                  <div className="text-xs text-muted-foreground w-full text-right">
                    Last backup: {systemMetrics.lastBackup}
                  </div>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="components" className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {componentStatus.map((component, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className={`h-1 ${
                    component.status === 'operational' ? 'bg-green-500' : 
                    component.status === 'degraded' ? 'bg-orange-500' : 
                    'bg-red-500'
                  }`} />
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Server className="h-4 w-4 text-slate-500" />
                        <span className="font-medium">{component.name}</span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3">
                        {getStatusBadge(component.status)}
                        
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium mr-1">Latency:</span>
                          {component.latency}
                        </div>
                        
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium mr-1">Last restart:</span>
                          {component.lastRestart}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent System Events</CardTitle>
                <CardDescription>System logs and important events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemEvents.map((event, index) => (
                    <div key={index} className="flex items-start justify-between border-b last:border-0 pb-3 last:pb-0">
                      <div className="flex items-start gap-3">
                        {getSeverityBadge(event.severity)}
                        <div>
                          <p className="font-medium">{event.message}</p>
                          <p className="text-xs text-muted-foreground">{event.timestamp}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="link" size="sm" className="px-0">Export Logs</Button>
                <Button variant="outline" size="sm">View All Events</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default SystemStatus;
