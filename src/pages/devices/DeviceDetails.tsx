
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getDeviceById, deleteDevice } from '@/services/deviceService';
import { Device } from '@/types/device';
import { Button } from '@/components/ui/button';
import { Main } from '@/components/ui/main';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Battery, Edit, ExternalLink, Grid, Settings, Trash2 } from 'lucide-react';
import { getStatusAwareDeviceIcon } from '@/utils/deviceIconUtils';
import { DeviceControlsPanel } from '@/components/microgrid/DeviceControlsPanel';
import { DeviceDetailTab } from '@/components/devices/tabs/DeviceDetailTab';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  AlertDialog, 
  AlertDialogTrigger, 
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel
} from '@/components/ui/alert-dialog';

const DeviceDetails = () => {
  const { deviceId } = useParams<{ deviceId: string }>();
  const navigate = useNavigate();
  const [device, setDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState('overview');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchDevice = async () => {
      if (!deviceId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const deviceData = await getDeviceById(deviceId);
        setDevice(deviceData);
      } catch (err) {
        console.error('Error fetching device:', err);
        setError('Failed to load device details. The device may not exist or there might be a connectivity issue.');
      } finally {
        setLoading(false);
      }
    };

    fetchDevice();
  }, [deviceId]);

  const handleDeleteDevice = async () => {
    if (!device) return;
    
    setIsDeleting(true);
    try {
      await deleteDevice(device.id);
      toast.success(`Device "${device.name}" deleted successfully`);
      navigate('/devices');
    } catch (err) {
      console.error('Error deleting device:', err);
      toast.error('Failed to delete device');
    } finally {
      setIsDeleting(false);
    }
  };

  const renderLoading = () => (
    <div className="h-48 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  const renderError = () => (
    <Alert variant="destructive" className="my-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {error}
        <div className="mt-4">
          <Link to="/devices">
            <Button variant="outline" size="sm">Return to devices</Button>
          </Link>
        </div>
      </AlertDescription>
    </Alert>
  );

  if (loading) {
    return (
      <Main>
        {renderLoading()}
      </Main>
    );
  }

  if (error || !device) {
    return (
      <Main>
        {renderError()}
      </Main>
    );
  }

  // Determine if we should show the battery tab
  const showBatteryTab = device.type === 'battery';

  return (
    <Main>
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 space-y-4 md:space-y-0">
        <div className="flex items-center">
          <div className="mr-3 p-2 bg-muted rounded-lg">
            {getStatusAwareDeviceIcon(device.type, device.status)}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{device.name}</h1>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>{device.type.charAt(0).toUpperCase() + device.type.slice(1)}</span>
              <span>•</span>
              <Badge variant="outline" className={
                device.status === 'online' ? 'border-green-200 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                device.status === 'offline' ? 'border-red-200 bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' :
                device.status === 'maintenance' ? 'border-amber-200 bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300' :
                'border-gray-200 bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
              }>
                {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
              </Badge>
              {device.location && (
                <>
                  <span>•</span>
                  <span>{device.location}</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link to={`/devices/${deviceId}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Device</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{device.name}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDeleteDevice} 
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      <Tabs 
        defaultValue="overview" 
        value={tabValue} 
        onValueChange={setTabValue}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="controls">Controls</TabsTrigger>
          {showBatteryTab && (
            <TabsTrigger value="battery">Battery</TabsTrigger>
          )}
          <TabsTrigger value="telemetry">Telemetry</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle>Device Details</CardTitle>
                <CardDescription>
                  Key information about this device
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DeviceDetailTab device={device} />
              </CardContent>
            </Card>
            
            <div className="flex flex-col space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Connection</span>
                      <Badge variant={device.status === 'online' ? 'success' : 'destructive'}>
                        {device.status === 'online' ? 'Connected' : 'Disconnected'}
                      </Badge>
                    </div>
                    
                    {device.protocol && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Protocol</span>
                        <span>{device.protocol}</span>
                      </div>
                    )}
                    
                    {device.last_updated && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Updated</span>
                        <span>{format(new Date(device.last_updated), 'MMM d, yyyy HH:mm')}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-4">
                    {device.description && (
                      <div>
                        <span className="text-muted-foreground">Description</span>
                        <p className="mt-1 text-sm">{device.description}</p>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type</span>
                      <span>{device.type.charAt(0).toUpperCase() + device.type.slice(1)}</span>
                    </div>
                    
                    {device.capacity && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Capacity</span>
                        <span>{device.capacity} W</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {device.type === 'battery' && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Battery Overview</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-between">
                  <div className="flex items-center">
                    <Battery className="h-8 w-8 mr-2 text-green-500" />
                    <div>
                      <span className="text-xl font-medium">65%</span>
                      <p className="text-sm text-muted-foreground">State of Charge</p>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-right">
                      <span className="text-xl font-medium">2.4 kW</span>
                      <p className="text-sm text-muted-foreground">Current Power</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {(device.type === 'battery' || device.type === 'inverter') && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Grid Connection</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-between">
                  <div className="flex items-center">
                    <Grid className="h-8 w-8 mr-2 text-blue-500" />
                    <div>
                      <span className="text-xl font-medium">Connected</span>
                      <p className="text-sm text-muted-foreground">Grid Status</p>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-right">
                      <span className="text-xl font-medium">1.2 kW</span>
                      <p className="text-sm text-muted-foreground">Grid Import</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {device.type === 'solar' && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Solar Production</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-between">
                  <div className="flex items-center">
                    <div>
                      <span className="text-xl font-medium">3.5 kW</span>
                      <p className="text-sm text-muted-foreground">Current Output</p>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-right">
                      <span className="text-xl font-medium">12.4 kWh</span>
                      <p className="text-sm text-muted-foreground">Today's Production</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="controls">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <div>
                  <CardTitle>Device Controls</CardTitle>
                  <CardDescription>
                    Manage and control your {device.type} device
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Settings className="mr-2 h-4 w-4" />
                  Advanced
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <DeviceControlsPanel deviceType={device.type} deviceId={device.id} />
            </CardContent>
          </Card>
        </TabsContent>
        
        {showBatteryTab && (
          <TabsContent value="battery">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Battery Management</CardTitle>
                <CardDescription>
                  Battery-specific controls and information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-medium mb-2">Technical Specifications</h3>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Chemistry</dt>
                        <dd className="font-mono">Lithium-Ion</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Capacity</dt>
                        <dd className="font-mono">{device.capacity || 0} Wh</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Max Power</dt>
                        <dd className="font-mono">5000 W</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Model</dt>
                        <dd className="font-mono">{device.model || "N/A"}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Manufacturer</dt>
                        <dd className="font-mono">{device.manufacturer || "N/A"}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Serial Number</dt>
                        <dd className="font-mono">{device.serialNumber || "N/A"}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
        
        <TabsContent value="telemetry">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Device Telemetry</CardTitle>
              <CardDescription>
                Real-time monitoring data from this device
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-center text-muted-foreground">Telemetry visualizations will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="maintenance">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Maintenance & Service</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2">Device Information</h3>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Protocol</dt>
                        <dd className="font-mono">{device.protocol || "N/A"}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Firmware</dt>
                        <dd className="font-mono">{device.firmware || "N/A"}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Last Update</dt>
                        <dd className="font-mono">{device.last_updated ? format(new Date(device.last_updated), 'MMM d, yyyy') : "N/A"}</dd>
                      </div>
                    </dl>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Network</h3>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">IP Address</dt>
                        <dd className="font-mono">{device.ip_address || "N/A"}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Protocol</dt>
                        <dd className="font-mono">{device.protocol || "N/A"}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Maintenance History</h3>
                  <div className="text-center p-4 text-muted-foreground text-sm">
                    No maintenance records found
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Device Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Location</h3>
                  {device.lat && device.lng ? (
                    <div className="flex flex-col space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Coordinates</span>
                        <span className="font-mono">{device.lat.toFixed(6)}, {device.lng.toFixed(6)}</span>
                      </div>
                      <div className="h-40 bg-muted rounded-md flex items-center justify-center">
                        Map visualization placeholder
                      </div>
                    </div>
                  ) : (
                    <div className="text-muted-foreground">
                      No location information available
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Tags</h3>
                  {device.tags && Object.keys(device.tags).length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(device.tags).map(([key, value]) => (
                        <Badge key={key} variant="secondary">
                          {key}: {String(value)}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <div className="text-muted-foreground">
                      No tags assigned
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">External Resources</h3>
                  <Button variant="outline" size="sm" className="mr-2">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Documentation
                  </Button>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Manufacturer Site
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Main>
  );
};

export default DeviceDetails;
