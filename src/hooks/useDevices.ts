
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { EnergyDevice } from '@/types/energy';

export function useDevices(siteId?: string) {
  const [devices, setDevices] = useState<EnergyDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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
      setError(err instanceof Error ? err : new Error('Failed to fetch devices'));
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
    refetch: fetchDevices
  };
}
