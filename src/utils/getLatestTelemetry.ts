import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getLatestTelemetry(deviceId: string) {
  const { data, error } = await supabase
    .from('telemetry_log')
    .select('*')
    .eq('device_id', deviceId)
    .order('timestamp', { ascending: false })
    .limit(1);

  if (error) {
    console.error('Error fetching telemetry:', error);
    return null;
  }

  return data?.[0] || null;
}
