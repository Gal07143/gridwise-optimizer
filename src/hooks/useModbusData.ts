
import { useState, useEffect } from 'react';
import { readRegister } from '@/services/modbus/modbusService';
import { ModbusRegister } from '@/types/modbus';

interface UseModbusDataParams {
  deviceId: string;
  register: ModbusRegister | number;
  pollingInterval?: number;
  enabled?: boolean;
}

export const useModbusData = ({
  deviceId,
  register,
  pollingInterval = 5000,
  enabled = true
}: UseModbusDataParams) => {
  const [value, setValue] = useState<string | number | boolean>('');
  const [formattedValue, setFormattedValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = async () => {
    if (!deviceId || !register) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Handle both ModbusRegister object and direct address number
      const registerAddress = typeof register === 'number' 
        ? register 
        : register.register_address;
        
      const result = await readRegister(deviceId, registerAddress);
      
      if (result.success) {
        // Handle array result (multiple registers)
        if (Array.isArray(result.value)) {
          setValue(result.value[0]);
        } else if (result.value !== undefined) {
          setValue(result.value);
        }
        
        setFormattedValue(result.formattedValue || String(result.value));
        setLastUpdated(new Date());
      } else {
        setError(result.error || 'Unknown error');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to read register');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!enabled) return;

    fetchData();
    
    const intervalId = setInterval(fetchData, pollingInterval);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [deviceId, register, pollingInterval, enabled]);

  return {
    value,
    formattedValue,
    isLoading,
    error,
    lastUpdated,
    refresh: fetchData
  };
};

export default useModbusData;
