
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDeviceById, deleteDevice } from '@/services/deviceService';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Edit, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import AppLayout from '@/components/layout/AppLayout';
import { Main } from '@/components/ui/main';
import { PageHeader } from '@/components/ui/page-header';
import { EnergyDevice } from '@/types/energy';
import DeviceControlsPanel from '@/components/microgrid/DeviceControlsPanel';
import DeviceDetailTab from '@/components/devices/tabs/DeviceDetailTab';

const DeviceDetails: React.FC = () => {
  const { deviceId } = useParams<{ deviceId: string }>();
  const navigate = useNavigate();
  const [device, setDevice] = useState<EnergyDevice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDevice = async () => {
      if (!deviceId) {
        setError('No device ID provided');
        setLoading(false);
        return;
      }

      try {
        const deviceData = await getDeviceById(deviceId);
        if (deviceData) {
          setDevice(deviceData);
        } else {
          setError('Device not found');
        }
      } catch (err) {
        setError('Error loading device');
        console.error('Failed to load device:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDevice();
  }, [deviceId]);

  const handleDelete = async () => {
    if (!deviceId || !device) return;
    
    if (window.confirm(`Are you sure you want to delete ${device.name}?`)) {
      try {
        const success = await deleteDevice(deviceId);
        if (success) {
          toast.success('Device successfully deleted');
          navigate('/devices');
        } else {
          toast.error('Failed to delete device');
        }
      } catch (err) {
        console.error('Error deleting device:', err);
        toast.error('Error deleting device');
      }
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <Main>
          <div className="flex items-center justify-center h-[60vh]">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 rounded-md bg-primary/20"></div>
              <p className="mt-4 text-muted-foreground">Loading device details...</p>
            </div>
          </div>
        </Main>
      </AppLayout>
    );
  }

  if (error || !device) {
    return (
      <AppLayout>
        <Main>
          <Card className="p-6 text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-amber-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Device Not Found</h2>
            <p className="text-muted-foreground mb-4">
              {error || 'The requested device could not be found.'}
            </p>
            <Button onClick={() => navigate('/devices')}>Back to Devices</Button>
          </Card>
        </Main>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Main>
        <PageHeader
          title={device.name}
          description={`${device.type} - ${device.status}`}
        >
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/devices/${deviceId}/edit`)}
            >
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
          </div>
        </PageHeader>

        <div className="grid gap-6 mt-6">
          <DeviceDetailTab device={device} />
          <DeviceControlsPanel device={device} />
        </div>
      </Main>
    </AppLayout>
  );
};

export default DeviceDetails;
