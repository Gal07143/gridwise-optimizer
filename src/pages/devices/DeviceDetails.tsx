
import React from 'react';
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
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';
import ErrorMessage from '@/components/ui/error-message';

const DeviceDetails = () => {
  const { deviceId = '' } = useParams<{ deviceId: string }>();
  const navigate = useNavigate();

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

  const handleEditDevice = () => {
    navigate(`/devices/${deviceId}/edit`);
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

        {status === 'error' && (
          <ErrorMessage 
            message="Failed to load device details"
            description={error instanceof Error ? error.message : 'Unknown error'}
            retryAction={() => refetch()}
          />
        )}

        {status === 'loading' && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}

        {device && (
          <Card className="w-full max-w-3xl mx-auto">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <PlugZap className="h-5 w-5 text-primary" />
                    <CardTitle>{device.name}</CardTitle>
                  </div>
                  <CardDescription>ID: {device.id}</CardDescription>
                </div>
                {getStatusBadge(device.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                {device.installation_date && (
                  <div className="col-span-2">
                    <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Installation Date
                    </h3>
                    <p>{new Date(device.installation_date).toLocaleDateString()}</p>
                  </div>
                )}
              </div>

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
            <CardFooter className="flex justify-between pt-3 border-t">
              <Button 
                variant="outline"
                onClick={() => navigate('/devices')}
              >
                Back to Devices
              </Button>
              <div className="flex gap-2">
                <Button 
                  variant="secondary"
                  onClick={handleEditDevice}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Configure
                </Button>
              </div>
            </CardFooter>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default DeviceDetails;
