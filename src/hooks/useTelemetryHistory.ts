import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const useTelemetryHistory = (deviceId: string, limitMinutes = 60) => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const since = new Date(Date.now() - limitMinutes * 60 * 1000).toISOString();
      const { data, error } = await supabase
        .from('telemetry_log')
        .select('*')
        .eq('device_id', deviceId)
        .gte('timestamp', since)
        .order('timestamp', { ascending: true });

      if (!error && data) setData(data);
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // Refresh every 10s

    return () => clearInterval(interval);
  }, [deviceId, limitMinutes]);

  return data;
};
