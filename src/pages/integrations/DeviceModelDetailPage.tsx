
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { 
  Battery, ChevronLeft, Download, FileText, Cpu, HardDrive, Wifi, Zap, 
  CheckCircle, XCircle, Globe, AlertCircle, Edit, Trash2, Plus, Copy
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { categoryNames } from '@/hooks/useDeviceModels';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const DeviceModelDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  
  // Simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Mocked device data - in a real app, this would be fetched from the API
  const deviceModel = {
    id: id || 'b1',
    manufacturer: 'Tesla',
    model: 'Powerwall 2',
    category: 'batteries',
    type: 'Lithium-ion Battery Storage',
    protocol: 'Modbus TCP',
    firmware: 'v1.45.2',
    supported: true,
    hasManual: true,
    releaseDate: '2021-05-15',
    capacity: '13.5 kWh',
    nominalVoltage: '50V DC',
    peakPower: '7 kW',
    continuousPower: '5 kW',
    dimensions: '115.6 x 75.3 x 15.5 cm',
    weight: '114 kg',
    warranty: '10 years',
    efficiency: '90%',
    connectionTypes: ['Ethernet', 'Wi-Fi'],
    certifications: ['UL', 'IEC', 'CE'],
    compatibilityNotes: 'Compatible with all Grid-tied solar systems',
    description: 'The Powerwall 2 is a rechargeable home battery system that stores energy from solar or from the grid and makes it available on demand. It can power your home during the night or back up your home in the event of a power outage.'
  };
  
  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'batteries':
        return <Battery className="h-5 w-5" />;
      case 'inverters':
        return <Zap className="h-5 w-5" />;
      case 'ev-chargers':
        return <Zap className="h-5 w-5" />;
      case 'meters':
        return <Cpu className="h-5 w-5" />;
      case 'controllers':
        return <HardDrive className="h-5 w-5" />;
      default:
        return <Cpu className="h-5 w-5" />;
    }
  };
  
  const handleAddToSystem = () => {
    toast.success('Device model added to your system');
  };
  
  const handleCopyDeviceId = () => {
    navigator.clipboard.writeText(id || 'b1');
    toast.success('Device ID copied to clipboard');
  };
  
  const handleDelete = () => {
    setConfirmDeleteOpen(false);
    toast.success('Device model deleted');
    navigate('/integrations');
  };
  
  const handleDownloadManual = () => {
    toast.success('Downloading manual...');
  };
  
  const handleDownloadSpecs = () => {
    toast.success('Downloading technical specifications...');
  };
  
  const handleVisitManufacturer = () => {
    toast.info('Opening manufacturer website...');
  };
  
  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex flex-col gap-6 p-6 animate-in fade-in duration-500">
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-8 w-64" />
          </div>
          <Skeleton className="h-[500px] w-full" />
        </div>
      </AppLayout>
    );
  }
  
  return (
    <AppLayout>
      <div className="flex flex-col gap-6 p-6 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link to={`/integrations/${deviceModel.category}`}>
                <ChevronLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-2xl font-semibold">{deviceModel.manufacturer} {deviceModel.model}</h1>
            {deviceModel.supported ? (
              <Badge className="bg-green-500">Supported</Badge>
            ) : (
              <Badge variant="outline" className="border-amber-500 text-amber-500">
                <AlertCircle className="h-3 w-3 mr-1" />
                Not Supported
              </Badge>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCopyDeviceId}>
              <Copy className="h-4 w-4 mr-2" />
              Copy ID
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to={`/integrations/edit-device-model/${id}`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </Button>
            <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Device Model</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete {deviceModel.manufacturer} {deviceModel.model}? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4">
                  <Button variant="outline" onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
                  <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <p className="text-muted-foreground">
          {deviceModel.description}
        </p>
        
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-2/3">
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="technical">Technical Specs</TabsTrigger>
                <TabsTrigger value="compatibility">Compatibility</TabsTrigger>
                <TabsTrigger value="firmware">Firmware</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Manufacturer</p>
                        <p className="text-base">{deviceModel.manufacturer}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Model</p>
                        <p className="text-base">{deviceModel.model}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Category</p>
                        <p className="text-base flex items-center gap-1">
                          {getCategoryIcon(deviceModel.category)}
                          {categoryNames[deviceModel.category as keyof typeof categoryNames]}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Type</p>
                        <p className="text-base">{deviceModel.type}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Protocol</p>
                        <p className="text-base">{deviceModel.protocol}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Release Date</p>
                        <p className="text-base">{deviceModel.releaseDate}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Warranty</p>
                        <p className="text-base">{deviceModel.warranty}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Status</p>
                        <p className="text-base flex items-center gap-1">
                          {deviceModel.supported ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              Fully Supported
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 text-amber-500" />
                              Not Supported
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Key Specifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Capacity</p>
                        <p className="text-base">{deviceModel.capacity}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Nominal Voltage</p>
                        <p className="text-base">{deviceModel.nominalVoltage}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Peak Power</p>
                        <p className="text-base">{deviceModel.peakPower}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Continuous Power</p>
                        <p className="text-base">{deviceModel.continuousPower}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Efficiency</p>
                        <p className="text-base">{deviceModel.efficiency}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Physical Size</p>
                        <p className="text-base">{deviceModel.dimensions}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="technical" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Detailed Specifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Specification</TableHead>
                          <TableHead>Value</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Capacity</TableCell>
                          <TableCell>{deviceModel.capacity}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Nominal Voltage</TableCell>
                          <TableCell>{deviceModel.nominalVoltage}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Peak Power</TableCell>
                          <TableCell>{deviceModel.peakPower}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Continuous Power</TableCell>
                          <TableCell>{deviceModel.continuousPower}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Dimensions</TableCell>
                          <TableCell>{deviceModel.dimensions}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Weight</TableCell>
                          <TableCell>{deviceModel.weight}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Efficiency</TableCell>
                          <TableCell>{deviceModel.efficiency}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Operating Temperature</TableCell>
                          <TableCell>-20°C to 50°C</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Cycle Life</TableCell>
                          <TableCell>~4000 cycles</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Connectivity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium mb-2">Connection Types</p>
                        <div className="flex flex-wrap gap-2">
                          {deviceModel.connectionTypes.map((type) => (
                            <Badge key={type} variant="outline" className="flex items-center gap-1">
                              <Wifi className="h-3 w-3" />
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium mb-2">Certifications</p>
                        <div className="flex flex-wrap gap-2">
                          {deviceModel.certifications.map((cert) => (
                            <Badge key={cert} variant="outline">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="compatibility" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>System Compatibility</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">{deviceModel.compatibilityNotes}</p>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Grid-Tied Solar Systems</p>
                          <p className="text-sm text-muted-foreground">Compatible with most grid-tied solar inverters</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Off-Grid Systems</p>
                          <p className="text-sm text-muted-foreground">Can be used in off-grid configurations with appropriate equipment</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Time-of-Use Rate Optimization</p>
                          <p className="text-sm text-muted-foreground">Supports time-based control for electricity rate optimization</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <XCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                        <div>
                          <p className="font-medium">Three-Phase Systems</p>
                          <p className="text-sm text-muted-foreground">Not compatible with three-phase power systems without additional equipment</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="firmware" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Firmware Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">Current Version</p>
                          <p className="text-base">{deviceModel.firmware}</p>
                        </div>
                        <Badge className="bg-green-500">Latest</Badge>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <p className="font-medium mb-2">Update History</p>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Version</TableHead>
                              <TableHead>Release Date</TableHead>
                              <TableHead>Changes</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-medium">v1.45.2</TableCell>
                              <TableCell>2023-05-15</TableCell>
                              <TableCell>Security enhancements and bug fixes</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">v1.45.0</TableCell>
                              <TableCell>2023-03-22</TableCell>
                              <TableCell>Added support for new grid codes</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">v1.44.2</TableCell>
                              <TableCell>2023-01-10</TableCell>
                              <TableCell>Performance improvements and bug fixes</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                      
                      <div className="pt-4">
                        <p className="font-medium mb-2">Update Method</p>
                        <p className="text-sm">
                          Updates can be performed remotely via the manufacturer's cloud platform or locally using the device's web interface.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="lg:w-1/3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" onClick={handleAddToSystem}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add to My System
                </Button>
                <Button variant="outline" className="w-full" onClick={handleDownloadManual} disabled={!deviceModel.hasManual}>
                  <FileText className="h-4 w-4 mr-2" />
                  Download Manual
                </Button>
                <Button variant="outline" className="w-full" onClick={handleDownloadSpecs}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Specifications
                </Button>
                <Button variant="outline" className="w-full" onClick={handleVisitManufacturer}>
                  <Globe className="h-4 w-4 mr-2" />
                  Visit Manufacturer Website
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Integration Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-2">
                  {deviceModel.supported ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                  )}
                  <div>
                    <p className="font-medium">
                      {deviceModel.supported ? 'Fully Supported' : 'Not Supported'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {deviceModel.supported 
                        ? 'This device is fully supported by our system with all features available.'
                        : 'This device is not officially supported. Limited functionality may be available.'}
                    </p>
                  </div>
                </div>
                
                {deviceModel.supported && (
                  <>
                    <Separator />
                    
                    <div>
                      <p className="font-medium mb-2">Supported Features</p>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Real-time monitoring</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Remote configuration</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Energy scheduling</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Firmware updates</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Automated alerts</span>
                        </li>
                      </ul>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default DeviceModelDetailPage;
