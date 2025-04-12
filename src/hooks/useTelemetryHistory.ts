
import { useState, useEffect } from 'react';
import { EnergyReading } from '@/types/energy';
import { simulateHistoricalTelemetry } from '@/services/devices/telemetrySimulator';

/**
 * Hook to fetch telemetry history for a device
 */
export function useTelemetryHistory(deviceId: string, parameter: string) {
  const [data, setData] = useState<EnergyReading[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // In a real app, you would fetch from an API here
      // For simulation, we use the simulator
      const simulatedData = simulateHistoricalTelemetry(deviceId, 24);
      setData(simulatedData);
      setError(null);
      return simulatedData;
    } catch (err) {
      console.error('Error fetching telemetry history:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch telemetry history'));
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [deviceId, parameter]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData
  };
}
