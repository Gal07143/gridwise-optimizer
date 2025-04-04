
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getDeviceById, isValidUuid } from '@/services/deviceService';
import AppLayout from '@/components/layout/AppLayout';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  PlugZap, 
  Settings, 
  AlertTriangle, 
  Edit,
  Trash2, 
  ArrowLeft,
  Wifi,
  CloudOff,
  Calendar,
  Shield,
  FileText,
  Download,
  BarChart2,
  Clock,
  Zap,
  DownloadCloud,
  Activity,
  RefreshCw,
  RotateCw,
  History,
  BookOpen,
  Paperclip,
  Cpu,
  Link,
  Send,
  Bell,
  Tag
} from 'lucide-react';
import { toast } from 'sonner';
import ErrorMessage from '@/components/ui/error-message';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';

const DeviceDetails = () => {
  const { deviceId = '' } = useParams<{ deviceId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch device data
  const { 
    data: device, 
    isLoading, 
    error, 
    status,
    refetch 
  } = useQuery({
    queryKey: ['device', deviceId],
    queryFn: () => getDeviceById(deviceId),
    meta: {
      onError: (error: Error) => {
        console.error('Error fetching device details:', error);
        toast.error(`Failed to fetch device details: ${error.message}`);
      }
    }
  });

  // Generate fake telemetry data for demo
  const telemetryData = React.useMemo(() => {
    return [
      { timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), value: 45.3, type: 'voltage' },
      { timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString(), value: 46.1, type: 'voltage' },
      { timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(), value: 45.8, type: 'voltage' },
      { timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(), value: 45.5, type: 'voltage' },
      { timestamp: new Date(Date.now() - 1000 * 60).toISOString(), value: 45.9, type: 'voltage' },
    ];
  }, []);

  // Generate fake maintenance records for demo
  const maintenanceRecords = React.useMemo(() => {
    return [
      { 
        id: '1',
        type: 'Inspection',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
        technician: 'John Smith',
        notes: 'Routine inspection completed. All systems normal.' 
      },
      { 
        id: '2',
        type: 'Firmware Update',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(),
        technician: 'Alice Johnson',
        notes: 'Updated firmware to version 3.2.1. Verified device operation after update.' 
      }
    ];
  }, []);

  // Handle actions
  const handleEditDevice = () => {
    navigate(`/devices/${deviceId}/edit`);
  };

  const handleDeleteDevice = () => {
    toast.error("Delete operation not implemented", {
      action: {
        label: "Dismiss",
        onClick: () => {}
      }
    });
  };

  const handleDownloadManual = () => {
    toast.info("Downloading device manual...");
    setTimeout(() => toast.success("Device manual downloaded"), 1500);
  };

  const handleDownloadData = () => {
    toast.info("Preparing device data export...");
    setTimeout(() => toast.success("Device data exported successfully"), 1500);
  };

  const handleRefreshTelemetry = () => {
    toast.info("Refreshing telemetry data...");
    setTimeout(() => refetch(), 500);
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'online':
        return <Badge className="bg-green-500 flex items-center gap-1"><Wifi className="h-3 w-3" /> Online</Badge>;
      case 'offline':
        return <Badge variant="outline" className="text-gray-500 flex items-center gap-1"><CloudOff className="h-3 w-3" /> Offline</Badge>;
      case 'warning':
        return <Badge className="bg-amber-500 flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Warning</Badge>;
      case 'error':
        return <Badge variant="destructive" className="flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Error</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  if (status === 'loading') {
    return (
      <AppLayout>
        <div className="container mx-auto p-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (status === 'error') {
    return (
      <AppLayout>
        <div className="container mx-auto p-4">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)} 
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">Device Details</h1>
          </div>

          <ErrorMessage 
            message="Failed to load device details"
            description={error instanceof Error ? error.message : 'Unknown error'}
            retryAction={() => refetch()}
          />
        </div>
      </AppLayout>
    );
  }

  if (!device) {
    return (
      <AppLayout>
        <div className="container mx-auto p-4">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)} 
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">Device Details</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Device Not Found</CardTitle>
              <CardDescription>The device you are looking for could not be found.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button 
                variant="outline"
                onClick={() => navigate('/devices')}
              >
                Back to Devices
              </Button>
            </CardFooter>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto p-4">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Device Details</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Device info card */}
          <Card className="md:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <PlugZap className="h-5 w-5 text-primary" />
                    <CardTitle>{device.name}</CardTitle>
                    {getStatusBadge(device.status)}
                  </div>
                  <CardDescription>ID: {device.id}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Type</h3>
                  <p className="capitalize">{device.type.replace('_', ' ')}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                  <p>{device.location || 'Not specified'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Capacity</h3>
                  <p>{device.capacity ? `${device.capacity} W` : 'Not specified'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Firmware</h3>
                  <p>{device.firmware || 'Not specified'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Protocol</h3>
                  <p>{device.protocol || 'Not specified'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
                  <p>{device.last_updated ? new Date(device.last_updated).toLocaleTimeString() : 'Unknown'}</p>
                </div>
                {device.installation_date && (
                  <div className="col-span-2 sm:col-span-3">
                    <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Installation Date
                    </h3>
                    <p>{new Date(device.installation_date).toLocaleDateString()}</p>
                  </div>
                )}
              </div>

              {device.description && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                  <p className="text-sm mt-1">{device.description}</p>
                </div>
              )}

              {!isValidUuid(device.id) && (
                <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-md border border-amber-200 dark:border-amber-800">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-amber-700 dark:text-amber-400">Demo Device</h4>
                      <p className="text-sm text-amber-600 dark:text-amber-300">
                        This is a demonstration device with ID "{device.id}". For production, use proper UUID-format device IDs.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="justify-between border-t pt-3">
              <Button 
                variant="outline" 
                onClick={() => setActiveTab('maintenance')}
              >
                <History className="h-4 w-4 mr-2" />
                Maintenance History
              </Button>
              <Button 
                variant="outline" 
                onClick={handleDownloadData}
              >
                <DownloadCloud className="h-4 w-4 mr-2" />
                Export Device Data
              </Button>
            </CardFooter>
          </Card>

          {/* Quick stats card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {device.status === 'online' ? (
                <>
                  {device.type === 'battery' && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium">Battery Charge</h3>
                        <span className="text-sm font-medium">78%</span>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>
                  )}
                  
                  {(device.type === 'battery' || device.type === 'inverter') && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium">Power Output</h3>
                        <span className="text-sm font-medium">3.2 kW</span>
                      </div>
                      <Progress value={64} className="h-2" indicatorClassName="bg-green-500" />
                    </div>
                  )}
                  
                  {device.type === 'solar' && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium">Current Production</h3>
                        <span className="text-sm font-medium">4.8 kW</span>
                      </div>
                      <Progress value={75} className="h-2" indicatorClassName="bg-yellow-500" />
                    </div>
                  )}
                  
                  {device.type === 'ev_charger' && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium">Charging Rate</h3>
                        <span className="text-sm font-medium">7.4 kW</span>
                      </div>
                      <Progress value={62} className="h-2" indicatorClassName="bg-blue-500" />
                    </div>
                  )}

                  <div className="space-y-1">
                    <h3 className="text-sm font-medium">Current Stats</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-muted p-2 rounded text-center">
                        <p className="text-xs text-muted-foreground">Voltage</p>
                        <p className="font-medium">230V</p>
                      </div>
                      <div className="bg-muted p-2 rounded text-center">
                        <p className="text-xs text-muted-foreground">Current</p>
                        <p className="font-medium">13.2A</p>
                      </div>
                      <div className="bg-muted p-2 rounded text-center">
                        <p className="text-xs text-muted-foreground">Temperature</p>
                        <p className="font-medium">35°C</p>
                      </div>
                      <div className="bg-muted p-2 rounded text-center">
                        <p className="text-xs text-muted-foreground">Frequency</p>
                        <p className="font-medium">50Hz</p>
                      </div>
                    </div>
                  </div>

                  <Button 
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={handleRefreshTelemetry}
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Refresh Stats
                  </Button>
                </>
              ) : (
                <div className="text-center py-4 space-y-2">
                  <CloudOff className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground">Device is currently offline</p>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={handleRefreshTelemetry}
                  >
                    <RotateCw className="h-4 w-4 mr-1" />
                    Check Connection
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="telemetry">Telemetry</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            <TabsTrigger value="documentation">Documentation</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Device Overview</CardTitle>
                <CardDescription>Key information about this device</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Technical Specifications</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-3 border rounded-lg">
                      <h4 className="text-sm font-medium text-muted-foreground">Model</h4>
                      <p>{device.model || 'Unknown'}</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="text-sm font-medium text-muted-foreground">Manufacturer</h4>
                      <p>{device.manufacturer || 'Unknown'}</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="text-sm font-medium text-muted-foreground">Serial Number</h4>
                      <p>{device.serialNumber || 'Unknown'}</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="text-sm font-medium text-muted-foreground">Firmware Version</h4>
                      <p>{device.firmware || 'Unknown'}</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="text-sm font-medium text-muted-foreground">Capacity</h4>
                      <p>{device.capacity ? `${device.capacity} W` : 'Not specified'}</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="text-sm font-medium text-muted-foreground">Protocol</h4>
                      <p>{device.protocol || 'Not specified'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Device Status</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3 border rounded-lg">
                      <h4 className="text-sm font-medium text-muted-foreground">Current Status</h4>
                      <div className="mt-1">{getStatusBadge(device.status)}</div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="text-sm font-medium text-muted-foreground">Last Connection</h4>
                      <p>{device.last_updated ? new Date(device.last_updated).toLocaleString() : 'Unknown'}</p>
                    </div>
                    <div className="p-3 border rounded-lg sm:col-span-2">
                      <h4 className="text-sm font-medium text-muted-foreground">Connection Details</h4>
                      <div className="flex gap-2 mt-1 flex-wrap">
                        {device.ip_address && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Link className="h-3 w-3" />
                            IP: {device.ip_address}
                          </Badge>
                        )}
                        {device.protocol && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Send className="h-3 w-3" />
                            Protocol: {device.protocol}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Location Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3 border rounded-lg">
                      <h4 className="text-sm font-medium text-muted-foreground">Location</h4>
                      <p>{device.location || 'Not specified'}</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h4 className="text-sm font-medium text-muted-foreground">Site</h4>
                      <p>{device.site_id ? 'Assigned' : 'Not assigned'}</p>
                    </div>
                    {device.lat && device.lng && (
                      <div className="p-3 border rounded-lg sm:col-span-2">
                        <h4 className="text-sm font-medium text-muted-foreground">Coordinates</h4>
                        <p>Lat: {device.lat}, Lng: {device.lng}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Tags</h3>
                  <div className="flex gap-1 flex-wrap">
                    {device.tags ? (
                      Object.entries(device.tags).map(([key, value]) => (
                        <Badge key={key} variant="outline" className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {key}: {value}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No tags assigned</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="telemetry" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Device Telemetry</CardTitle>
                <CardDescription>Recent telemetry readings from this device</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Recent Readings</h3>
                  <Button variant="outline" size="sm" onClick={handleRefreshTelemetry}>
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Refresh
                  </Button>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted/40">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Timestamp
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Value
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-card divide-y divide-border">
                      {telemetryData.map((reading, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {new Date(reading.timestamp).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">
                            {reading.type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {reading.value} {reading.type === 'voltage' ? 'V' : ''}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Alerts</h3>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Bell className="h-3 w-3" />
                    Alerts: {Math.floor(Math.random() * 3)}
                  </Badge>
                </div>

                <div className="border rounded-lg p-4 text-center">
                  <p className="text-muted-foreground">No recent alerts for this device</p>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleDownloadData}>
                    <DownloadCloud className="h-4 w-4 mr-1" />
                    Export Telemetry Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="maintenance" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between">
                  <div>
                    <CardTitle>Maintenance History</CardTitle>
                    <CardDescription>Record of all maintenance activities</CardDescription>
                  </div>
                  <Button size="sm" onClick={() => toast.info("Maintenance logging feature coming soon")}>
                    Add Record
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted/40">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Technician
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Notes
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-card divide-y divide-border">
                      {maintenanceRecords.map((record) => (
                        <tr key={record.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {new Date(record.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {record.type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {record.technician}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {record.notes}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-3">Upcoming Maintenance</h3>
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Routine Inspection</p>
                        <p className="text-sm text-muted-foreground">Scheduled for: {new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toLocaleDateString()}</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => toast.info("Calendar integration coming soon")}>
                        Add to Calendar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documentation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Documentation</CardTitle>
                <CardDescription>Manuals and technical documents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 text-primary mr-3" />
                    <div>
                      <p className="font-medium">User Manual</p>
                      <p className="text-sm text-muted-foreground">Installation and operation guide</p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={handleDownloadManual}>
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>

                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-primary mr-3" />
                    <div>
                      <p className="font-medium">Technical Specifications</p>
                      <p className="text-sm text-muted-foreground">Detailed product specifications</p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => toast.info("Downloading specifications...")}>
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>

                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <div className="flex items-center">
                    <Paperclip className="h-5 w-5 text-primary mr-3" />
                    <div>
                      <p className="font-medium">Warranty Information</p>
                      <p className="text-sm text-muted-foreground">Warranty terms and conditions</p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => toast.info("Downloading warranty information...")}>
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>

                <Separator className="my-4" />

                <div>
                  <h3 className="text-lg font-medium mb-3">Additional Resources</h3>
                  <div className="space-y-2">
                    <Button variant="link" className="h-auto p-0 flex items-center" onClick={() => toast.info("Opening manufacturer website...")}>
                      <ExternalLink className="h-4 w-4 mr-1" /> 
                      Visit Manufacturer Website
                    </Button>
                    <Button variant="link" className="h-auto p-0 flex items-center" onClick={() => toast.info("Opening support portal...")}>
                      <ExternalLink className="h-4 w-4 mr-1" /> 
                      Technical Support Portal
                    </Button>
                    <Button variant="link" className="h-auto p-0 flex items-center" onClick={() => toast.info("Opening firmware download page...")}>
                      <ExternalLink className="h-4 w-4 mr-1" /> 
                      Latest Firmware Downloads
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Device Settings</CardTitle>
                <CardDescription>Configuration and management options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Quick Actions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <Button variant="outline" className="flex justify-start" onClick={() => toast.info("Opening firmware update tool...")}>
                      <Cpu className="h-4 w-4 mr-2" />
                      Update Firmware
                    </Button>
                    <Button variant="outline" className="flex justify-start" onClick={() => toast.info("Network configuration coming soon...")}>
                      <Link className="h-4 w-4 mr-2" />
                      Network Settings
                    </Button>
                    <Button variant="outline" className="flex justify-start" onClick={() => toast.info("Notification settings coming soon...")}>
                      <Bell className="h-4 w-4 mr-2" />
                      Notifications
                    </Button>
                    <Button variant="outline" className="flex justify-start" onClick={() => toast.info("Security settings coming soon...")}>
                      <Shield className="h-4 w-4 mr-2" />
                      Security
                    </Button>
                    <Button variant="outline" className="flex justify-start" onClick={() => toast.info("Remote diagnostics coming soon...")}>
                      <Activity className="h-4 w-4 mr-2" />
                      Diagnostics
                    </Button>
                    <Button variant="outline" className="flex justify-start" onClick={() => navigate(`/devices/${deviceId}/edit`)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Details
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Danger Zone</h3>
                  <p className="text-sm text-muted-foreground">These actions cannot be undone.</p>
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => toast.info("Factory reset functionality coming soon")}
                    >
                      Reset to Factory Settings
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={handleDeleteDevice}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Device
                    </Button>
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

export default DeviceDetails;
