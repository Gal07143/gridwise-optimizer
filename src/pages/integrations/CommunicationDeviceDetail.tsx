
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  ChevronLeft,
  Edit,
  Trash2,
  RefreshCw,
  Signal,
  Router,
  Wifi,
  Settings,
  BarChart,
  Clock,
  AlertCircle,
  Clipboard,
  Terminal,
  Download
} from 'lucide-react';
import { 
  getCommunicationDeviceById,
  CommunicationDevice,
  updateCommunicationDevice
} from '@/services/communicationDeviceService';

const CommunicationDeviceDetail = () => {
  const { deviceId } = useParams<{ deviceId: string }>();
  const navigate = useNavigate();
  const [device, setDevice] = useState<CommunicationDevice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isRestarting, setIsRestarting] = useState(false);

  useEffect(() => {
    const fetchDevice = async () => {
      if (!deviceId) return;
      
      try {
        setIsLoading(true);
        const data = await getCommunicationDeviceById(deviceId);
        if (data) {
          setDevice(data);
        } else {
          toast.error('Device not found');
          navigate('/integrations/communication');
        }
      } catch (error) {
        console.error('Error fetching device:', error);
        toast.error('Failed to load device details');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDevice();
  }, [deviceId, navigate]);

  const handleRestart = async () => {
    if (!device) return;
    
    try {
      setIsRestarting(true);
      toast.info(`Restarting ${device.name}...`);
      
      // Simulate restart operation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      await updateCommunicationDevice(device.id, {
        status: 'online',
        last_seen: new Date().toISOString()
      });
      
      setDevice(prev => prev ? { 
        ...prev, 
        status: 'online',
        last_seen: new Date().toISOString()
      } : null);
      
      toast.success(`${device.name} restarted successfully`);
    } catch (error) {
      console.error('Error restarting device:', error);
      toast.error('Failed to restart device');
    } finally {
      setIsRestarting(false);
    }
  };

  const getDeviceTypeIcon = (type: string) => {
    switch (type) {
      case 'modem': return <Signal className="h-5 w-5 text-blue-500" />;
      case 'gateway': return <Router className="h-5 w-5 text-purple-500" />;
      case 'router': return <Router className="h-5 w-5 text-green-500" />;
      case 'access_point': return <Wifi className="h-5 w-5 text-cyan-500" />;
      case 'repeater': return <Signal className="h-5 w-5 text-orange-500" />;
      default: return <Wifi className="h-5 w-5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online': 
        return <Badge className="bg-green-500">Online</Badge>;
      case 'offline': 
        return <Badge variant="secondary" className="bg-slate-400">Offline</Badge>;
      case 'error': 
        return <Badge variant="destructive">Error</Badge>;
      case 'maintenance': 
        return <Badge variant="outline" className="border-blue-500 text-blue-500">Maintenance</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-2 mb-6">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-8 w-48" />
          </div>
          
          <Skeleton className="h-12 w-full mb-6" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-56 w-full" />
            <Skeleton className="h-56 w-full" />
          </div>
          
          <Skeleton className="h-64 w-full" />
        </div>
      </AppLayout>
    );
  }

  if (!device) {
    return (
      <AppLayout>
        <div className="p-6">
          <div className="text-center py-12 border rounded-lg">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Device Not Found</h2>
            <p className="text-muted-foreground mb-6">The communication device you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/integrations/communication')}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Devices
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 space-y-6 animate-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={() => navigate('/integrations/communication')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-primary/10">
                {getDeviceTypeIcon(device.type)}
              </div>
              <div>
                <h1 className="text-2xl font-semibold">{device.name}</h1>
                <p className="text-muted-foreground">
                  {device.manufacturer} {device.model} • {getStatusBadge(device.status)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <Button 
              variant="outline" 
              onClick={handleRestart} 
              disabled={isRestarting}
              className="w-full md:w-auto"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRestarting ? 'animate-spin' : ''}`} />
              Restart Device
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate(`/integrations/communication/${device.id}/edit`)}
              className="w-full md:w-auto"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                // Handle delete
                toast.info('Delete functionality would go here');
              }}
              className="w-full md:w-auto"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="diagnostics">Diagnostics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Device Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Manufacturer</span>
                    <span className="font-medium">{device.manufacturer}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Model</span>
                    <span className="font-medium">{device.model}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Type</span>
                    <span className="font-medium capitalize">{device.type.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Firmware Version</span>
                    <span className="font-medium">{device.firmware_version || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Connection Type</span>
                    <span className="font-medium">{device.connection_type || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground">Location</span>
                    <span className="font-medium">{device.location || 'N/A'}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Network Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">IP Address</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{device.ip_address || 'N/A'}</span>
                      {device.ip_address && (
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => {
                          navigator.clipboard.writeText(device.ip_address || '');
                          toast.success('IP address copied to clipboard');
                        }}>
                          <Clipboard className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">MAC Address</span>
                    <span className="font-medium">{device.mac_address || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Protocol</span>
                    <span className="font-medium">{device.protocol}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Bandwidth</span>
                    <span className="font-medium">{device.bandwidth || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-muted-foreground">Status</span>
                    <span>{getStatusBadge(device.status)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground">Last Seen</span>
                    <span className="font-medium">
                      {device.last_seen 
                        ? new Date(device.last_seen).toLocaleString() 
                        : 'Never'
                      }
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Last 24 hours of device activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-3">
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Status changed to {device.status}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(device.last_seen || '').toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <RefreshCw className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Device restarted</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(Date.now() - 3600000).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Settings className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Configuration updated</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(Date.now() - 86400000 / 2).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t">
                <Button variant="ghost" className="w-full">
                  View All Activity
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="configuration" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Device Configuration</CardTitle>
                <CardDescription>View and edit device settings</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-10 text-muted-foreground">
                  Configuration options would be displayed here for {device.name}
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="logs" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Device Logs</CardTitle>
                  <CardDescription>
                    System logs and connection history
                  </CardDescription>
                </div>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Logs
                </Button>
              </CardHeader>
              <CardContent>
                <div className="bg-black text-green-500 font-mono p-4 rounded-md h-64 overflow-y-auto text-xs">
                  <p>[{new Date(Date.now() - 60000).toISOString()}] Device status: ONLINE</p>
                  <p>[{new Date(Date.now() - 120000).toISOString()}] Connection established</p>
                  <p>[{new Date(Date.now() - 180000).toISOString()}] Attempting connection...</p>
                  <p>[{new Date(Date.now() - 3600000).toISOString()}] Device restart initiated</p>
                  <p>[{new Date(Date.now() - 3660000).toISOString()}] Configuration update applied</p>
                  <p>[{new Date(Date.now() - 7200000).toISOString()}] Signal strength: Excellent (95%)</p>
                  <p>[{new Date(Date.now() - 10800000).toISOString()}] Bandwidth test: Download: 150Mbps / Upload: 25Mbps</p>
                  <p>[{new Date(Date.now() - 14400000).toISOString()}] Firmware update check: No updates available</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="diagnostics" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Diagnostics & Troubleshooting</CardTitle>
                  <CardDescription>
                    Test network connectivity and run diagnostics
                  </CardDescription>
                </div>
                <Button>
                  <Terminal className="h-4 w-4 mr-2" />
                  Run Diagnostics
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="font-semibold">Network Tests</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button variant="outline" className="justify-start">Ping Test</Button>
                      <Button variant="outline" className="justify-start">Traceroute</Button>
                      <Button variant="outline" className="justify-start">Bandwidth Test</Button>
                      <Button variant="outline" className="justify-start">DNS Lookup</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold">Device Diagnostics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button variant="outline" className="justify-start">Check Firmware</Button>
                      <Button variant="outline" className="justify-start">Memory Usage</Button>
                      <Button variant="outline" className="justify-start">CPU Usage</Button>
                      <Button variant="outline" className="justify-start">Signal Strength</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default CommunicationDeviceDetail;
