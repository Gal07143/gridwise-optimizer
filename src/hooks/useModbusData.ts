import { useState, useEffect } from 'react';

// Create minimal versions of the missing utilities
const modbusClient = {
  isConnected: (deviceId: string) => false
};

const readModbusValue = async (deviceId: string, register: number, length: number = 1) => {
  console.log('Read modbus not implemented:', deviceId, register, length);
  return 0;
};

const writeModbusValue = async (deviceId: string, register: number, value: number | number[]) => {
  console.log('Write modbus not implemented:', deviceId, register, value);
  return true;
};

function useModbusData(deviceId: string, register: number, length: number = 1, interval: number = 5000) {
  const [value, setValue] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refreshValue = async () => {
    if (!modbusClient.isConnected(deviceId)) {
      setError(new Error('Device not connected'));
      setIsLoading(false);
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const newValue = await readModbusValue(deviceId, register, length);
      setValue(newValue);
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const writeValue = async (newValue: number | number[]) => {
    if (!modbusClient.isConnected(deviceId)) {
      throw new Error('Device not connected');
    }

    try {
      const success = await writeModbusValue(deviceId, register, newValue);

      if (success) {
        // Update local state if write was successful
        if (typeof newValue === 'number') {
          setValue(newValue);
        } else {
          // For array values, refresh to get the new value
          await refreshValue();
        }
      }

      return success;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    }
  };

  useEffect(() => {
    // Initial fetch
    refreshValue();

    // Set up interval for polling
    const timerId = setInterval(() => {
      if (modbusClient.isConnected(deviceId)) {
        refreshValue();
      }
    }, interval);

    return () => {
      clearInterval(timerId);
    };
  }, [deviceId, register, length, interval]);

  return {
    value,
    isLoading,
    error,
    refreshValue,
    writeValue
  };
}

export default useModbusData;
