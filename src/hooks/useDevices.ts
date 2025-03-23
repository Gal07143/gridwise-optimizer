import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Use your Supabase URL and API key (adjust if needed)
const supabase = createClient(
  'https://xullgeycueouyxeirrqs.supabase.co',
  process.env.SUPABASE_API_KEY || ''
);

export const useDevices = (deviceType: string) => {
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDevices = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('devices')
        .select('*')
        .eq('type', deviceType);

      if (error) setError(error.message);
      else setDevices(data || []);
      setLoading(false);
    };

    fetchDevices();

    // Real-time subscription
    const channel = supabase
      .channel(`devices_${deviceType}_channel`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'devices',
          filter: `type=eq.${deviceType}`,
        },
        () => fetchDevices()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [deviceType]);

  return { devices, loading, error };
};
