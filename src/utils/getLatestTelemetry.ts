
import { supabase } from '@/integrations/supabase/client';

export async function getLatestTelemetry(deviceId: string) {
  try {
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

    // Process message data if it exists
    if (data && data.length > 0) {
      let result = { ...data[0] };
      
      if (result.message) {
        if (typeof result.message === 'string') {
          try {
            const parsedMessage = JSON.parse(result.message);
            result = { ...result, ...parsedMessage };
          } catch (e) {
            console.warn('Could not parse message as JSON:', e);
          }
        } else if (typeof result.message === 'object') {
          result = { ...result, ...result.message };
        }
      }
      
      return result;
    }

    return null;
  } catch (error) {
    console.error('Error in getLatestTelemetry:', error);
    return null;
  }
}
