
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import api from "@/lib/axios";

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

export interface TelemetryHistoryOptions {
  limit?: number;
  minutes?: number;
  source?: string;
  startDate?: Date;
  endDate?: Date;
  aggregation?: 'none' | 'hourly' | 'daily';
}

/**
 * Fetches telemetry data for a specific device with enhanced options
 */
export const fetchDeviceTelemetry = async (
  deviceId: string, 
  options: TelemetryHistoryOptions = {}
): Promise<TelemetryReading[]> => {
  const { 
    limit = 100, 
    minutes, 
    source,
    startDate,
    endDate,
    aggregation = 'none'
  } = options;
  
  try {
    let query = supabase
      .from('telemetry_log')
      .select('*')
      .eq('device_id', deviceId);
    
    // Apply time filters based on provided options
    if (minutes) {
      const since = new Date(Date.now() - minutes * 60 * 1000).toISOString();
      query = query.gte('created_at', since);
    } else if (startDate) {
      query = query.gte('created_at', startDate.toISOString());
      
      if (endDate) {
        query = query.lte('created_at', endDate.toISOString());
      }
    }
      
    // Add source filter if provided
    if (source) {
      query = query.eq('source', source);
    }
    
    // Order and limit
    query = query.order('created_at', { ascending: false }).limit(limit);
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Process the data to handle the message field
    const rawReadings = (data || []).map(processRawTelemetry);
    
    // Apply aggregation if requested
    if (aggregation === 'none' || rawReadings.length === 0) {
      return rawReadings;
    } else {
      return aggregateTelemetryData(rawReadings, aggregation);
    }
  } catch (error) {
    console.error(`Error fetching telemetry for device ${deviceId}:`, error);
    throw error;
  }
};

/**
 * Fetches the latest telemetry reading for a device
 */
export const getLatestTelemetry = async (deviceId: string): Promise<TelemetryReading | null> => {
  try {
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
    
    return processRawTelemetry(data);
  } catch (error) {
    console.error(`Error fetching latest telemetry for device ${deviceId}:`, error);
    return null;
  }
};

/**
 * Record manual telemetry reading for a device with validation
 */
export const recordManualReading = async (reading: TelemetryReading): Promise<TelemetryReading> => {
  try {
    // Validate the reading data
    validateReadingData(reading);
    
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
      .insert([telemetryRecord])
      .select()
      .single();
      
    if (error) throw error;
    
    toast.success('Reading recorded successfully');
    return processRawTelemetry(data);
  } catch (error: any) {
    console.error('Error recording manual reading:', error);
    toast.error(`Failed to record reading: ${error.message}`);
    throw error;
  }
};

/**
 * Subscribe to real-time telemetry updates for a device
 */
export const subscribeTelemetryUpdates = (
  deviceId: string, 
  callback: (reading: TelemetryReading) => void
) => {
  try {
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
          console.log('New telemetry received:', payload);
          const processedReading = processRawTelemetry(payload.new);
          callback(processedReading);
        }
      )
      .subscribe((status) => {
        console.log(`Telemetry subscription status for ${deviceId}:`, status);
      });
      
    // Return unsubscribe function
    return () => {
      subscription.unsubscribe();
    };
  } catch (error) {
    console.error(`Error subscribing to telemetry for device ${deviceId}:`, error);
    toast.error('Failed to subscribe to device updates');
    // Return no-op unsubscribe function
    return () => {};
  }
};

/**
 * Fetch telemetry statistics for a device
 */
export const getTelemetryStats = async (
  deviceId: string, 
  period: 'day' | 'week' | 'month' = 'day'
): Promise<any> => {
  try {
    // Calculate start date based on period
    const now = new Date();
    let startDate = new Date();
    
    if (period === 'day') {
      startDate.setDate(now.getDate() - 1);
    } else if (period === 'week') {
      startDate.setDate(now.getDate() - 7);
    } else if (period === 'month') {
      startDate.setMonth(now.getMonth() - 1);
    }
    
    // Fetch telemetry data for the period
    const telemetryData = await fetchDeviceTelemetry(deviceId, {
      startDate,
      endDate: now,
      limit: 1000
    });
    
    if (telemetryData.length === 0) {
      return {
        min: null,
        max: null,
        avg: null,
        count: 0,
        period
      };
    }
    
    // Calculate statistics
    const powerValues = telemetryData
      .map(reading => reading.power || 0)
      .filter(power => typeof power === 'number');
      
    if (powerValues.length === 0) {
      return {
        min: null,
        max: null,
        avg: null,
        count: 0,
        period
      };
    }
    
    const min = Math.min(...powerValues);
    const max = Math.max(...powerValues);
    const sum = powerValues.reduce((acc, val) => acc + val, 0);
    const avg = sum / powerValues.length;
    
    return {
      min,
      max,
      avg,
      count: powerValues.length,
      period
    };
  } catch (error) {
    console.error(`Error fetching telemetry stats for device ${deviceId}:`, error);
    throw error;
  }
};

/**
 * Submit a bulk telemetry import request (e.g., from CSV)
 */
export const importTelemetryData = async (deviceId: string, readings: TelemetryReading[]): Promise<boolean> => {
  try {
    if (!readings || readings.length === 0) {
      throw new Error('No readings provided for import');
    }
    
    // Validate and prepare readings for import
    const formattedReadings = readings.map(reading => {
      validateReadingData({
        ...reading,
        device_id: deviceId
      });
      
      return {
        device_id: deviceId,
        message: { ...reading },
        source: reading.source || 'import',
        severity: 'info',
        timestamp: reading.timestamp || new Date().toISOString(),
        created_at: new Date().toISOString()
      };
    });
    
    // Import data in batches to avoid request size limits
    const BATCH_SIZE = 50;
    const batches = [];
    
    for (let i = 0; i < formattedReadings.length; i += BATCH_SIZE) {
      const batch = formattedReadings.slice(i, i + BATCH_SIZE);
      batches.push(batch);
    }
    
    // Process batches sequentially
    for (const [index, batch] of batches.entries()) {
      const progressPercent = Math.round(((index + 1) / batches.length) * 100);
      
      // Show progress toast on first batch, every 25% and last batch
      if (index === 0) {
        toast.loading(`Importing telemetry data (${progressPercent}%)...`, { id: 'import-telemetry' });
      } else if (progressPercent % 25 === 0 || index === batches.length - 1) {
        toast.loading(`Importing telemetry data (${progressPercent}%)...`, { id: 'import-telemetry' });
      }
      
      const { error } = await supabase
        .from('telemetry_log')
        .insert(batch);
        
      if (error) throw error;
    }
    
    toast.success(`Successfully imported ${readings.length} telemetry readings`, { id: 'import-telemetry' });
    return true;
  } catch (error: any) {
    console.error('Error importing telemetry data:', error);
    toast.error(`Failed to import readings: ${error.message}`, { id: 'import-telemetry' });
    return false;
  }
};

/**
 * Request telemetry export for a device
 */
export const requestTelemetryExport = async (
  deviceId: string,
  format: 'csv' | 'json' = 'csv',
  dateRange?: { start: Date, end: Date }
): Promise<{ url: string } | null> => {
  try {
    // Prepare the export request
    const request = {
      deviceId,
      format,
      ...(dateRange && {
        startDate: dateRange.start.toISOString(),
        endDate: dateRange.end.toISOString()
      })
    };
    
    // Submit the export request
    const { data, error } = await api.post('/api/telemetry/export', request);
    
    if (error) throw error;
    
    toast.success(`Export request processed. ${format.toUpperCase()} download ready.`);
    return data;
  } catch (error) {
    console.error('Error requesting telemetry export:', error);
    toast.error('Failed to generate export');
    return null;
  }
};

// Process a raw telemetry record from the database
function processRawTelemetry(item: any): TelemetryReading {
  // Create a base record with basic fields
  const processed: TelemetryReading = { 
    ...item,
    // Ensure timestamp exists, falling back to other available time fields
    timestamp: item.timestamp || item.received_at || item.created_at
  };
  
  // Process message field if it exists
  if (item.message) {
    if (typeof item.message === 'string') {
      try {
        const parsedMessage = JSON.parse(item.message);
        Object.assign(processed, parsedMessage);
      } catch (e) {
        console.warn('Could not parse message as JSON:', e);
      }
    } else if (typeof item.message === 'object') {
      Object.assign(processed, item.message);
    }
  }
  
  return processed;
}

// Validate telemetry reading data
function validateReadingData(reading: TelemetryReading): void {
  if (!reading.device_id) {
    throw new Error('Device ID is required');
  }
  
  // Check that at least one measurement value is present
  const hasMeasurement = [
    'voltage',
    'current',
    'power',
    'energy',
    'temperature',
    'state_of_charge'
  ].some(key => reading[key] !== undefined);
  
  if (!hasMeasurement) {
    throw new Error('At least one measurement value (voltage, current, power, etc.) is required');
  }
  
  // Validate numeric values
  ['voltage', 'current', 'power', 'energy', 'temperature', 'state_of_charge'].forEach(key => {
    if (reading[key] !== undefined && typeof reading[key] !== 'number') {
      throw new Error(`${key} must be a number`);
    }
  });
}

// Aggregate telemetry data by time period
function aggregateTelemetryData(
  readings: TelemetryReading[], 
  aggregation: 'hourly' | 'daily'
): TelemetryReading[] {
  if (readings.length === 0) return [];
  
  // Group readings by time period
  const groupedReadings: Record<string, TelemetryReading[]> = {};
  
  readings.forEach(reading => {
    const timestamp = new Date(reading.timestamp || reading.created_at);
    let key: string;
    
    if (aggregation === 'hourly') {
      key = `${timestamp.getFullYear()}-${timestamp.getMonth()}-${timestamp.getDate()}-${timestamp.getHours()}`;
    } else { // daily
      key = `${timestamp.getFullYear()}-${timestamp.getMonth()}-${timestamp.getDate()}`;
    }
    
    if (!groupedReadings[key]) {
      groupedReadings[key] = [];
    }
    
    groupedReadings[key].push(reading);
  });
  
  // Aggregate each group
  return Object.entries(groupedReadings).map(([key, groupReadings]) => {
    // Calculate average for each numeric field
    const numReadings = groupReadings.length;
    const sums: Record<string, number> = {};
    const fields = ['voltage', 'current', 'power', 'energy', 'temperature', 'state_of_charge'];
    
    groupReadings.forEach(reading => {
      fields.forEach(field => {
        if (typeof reading[field] === 'number') {
          sums[field] = (sums[field] || 0) + reading[field];
        }
      });
    });
    
    // Create aggregated reading
    const firstReading = groupReadings[0];
    const aggregated: TelemetryReading = {
      device_id: firstReading.device_id,
      id: `agg-${key}`,
      timestamp: firstReading.timestamp,
      created_at: firstReading.created_at,
      source: 'aggregated',
      aggregation_type: aggregation,
      reading_count: numReadings
    };
    
    // Calculate averages
    fields.forEach(field => {
      if (sums[field] !== undefined) {
        aggregated[field] = sums[field] / numReadings;
      }
    });
    
    return aggregated;
  }).sort((a, b) => {
    return new Date(b.timestamp!).getTime() - new Date(a.timestamp!).getTime();
  });
}

// Export telemetry service
export const telemetryService = {
  fetchDeviceTelemetry,
  getLatestTelemetry,
  recordManualReading,
  subscribeTelemetryUpdates,
  getTelemetryStats,
  importTelemetryData,
  requestTelemetryExport
};
