
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { EnergyDevice } from '@/types/energy';
import { toast } from 'sonner';

// Create a wrapper for device context to avoid circular dependencies
// This is done to prevent the "useDevices must be used within a DeviceProvider" error
let deviceContextInstance: any = null;
export function setDeviceContextInstance(instance: any) {
  deviceContextInstance = instance;
}

export function useDevices(siteId?: string) {
  // Try to use the device context if available
  if (deviceContextInstance) {
    return deviceContextInstance;
  }
  
  // If context not available (or we're initializing the context itself), use local implementation
  const [devices, setDevices] = useState<EnergyDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [deviceTelemetry, setDeviceTelemetry] = useState<Record<string, any[]>>({});
  const [selectedDevice, setSelectedDevice] = useState<EnergyDevice | null>(null);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      
      let query = supabase.from('devices').select('*');
      
      if (siteId) {
        query = query.eq('site_id', siteId);
      }
      
      const { data, error: supabaseError } = await query;
      
      if (supabaseError) {
        throw new Error(supabaseError.message);
      }
      
      setDevices(data as EnergyDevice[]);
      
      // Set first device as selected if we don't have one already
      if (!selectedDevice && data && data.length > 0) {
        setSelectedDevice(data[0] as EnergyDevice);
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch devices';
      setError(err instanceof Error ? err : new Error(errorMessage));
      toast.error(errorMessage);
      console.error('Error fetching devices:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchDeviceTelemetry = async (deviceId: string) => {
    try {
      // Mock implementation - in a real app this would fetch from API
      setDeviceTelemetry(prev => ({
        ...prev,
        [deviceId]: Array(24).fill(0).map((_, i) => ({
          id: `telemetry-${i}`,
          deviceId: deviceId,
          timestamp: new Date(Date.now() - i * 60 * 60 * 1000),
          power: Math.random() * 5,
          energy: Math.random() * 10,
          voltage: 220 + Math.random() * 10,
          current: Math.random() * 20
        }))
      }));
    } catch (err) {
      console.error('Error fetching device telemetry:', err);
    }
  };
  
  const selectDevice = (device: EnergyDevice) => {
    setSelectedDevice(device);
  };
  
  const createDevice = async (deviceData: Partial<EnergyDevice>): Promise<EnergyDevice> => {
    try {
      const { data, error } = await supabase
        .from('devices')
        .insert([{ ...deviceData, created_at: new Date() }])
        .select();
        
      if (error) throw new Error(error.message);
      if (!data || data.length === 0) throw new Error('Failed to create device');
      
      // Refresh the device list
      fetchDevices();
      
      return data[0] as EnergyDevice;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create device';
      toast.error(errorMessage);
      throw err;
    }
  };

  useEffect(() => {
    fetchDevices();
  }, [siteId]);

  return {
    devices,
    loading,
    error,
    refetch: fetchDevices,
    deviceTelemetry,
    fetchDeviceTelemetry,
    selectedDevice,
    selectDevice,
    createDevice
  };
}
