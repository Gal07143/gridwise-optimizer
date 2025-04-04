
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getDeviceModelById } from '@/services/deviceCatalogService';
import { DeviceModel } from '@/types/device-model';
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  ArrowLeft,
  Download,
  ExternalLink,
  BookOpen,
  Settings,
  Info,
  Package,
  BarChart4,
  Calendar,
  ChevronRight,
  ChevronsRight,
  Tag,
  CheckCircle,
  AlertCircle,
  Cpu,
  Layers,
  Shield,
  Weight,
  Ruler,
  Zap,
  FileText,
  Video,
  DownloadCloud
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/components/layout/AppLayout';

const DeviceModelDetail = () => {
  const { modelId } = useParams<{ modelId: string }>();
  const navigate = useNavigate();
  
  // Fetch device model details
  const { 
    data: deviceModel, 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ['deviceModel', modelId],
    queryFn: () => modelId ? getDeviceModelById(modelId) : Promise.resolve(null),
    enabled: !!modelId
  });

  const getDeviceTypeIcon = (deviceType?: string) => {
    switch (deviceType) {
      case 'battery':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'solar':
        return <Zap className="h-5 w-5 text-yellow-500" />;
      case 'inverter':
        return <Cpu className="h-5 w-5 text-green-500" />;
      case 'ev_charger':
        return <Zap className="h-5 w-5 text-purple-500" />;
      case 'meter':
        return <BarChart4 className="h-5 w-5 text-orange-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const handleAddToMyDevices = () => {
    navigate(`/devices/add?modelId=${modelId}`);
  };
  
  const handleCopyModelNumber = () => {
    if (deviceModel?.model_number) {
      navigator.clipboard.writeText(deviceModel.model_number);
      toast.success("Model number copied to clipboard");
    }
  };
  
  const getSupportLevelBadge = (level?: 'full' | 'partial' | 'none') => {
    switch (level) {
      case 'full':
        return (
          <Badge className="bg-green-600 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Fully Supported
          </Badge>
        );
      case 'partial':
        return (
          <Badge className="bg-amber-600 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Partial Support
          </Badge>
        );
      case 'none':
      default:
        return (
          <Badge variant="outline" className="flex items-center gap-1 text-muted-foreground">
            <AlertCircle className="h-3 w-3" />
            Not Supported
          </Badge>
        );
    }
  };

  const handleOpenManual = () => {
    if (deviceModel?.has_manual) {
      // In a production app, this would link to actual downloadable content
      toast.info(`Opening manual for ${deviceModel.name}`, {
        action: {
          label: "Close",
          onClick: () => {}
        }
      });
    } else {
      toast.info("Manual not available for this device model");
    }
  };

  const handleOpenDatasheet = () => {
    if (deviceModel?.has_datasheet) {
      // In a production app, this would link to actual downloadable content
      toast.info(`Opening datasheet for ${deviceModel.model_name}`, {
        action: {
          label: "Close",
          onClick: () => {}
        }
      });
    } else {
      toast.info("Datasheet not available for this device model");
    }
  };

  const handleOpenVideo = () => {
    if (deviceModel?.has_video) {
      // In a production app, this would link to actual video content
      toast.info(`Opening installation video for ${deviceModel.model_name}`, {
        action: {
          label: "Close",
          onClick: () => {}
        }
      });
    } else {
      toast.info("Installation video not available for this device model");
    }
  };

  const handleExportSpecifications = () => {
    toast.success(`Exporting specifications for ${deviceModel?.model_name}...`);
    setTimeout(() => {
      toast.info(`Specifications exported successfully`);
    }, 1000);
  };
  
  if (isLoading) {
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
  
  if (error || !deviceModel) {
    return (
      <AppLayout>
        <div className="container mx-auto p-4">
          <Card className="border-red-200 bg-red-50 dark:bg-red-900/10">
            <CardHeader>
              <CardTitle className="text-red-800 dark:text-red-300">
                Device Model Not Found
              </CardTitle>
              <CardDescription className="text-red-700 dark:text-red-400">
                The device model you are looking for could not be found or might have been removed.
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex gap-2">
              <Button onClick={() => navigate(-1)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
              <Button variant="outline" onClick={() => refetch()}>
                Retry
              </Button>
            </CardFooter>
          </Card>
        </div>
      </AppLayout>
    );
  }
  
  // Organize specifications
  const specs = deviceModel.specifications || {};
  const generalSpecs: Record<string, any> = {};
  const electricalSpecs: Record<string, any> = {};
  const physicalSpecs: Record<string, any> = {};
  const communicationSpecs: Record<string, any> = {};
  
  // Sort specifications into categories
  Object.entries(specs).forEach(([key, value]) => {
    if (['dimensions', 'weight', 'ip_rating', 'mounting', 'frame', 'operating_temperature'].includes(key)) {
      physicalSpecs[key] = value;
    } else if (['voltage', 'current', 'power', 'efficiency', 'max_voltage', 'max_input_voltage', 'max_current', 'voltage_range'].includes(key)) {
      electricalSpecs[key] = value;
    } else if (['communication', 'connectivity', 'protocol', 'connector_type'].includes(key)) {
      communicationSpecs[key] = value;
    } else {
      generalSpecs[key] = value;
    }
  });

  // Format specification values
  const formatSpecValue = (key: string, value: any): string => {
    if (value === null || value === undefined) return 'N/A';
    
    if (key === 'efficiency' || key.includes('efficiency')) {
      return `${value}%`;
    } else if (key === 'temperature_coefficient') {
      return `${value}%/°C`;
    } else if (key === 'weight') {
      return `${value} kg`;
    } else if (key.includes('temperature')) {
      return typeof value === 'string' ? value : `${value}°C`;
    } else if (Array.isArray(value)) {
      return value.join(', ');
    }
    
    return String(value);
  };
  
  return (
    <AppLayout>
      <div className="container mx-auto p-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-4 pl-0 hover:pl-2 transition-all"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Models
        </Button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <div className="flex items-center">
              {getDeviceTypeIcon(deviceModel.device_type)}
              <h1 className="text-2xl font-bold ml-2">
                {deviceModel.manufacturer} {deviceModel.model_name}
              </h1>
            </div>
            <div className="flex items-center mt-1 text-muted-foreground">
              <Tag className="h-4 w-4 mr-1" />
              <span>{deviceModel.model_number}</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0 ml-1" 
                      onClick={handleCopyModelNumber}
                    >
                      <FileText className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy model number</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button variant="secondary" onClick={handleExportSpecifications}>
              <DownloadCloud className="h-4 w-4 mr-2" />
              Export Specifications
            </Button>
            <Button onClick={handleAddToMyDevices}>
              <ChevronsRight className="h-4 w-4 mr-2" />
              Add to My Devices
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Device Information</CardTitle>
              <CardDescription>Manufacturer and general details</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Manufacturer</dt>
                  <dd className="mt-1">{deviceModel.manufacturer}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Model</dt>
                  <dd className="mt-1">{deviceModel.model_name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Type</dt>
                  <dd className="mt-1 flex">
                    <Badge variant="outline" className="capitalize">
                      {(deviceModel.device_type || '').replace('_', ' ')}
                    </Badge>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Protocol</dt>
                  <dd className="mt-1">{deviceModel.protocol || 'Not specified'}</dd>
                </div>
                {deviceModel.release_date && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Release Date</dt>
                    <dd className="mt-1 flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                      {new Date(deviceModel.release_date).toLocaleDateString()}
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Support Level</dt>
                  <dd className="mt-1">{getSupportLevelBadge(deviceModel.support_level)}</dd>
                </div>
                {deviceModel.warranty && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Warranty</dt>
                    <dd className="mt-1">{deviceModel.warranty}</dd>
                  </div>
                )}
                {deviceModel.certifications && deviceModel.certifications.length > 0 && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Certifications</dt>
                    <dd className="mt-1 flex flex-wrap gap-1">
                      {deviceModel.certifications.map((cert, i) => (
                        <Badge key={i} variant="outline" className="flex items-center gap-1">
                          <Shield className="h-3 w-3" />
                          {cert}
                        </Badge>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Technical Specifications</CardTitle>
              <CardDescription>Detailed product information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Description</h3>
                  <p>{deviceModel.description || 'No description available.'}</p>
                </div>

                {Object.keys(generalSpecs).length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">General</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                      {Object.entries(generalSpecs).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-1 border-b">
                          <span className="text-sm capitalize">{key.replace(/_/g, ' ')}</span>
                          <span className="text-sm font-medium">{formatSpecValue(key, value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {Object.keys(electricalSpecs).length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-2 flex items-center">
                      <Zap className="h-4 w-4 mr-1 text-muted-foreground" />
                      Electrical
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                      {Object.entries(electricalSpecs).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-1 border-b">
                          <span className="text-sm capitalize">{key.replace(/_/g, ' ')}</span>
                          <span className="text-sm font-medium">{formatSpecValue(key, value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {Object.keys(physicalSpecs).length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-2 flex items-center">
                      <Ruler className="h-4 w-4 mr-1 text-muted-foreground" />
                      Physical
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                      {Object.entries(physicalSpecs).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-1 border-b">
                          <span className="text-sm capitalize">{key.replace(/_/g, ' ')}</span>
                          <span className="text-sm font-medium">{formatSpecValue(key, value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {Object.keys(communicationSpecs).length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">Communication</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                      {Object.entries(communicationSpecs).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-1 border-b">
                          <span className="text-sm capitalize">{key.replace(/_/g, ' ')}</span>
                          <span className="text-sm font-medium">{formatSpecValue(key, value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="documentation" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="documentation">Documentation</TabsTrigger>
            <TabsTrigger value="compatibility">Compatibility</TabsTrigger>
            <TabsTrigger value="installation">Installation Guide</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
          </TabsList>
          
          <TabsContent value="documentation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Available Documentation</CardTitle>
                <CardDescription>Manuals, datasheets and other resources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className={`flex justify-between items-center p-3 border rounded-md ${!deviceModel.has_manual && 'opacity-50'}`}>
                    <div className="flex items-center">
                      <BookOpen className="h-5 w-5 mr-2 text-primary" />
                      <div>
                        <div className="text-sm font-medium">User Manual</div>
                        <div className="text-xs text-muted-foreground">Complete operation and maintenance guide</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" disabled={!deviceModel.has_manual} onClick={handleOpenManual}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                  
                  <div className={`flex justify-between items-center p-3 border rounded-md ${!deviceModel.has_datasheet && 'opacity-50'}`}>
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-primary" />
                      <div>
                        <div className="text-sm font-medium">Technical Datasheet</div>
                        <div className="text-xs text-muted-foreground">Detailed specifications and technical information</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" disabled={!deviceModel.has_datasheet} onClick={handleOpenDatasheet}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                  
                  <div className={`flex justify-between items-center p-3 border rounded-md ${!deviceModel.has_video && 'opacity-50'}`}>
                    <div className="flex items-center">
                      <Video className="h-5 w-5 mr-2 text-primary" />
                      <div>
                        <div className="text-sm font-medium">Installation Video</div>
                        <div className="text-xs text-muted-foreground">Step-by-step visual installation guide</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" disabled={!deviceModel.has_video} onClick={handleOpenVideo}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border rounded-md">
                    <div className="flex items-center">
                      <ExternalLink className="h-5 w-5 mr-2 text-primary" />
                      <div>
                        <div className="text-sm font-medium">Manufacturer Website</div>
                        <div className="text-xs text-muted-foreground">Visit official product page</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="compatibility" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Compatible Devices</CardTitle>
                <CardDescription>Works well with these devices in your system</CardDescription>
              </CardHeader>
              <CardContent>
                {deviceModel.compatible_with && deviceModel.compatible_with.length > 0 ? (
                  <div className="space-y-2">
                    {deviceModel.compatible_with.map((device, index) => (
                      <div key={index} className="flex items-center p-2 rounded hover:bg-muted">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                        <span>{device}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 space-y-2">
                    <Info className="h-10 w-10 text-muted-foreground mx-auto" />
                    <p className="text-muted-foreground">Compatibility information is not available for this device.</p>
                    <Button variant="outline" size="sm">
                      Request Compatibility Data
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Components</CardTitle>
                <CardDescription>Recommended additional components</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {deviceModel.device_type === 'inverter' && (
                    <>
                      <Card className="border shadow-sm hover:shadow-md transition-all">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Solar Panels</CardTitle>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <p className="text-sm text-muted-foreground">Compatible solar panels that work optimally with this inverter.</p>
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline" size="sm" className="w-full">
                            <ChevronRight className="h-4 w-4 mr-1" />
                            View Compatible Panels
                          </Button>
                        </CardFooter>
                      </Card>

                      <Card className="border shadow-sm hover:shadow-md transition-all">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Battery Storage</CardTitle>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <p className="text-sm text-muted-foreground">Compatible battery systems for energy storage.</p>
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline" size="sm" className="w-full">
                            <ChevronRight className="h-4 w-4 mr-1" />
                            View Compatible Batteries
                          </Button>
                        </CardFooter>
                      </Card>
                    </>
                  )}

                  {deviceModel.device_type === 'battery' && (
                    <>
                      <Card className="border shadow-sm hover:shadow-md transition-all">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Inverters</CardTitle>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <p className="text-sm text-muted-foreground">Compatible inverters for this battery system.</p>
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline" size="sm" className="w-full">
                            <ChevronRight className="h-4 w-4 mr-1" />
                            View Compatible Inverters
                          </Button>
                        </CardFooter>
                      </Card>

                      <Card className="border shadow-sm hover:shadow-md transition-all">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">BMS Systems</CardTitle>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <p className="text-sm text-muted-foreground">Battery management systems for optimal performance.</p>
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline" size="sm" className="w-full">
                            <ChevronRight className="h-4 w-4 mr-1" />
                            View Compatible BMS
                          </Button>
                        </CardFooter>
                      </Card>
                    </>
                  )}

                  <Card className="border shadow-sm hover:shadow-md transition-all">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Control Systems</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-muted-foreground">Energy management and monitoring solutions.</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full">
                        <ChevronRight className="h-4 w-4 mr-1" />
                        View Control Systems
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="installation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Installation Guide</CardTitle>
                <CardDescription>Step-by-step guide to installing this device</CardDescription>
              </CardHeader>
              <CardContent>
                {deviceModel.has_manual ? (
                  <div className="space-y-6">
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <p className="text-sm italic text-muted-foreground">
                        This is a summarized installation guide. Always refer to the manufacturer's installation manual for complete instructions.
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium flex items-center">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm mr-2">1</span>
                          Preparation
                        </h3>
                        <p className="mt-2 ml-8 text-sm">
                          Check all components for damage. Verify site conditions meet installation requirements.
                          Gather all necessary tools and personal protective equipment.
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium flex items-center">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm mr-2">2</span>
                          Mounting
                        </h3>
                        <p className="mt-2 ml-8 text-sm">
                          Locate a suitable mounting location according to specifications. 
                          Follow proper mounting procedures for the device type.
                          Ensure proper clearance for ventilation and service access.
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium flex items-center">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm mr-2">3</span>
                          Electrical Connections
                        </h3>
                        <p className="mt-2 ml-8 text-sm">
                          All electrical work must be performed by a qualified electrician.
                          Follow local electrical codes and regulations.
                          Connect according to wiring diagrams provided in the manual.
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium flex items-center">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm mr-2">4</span>
                          Configuration
                        </h3>
                        <p className="mt-2 ml-8 text-sm">
                          Configure device settings according to system requirements.
                          Follow initialization and setup procedures in the manual.
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium flex items-center">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm mr-2">5</span>
                          Testing and Commissioning
                        </h3>
                        <p className="mt-2 ml-8 text-sm">
                          Perform system tests to verify proper operation.
                          Document all test results and system parameters.
                          Complete commissioning checklist.
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-md">
                      <h4 className="font-medium mb-2">Safety Notes</h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>Always disconnect power before working on the device</li>
                        <li>Follow all local codes and regulations</li>
                        <li>Use appropriate personal protective equipment</li>
                        <li>Do not modify the device in any way</li>
                      </ul>
                    </div>
                    
                    <div className="flex justify-center">
                      <Button onClick={handleOpenManual} className="flex items-center">
                        <BookOpen className="mr-2 h-4 w-4" />
                        View Complete Installation Manual
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <Info className="h-12 w-12 text-muted-foreground mx-auto" />
                    <h3 className="text-lg font-medium mt-4">Installation Guide Not Available</h3>
                    <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                      A detailed installation guide is not available for this device model. Please contact the manufacturer or consult an authorized installer.
                    </p>
                    <Button className="mt-6" variant="outline">
                      Request Installation Guide
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="gallery" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Product Gallery</CardTitle>
                <CardDescription>Images and media of this device</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-16">
                  <Info className="h-12 w-12 text-muted-foreground mx-auto" />
                  <h3 className="text-lg font-medium mt-4">Gallery Coming Soon</h3>
                  <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                    We're working on adding product images and media for this device.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default DeviceModelDetail;
