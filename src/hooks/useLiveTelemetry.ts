
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client'; // Use the shared client

interface TelemetryData {
  id: string;
  device_id: string;
  timestamp?: string;
  received_at?: string;
  created_at: string;
  message: any;
  voltage?: number;
  current?: number;
  power?: number;
  temperature?: number;
  state_of_charge?: number;
}

export const useLiveTelemetry = (deviceId: string) => {
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        setLoading(true);
        const { data, error: supabaseError } = await supabase
          .from('telemetry_log')
          .select('*')
          .eq('device_id', deviceId)
          .order('timestamp', { ascending: false })
          .limit(1)
          .single();

        if (supabaseError) {
          throw new Error(supabaseError.message);
        }

        // Process message data if it exists
        let processedData = { ...data };
        if (data.message) {
          if (typeof data.message === 'string') {
            try {
              const parsedMessage = JSON.parse(data.message);
              processedData = { ...processedData, ...parsedMessage };
            } catch (e) {
              console.warn('Could not parse message as JSON:', e);
            }
          } else if (typeof data.message === 'object') {
            processedData = { ...processedData, ...data.message };
          }
        }

        setTelemetry(processedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching telemetry:', err);
        setError(err instanceof Error ? err : new Error('Unknown error fetching telemetry'));
      } finally {
        setLoading(false);
      }
    };

    fetchLatest();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('telemetry_updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'telemetry_log',
          filter: `device_id=eq.${deviceId}`
        },
        (payload) => {
          console.log('New telemetry data:', payload);
          fetchLatest(); // Refresh data when new telemetry arrives
        }
      )
      .subscribe();
    
    // Also poll every 5 seconds as a fallback
    const interval = setInterval(fetchLatest, 5000);

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [deviceId]);

  return { telemetry, loading, error };
};
