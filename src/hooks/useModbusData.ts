
import { useState, useEffect } from 'react';

export interface ModbusDataOptions {
  deviceId: string;
  register: number;
  type?: 'coil' | 'input' | 'holding' | 'discrete';
  interval?: number;
}

export function useModbusData(options?: ModbusDataOptions) {
  const [value, setValue] = useState<string | number | boolean>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isWriting, setIsWriting] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastReadTime, setLastReadTime] = useState<Date>(new Date());

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Simulated delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock different data types based on register
      const registerNum = options?.register || 0;
      
      if (registerNum % 4 === 0) {
        setValue(Math.floor(Math.random() * 100));
      } else if (registerNum % 4 === 1) {
        setValue(Math.random() > 0.5);
      } else if (registerNum % 4 === 2) {
        setValue((Math.random() * 10).toFixed(2));
      } else {
        setValue('Status OK');
      }
      
      setLastReadTime(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to read data'));
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateValue = async (newValue: any) => {
    setIsWriting(true);
    try {
      // Simulated delay
      await new Promise(resolve => setTimeout(resolve, 700));
      setValue(newValue);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to write data'));
    } finally {
      setIsWriting(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    if (options?.deviceId) {
      fetchData();
    }
  }, [options?.deviceId, options?.register]);

  return {
    value,
    setValue: updateValue,
    isLoading,
    isWriting,
    error,
    lastReadTime,
    refetch: fetchData,
    // These properties are added to fix the TypeScript errors
    readAddress: (register: number) => Promise.resolve(0),
    writeAddress: (register: number, value: any) => Promise.resolve(true),
    isReading: false,
    lastData: null,
    startPolling: (interval: number = 5000) => {},
    stopPolling: () => {},
    pollingInterval: 5000
  };
}

export default useModbusData;
