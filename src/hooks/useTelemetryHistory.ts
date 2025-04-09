import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Add the missing 'value' property to the TelemetryData interface
interface TelemetryData {
  timestamp: string;
  metric: string;
  device_id: string;
  value?: number; // Add this
}

export const useTelemetryHistory = (deviceId: string, metric: string) => {
  const [history, setHistory] = useState<TelemetryData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('energy_readings')
          .select('timestamp, power')
          .eq('device_id', deviceId)
          .order('timestamp', { ascending: false })
          .limit(100);

        if (error) {
          throw new Error(error.message);
        }

        // Transform the data to match the TelemetryData interface
        const telemetryData = data.map(item => ({
          timestamp: item.timestamp,
          metric: 'power',
          device_id: deviceId,
          value: item.power || 0,
        }));

        setHistory(telemetryData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [deviceId, metric]);

  return { history, isLoading, error };
};
