import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, LineChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import AppLayout from '@/components/layout/AppLayout';
import DeviceDetails from '@/components/devices/DeviceDetails';
import DeviceActions from '@/components/devices/DeviceActions';
import DeviceMonitoring from '@/components/devices/DeviceMonitoring';
import { Device } from '@/types/device';
import { toast } from 'sonner';

const DeviceView: React.FC = () => {
  const { deviceId } = useParams<{ deviceId: string }>();
  const navigate = useNavigate();
  const [device, setDevice] = useState<Device | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDevice = async () => {
      try {
        setIsLoading(true);
        // Simulated API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock device data
        const mockDevice: Device = {
          id: deviceId || '',
          name: 'Solar Inverter X2000',
          type: 'inverter',
          status: 'online',
          capacity: 2000,
          current_output: 1500,
          location: 'Building A - Roof',
          description: 'Main solar inverter for the building',
          model: 'X2000-Pro',
          protocol: 'Modbus TCP',
          firmware: 'v2.1.0',
          site_id: 'site-1',
          ip_address: '192.168.1.100',
          installation_date: '2023-01-15',
          created_at: '2023-01-15T08:00:00Z',
          updated_at: '2024-03-15T10:30:00Z',
          last_updated: new Date().toISOString(),
          enabled: true,
        };

        setDevice(mockDevice);
      } catch (error) {
        toast.error('Failed to fetch device details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDevice();
  }, [deviceId]);

  const handleStatusChange = (newStatus: boolean) => {
    if (device) {
      setDevice({
        ...device,
        status: newStatus ? 'online' : 'offline',
        enabled: newStatus,
      });
    }
  };

  const handleDelete = async () => {
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate('/devices');
      toast.success('Device deleted successfully');
    } catch (error) {
      toast.error('Failed to delete device');
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-muted rounded"></div>
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!device) {
    return (
      <AppLayout>
        <div className="p-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Device Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The device you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/devices')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Devices
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/devices')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-semibold">{device.name}</h1>
              <p className="text-muted-foreground">
                {device.type.charAt(0).toUpperCase() + device.type.slice(1)} • {device.location}
              </p>
            </div>
          </div>
          
          <DeviceActions
            deviceId={device.id}
            deviceName={device.name}
            isOnline={device.status === 'online'}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="monitoring">
              <LineChart className="h-4 w-4 mr-2" />
              Monitoring
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <DeviceDetails device={device} />
          </TabsContent>

          <TabsContent value="monitoring" className="mt-6">
            <DeviceMonitoring device={device} />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default DeviceView;
