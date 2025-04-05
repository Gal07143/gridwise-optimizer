
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TelemetryMetric } from '@/components/dashboard/LiveTelemetryChart';
import { subscribeToTable } from '@/services/supabaseRealtimeService';

export interface TelemetryReading {
  time: string;
  value: number;
}

export interface Telemetry {
  deviceId: string;
  metric: TelemetryMetric;
  readings: TelemetryReading[];
  latestValue?: number;
  latestTimestamp?: string;
}

export function useTelemetryHistory(
  deviceId: string,
  metric: TelemetryMetric = 'power',
  limit: number = 60
) {
  const [telemetry, setTelemetry] = useState<Telemetry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchTelemetryData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch the data
      const { data, error } = await supabase
        .from('energy_readings')
        .select('*')
        .eq('device_id', deviceId)
        .order('timestamp', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        setTelemetry({
          deviceId,
          metric,
          readings: [],
        });
        return;
      }
      
      // Process the data for the chart
      const readings = data.map(reading => ({
        time: reading.timestamp,
        value: reading[metric] || 0,
      })).reverse();
      
      // Get the latest value
      const latestReading = data[0];
      
      setTelemetry({
        deviceId,
        metric,
        readings,
        latestValue: latestReading[metric],
        latestTimestamp: latestReading.timestamp
      });
      
      setError(null);
    } catch (err) {
      console.error('Error fetching telemetry data:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch telemetry data'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetryData();

    // Subscribe to updates
    const unsubscribe = subscribeToTable(
      'energy_readings',
      'INSERT',
      (payload) => {
        const reading = payload.new;
        
        // Only process if it's for the current device
        if (reading.device_id === deviceId) {
          setTelemetry(prevTelemetry => {
            if (!prevTelemetry) return null;
            
            // Add the new reading and limit the number of readings
            const newReadings = [...prevTelemetry.readings, {
              time: reading.timestamp,
              value: reading[metric] || 0
            }].slice(-limit);
            
            return {
              ...prevTelemetry,
              readings: newReadings,
              latestValue: reading[metric],
              latestTimestamp: reading.timestamp
            };
          });
        }
      },
      `device_id=eq.${deviceId}`
    );

    return () => unsubscribe();
  }, [deviceId, metric, limit]);

  const refetch = () => {
    fetchTelemetryData();
  };

  return { telemetry, isLoading, error, refetch };
}
