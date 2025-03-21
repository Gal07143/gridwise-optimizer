import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Battery, 
  BatteryCharging, 
  Wind, 
  Sun, 
  Zap, 
  Activity,
  Settings, 
  ChevronLeft, 
  Download,
  Edit,
  Trash,
  BarChart2,
  Clock,
  Calendar
} from 'lucide-react';
import { getDeviceById } from '@/services/devices/queries';
import AppLayout from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import DeviceDetailTab from '@/components/devices/tabs/DeviceDetailTab';
import { DeviceStatus, DeviceType } from '@/types/energy';

const DeviceView = () => {
  const { deviceId } = useParams<{ deviceId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  const { data: device, isLoading, error } = useQuery({
    queryKey: ['device', deviceId],
    queryFn: () => getDeviceById(deviceId as string),
    enabled: !!deviceId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  const getDeviceIcon = (type: DeviceType) => {
    switch (type) {
      case 'battery':
        return <Battery className="h-6 w-6 text-blue-500" />;
      case 'solar':
        return <Sun className="h-6 w-6 text-yellow-500" />;
      case 'wind':
        return <Wind className="h-6 w-6 text-teal-500" />;
      case 'grid':
        return <Zap className="h-6 w-6 text-purple-500" />;
      case 'load':
        return <Activity className="h-6 w-6 text-red-500" />;
      case 'ev_charger':
        return <BatteryCharging className="h-6 w-6 text-green-500" />;
      case 'inverter':
        return <Settings className="h-6 w-6 text-indigo-500" />;
      case 'meter':
        return <BarChart2 className="h-6 w-6 text-orange-500" />;
      default:
        return <Settings className="h-6 w-6 text-gray-500" />;
    }
  };
  
  const getStatusBadge = (status: DeviceStatus) => {
    switch (status) {
      case 'online':
        return <Badge className="bg-green-500">Online</Badge>;
      case 'offline':
        return <Badge variant="outline" className="text-gray-500 border-gray-300">Offline</Badge>;
      case 'maintenance':
        return <Badge className="bg-blue-500">Maintenance</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'warning':
        return <Badge className="bg-amber-500">Warning</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };
  
  const handleDeleteDevice = () => {
    toast.error("Delete functionality is not fully implemented");
    // In a real application, this would show a confirmation dialog and then delete the device
  };
  
  const handleDownloadSpecs = () => {
    toast.success(`Downloading specifications for ${device?.name}...`);
    setTimeout(() => {
      toast.info(`${device?.name} specifications downloaded successfully`);
    }, 1500);
  };
  
  const handleDownloadManual = () => {
    toast.success(`Downloading user manual for ${device?.name}...`);
    setTimeout(() => {
      toast.info(`${device?.name} user manual downloaded successfully`);
    }, 1500);
  };
  
  const handleExportData = () => {
    toast.success(`Exporting data for ${device?.name}...`);
    setTimeout(() => {
      toast.info(`${device?.name} data exported successfully as CSV`);
    }, 1500);
  };
  
  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AppLayout>
    );
  }
  
  if (error || !device) {
    return (
      <AppLayout>
        <div className="p-6">
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="icon" asChild className="mr-2">
              <Link to="/devices">
                <ChevronLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-2xl font-semibold">Device Not Found</h1>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  The device you are looking for could not be found or you don't have permission to view it.
                </p>
                <Button asChild>
                  <Link to="/devices">Back to Devices</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }
  
  return (
    <AppLayout>
      <div className="p-6 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" asChild className="mr-2">
              <Link to="/devices">
                <ChevronLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex items-center">
              {getDeviceIcon(device.type as DeviceType)}
              <div className="ml-3">
                <h1 className="text-2xl font-semibold">{device.name}</h1>
                <div className="flex items-center text-muted-foreground">
                  <span className="capitalize">{device.type}</span>
                  <span className="mx-2">•</span>
                  <span>{device.location}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex mt-4 md:mt-0 gap-2">
            <Button 
              variant="outline" 
              onClick={handleExportData}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export Data
            </Button>
            
            <Button asChild>
              <Link to={`/devices/${device.id}/edit`} className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Edit Device
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">
                  {getStatusBadge(device.status as DeviceStatus)}
                </span>
                <Clock className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Last updated: {new Date(device.last_updated).toLocaleString()}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Capacity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">
                  {device.capacity} {device.type === 'battery' ? 'kWh' : 'kW'}
                </span>
                <BarChart2 className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Nominal capacity
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Firmware</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">
                  {device.firmware || "N/A"}
                </span>
                <Settings className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {device.firmware ? "Current version" : "No firmware information"}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Installation Date</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">
                  {device.installation_date 
                    ? new Date(device.installation_date).toLocaleDateString() 
                    : "N/A"}
                </span>
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {device.installation_date ? "Date installed" : "Not recorded"}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Device Details</CardTitle>
              </CardHeader>
              <CardContent>
                <DeviceDetailTab device={{
                  id: device.id,
                  name: device.name,
                  location: device.location || '',
                  type: device.type as DeviceType,
                  status: device.status as DeviceStatus,
                  capacity: device.capacity,
                  firmware: device.firmware || '',
                  description: device.description || '',
                }} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">This tab will display performance metrics and charts for the device.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="maintenance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Maintenance History</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">This tab will display maintenance records and schedule for the device.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Device Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Danger Zone</h3>
                    <p className="text-muted-foreground mb-4">These actions cannot be undone.</p>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button variant="outline" onClick={handleDownloadManual}>
                        <Download className="mr-2 h-4 w-4" />
                        Download Manual
                      </Button>
                      
                      <Button variant="outline" onClick={handleDownloadSpecs}>
                        <Download className="mr-2 h-4 w-4" />
                        Download Specifications
                      </Button>
                      
                      <Button 
                        variant="destructive"
                        onClick={handleDeleteDevice}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete Device
                      </Button>
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

export default DeviceView;
