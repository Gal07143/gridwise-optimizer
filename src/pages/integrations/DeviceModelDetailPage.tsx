
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  ChevronRight, 
  Download, 
  ExternalLink, 
  Layers, 
  Package, 
  Settings 
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb';
import { executeSql } from '@/services/sqlExecutor';

// Create a getDeviceModelById function to replace the import
const getDeviceModelById = async (id: string) => {
  try {
    const query = `SELECT * FROM device_models WHERE id = '${id}'`;
    const result = await executeSql(query);
    return result && result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("Error fetching device model:", error);
    throw new Error("Failed to fetch device model details");
  }
};

const DeviceModelDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: deviceModel, isLoading, isError, error } = useQuery({
    queryKey: ['deviceModel', id],
    queryFn: () => getDeviceModelById(id as string),
    enabled: !!id
  });
  
  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  
  if (isError || !deviceModel) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Device Model Not Found</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : "The device model you are looking for could not be found."}
          </AlertDescription>
        </Alert>
        
        <Button onClick={() => navigate('/integrations')}>
          Back to Integrations
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href="/integrations">Integrations</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/integrations/device-models">Device Models</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink>{deviceModel.model_name}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Package className="h-6 w-6" />
            {deviceModel.model_name}
          </h1>
          <p className="text-muted-foreground">{deviceModel.manufacturer}</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/integrations/device-models/${id}/edit`)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Edit Model
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Download Specs
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Model Information</CardTitle>
            <CardDescription>Basic details about this device model</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Manufacturer</dt>
                <dd className="mt-1">{deviceModel.manufacturer}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Model Name</dt>
                <dd className="mt-1">{deviceModel.model_name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Device Type</dt>
                <dd className="mt-1 flex">
                  <Badge variant="outline">{deviceModel.device_type}</Badge>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Created</dt>
                <dd className="mt-1">{new Date(deviceModel.created_at).toLocaleDateString()}</dd>
              </div>
              {deviceModel.updated_at && (
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Last Updated</dt>
                  <dd className="mt-1">{new Date(deviceModel.updated_at).toLocaleDateString()}</dd>
                </div>
              )}
            </dl>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Specifications</CardTitle>
            <CardDescription>Technical details and specifications</CardDescription>
          </CardHeader>
          <CardContent>
            {deviceModel.specifications ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(deviceModel.specifications).map(([key, value]) => (
                  <div key={key}>
                    <dt className="text-sm font-medium text-muted-foreground capitalize">{key.replace('_', ' ')}</dt>
                    <dd className="mt-1">{value as React.ReactNode}</dd>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No specifications available for this model.</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="compatibility" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="compatibility">Compatibility</TabsTrigger>
          <TabsTrigger value="firmware">Firmware</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="compatibility">
          <Card>
            <CardHeader>
              <CardTitle>Compatible Devices</CardTitle>
              <CardDescription>Other devices this model can work with</CardDescription>
            </CardHeader>
            <CardContent>
              {deviceModel.compatible_with && deviceModel.compatible_with.length > 0 ? (
                <ul className="space-y-2">
                  {deviceModel.compatible_with.map((device) => (
                    <li key={device} className="flex items-center">
                      <ChevronRight className="h-4 w-4 mr-2 text-muted-foreground" />
                      {device}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No compatibility information available.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="firmware">
          <Card>
            <CardHeader>
              <CardTitle>Firmware Versions</CardTitle>
              <CardDescription>Available firmware for this device model</CardDescription>
            </CardHeader>
            <CardContent>
              {deviceModel.firmware_versions && deviceModel.firmware_versions.length > 0 ? (
                <div className="space-y-4">
                  {deviceModel.firmware_versions.map((version) => (
                    <div key={version} className="flex justify-between items-center p-3 border rounded-md">
                      <div>
                        <p className="font-medium">Version {version}</p>
                        <p className="text-sm text-muted-foreground">Released: Unknown</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No firmware information available.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documentation">
          <Card>
            <CardHeader>
              <CardTitle>Documentation</CardTitle>
              <CardDescription>Manuals, guides and other documentation</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">No documentation has been uploaded for this device model.</p>
              
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center">
                  <Layers className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span>Visit manufacturer website</span>
                </div>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeviceModelDetailPage;
