import { supabase } from './supabase';

// Mock API functions for device data

export const getLatestReadingForDevice = async (deviceId: string) => {
  // In a real implementation, this would make an API call
  return {
    voltage: 230 + Math.random() * 10,
    current: 10 + Math.random() * 5,
    power: 2300 + Math.random() * 500,
    frequency: 49.9 + Math.random() * 0.3,
    energy: 150 + Math.random() * 10,
    timestamp: new Date().toISOString()
  };
};

export const getDeviceById = async (deviceId: string) => {
  // Mock implementation
  return {
    id: deviceId,
    name: `Device ${deviceId}`,
    type: 'solar',
    status: 'active'
  };
};

export const getDeviceHistory = async (deviceId: string, period: string) => {
  // Generate some random history data
  const dataPoints = [];
  const now = Date.now();
  
  for (let i = 0; i < 24; i++) {
    dataPoints.push({
      timestamp: new Date(now - i * 3600000).toISOString(),
      value: Math.random() * 100
    });
  }
  
  return dataPoints.reverse();
};

export type TimeRange = '24h' | '7d' | '30d';

interface DeviceMetric {
  timestamp: string;
  temperature?: number;
  humidity?: number;
  pressure?: number;
  voltage?: number;
}

export async function fetchDeviceMetrics(
  deviceId: string,
  timeRange: TimeRange
): Promise<DeviceMetric[]> {
  // Calculate the start time based on the time range
  const now = new Date();
  const startTime = new Date(now);
  
  switch (timeRange) {
    case '24h':
      startTime.setHours(now.getHours() - 24);
      break;
    case '7d':
      startTime.setDate(now.getDate() - 7);
      break;
    case '30d':
      startTime.setDate(now.getDate() - 30);
      break;
  }

  try {
    const { data, error } = await supabase
      .from('device_metrics')
      .select('*')
      .eq('device_id', deviceId)
      .gte('timestamp', startTime.toISOString())
      .lte('timestamp', now.toISOString())
      .order('timestamp', { ascending: true });

    if (error) {
      throw new Error(`Error fetching device metrics: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch device metrics:', error);
    throw error;
  }
}
