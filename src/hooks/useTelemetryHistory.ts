
import { useState, useEffect } from 'react';
import { TelemetryData } from '@/types/energy';

interface UseTelemetryHistoryOptions {
  deviceId?: string;
  parameter?: string;
  timeframe?: 'hour' | 'day' | 'week' | 'month';
  metricId?: string; // Add this field
}

// Mock telemetry data
const generateMockData = (deviceId: string, timeframe: string): TelemetryData[] => {
  const now = new Date();
  const data: TelemetryData[] = [];
  let points = 24;
  let interval = 60 * 60 * 1000; // 1 hour in ms
  
  switch(timeframe) {
    case 'week':
      points = 7;
      interval = 24 * 60 * 60 * 1000; // 1 day in ms
      break;
    case 'month':
      points = 30;
      interval = 24 * 60 * 60 * 1000; // 1 day in ms
      break;
    case 'hour':
      points = 60;
      interval = 60 * 1000; // 1 minute in ms
      break;
    default: // day
      points = 24;
      interval = 60 * 60 * 1000; // 1 hour in ms
  }
  
  for (let i = 0; i < points; i++) {
    const timestamp = new Date(now.getTime() - (i * interval));
    const baseValue = timeframe === 'hour' ? 5 : 50;
    const randomFactor = timeframe === 'hour' ? 3 : 15;
    const value = baseValue + (Math.random() * randomFactor);
    
    data.push({
      timestamp: timestamp.toISOString(),
      value: +value.toFixed(2),
      unit: "kWh", // A default unit
      type: "energy",
      device_id: deviceId // Important: use device_id, not deviceId
    });
  }
  
  return data.reverse();
};

export const useTelemetryHistory = (options: UseTelemetryHistoryOptions = {}) => {
  const { deviceId = 'default-device', parameter = 'energy', timeframe = 'day' } = options;
  
  const [data, setData] = useState<TelemetryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real implementation, this would be an API call
        // For now, we'll simulate a delay and return mock data
        await new Promise(resolve => setTimeout(resolve, 800));
        const mockData = generateMockData(deviceId, timeframe);
        setData(mockData);
      } catch (err) {
        console.error("Error fetching telemetry data:", err);
        setError(err instanceof Error ? err : new Error('Failed to fetch telemetry data'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [deviceId, parameter, timeframe]);
  
  return { data, isLoading, error, refetch: () => {} };
};

// Default export for compatibility
export default useTelemetryHistory;
