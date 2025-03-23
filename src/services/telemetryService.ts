
import { supabase } from '@/integrations/supabase/client';

export interface TelemetryReading {
  id?: string;
  device_id: string;
  timestamp?: string;
  voltage?: number;
  current?: number;
  power?: number | null;
  energy?: number | null;
  temperature?: number | null;
  state_of_charge?: number | null;
  source?: 'mqtt' | 'modbus' | 'manual' | string;
  [key: string]: any;
}

/**
 * Fetches telemetry data for a specific device
 */
export const fetchDeviceTelemetry = async (
  deviceId: string, 
  options: { 
    limit?: number; 
    minutes?: number;
    source?: string;
  } = {}
) => {
  const { limit = 100, minutes = 60, source } = options;
  const since = new Date(Date.now() - minutes * 60 * 1000).toISOString();
  
  let query = supabase
    .from('telemetry_log')
    .select('*')
    .eq('device_id', deviceId)
    .gte('created_at', since)
    .order('created_at', { ascending: false })
    .limit(limit);
    
  // Add source filter if provided
  if (source) {
    query = query.eq('source', source);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  
  // Process the data to handle the message field
  return (data || []).map(item => {
    const processed = { ...item };
    
    // Extract values from message if it's an object
    if (item.message && typeof item.message === 'object') {
      Object.assign(processed, item.message);
    }
    // Try to parse message if it's a string
    else if (item.message && typeof item.message === 'string') {
      try {
        const parsedMessage = JSON.parse(item.message);
        Object.assign(processed, parsedMessage);
      } catch (e) {
        console.warn('Could not parse message as JSON:', e);
      }
    }
    
    // Ensure timestamp exists
    processed.timestamp = processed.timestamp || processed.received_at || processed.created_at;
    
    return processed;
  });
};

/**
 * Record manual telemetry reading for a device
 */
export const recordManualReading = async (reading: TelemetryReading) => {
  const { device_id, ...metrics } = reading;
  
  const telemetryRecord = {
    device_id,
    message: metrics,
    source: reading.source || 'manual',
    severity: 'info',
    timestamp: reading.timestamp || new Date().toISOString(),
    created_at: new Date().toISOString()
  };
  
  const { data, error } = await supabase
    .from('telemetry_log')
    .insert([telemetryRecord]);
    
  if (error) throw error;
  
  return data;
};

/**
 * Subscribe to real-time telemetry updates for a device
 */
export const subscribeTelemetryUpdates = (
  deviceId: string, 
  callback: (reading: TelemetryReading) => void
) => {
  const subscription = supabase
    .channel(`telemetry-${deviceId}`)
    .on('postgres_changes', 
      { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'telemetry_log',
        filter: `device_id=eq.${deviceId}`
      },
      (payload) => {
        const record = payload.new;
        
        // Process the record to extract values from message
        const processed = { ...record };
        
        if (record.message) {
          if (typeof record.message === 'object') {
            Object.assign(processed, record.message);
          } else if (typeof record.message === 'string') {
            try {
              const parsedMessage = JSON.parse(record.message);
              Object.assign(processed, parsedMessage);
            } catch (e) {
              console.warn('Could not parse real-time message as JSON:', e);
            }
          }
        }
        
        // Ensure timestamp exists
        processed.timestamp = processed.timestamp || processed.received_at || processed.created_at;
        
        callback(processed);
      }
    )
    .subscribe();
    
  // Return unsubscribe function
  return () => {
    subscription.unsubscribe();
  };
};

/**
 * Get the latest telemetry reading for a device
 */
export const getLatestTelemetry = async (deviceId: string) => {
  const { data, error } = await supabase
    .from('telemetry_log')
    .select('*')
    .eq('device_id', deviceId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    throw error;
  }
  
  // Process the record
  if (!data) return null;
  
  const processed = { ...data };
  
  // Extract values from message if it's an object
  if (data.message && typeof data.message === 'object') {
    Object.assign(processed, data.message);
  }
  // Try to parse message if it's a string
  else if (data.message && typeof data.message === 'string') {
    try {
      const parsedMessage = JSON.parse(data.message);
      Object.assign(processed, parsedMessage);
    } catch (e) {
      console.warn('Could not parse message as JSON:', e);
    }
  }
  
  // Ensure timestamp exists
  processed.timestamp = processed.timestamp || processed.received_at || processed.created_at;
  
  return processed;
};
