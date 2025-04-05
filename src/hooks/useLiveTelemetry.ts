
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import useConnectionStatus from './useConnectionStatus';
import { handleApiError } from '@/utils/errorUtils';

interface Telemetry {
  timestamp: string;
  device_id: string;
  [key: string]: any;
}

interface UseLiveTelemetryOptions {
  deviceId: string;
  pollInterval?: number;
  autoRefresh?: boolean;
}

export function useLiveTelemetry({ 
  deviceId, 
  pollInterval = 5000, 
  autoRefresh = true 
}: UseLiveTelemetryOptions) {
  const [telemetry, setTelemetry] = useState<Telemetry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const connection = useConnectionStatus();

  // Function to fetch telemetry data
  const fetchTelemetry = async () => {
    if (!deviceId) {
      setError(new Error('Device ID is required'));
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.get(`/api/devices/${deviceId}/telemetry`);
      setTelemetry(response.data);
      setError(null);
    } catch (err) {
      handleApiError(err, { 
        context: 'Telemetry', 
        showToast: false 
      });
      setError(err instanceof Error ? err : new Error('Failed to fetch telemetry'));
    } finally {
      setIsLoading(false);
    }
  };

  // Set up polling
  useEffect(() => {
    if (!autoRefresh || !deviceId) return;

    fetchTelemetry();
    
    const intervalId = setInterval(() => {
      // Only fetch if we're online
      if (connection.isOnline) {
        fetchTelemetry();
      }
    }, pollInterval);

    return () => clearInterval(intervalId);
  }, [deviceId, pollInterval, autoRefresh, connection.isOnline]);

  return {
    telemetry,
    isLoading,
    error,
    refetch: fetchTelemetry
  };
}

export default useLiveTelemetry;
