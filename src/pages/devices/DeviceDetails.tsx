
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Main } from '@/components/ui/main';
import { getDeviceById } from '@/services/devices/deviceService';
import { Device } from '@/types/device';
import { EnergyDevice, DeviceType, DeviceStatus } from '@/types/energy';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DeviceDetailTab from '@/components/devices/tabs/DeviceDetailTab';
import DeviceControlPanel from '@/components/dashboard/devices/DeviceControlPanel';
import DeviceTelemetryTab from './DeviceTelemetryTab';
import DeviceMaintenanceTab from './DeviceMaintenanceTab';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Convert Device to EnergyDevice with appropriate type safety
const convertToEnergyDevice = (device: Device): EnergyDevice => {
  // This function ensures safe type conversion
  
  // Valid device types according to DeviceType
  const validDeviceTypes: DeviceType[] = [
    'solar', 'battery', 'grid', 'ev_charger', 'load', 'inverter',
    'meter', 'light', 'generator', 'hydro', 'wind', 'sensor'
  ];
  
  // Valid device statuses according to DeviceStatus
  const validDeviceStatuses: DeviceStatus[] = [
    'online', 'offline', 'maintenance', 'error', 'warning',
    'idle', 'active', 'charging', 'discharging'
  ];
  
  // Default type and status if invalid
  const safeType: DeviceType = validDeviceTypes.includes(device.type as DeviceType)
    ? (device.type as DeviceType)
    : 'load'; // Default type
    
  const safeStatus: DeviceStatus = validDeviceStatuses.includes(device.status as DeviceStatus)
    ? (device.status as DeviceStatus)
    : 'idle'; // Default status
  
  return {
    id: device.id,
    name: device.name,
    type: safeType,
    status: safeStatus,
    site_id: device.site_id,
    capacity: device.capacity || 0,
    description: device.description,
    location: device.location,
    created_at: device.created_at || new Date().toISOString(),
    last_updated: device.last_updated || new Date().toISOString(),
    firmware_version: device.firmware,
    model: device.model,
    manufacturer: device.manufacturer
  };
};

const DeviceDetails: React.FC = () => {
  const { deviceId } = useParams<{ deviceId: string }>();
  const navigate = useNavigate();
  const [device, setDevice] = useState<Device | null>(null);
  const [energyDevice, setEnergyDevice] = useState<EnergyDevice | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchDevice = async () => {
      if (!deviceId) return;

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('devices')
          .select('*')
          .eq('id', deviceId)
          .single();
          
        if (error) throw error;
        
        if (data) {
          const deviceData = data as Device;
          setDevice(deviceData);
          
          // Convert to EnergyDevice type for components that expect it
          setEnergyDevice(convertToEnergyDevice(deviceData));
        } else {
          throw new Error("Device not found");
        }
      } catch (err) {
        console.error("Error fetching device:", err);
        setError(err instanceof Error ? err : new Error('Failed to fetch device details'));
        toast.error("Failed to load device details");
      } finally {
        setLoading(false);
      }
    };

    fetchDevice();
    
    // Set up subscription for real-time updates
    const channel = supabase
      .channel('device-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'devices',
          filter: `id=eq.${deviceId}`
        } as any, 
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            const updatedDevice = payload.new as Device;
            setDevice(updatedDevice);
            setEnergyDevice(convertToEnergyDevice(updatedDevice));
          } else if (payload.eventType === 'DELETE') {
            toast.warning("This device has been deleted");
            navigate('/devices');
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [deviceId, navigate]);

  if (loading) {
    return (
      <Main>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Main>
    );
  }

  if (error || !device) {
    return (
      <Main>
        <div className="bg-destructive/10 border border-destructive/30 p-4 rounded-md">
          <h2 className="text-xl font-bold text-destructive mb-2">Error Loading Device</h2>
          <p>{error?.message || 'Device not found'}</p>
        </div>
      </Main>
    );
  }

  return (
    <Main title={device.name}>
      <div className="flex flex-col gap-4">
        {energyDevice && <DeviceControlPanel device={energyDevice} />}

        <Tabs defaultValue="overview" className="space-y-4" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="telemetry">Telemetry</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <DeviceDetailTab device={device} />
          </TabsContent>
          <TabsContent value="telemetry">
            <DeviceTelemetryTab device={device} />
          </TabsContent>
          <TabsContent value="maintenance">
            <DeviceMaintenanceTab device={device} />
          </TabsContent>
        </Tabs>
      </div>
    </Main>
  );
};

export default DeviceDetails;
