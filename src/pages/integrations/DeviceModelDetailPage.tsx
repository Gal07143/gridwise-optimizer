
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Battery, 
  FileText, 
  Code, 
  Settings, 
  Cpu, 
  History,
  Download,
  BarChart,
  EditIcon,
  Trash2,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from '@/integrations/supabase/client';

// Mock data for device model details
const mockDeviceModels = {
  'b1': {
    id: 'b1',
    manufacturer: 'Tesla',
    model: 'Powerwall 2',
    deviceType: 'batteries',
    protocol: 'Modbus TCP',
    firmware: 'v1.45.2',
    supported: true,
    hasManual: true,
    hasRegisterMap: true,
    description: 'The Powerwall 2 is a rechargeable lithium-ion battery stationary energy storage product manufactured by Tesla Energy. The 14 kWh Powerwall 2 was unveiled in October 2016.',
    tecSpecs: {
      capacity: '13.5 kWh',
      power: '7 kW peak / 5 kW continuous',
      efficiency: '90%',
      dimensions: '1150 x 753 x 147 mm',
      weight: '125 kg',
      voltage: '380-480V AC (3-phase)',
      operating_temp: '-20°C to 50°C',
    },
    integrationNotes: 'Tesla Powerwall 2 can be integrated via the Tesla Energy API or Modbus TCP. It requires firmware 1.45.0 or higher for full functionality.',
    compatibleInverters: ['SolarEdge StorEdge', 'Tesla Backup Gateway', 'Fronius Symo Hybrid'],
    knownIssues: [
      'May disconnect during firmware updates',
      'API rate limiting can cause temporary unavailability',
      'Power readings may fluctuate under very low load conditions'
    ],
    configOptions: [
      {name: 'Reserve Percentage', description: 'Minimum battery level to maintain (0-100%)', default: '20%'},
      {name: 'Storm Watch', description: 'Automatically charge from grid before storms', default: 'Enabled'},
      {name: 'Time-Based Control', description: 'Charge/discharge based on time schedule', default: 'Disabled'}
    ]
  },
  'i1': {
    id: 'i1',
    manufacturer: 'SMA',
    model: 'Sunny Boy 5.0',
    deviceType: 'inverters',
    protocol: 'Modbus TCP',
    firmware: 'v3.20.13.R',
    supported: true,
    hasManual: true,
    hasRegisterMap: true,
    description: 'The Sunny Boy 5.0 is a transformerless string inverter for residential solar installations. It features SMA Smart Connected service for automatic monitoring and diagnostics.',
    tecSpecs: {
      max_power: '5000W',
      efficiency: '97.2%',
      max_input_voltage: '600V DC',
      dimensions: '435 x 470 x 176 mm',
      weight: '16 kg',
      mppt_channels: '2',
      grid_voltage: '230V / 240V',
    },
    integrationNotes: 'SMA Sunny Boy can be integrated via Modbus TCP or the proprietary SMA Speedwire protocol. It requires a data connection through either Ethernet or RS485.',
    compatibleBatteries: ['None - grid-tie only'],
    knownIssues: [
      'Web interface may become unresponsive under high network load',
      'Modbus register documentation may differ between firmware versions'
    ],
    configOptions: [
      {name: 'Grid Guard', description: 'Grid protection settings (country-specific)', default: 'As per region'},
      {name: 'Power Limitation', description: 'Maximum export power', default: '100%'},
      {name: 'Reactive Power Control', description: 'Power factor adjustment', default: '1.0 (disabled)'}
    ]
  }
};

const DeviceModelDetailPage = () => {
  const { deviceId } = useParams<{ deviceId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  // In a real app, this would be fetched from the database
  const deviceModel = mockDeviceModels[deviceId as keyof typeof mockDeviceModels];
  
  if (!deviceModel) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Device Not Found</h2>
          <p className="text-muted-foreground mb-6">The device model you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/integrations">Back to Integrations</Link>
          </Button>
        </div>
      </AppLayout>
    );
  }
  
  const handleDownloadManual = () => {
    toast.info('Downloading device manual...');
  };
  
  const handleDownloadRegisterMap = () => {
    toast.info('Downloading register map...');
  };
  
  const handleDelete = () => {
    toast.success('Device model deleted successfully');
    setTimeout(() => {
      navigate('/integrations');
    }, 1500);
  };
  
  const getDeviceTypeIcon = (type: string) => {
    switch (type) {
      case 'batteries':
        return <Battery className="h-5 w-5" />;
      case 'inverters':
        return <Cpu className="h-5 w-5" />;
      case 'ev-chargers':
        return <Battery className="h-5 w-5" />;
      case 'meters':
        return <BarChart className="h-5 w-5" />;
      case 'controllers':
        return <Settings className="h-5 w-5" />;
      default:
        return <Settings className="h-5 w-5" />;
    }
  };
  
  const deviceTypeLabels = {
    'batteries': 'Battery System',
    'inverters': 'Inverter',
    'ev-chargers': 'EV Charger',
    'meters': 'Energy Meter',
    'controllers': 'Microgrid Controller'
  };
  
  return (
    <AppLayout>
      <div className="flex flex-col gap-6 p-6 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold mb-1">{deviceModel.manufacturer} {deviceModel.model}</h1>
              <div className="flex items-center gap-2">
                <Badge className="bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200 flex items-center gap-1">
                  {getDeviceTypeIcon(deviceModel.deviceType)}
                  <span>{deviceTypeLabels[deviceModel.deviceType as keyof typeof deviceTypeLabels]}</span>
                </Badge>
                
                {deviceModel.supported ? (
                  <Badge className="bg-green-500">Supported</Badge>
                ) : (
                  <Badge variant="outline" className="border-amber-500 text-amber-500">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Not Supported
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to={`/integrations/edit-device/${deviceId}`}>
                <EditIcon className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the {deviceModel.manufacturer} {deviceModel.model} device model and all associated data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="technical">Technical Details</TabsTrigger>
            <TabsTrigger value="integration">Integration</TabsTrigger>
            <TabsTrigger value="documentation">Documentation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Device Overview</CardTitle>
                <CardDescription>Basic information about this device model</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Device Information</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Manufacturer</span>
                        <span className="font-medium">{deviceModel.manufacturer}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Model</span>
                        <span className="font-medium">{deviceModel.model}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Type</span>
                        <span className="font-medium">{deviceTypeLabels[deviceModel.deviceType as keyof typeof deviceTypeLabels]}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Protocol</span>
                        <span className="font-medium">{deviceModel.protocol}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Firmware</span>
                        <span className="font-medium">{deviceModel.firmware}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Description</h3>
                    <p className="text-muted-foreground">{deviceModel.description}</p>
                    
                    <div className="mt-6">
                      <h4 className="font-medium mb-2">Support Status</h4>
                      <div className="flex items-center gap-2 p-3 rounded-md bg-muted">
                        {deviceModel.supported ? (
                          <>
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <div>
                              <p className="font-medium">Fully Supported</p>
                              <p className="text-sm text-muted-foreground">This device is fully supported and tested with our system.</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-5 w-5 text-amber-500" />
                            <div>
                              <p className="font-medium">Limited Support</p>
                              <p className="text-sm text-muted-foreground">This device has limited support or is under testing.</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Available Documentation</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {deviceModel.hasManual && (
                      <div className="flex items-center gap-3 p-4 border rounded-md">
                        <FileText className="h-8 w-8 text-blue-500" />
                        <div className="flex-1">
                          <h4 className="font-medium">User Manual</h4>
                          <p className="text-sm text-muted-foreground">Complete documentation and installation guide</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={handleDownloadManual}>
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    )}
                    
                    {deviceModel.hasRegisterMap && (
                      <div className="flex items-center gap-3 p-4 border rounded-md">
                        <Code className="h-8 w-8 text-purple-500" />
                        <div className="flex-1">
                          <h4 className="font-medium">Register Map</h4>
                          <p className="text-sm text-muted-foreground">Modbus registers for device integration</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={handleDownloadRegisterMap}>
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="technical" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Technical Specifications</CardTitle>
                <CardDescription>Detailed technical information about this device</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="overflow-hidden border rounded-md">
                  <table className="w-full">
                    <tbody>
                      {deviceModel.tecSpecs && Object.entries(deviceModel.tecSpecs).map(([key, value]) => (
                        <tr key={key} className="border-b last:border-0">
                          <td className="px-4 py-3 bg-muted font-medium capitalize">{key.replace('_', ' ')}</td>
                          <td className="px-4 py-3">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Configuration Options</h3>
                  <div className="overflow-hidden border rounded-md">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted">
                          <th className="px-4 py-3 text-left font-medium">Setting</th>
                          <th className="px-4 py-3 text-left font-medium">Description</th>
                          <th className="px-4 py-3 text-left font-medium">Default</th>
                        </tr>
                      </thead>
                      <tbody>
                        {deviceModel.configOptions && deviceModel.configOptions.map((option, index) => (
                          <tr key={index} className="border-b last:border-0">
                            <td className="px-4 py-3 font-medium">{option.name}</td>
                            <td className="px-4 py-3">{option.description}</td>
                            <td className="px-4 py-3">{option.default}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {deviceModel.knownIssues && deviceModel.knownIssues.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-3">Known Issues</h3>
                    <ul className="space-y-2 list-disc pl-5">
                      {deviceModel.knownIssues.map((issue, index) => (
                        <li key={index} className="text-muted-foreground">{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="integration" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Integration Information</CardTitle>
                <CardDescription>Details for integrating this device with your system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Integration Notes</h3>
                  <p className="text-muted-foreground">{deviceModel.integrationNotes}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Compatible Devices</h3>
                  <div className="overflow-hidden border rounded-md">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted">
                          <th className="px-4 py-3 text-left font-medium">Device Type</th>
                          <th className="px-4 py-3 text-left font-medium">Compatible Models</th>
                        </tr>
                      </thead>
                      <tbody>
                        {deviceModel.compatibleInverters && (
                          <tr className="border-b">
                            <td className="px-4 py-3 font-medium">Inverters</td>
                            <td className="px-4 py-3">
                              <ul className="list-disc pl-5">
                                {deviceModel.compatibleInverters.map((item, index) => (
                                  <li key={index}>{item}</li>
                                ))}
                              </ul>
                            </td>
                          </tr>
                        )}
                        
                        {deviceModel.compatibleBatteries && (
                          <tr className="border-b">
                            <td className="px-4 py-3 font-medium">Batteries</td>
                            <td className="px-4 py-3">
                              <ul className="list-disc pl-5">
                                {deviceModel.compatibleBatteries.map((item, index) => (
                                  <li key={index}>{item}</li>
                                ))}
                              </ul>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Integration Requirements</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-md">
                      <h4 className="font-medium flex items-center gap-2 mb-2">
                        <Code className="h-4 w-4" />
                        Communication Protocol
                      </h4>
                      <p className="text-sm text-muted-foreground">{deviceModel.protocol}</p>
                    </div>
                    
                    <div className="p-4 border rounded-md">
                      <h4 className="font-medium flex items-center gap-2 mb-2">
                        <Settings className="h-4 w-4" />
                        Firmware Requirements
                      </h4>
                      <p className="text-sm text-muted-foreground">Minimum version: {deviceModel.firmware}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="documentation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Documentation</CardTitle>
                <CardDescription>User manuals, technical documents, and guides</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {deviceModel.hasManual && (
                    <div className="border p-6 rounded-md">
                      <div className="flex items-center gap-3 mb-4">
                        <FileText className="h-10 w-10 text-blue-500" />
                        <div>
                          <h3 className="font-medium">User Manual</h3>
                          <p className="text-sm text-muted-foreground">Installation, operation and maintenance guide</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">PDF Document</span>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <a href="#" target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-1" />
                              View
                            </a>
                          </Button>
                          <Button size="sm" onClick={handleDownloadManual}>
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {deviceModel.hasRegisterMap && (
                    <div className="border p-6 rounded-md">
                      <div className="flex items-center gap-3 mb-4">
                        <Code className="h-10 w-10 text-purple-500" />
                        <div>
                          <h3 className="font-medium">Register Map</h3>
                          <p className="text-sm text-muted-foreground">Complete Modbus register definitions</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">PDF/Excel Document</span>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <a href="#" target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-1" />
                              View
                            </a>
                          </Button>
                          <Button size="sm" onClick={handleDownloadRegisterMap}>
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Additional Resources</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b pb-3">
                      <div className="flex items-center gap-3">
                        <ExternalLink className="h-5 w-5 text-muted-foreground" />
                        <span>Manufacturer Website</span>
                      </div>
                      <Button variant="link" asChild>
                        <a href="#" target="_blank" rel="noopener noreferrer">Visit Website</a>
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between border-b pb-3">
                      <div className="flex items-center gap-3">
                        <History className="h-5 w-5 text-muted-foreground" />
                        <span>Release Notes</span>
                      </div>
                      <Button variant="link" asChild>
                        <a href="#" target="_blank" rel="noopener noreferrer">View</a>
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

export default DeviceModelDetailPage;
