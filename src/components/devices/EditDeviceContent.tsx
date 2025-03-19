
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getDeviceById } from '@/services/devices';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, BarChart, Settings, History, Wrench, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import DeviceForm from './DeviceForm';
import DeviceControls from './DeviceControls';
import DeviceLogger from './DeviceLogger';
import DevicePageHeader from './DevicePageHeader';
import DeviceMaintenance from './DeviceMaintenance';

const EditDeviceContent = () => {
  const { deviceId } = useParams<{ deviceId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('details');
  
  const { data: device, isLoading, error } = useQuery({
    queryKey: ['device', deviceId],
    queryFn: () => getDeviceById(deviceId as string),
    enabled: !!deviceId,
  });
  
  if (isLoading) {
    return (
      <div className="container py-6">
        <div className="flex flex-col space-y-8">
          <Skeleton className="h-[50px] w-[300px]" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    );
  }
  
  if (error || !device) {
    return (
      <div className="container py-6">
        <Button 
          variant="ghost" 
          className="mb-4" 
          onClick={() => navigate('/devices')}
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to Devices
        </Button>
        
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load device details. The device may not exist or there was a network error.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="container py-6">
      <DevicePageHeader 
        title={device.name}
        subtitle={`Type: ${device.type} • ID: ${device.id}`}
        onBack={() => navigate('/devices')}
        onSave={() => {}} // Empty function since we're not saving through header
        isSaving={false}
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="mb-8">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="controls">Controls</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <DeviceForm device={device} />
        </TabsContent>
        
        <TabsContent value="controls">
          <DeviceControls deviceId={device.id} />
        </TabsContent>
        
        <TabsContent value="maintenance">
          <DeviceMaintenance 
            deviceId={device.id}
            deviceType={device.type} 
            deviceStatus={device.status}
            deviceName={device.name}
            installationDate={device.installation_date}
          />
        </TabsContent>
        
        <TabsContent value="history">
          <DeviceLogger deviceId={device.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EditDeviceContent;
