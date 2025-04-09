
import { useState, useEffect, useCallback } from 'react';
import { readRegister } from '@/services/modbus/modbusService';
import { ModbusRegister, ModbusReadingResult } from '@/types/modbus';

interface UseModbusDataOptions {
  deviceId?: string;
  register: ModbusRegister;
  interval?: number;
  enabled?: boolean;
}

interface UseModbusDataResult {
  value: number | string | boolean | null;
  formattedValue: string | null;
  lastReadTime: Date | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to read Modbus register data
 */
const useModbusData = (options: UseModbusDataOptions): UseModbusDataResult => {
  const { deviceId, register, interval = 30000, enabled = true } = options;
  
  const [value, setValue] = useState<number | string | boolean | null>(null);
  const [formattedValue, setFormattedValue] = useState<string | null>(null);
  const [lastReadTime, setLastReadTime] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const readModbusRegister = useCallback(async () => {
    if (!deviceId || !register || isLoading || !enabled) return;
    
    setIsLoading(true);
    try {
      const result = await readRegister(deviceId, register);
      
      if (!result.success) {
        throw new Error('Failed to read register');
      }
      
      setValue(result.value);
      setFormattedValue(result.formattedValue || String(result.value));
      setLastReadTime(new Date(result.timestamp));
      setError(null);
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(err?.message || 'Failed to read register'));
      console.error('Error reading Modbus register:', err);
    } finally {
      setIsLoading(false);
    }
  }, [deviceId, register, isLoading, enabled]);

  // Read register on mount and when dependencies change
  useEffect(() => {
    if (deviceId && register && enabled) {
      readModbusRegister();
    }
  }, [deviceId, register, readModbusRegister, enabled]);

  // Set up regular polling if interval is provided
  useEffect(() => {
    if (!interval || interval <= 0 || !enabled) return;
    
    const timerId = setInterval(() => {
      readModbusRegister();
    }, interval);
    
    return () => {
      clearInterval(timerId);
    };
  }, [interval, readModbusRegister, enabled]);

  return {
    value,
    formattedValue,
    lastReadTime,
    isLoading,
    error,
    refetch: readModbusRegister
  };
};

export default useModbusData;
