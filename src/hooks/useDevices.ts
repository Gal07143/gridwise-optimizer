
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { EnergyDevice } from '@/types/energy';
import { toast } from 'sonner';

export function useDevices(siteId?: string) {
  try {
    // Using dynamic import to avoid circular dependency
    const { useDevicesContext } = require('@/contexts/DeviceContext');
    const deviceContext = useDevicesContext();
    
    // If we have access to the device context, use it
    if (deviceContext) {
      return deviceContext;
    }
  } catch (error) {
    // Context not available or circular dependency, proceed with local implementation
  }

  const [devices, setDevices] = useState<EnergyDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [deviceTelemetry, setDeviceTelemetry] = useState<Record<string, any[]>>({});

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
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch devices';
      setError(err instanceof Error ? err : new Error(errorMessage));
      toast.error(errorMessage);
      console.error('Error fetching devices:', err);
    } finally {
      setLoading(false);
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
    deviceTelemetry
  };
}
