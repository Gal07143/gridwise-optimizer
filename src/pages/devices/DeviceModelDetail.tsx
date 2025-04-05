import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  Download, 
  ExternalLink, 
  Package, 
  Cpu, 
  Zap,
  Clipboard,
  Calendar,
  Tag,
  CheckCircle
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { getDeviceModelById } from '@/services/deviceCatalogService';
import { toast } from 'sonner';
import AppLayout from '@/components/layout/AppLayout';

const DeviceModelDetail = () => {
  const { modelId } = useParams<{ modelId: string }>();
  const navigate = useNavigate();
  
  // Fetch device model details
  const { 
    data: deviceModel, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['deviceModel', modelId],
    queryFn: () => modelId ? getDeviceModelById(modelId) : Promise.resolve(null),
    enabled: !!modelId
  });
  
  const handleAddToMyDevices = () => {
    navigate(`/devices/add?modelId=${modelId}`);
  };
  
  const handleCopySerialNumber = () => {
    if (deviceModel?.model_number) {
      navigator.clipboard.writeText(deviceModel.model_number);
      toast.success("Model number copied to clipboard");
    }
  };
  
  const getSupportLevelBadge = (level?: 'full' | 'partial' | 'none') => {
    switch (level) {
      case 'full':
        return <Badge className="bg-green-600">Fully Supported</Badge>;
      case 'partial':
        return <Badge className="bg-amber-600">Partial Support</Badge>;
      case 'none':
      default:
        return <Badge variant="outline">Not Supported</Badge>;
    }
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
                Device Not Found
              </CardTitle>
              <CardDescription className="text-red-700 dark:text-red-400">
                The device model you are looking for could not be found.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => navigate('/devices/catalog')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Device Catalog
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
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-4 pl-0 hover:pl-2 transition-all"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <div className="flex items-center">
              <Package className="h-6 w-6 mr-2 text-primary" />
              <h1 className="text-2xl font-bold">
                {deviceModel.manufacturer} {deviceModel.model_name}
              </h1>
            </div>
            <div className="flex items-center mt-1 text-muted-foreground">
              <Tag className="h-4 w-4 mr-1" />
              <span>{deviceModel.model_number}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0 ml-1" 
                onClick={handleCopySerialNumber}
              >
                <Clipboard className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" onClick={() => navigate(`/devices/edit-model/${modelId}`)}>
              Edit Device Model
            </Button>
            <Button onClick={handleAddToMyDevices}>
              Add to My Devices
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Device Information</CardTitle>
              <CardDescription>Basic details and specifications</CardDescription>
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
                      {deviceModel.device_type.replace('_', ' ')}
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
              </dl>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Technical Specifications</CardTitle>
              <CardDescription>Detailed technical information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Table>
                  <TableBody>
                    {deviceModel.power_rating && (
                      <TableRow>
                        <TableCell className="font-medium">Power Rating</TableCell>
                        <TableCell>{deviceModel.power_rating} W</TableCell>
                      </TableRow>
                    )}
                    {deviceModel.capacity && (
                      <TableRow>
                        <TableCell className="font-medium">Capacity</TableCell>
                        <TableCell>{deviceModel.capacity} kWh</TableCell>
                      </TableRow>
                    )}
                    {deviceModel.warranty && (
                      <TableRow>
                        <TableCell className="font-medium">Warranty</TableCell>
                        <TableCell>{deviceModel.warranty}</TableCell>
                      </TableRow>
                    )}
                    {deviceModel.protocol && (
                      <TableRow>
                        <TableCell className="font-medium">Communication Protocol</TableCell>
                        <TableCell>{deviceModel.protocol}</TableCell>
                      </TableRow>
                    )}
                    {deviceModel.certifications && deviceModel.certifications.length > 0 && (
                      <TableRow>
                        <TableCell className="font-medium">Certifications</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {deviceModel.certifications.map((cert, i) => (
                              <Badge key={i} variant="outline">{cert}</Badge>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                
                {deviceModel.description && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                    <p className="text-sm">{deviceModel.description}</p>
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
            <TabsTrigger value="installations">Installation Guide</TabsTrigger>
          </TabsList>
          
          <TabsContent value="documentation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Available Documentation</CardTitle>
                <CardDescription>Manuals, datasheets and other resources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deviceModel.has_manual && (
                    <div className="flex justify-between items-center p-3 border rounded-md">
                      <div className="flex items-center">
                        <svg className="h-5 w-5 mr-2 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19 16V3H5V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M19 16H5V21H19V16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M9 8H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M9 12H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>User Manual</span>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  )}
                  
                  {deviceModel.has_datasheet && (
                    <div className="flex justify-between items-center p-3 border rounded-md">
                      <div className="flex items-center">
                        <svg className="h-5 w-5 mr-2 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>Technical Datasheet</span>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  )}
                  
                  {deviceModel.has_video && (
                    <div className="flex justify-between items-center p-3 border rounded-md">
                      <div className="flex items-center">
                        <svg className="h-5 w-5 mr-2 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M23 7L16 12L23 17V7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <rect x="1" y="5" width="15" height="14" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>Installation Video</span>
                      </div>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </div>
                  )}
                  
                  {!deviceModel.has_manual && !deviceModel.has_datasheet && !deviceModel.has_video && (
                    <div className="text-center py-4 text-muted-foreground">
                      <p>No documentation is currently available for this device.</p>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center p-3 border rounded-md">
                    <div className="flex items-center">
                      <ExternalLink className="h-5 w-5 mr-2 text-primary" />
                      <span>Manufacturer Website</span>
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
                <CardDescription>Devices that work well with this model</CardDescription>
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
                  <div className="text-center py-4 text-muted-foreground">
                    <p>No compatibility information available.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="installations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Installation Guide</CardTitle>
                <CardDescription>Steps to set up this device</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4 text-muted-foreground">
                  <p>Installation guide coming soon.</p>
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
