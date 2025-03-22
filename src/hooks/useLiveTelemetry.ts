import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const useLiveTelemetry = (deviceId: string) => {
  const [telemetry, setTelemetry] = useState<any>(null);

  useEffect(() => {
    const fetchLatest = async () => {
      const { data, error } = await supabase
        .from('telemetry_log')
        .select('*')
        .eq('device_id', deviceId)
        .order('timestamp', { ascending: false })
        .limit(1)
        .single();

      if (!error && data) setTelemetry(data);
    };

    fetchLatest();
    const interval = setInterval(fetchLatest, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, [deviceId]);

  return telemetry;
};
