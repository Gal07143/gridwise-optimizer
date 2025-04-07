
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TelemetryData } from '@/types/energy';

interface UseTelemetryHistoryOptions {
  deviceId?: string;
  metricId?: string;
  range?: 'hour' | 'day' | 'week' | 'month';
  limit?: number;
  interval?: string;
  aggregation?: 'avg' | 'sum' | 'min' | 'max';
}

interface UseTelemetryHistoryResult {
  data: TelemetryData[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

const useTelemetryHistory = ({
  deviceId,
  metricId,
  range = 'day',
  limit = 100,
  interval = '15m',
  aggregation = 'avg'
}: UseTelemetryHistoryOptions): UseTelemetryHistoryResult => {
  const [data, setData] = useState<TelemetryData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    if (!deviceId) {
      setData([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Calculate the time range
      const now = new Date();
      let startDate: Date;

      switch (range) {
        case 'hour':
          startDate = new Date(now.getTime() - 60 * 60 * 1000);
          break;
        case 'day':
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      }

      // Format the dates for the query
      const startTimestamp = startDate.toISOString();
      const endTimestamp = now.toISOString();

      // Using proper string interpolation for the SQL query
      // This fixes the issue where a String object was treated as a function
      const query = `
        SELECT 
          time_bucket('${interval}', timestamp) AS timestamp,
          ${aggregation}(value) AS value,
          device_id AS "deviceId",
          ${metricId ? `'${metricId}'` : 'metric_type'} AS "metricId"
        FROM 
          telemetry
        WHERE 
          device_id = '${deviceId}'
          ${metricId ? `AND metric_type = '${metricId}'` : ''}
          AND timestamp > '${startTimestamp}'
          AND timestamp <= '${endTimestamp}'
        GROUP BY 
          time_bucket('${interval}', timestamp), 
          device_id
          ${metricId ? '' : ', metric_type'}
        ORDER BY 
          timestamp ASC
        LIMIT ${limit}
      `;

      const { data: telemetryData, error: supabaseError } = await supabase.rpc('run_query', { query_text: query });

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      setData(telemetryData || []);
    } catch (err) {
      console.error('Error fetching telemetry history:', err);
      setError(err instanceof Error ? err : new Error('Unknown error fetching telemetry data'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [deviceId, metricId, range, limit, interval, aggregation]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData
  };
};

export default useTelemetryHistory;
