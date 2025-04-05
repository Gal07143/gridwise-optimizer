
import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';

// Mock implementations for Modbus functionality
const readModbusValue = async (
  deviceId: string, 
  register: number, 
  dataType: string = 'uint16'
): Promise<number | string | boolean> => {
  // Mock implementation that returns random values based on register
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (dataType === 'bool') return Math.random() > 0.5;
  if (dataType === 'string') return `Value-${register}`;
  
  // Return a random number appropriate for the data type
  return Math.floor(Math.random() * 1000);
};

const writeModbusValue = async (
  deviceId: string, 
  register: number, 
  value: any, 
  dataType: string = 'uint16'
): Promise<boolean> => {
  // Mock implementation
  await new Promise(resolve => setTimeout(resolve, 400));
  console.log(`Writing ${value} to device ${deviceId}, register ${register}, type ${dataType}`);
  return true;
};

interface ModbusDataOptions {
  deviceId: string;
  register: number;
  dataType?: string;
  pollInterval?: number;
  enabled?: boolean;
}

export function useModbusData({
  deviceId,
  register,
  dataType = 'uint16',
  pollInterval = 5000,
  enabled = true
}: ModbusDataOptions) {
  const [lastReadTime, setLastReadTime] = useState<Date | null>(null);

  const {
    data: value,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['modbus', deviceId, register, dataType],
    queryFn: async () => {
      const value = await readModbusValue(deviceId, register, dataType);
      setLastReadTime(new Date());
      return value;
    },
    refetchInterval: enabled ? pollInterval : false,
    enabled: enabled,
  });

  const writeValue = useMutation({
    mutationFn: async (newValue: any) => {
      return writeModbusValue(deviceId, register, newValue, dataType);
    },
    onSuccess: () => {
      refetch();
    },
  });

  const handleWrite = useCallback(
    (newValue: any) => {
      writeValue.mutate(newValue);
    },
    [writeValue]
  );

  return {
    value,
    setValue: handleWrite,
    isLoading,
    isWriting: writeValue.isPending,
    error: error || writeValue.error,
    lastReadTime,
    refetch,
  };
}

export default useModbusData;
