
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { fetchDeviceModelById } from '@/services/deviceModelsService';
import { toast } from 'sonner';
import { 
  ChevronLeft, 
  Download,
  ExternalLink,
  Edit,
  BookOpen,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Wifi,
  Cable,
  Settings,
  BarChart4
} from 'lucide-react';

const DeviceModelDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  const { data: device, isLoading, error } = useQuery({
    queryKey: ['deviceModel', id],
    queryFn: () => fetchDeviceModelById(id || ''),
    enabled: !!id,
  });
  
  const handleEditDevice = () => {
    navigate(`/integrations/device-model/${id}/edit`);
  };
  
  const handleDownloadManual = () => {
    if (device?.has_manual) {
      toast.success(`Downloading manual for ${device.name}...`);
      // In a real scenario, this would download an actual file
      setTimeout(() => {
        toast.info(`${device.name} manual downloaded successfully`);
      }, 1500);
    } else {
      toast.info("Manual not available for this device");
    }
  };
  
  const handleDownloadDatasheet = () => {
    if (device?.has_datasheet) {
      toast.success(`Downloading datasheet for ${device.name}...`);
      setTimeout(() => {
        toast.info(`${device.name} datasheet downloaded successfully`);
      }, 1500);
    } else {
      toast.info("Datasheet not available for this device");
    }
  };
  
  const handleViewVideo = () => {
    if (device?.has_video) {
      toast.success(`Opening video for ${device.name}...`);
      // In a real app, this would open a modal with the video
      setTimeout(() => {
        toast.info(`${device.name} installation video opened`);
      }, 1500);
    } else {
      toast.info("Video not available for this device");
    }
  };
  
  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="flex flex-col items-center">
            <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Loading device model data...</p>
          </div>
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
              <div onClick={() => navigate('/integrations')}>
                <ChevronLeft className="h-5 w-5" />
              </div>
            </Button>
            <h1 className="text-2xl font-semibold">Device Model Not Found</h1>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <AlertTriangle className="h-12 w-12 mx-auto text-amber-500 mb-4" />
                <p className="text-muted-foreground mb-4">
                  The device model you are looking for could not be found or you don't have permission to view it.
                </p>
                <Button asChild>
                  <div onClick={() => navigate('/integrations')}>
                    Back to Integrations
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }
  
  const getSupportBadge = (supportLevel: 'full' | 'partial' | 'none') => {
    switch (supportLevel) {
      case 'full':
        return (
          <Badge className="bg-green-500 hover:bg-green-600 gap-1 flex items-center">
            <CheckCircle2 className="h-3 w-3" />
            Fully Supported
          </Badge>
        );
      case 'partial':
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600 gap-1 flex items-center">
            <AlertTriangle className="h-3 w-3" />
            Partial Support
          </Badge>
        );
      case 'none':
        return (
          <Badge variant="outline" className="gap-1 flex items-center text-muted-foreground">
            <AlertTriangle className="h-3 w-3" />
            Not Supported
          </Badge>
        );
    }
  };
  
  return (
    <AppLayout>
      <div className="p-6 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" asChild className="mr-2">
              <div onClick={() => navigate('/integrations')}>
                <ChevronLeft className="h-5 w-5" />
              </div>
            </Button>
            <div>
              <h1 className="text-2xl font-semibold">{device.name}</h1>
              <div className="flex items-center text-muted-foreground">
                <span className="capitalize">{device.device_type}</span>
                <span className="mx-2">•</span>
                <span>{device.manufacturer}</span>
              </div>
            </div>
          </div>
          
          <div className="flex mt-4 md:mt-0 gap-2">
            <Button 
              variant="outline" 
              onClick={handleDownloadDatasheet}
              className="flex items-center gap-2"
              disabled={!device.has_datasheet}
            >
              <Download className="h-4 w-4" />
              Datasheet
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleDownloadManual}
              className="flex items-center gap-2"
              disabled={!device.has_manual}
            >
              <BookOpen className="h-4 w-4" />
              Manual
            </Button>
            
            <Button 
              onClick={handleEditDevice}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit Device
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Support Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">
                  {getSupportBadge(device.support_level)}
                </span>
                <Settings className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Integration compatibility level
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Model</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">
                  {device.model_number}
                </span>
                <Cpu className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Model reference
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {device.device_type === 'battery' ? 'Capacity' : 'Power Rating'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">
                  {device.device_type === 'battery' 
                    ? `${device.capacity || 'N/A'} kWh` 
                    : `${device.power_rating || 'N/A'} kW`}
                </span>
                <BarChart4 className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {device.device_type === 'battery' ? 'Energy storage capacity' : 'Maximum power output'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Protocol</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">
                  {device.protocol}
                </span>
                <Cable className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Communication protocol
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="connectivity">Connectivity</TabsTrigger>
            <TabsTrigger value="documentation">Documentation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Device Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Description</h3>
                  <p className="text-muted-foreground">
                    {device.description || 'No description available.'}
                  </p>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium">Manufacturer</h4>
                    <p>{device.manufacturer}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium">Model Number</h4>
                    <p>{device.model_number}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium">Category</h4>
                    <p className="capitalize">{device.category || device.device_type}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium">Release Date</h4>
                    <p>{device.release_date ? new Date(device.release_date).toLocaleDateString() : 'Unknown'}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium">Firmware Version</h4>
                    <p>{device.firmware_version || 'Not specified'}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium">Protocol</h4>
                    <p>{device.protocol}</p>
                  </div>
                  
                  {device.warranty && (
                    <div>
                      <h4 className="text-sm font-medium">Warranty</h4>
                      <p>{device.warranty}</p>
                    </div>
                  )}
                  
                  {device.certifications && device.certifications.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium">Certifications</h4>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {device.certifications.map((cert, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="specifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Technical Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                {device.specifications ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(device.specifications).map(([key, value]) => (
                        <div key={key}>
                          <h4 className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                          <p>{value}</p>
                        </div>
                      ))}
                      
                      {device.device_type === 'battery' && (
                        <div>
                          <h4 className="text-sm font-medium">Capacity</h4>
                          <p>{device.capacity} kWh</p>
                        </div>
                      )}
                      
                      {device.device_type !== 'battery' && device.power_rating && (
                        <div>
                          <h4 className="text-sm font-medium">Power Rating</h4>
                          <p>{device.power_rating} kW</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No specifications available for this device model.</p>
                )}
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Physical Specifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium">Dimensions</h4>
                      <p>{device.specifications?.dimensions || 'Not specified'}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium">Weight</h4>
                      <p>{device.specifications?.weight ? `${device.specifications.weight} kg` : 'Not specified'}</p>
                    </div>
                    
                    {device.specifications?.color && (
                      <div>
                        <h4 className="text-sm font-medium">Color</h4>
                        <p>{device.specifications.color}</p>
                      </div>
                    )}
                    
                    {device.specifications?.mountingType && (
                      <div>
                        <h4 className="text-sm font-medium">Mounting Type</h4>
                        <p>{device.specifications.mountingType}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Operational Specifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {device.specifications?.operatingTemperature && (
                      <div>
                        <h4 className="text-sm font-medium">Operating Temperature</h4>
                        <p>{device.specifications.operatingTemperature}</p>
                      </div>
                    )}
                    
                    {device.specifications?.ipRating && (
                      <div>
                        <h4 className="text-sm font-medium">IP Rating</h4>
                        <p>{device.specifications.ipRating}</p>
                      </div>
                    )}
                    
                    {device.specifications?.noiseLevel && (
                      <div>
                        <h4 className="text-sm font-medium">Noise Level</h4>
                        <p>{device.specifications.noiseLevel}</p>
                      </div>
                    )}
                    
                    {device.specifications?.cooling && (
                      <div>
                        <h4 className="text-sm font-medium">Cooling</h4>
                        <p>{device.specifications.cooling}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="connectivity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wifi className="h-5 w-5" />
                  Connectivity Options
                </CardTitle>
              </CardHeader>
              <CardContent>
                {device.connectivity ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium">Wi-Fi</h4>
                        <p>{device.connectivity.wifi ? 'Yes' : 'No'}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium">Ethernet</h4>
                        <p>{device.connectivity.ethernet ? 'Yes' : 'No'}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium">Bluetooth</h4>
                        <p>{device.connectivity.bluetooth ? 'Yes' : 'No'}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium">Cellular</h4>
                        <p>{device.connectivity.cellular ? 'Yes' : 'No'}</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Communication Protocols</h4>
                      <div className="flex flex-wrap gap-1">
                        {device.connectivity.protocols && device.connectivity.protocols.map((protocol: string, index: number) => (
                          <Badge key={index} variant="outline">
                            {protocol}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No connectivity information available for this device model.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="documentation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Documentation & Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="bg-muted/50">
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center">
                        <BookOpen className="h-8 w-8 mb-4 text-primary" />
                        <h3 className="font-medium mb-2">User Manual</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {device.has_manual 
                            ? 'Comprehensive guide for installation and operation'
                            : 'Manual not available for this device'}
                        </p>
                        <Button onClick={handleDownloadManual} disabled={!device.has_manual}>
                          Download Manual
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-muted/50">
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center">
                        <Download className="h-8 w-8 mb-4 text-primary" />
                        <h3 className="font-medium mb-2">Datasheet</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {device.has_datasheet
                            ? 'Technical specifications and performance data'
                            : 'Datasheet not available for this device'}
                        </p>
                        <Button onClick={handleDownloadDatasheet} disabled={!device.has_datasheet}>
                          Download Datasheet
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-muted/50">
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center">
                        <ExternalLink className="h-8 w-8 mb-4 text-primary" />
                        <h3 className="font-medium mb-2">Installation Video</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {device.has_video
                            ? 'Step-by-step installation tutorial video'
                            : 'Video not available for this device'}
                        </p>
                        <Button onClick={handleViewVideo} disabled={!device.has_video}>
                          Watch Video
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
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
