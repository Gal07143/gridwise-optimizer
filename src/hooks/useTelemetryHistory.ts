
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client'; // Use the shared client

interface TelemetryHistoryItem {
  id: string;
  device_id: string;
  timestamp: string;
  created_at: string;
  message: any;
  voltage?: number;
  current?: number;
  power?: number;
  temperature?: number;
  [key: string]: any; // Allow for dynamic properties from message
}

export const useTelemetryHistory = (deviceId: string, limitMinutes = 60) => {
  const [data, setData] = useState<TelemetryHistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const since = new Date(Date.now() - limitMinutes * 60 * 1000).toISOString();
        
        const { data: historyData, error: supabaseError } = await supabase
          .from('telemetry_log')
          .select('*')
          .eq('device_id', deviceId)
          .gte('timestamp', since)
          .order('timestamp', { ascending: true });

        if (supabaseError) {
          throw new Error(supabaseError.message);
        }

        // Process each record to extract telemetry values from message
        const processedData = historyData?.map(record => {
          let enhancedRecord = { ...record };
          
          if (record.message) {
            if (typeof record.message === 'string') {
              try {
                const parsedMessage = JSON.parse(record.message);
                enhancedRecord = { ...enhancedRecord, ...parsedMessage };
              } catch (e) {
                console.warn('Could not parse message as JSON:', e);
              }
            } else if (typeof record.message === 'object') {
              enhancedRecord = { ...enhancedRecord, ...record.message };
            }
          }
          
          return enhancedRecord;
        }) || [];

        setData(processedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching telemetry history:', err);
        setError(err instanceof Error ? err : new Error('Unknown error fetching telemetry history'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Set up polling for updates
    const interval = setInterval(fetchData, 10000); // Refresh every 10s

    return () => clearInterval(interval);
  }, [deviceId, limitMinutes]);

  return { data, loading, error };
};
