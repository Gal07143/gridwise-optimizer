
import { useState, useEffect } from 'react';
import { TelemetryData } from '@/types/energy';
import { supabase } from '@/lib/supabase';

interface TelemetryHistoryParams {
  deviceId: string;
  metricId: string;
  limit?: number;
  timeRange?: 'hour' | 'day' | 'week' | 'month';
}

const useTelemetryHistory = ({
  deviceId,
  metricId,
  limit = 100,
  timeRange = 'day'
}: TelemetryHistoryParams) => {
  const [data, setData] = useState<TelemetryData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Calculate the time range filter
        const now = new Date();
        let startTime = new Date();
        
        switch (timeRange) {
          case 'hour':
            startTime.setHours(now.getHours() - 1);
            break;
          case 'day':
            startTime.setDate(now.getDate() - 1);
            break;
          case 'week':
            startTime.setDate(now.getDate() - 7);
            break;
          case 'month':
            startTime.setMonth(now.getMonth() - 1);
            break;
        }

        // Format to ISO string for Supabase query
        const startTimeStr = startTime.toISOString();

        const { data, error } = await supabase
          .from('energy_readings')
          .select('*')
          .eq('device_id', deviceId)
          .eq('metric', metricId)
          .gte('timestamp', startTimeStr)
          .order('timestamp', { ascending: true })
          .limit(limit);

        if (error) throw error;

        // Format the data to match TelemetryData
        const formattedData: TelemetryData[] = (data || []).map(item => ({
          timestamp: item.timestamp,
          value: item.value,
          deviceId: item.device_id,
          metricId: item.metric
        }));

        setData(formattedData);
      } catch (err) {
        console.error('Error fetching telemetry data:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch telemetry data'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchTelemetry();
    
    // Set up subscription for real-time updates
    const channel = supabase
      .channel('energy_readings_changes')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'energy_readings',
          filter: `device_id=eq.${deviceId}` 
        }, 
        (payload) => {
          if (payload.new && payload.new.metric === metricId) {
            const newReading: TelemetryData = {
              timestamp: payload.new.timestamp,
              value: payload.new.value,
              deviceId: payload.new.device_id,
              metricId: payload.new.metric
            };
            
            setData(prevData => [...prevData, newReading]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [deviceId, metricId, limit, timeRange]);

  const refetch = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('energy_readings')
        .select('*')
        .eq('device_id', deviceId)
        .eq('metric', metricId)
        .order('timestamp', { ascending: true })
        .limit(limit);

      if (error) throw error;

      const formattedData: TelemetryData[] = (data || []).map(item => ({
        timestamp: item.timestamp,
        value: item.value,
        deviceId: item.device_id,
        metricId: item.metric
      }));

      setData(formattedData);
      setError(null);
    } catch (err) {
      console.error('Error refetching telemetry data:', err);
      setError(err instanceof Error ? err : new Error('Failed to refetch telemetry data'));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data,
    isLoading,
    error,
    refetch
  };
};

// Make sure to export both as named export and default
export { useTelemetryHistory };
export default useTelemetryHistory;
