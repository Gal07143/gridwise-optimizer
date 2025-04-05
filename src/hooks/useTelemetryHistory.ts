
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { subscribeToTable } from '@/services/supabaseRealtimeService';
import { TelemetryMetric } from '@/components/telemetry/LiveTelemetryChart';
import { handleApiError } from '@/utils/errorUtils';

interface TelemetryData {
  data: any[];
  timestamps: string[];
}

export function useTelemetryHistory(deviceId: string, metric: TelemetryMetric, limit = 24) {
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTelemetry = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: apiError } = await supabase
        .from('energy_readings')
        .select('*')
        .eq('device_id', deviceId)
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (apiError) throw apiError;

      if (data && data.length > 0) {
        // Extract timestamps
        const timestamps = data.map(item => item.timestamp);
        
        // Reverse data to show oldest first
        const sortedData = [...data].reverse();
        
        setTelemetry({
          data: sortedData,
          timestamps
        });
      } else {
        setTelemetry({ data: [], timestamps: [] });
      }
    } catch (err) {
      console.error('Error fetching telemetry history:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch telemetry data'));
    } finally {
      setIsLoading(false);
    }
  }, [deviceId, limit]);

  // Fetch data initially
  useEffect(() => {
    fetchTelemetry();
  }, [fetchTelemetry]);

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = subscribeToTable(
      'energy_readings',
      'INSERT',
      (payload) => {
        // If new reading is for current device, update data
        if (payload.new && payload.new.device_id === deviceId) {
          setTelemetry((prev) => {
            if (!prev) return { data: [payload.new], timestamps: [payload.new.timestamp] };
            
            // Add to beginning of array and maintain limit
            const newData = [...prev.data, payload.new].slice(-limit);
            const newTimestamps = [...prev.timestamps, payload.new.timestamp].slice(-limit);
            
            return {
              data: newData,
              timestamps: newTimestamps
            };
          });
        }
      }
    );

    return () => unsubscribe();
  }, [deviceId, limit]);

  return {
    telemetry,
    isLoading,
    error,
    refetch: fetchTelemetry
  };
}
