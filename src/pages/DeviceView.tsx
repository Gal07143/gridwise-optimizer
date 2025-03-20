
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getDeviceById } from '@/services/devices';
import AppLayout from '@/components/layout/AppLayout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { 
  AlertTriangle, 
  ArrowLeft, 
  Battery, 
  BatteryCharging,
  Download, 
  Eye, 
  FileText,
  Cpu, 
  Settings, 
  Zap,
  Activity,
  Lightbulb,
  Wind,
  ExternalLink
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DeviceView = () => {
  const { deviceId } = useParams<{ deviceId: string }>();
  const navigate = useNavigate();
  
  const { data: device, isLoading, error } = useQuery({
    queryKey: ['device', deviceId],
    queryFn: () => getDeviceById(deviceId as string),
    enabled: !!deviceId
  });

  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock data for the charts
  const energyData = [
    { time: '00:00', value: 12 },
    { time: '04:00', value: 8 },
    { time: '08:00', value: 15 },
    { time: '12:00', value: 22 },
    { time: '16:00', value: 18 },
    { time: '20:00', value: 14 },
    { time: '24:00', value: 10 },
  ];
  
  const temperatureData = [
    { time: '00:00', value: 32 },
    { time: '04:00', value: 30 },
    { time: '08:00', value: 34 },
    { time: '12:00', value: 38 },
    { time: '16:00', value: 40 },
    { time: '20:00', value: 36 },
    { time: '24:00', value: 33 },
  ];

  // Get device icon based on type
  const getDeviceIcon = (type: string | undefined) => {
    if (!type) return <Settings className="h-8 w-8 text-gray-500" />;
    
    switch (type) {
      case 'battery':
        return <Battery className="h-8 w-8 text-blue-500" />;
      case 'inverter':
        return <Zap className="h-8 w-8 text-green-500" />;
      case 'ev-charger':
        return <BatteryCharging className="h-8 w-8 text-purple-500" />;
      case 'meter':
        return <Activity className="h-8 w-8 text-orange-500" />;
      case 'light':
        return <Lightbulb className="h-8 w-8 text-yellow-500" />;
      case 'wind':
        return <Wind className="h-8 w-8 text-teal-500" />;
      default:
        return <Settings className="h-8 w-8 text-gray-500" />;
    }
  };

  // Get status badge based on status
  const getStatusBadge = (status: string | undefined) => {
    if (!status) return <Badge variant="secondary">Unknown</Badge>;
    
    switch (status) {
      case 'online':
        return <Badge className="bg-green-500">Online</Badge>;
      case 'offline':
        return <Badge variant="outline" className="text-gray-500 border-gray-300">Offline</Badge>;
      case 'warning':
        return <Badge className="bg-amber-500">Warning</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  // Handler for download buttons
  const handleDownload = (type: string) => {
    if (!device) return;
    
    switch (type) {
      case 'specs':
        toast.success(`Downloading specifications for ${device.name}...`);
        setTimeout(() => {
          toast.info(`${device.name} specifications downloaded successfully`);
        }, 1500);
        break;
      case 'manual':
        toast.success(`Downloading user manual for ${device.name}...`);
        setTimeout(() => {
          toast.info(`${device.name} user manual downloaded successfully`);
        }, 1500);
        break;
      case 'data':
        toast.success(`Exporting data for ${device.name}...`);
        setTimeout(() => {
          toast.info(`${device.name} data exported successfully as CSV`);
        }, 1500);
        break;
      default:
        break;
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container p-6">
          <Skeleton className="h-8 w-48 mb-4" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Skeleton className="h-[400px] w-full" />
            </div>
            <div>
              <Skeleton className="h-[200px] w-full mb-4" />
              <Skeleton className="h-[200px] w-full" />
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error || !device) {
    return (
      <AppLayout>
        <div className="container p-6">
          <Button 
            variant="outline" 
            className="mb-4" 
            onClick={() => navigate('/devices')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Devices
          </Button>
          
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load device details. The device may not exist or there was a network error.
            </AlertDescription>
          </Alert>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container p-6 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate('/devices')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-3">
              {getDeviceIcon(device.type)}
              <div>
                <h1 className="text-2xl font-semibold">{device.name}</h1>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">{device.location || 'No location'}</p>
                  {getStatusBadge(device.status)}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 mt-4 sm:mt-0">
            <Button variant="outline" size="sm" asChild>
              <Link to={`/edit-device/${device.id}`}>
                <Settings className="mr-2 h-4 w-4" />
                Edit Device
              </Link>
            </Button>
            
            <Button size="sm">
              <Eye className="mr-2 h-4 w-4" />
              Live View
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          </TabsList>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TabsContent value="overview">
                <Card>
                  <CardHeader>
                    <CardTitle>Device Overview</CardTitle>
                    <CardDescription>
                      Key information and current status of {device.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Basic Information</h3>
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          <div className="col-span-1 text-sm">Type:</div>
                          <div className="col-span-2 text-sm font-medium capitalize">{device.type}</div>
                          
                          <div className="col-span-1 text-sm">Status:</div>
                          <div className="col-span-2 text-sm font-medium capitalize">{device.status}</div>
                          
                          <div className="col-span-1 text-sm">Capacity:</div>
                          <div className="col-span-2 text-sm font-medium">{device.capacity} {device.type === 'battery' ? 'kWh' : 'kW'}</div>
                          
                          <div className="col-span-1 text-sm">Firmware:</div>
                          <div className="col-span-2 text-sm font-medium">{device.firmware || 'Unknown'}</div>
                          
                          <div className="col-span-1 text-sm">ID:</div>
                          <div className="col-span-2 text-sm font-medium overflow-hidden text-ellipsis">{device.id}</div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Current Metrics</h3>
                        {device.metrics ? (
                          <div className="grid grid-cols-3 gap-2">
                            {Object.entries(device.metrics).map(([key, value]) => (
                              <React.Fragment key={key}>
                                <div className="col-span-1 text-sm">{key}:</div>
                                <div className="col-span-2 text-sm font-medium">{value}</div>
                              </React.Fragment>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">No metrics available</p>
                        )}
                      </div>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-4">Energy Output (24h)</h3>
                      <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={energyData}>
                          <defs>
                            <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#0284c7" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#0284c7" stopOpacity={0.1}/>
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="time" />
                          <YAxis />
                          <CartesianGrid strokeDasharray="3 3" />
                          <Tooltip />
                          <Area type="monotone" dataKey="value" stroke="#0284c7" fillOpacity={1} fill="url(#colorEnergy)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="performance">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                    <CardDescription>
                      Detailed performance data for {device.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-4">Energy Output (24h)</h3>
                        <ResponsiveContainer width="100%" height={200}>
                          <AreaChart data={energyData}>
                            <defs>
                              <linearGradient id="colorEnergy2" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0284c7" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#0284c7" stopOpacity={0.1}/>
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="time" />
                            <YAxis />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip />
                            <Area type="monotone" dataKey="value" stroke="#0284c7" fillOpacity={1} fill="url(#colorEnergy2)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-4">Temperature (24h)</h3>
                        <ResponsiveContainer width="100%" height={200}>
                          <AreaChart data={temperatureData}>
                            <defs>
                              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="time" />
                            <YAxis />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip />
                            <Area type="monotone" dataKey="value" stroke="#ef4444" fillOpacity={1} fill="url(#colorTemp)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="specifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Technical Specifications</CardTitle>
                    <CardDescription>
                      Detailed technical information about {device.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">General Specifications</h3>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="col-span-1 text-sm">Model:</div>
                          <div className="col-span-2 text-sm font-medium">{device.name}</div>
                          
                          <div className="col-span-1 text-sm">Type:</div>
                          <div className="col-span-2 text-sm font-medium capitalize">{device.type}</div>
                          
                          <div className="col-span-1 text-sm">Firmware:</div>
                          <div className="col-span-2 text-sm font-medium">{device.firmware || 'Unknown'}</div>
                          
                          <div className="col-span-1 text-sm">Nominal Capacity:</div>
                          <div className="col-span-2 text-sm font-medium">{device.capacity} {device.type === 'battery' ? 'kWh' : 'kW'}</div>
                          
                          <div className="col-span-1 text-sm">Installation Date:</div>
                          <div className="col-span-2 text-sm font-medium">{device.installation_date || 'Unknown'}</div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Technical Details</h3>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="col-span-1 text-sm">Operating Voltage:</div>
                          <div className="col-span-2 text-sm font-medium">230V AC</div>
                          
                          <div className="col-span-1 text-sm">Max Current:</div>
                          <div className="col-span-2 text-sm font-medium">32A</div>
                          
                          <div className="col-span-1 text-sm">Communication:</div>
                          <div className="col-span-2 text-sm font-medium">Modbus TCP, MQTT</div>
                          
                          <div className="col-span-1 text-sm">Efficiency:</div>
                          <div className="col-span-2 text-sm font-medium">94%</div>
                          
                          <div className="col-span-1 text-sm">Dimensions:</div>
                          <div className="col-span-2 text-sm font-medium">600 x 400 x 200 mm</div>
                          
                          <div className="col-span-1 text-sm">Weight:</div>
                          <div className="col-span-2 text-sm font-medium">45 kg</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleDownload('specs')}>
                        <FileText className="mr-2 h-4 w-4" />
                        Download Full Specifications
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDownload('manual')}>
                        <Download className="mr-2 h-4 w-4" />
                        Download User Manual
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="maintenance">
                <Card>
                  <CardHeader>
                    <CardTitle>Maintenance History</CardTitle>
                    <CardDescription>
                      Service and maintenance records for {device.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="border rounded-md p-4">
                        <div className="flex justify-between mb-2">
                          <h3 className="font-medium">Routine Maintenance</h3>
                          <span className="text-sm text-muted-foreground">April 15, 2023</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">Regular inspection and cleaning</p>
                        <div className="text-sm">
                          <span className="font-medium">Technician:</span> John Smith
                        </div>
                      </div>
                      
                      <div className="border rounded-md p-4">
                        <div className="flex justify-between mb-2">
                          <h3 className="font-medium">Firmware Update</h3>
                          <span className="text-sm text-muted-foreground">February 22, 2023</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">Updated firmware from v1.2.3 to v1.3.0</p>
                        <div className="text-sm">
                          <span className="font-medium">Technician:</span> Remote Update
                        </div>
                      </div>
                      
                      <div className="border rounded-md p-4">
                        <div className="flex justify-between mb-2">
                          <h3 className="font-medium">Installation</h3>
                          <span className="text-sm text-muted-foreground">January 10, 2023</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">Initial device installation and setup</p>
                        <div className="text-sm">
                          <span className="font-medium">Technician:</span> Installation Team
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleDownload('data')}>
                        <Download className="mr-2 h-4 w-4" />
                        Export Maintenance Records
                      </Button>
                      <Button asChild size="sm">
                        <Link to={`/edit-device/${device.id}?tab=maintenance`}>
                          <Cpu className="mr-2 h-4 w-4" />
                          Schedule Maintenance
                        </Link>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full" asChild>
                    <Link to={`/edit-device/${device.id}`}>
                      <Settings className="mr-2 h-4 w-4" />
                      Edit Device
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => handleDownload('manual')}>
                    <FileText className="mr-2 h-4 w-4" />
                    Download Manual
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => handleDownload('specs')}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Specs
                  </Button>
                  <Button variant="outline" className="w-full">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Manufacturer Website
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Device Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">System Health</span>
                        <span className="text-sm font-medium">90%</span>
                      </div>
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-2 bg-green-500 rounded-full" style={{ width: '90%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Efficiency</span>
                        <span className="text-sm font-medium">85%</span>
                      </div>
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-2 bg-blue-500 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Connectivity</span>
                        <span className="text-sm font-medium">100%</span>
                      </div>
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-2 bg-green-500 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Next Maintenance</h3>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Scheduled for:</span>
                        <span className="font-medium ml-2">June 15, 2023</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default DeviceView;
