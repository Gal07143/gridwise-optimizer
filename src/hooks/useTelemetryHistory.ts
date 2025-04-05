
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { subscribeToTable } from '@/services/supabaseRealtimeService';
import { TelemetryMetric } from '@/components/telemetry/LiveTelemetryChart';

interface TelemetryHistoryProps {
  telemetry: {
    data: any[];
    timestamps: string[];
  };
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch telemetry history for a device
 * @param deviceId The device ID to fetch telemetry for
 * @param duration Minutes of history to fetch
 */
export function useTelemetryHistory(deviceId: string, metric: TelemetryMetric): TelemetryHistoryProps {
  const [telemetry, setTelemetry] = useState<{ data: any[]; timestamps: string[] }>({ data: [], timestamps: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!deviceId) return;

    setIsLoading(true);
    setError(null);

    try {
      // Calculate the timestamp from 'duration' minutes ago
      const fromDate = new Date();
      fromDate.setMinutes(fromDate.getMinutes() - 60); // Default to 60 mins

      // Fetch the readings
      const { data, error } = await supabase
        .from('energy_readings')
        .select('*')
        .eq('device_id', deviceId)
        .gte('timestamp', fromDate.toISOString())
        .order('timestamp', { ascending: true });

      if (error) throw error;

      // Process the data
      const readings = data || [];
      const timestamps = readings.map(r => r.timestamp);
      
      setTelemetry({
        data: readings,
        timestamps: timestamps,
      });
    } catch (err) {
      console.error('Error fetching telemetry:', err);
      setError(err instanceof Error ? err : new Error('Unknown error fetching telemetry'));
    } finally {
      setIsLoading(false);
    }
  }, [deviceId]);

  useEffect(() => {
    fetchData();

    // Subscribe to real-time updates
    const unsubscribe = subscribeToTable(
      'energy_readings',
      'INSERT',
      (payload) => {
        const newReading = payload.new;
        if (newReading.device_id === deviceId) {
          setTelemetry((prev) => ({
            data: [...prev.data, newReading],
            timestamps: [...prev.timestamps, newReading.timestamp],
          }));
        }
      },
      `device_id=eq.${deviceId}`
    );

    return () => {
      unsubscribe();
    };
  }, [deviceId, fetchData]);

  return {
    telemetry,
    isLoading,
    error,
    refetch: fetchData
  };
}
