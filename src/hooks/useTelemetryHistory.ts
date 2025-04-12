
import { useState, useEffect } from 'react';
import { TelemetryMetric } from '@/components/telemetry/LiveTelemetryChart';
import { simulateTelemetry } from '@/services/devices/telemetrySimulator';

// Sample telemetry data structure
interface TelemetryData {
  timestamp: string;
  value: number;
  unit: string;
}

export function useTelemetryHistory(deviceId: string, metric: TelemetryMetric, timeframe: string = '24h') {
  const [data, setData] = useState<TelemetryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTelemetryData = async () => {
      try {
        setIsLoading(true);
        // In a real app, we'd fetch data from an API
        // For now, use a simulator function
        const simulatedData = simulateTelemetry(deviceId, metric, timeframe);
        setData(simulatedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching telemetry history:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch telemetry data'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchTelemetryData();
    
    // Set up polling for live data
    const intervalId = setInterval(() => {
      fetchTelemetryData();
    }, 30000); // Poll every 30 seconds
    
    return () => {
      clearInterval(intervalId);
    };
  }, [deviceId, metric, timeframe]);

  const refetch = async () => {
    try {
      setIsLoading(true);
      const simulatedData = simulateTelemetry(deviceId, metric, timeframe);
      setData(simulatedData);
    } catch (err) {
      console.error('Error refetching telemetry data:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch telemetry data'));
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, refetch };
}
