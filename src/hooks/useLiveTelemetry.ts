import { useState, useEffect } from 'react';
import { useConnectionStatus } from './useConnectionStatus';
import { simulateTelemetry } from '@/services/devices/telemetrySimulator';
import { EnergyReading } from '@/types/energy';
import { toast } from 'sonner';

interface UseLiveTelemetryOptions {
  deviceId: string;
  interval?: number;
  parameter?: string;
  showToasts?: boolean;
  simulationMode?: boolean;
}

export function useLiveTelemetry({
  deviceId,
  interval = 5000,
  parameter = 'power',
  showToasts = false,
  simulationMode = true
}: UseLiveTelemetryOptions) {
  const [reading, setReading] = useState<EnergyReading | null>(null);
  const [history, setHistory] = useState<EnergyReading[]>([]);
  const [isPolling, setIsPolling] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  const { isConnected, error: connectionError } = useConnectionStatus({ 
    deviceId: deviceId || 'default-device'
  });

  const startPolling = () => setIsPolling(true);
  const stopPolling = () => setIsPolling(false);
  
  const fetchTelemetry = async () => {
    try {
      if (!deviceId || !isConnected) return;
      
      const newReading = simulationMode ? simulateTelemetry(deviceId, parameter) : await fetchFromAPI();
      
      setReading(newReading);
      setHistory(prev => {
        const newHistory = [...prev, newReading];
        return newHistory.length > 100 ? newHistory.slice(-100) : newHistory;
      });
      
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('Error fetching telemetry:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch telemetry data'));
      
      if (showToasts) {
        toast.error(`Telemetry error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }
  };
  
  const fetchFromAPI = async (): Promise<EnergyReading> => {
    return {
      device_id: deviceId,
      timestamp: new Date().toISOString(),
      power: Math.random() * 10,
      energy: Math.random() * 100,
      voltage: 230 + (Math.random() * 10 - 5),
      current: Math.random() * 20
    };
  };
  
  useEffect(() => {
    if (!isPolling || !isConnected) return;
    
    fetchTelemetry();
    
    const intervalId = setInterval(fetchTelemetry, interval);
    
    return () => clearInterval(intervalId);
  }, [deviceId, isPolling, interval, isConnected]);
  
  return {
    reading,
    history,
    isPolling,
    startPolling,
    stopPolling,
    error: error || connectionError,
    isConnected,
    lastUpdated,
    fetchTelemetry
  };
}

export default useLiveTelemetry;
