
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseTelemetryHistoryOptions {
  deviceId: string;
  metric: string;
  interval?: 'day' | 'hour' | 'minute';
  timeRange?: 'day' | 'week' | 'month' | 'year';
  limit?: number;
  enabled?: boolean;
}

interface TelemetryPoint {
  timestamp: string;
  value: number;
}

interface TelemetryStats {
  min: number;
  max: number;
  avg: number;
  current: number;
  total: number;
}

const useTelemetryHistory = ({
  deviceId,
  metric,
  interval = 'minute',
  timeRange = 'day',
  limit = 100,
  enabled = true,
}: UseTelemetryHistoryOptions) => {
  const [data, setData] = useState<TelemetryPoint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    if (!deviceId || !metric || !enabled) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Calculate time range based on timeRange value
      const rangeMs = {
        day: 24 * 60 * 60 * 1000,
        week: 7 * 24 * 60 * 60 * 1000,
        month: 30 * 24 * 60 * 60 * 1000,
        year: 365 * 24 * 60 * 60 * 1000,
      }[timeRange];

      const startDate = new Date(Date.now() - rangeMs).toISOString();

      // Query telemetry data
      const { data: telemetryData, error: telemetryError } = await supabase
        .from('telemetry')
        .select('timestamp, value')
        .filter('device_id', 'eq', deviceId)
        .filter('metric', 'eq', metric)
        .filter('timestamp', 'gte', startDate)
        .order('timestamp', { ascending: true })
        .limit(limit);

      if (telemetryError) {
        throw new Error(telemetryError.message);
      }

      // Process and set the data
      setData(
        telemetryData?.map((point) => ({
          timestamp: new Date(point.timestamp).toISOString(),
          value: Number(point.value),
        })) || []
      );
    } catch (err: any) {
      console.error('Error fetching telemetry history:', err);
      setError(err instanceof Error ? err : new Error(err?.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [deviceId, metric, interval, timeRange, limit, enabled]);

  // Calculate statistics from the data
  const stats: TelemetryStats = useMemo(() => {
    if (!data.length) {
      return {
        min: 0,
        max: 0,
        avg: 0,
        current: 0,
        total: 0,
      };
    }

    const values = data.map((point) => point.value);
    const sum = values.reduce((a, b) => a + b, 0);

    return {
      min: Math.min(...values),
      max: Math.max(...values),
      avg: sum / values.length,
      current: values[values.length - 1],
      total: sum,
    };
  }, [data]);

  return {
    data,
    isLoading,
    error,
    stats,
    refetch: fetchData,
  };
};

export default useTelemetryHistory;
