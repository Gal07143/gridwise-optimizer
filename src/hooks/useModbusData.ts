
import { useState, useEffect, useCallback } from 'react';

interface UseModbusDataOptions {
  deviceId?: string;
  register: number;
  interval?: number;
}

interface UseModbusDataResult {
  value: number | string | null;
  lastReadTime: Date | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to read Modbus register data
 */
const useModbusData = (options: UseModbusDataOptions): UseModbusDataResult => {
  const { deviceId, register, interval = 30000 } = options;
  
  const [value, setValue] = useState<number | string | null>(null);
  const [lastReadTime, setLastReadTime] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const readRegister = useCallback(async () => {
    if (!deviceId || register === undefined || isLoading) return;
    
    setIsLoading(true);
    try {
      // In a real app, you would send an API request to read the register
      // This is a mock implementation
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500)); // Simulate network delay
      
      const mockValue = parseFloat((Math.random() * 100).toFixed(2));
      setValue(mockValue);
      setLastReadTime(new Date());
      setError(null);
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(err?.message || 'Failed to read register'));
      console.error('Error reading Modbus register:', err);
    } finally {
      setIsLoading(false);
    }
  }, [deviceId, register, isLoading]);

  // Read register on mount and when dependencies change
  useEffect(() => {
    if (deviceId && register !== undefined) {
      readRegister();
    }
  }, [deviceId, register, readRegister]);

  // Set up regular polling if interval is provided
  useEffect(() => {
    if (!interval || interval <= 0) return;
    
    const timerId = setInterval(() => {
      readRegister();
    }, interval);
    
    return () => {
      clearInterval(timerId);
    };
  }, [interval, readRegister]);

  return {
    value,
    lastReadTime,
    isLoading,
    error,
    refetch: readRegister
  };
};

export default useModbusData;
