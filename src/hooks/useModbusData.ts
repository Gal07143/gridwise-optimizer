import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { modbusClient, readModbusValue, writeModbusValue } from '@/services/modbus/modbusClient';
import { 
  ModbusDataType, 
  ModbusDeviceConfig, 
  ModbusDeviceData, 
  ModbusReadOptions, 
  ModbusRegisterMap, 
  ModbusWriteOptions 
} from '@/types/modbus';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook for reading and writing Modbus data
 */
export function useModbusData(deviceId: string) {
  const [isReading, setIsReading] = useState<boolean>(false);
  const [lastData, setLastData] = useState<ModbusDeviceData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pollingInterval, setPollingInterval] = useState<number | null>(null);
  const [registerMap, setRegisterMap] = useState<ModbusRegisterMap>({});
  const [intervalId, setIntervalId] = useState<number | null>(null);

  // Fetch register map for the device
  const fetchRegisterMap = useCallback(async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('modbus_register_maps')
        .select('register_map')
        .eq('device_id', deviceId)
        .single();

      if (fetchError) throw new Error(fetchError.message);
      if (!data) throw new Error(`Register map not found for device ID ${deviceId}`);

      setRegisterMap(data.register_map as ModbusRegisterMap);
      return data.register_map as ModbusRegisterMap;
    } catch (err: any) {
      console.error('Error fetching register map:', err);
      setError(`Error loading register map: ${err.message}`);
      return {};
    }
  }, [deviceId]);

  // Load register map on mount
  useEffect(() => {
    fetchRegisterMap();
  }, [fetchRegisterMap]);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  /**
   * Read a specific data point using the register map
   */
  const readDataPoint = useCallback(async (dataPointName: string) => {
    if (!modbusClient.isConnected()) {
      throw new Error('Modbus client not connected');
    }

    if (!registerMap[dataPointName]) {
      throw new Error(`Data point "${dataPointName}" not found in register map`);
    }

    try {
      return await modbusClient.readDataPoint(dataPointName, registerMap);
    } catch (err: any) {
      console.error(`Error reading data point "${dataPointName}":`, err);
      toast.error(`Failed to read ${dataPointName}: ${err.message}`);
      throw err;
    }
  }, [registerMap]);

  /**
   * Write a value to a specific data point using the register map
   */
  const writeDataPoint = useCallback(async (dataPointName: string, value: number | boolean) => {
    if (!modbusClient.isConnected()) {
      throw new Error('Modbus client not connected');
    }

    if (!registerMap[dataPointName]) {
      throw new Error(`Data point "${dataPointName}" not found in register map`);
    }

    try {
      await modbusClient.writeDataPoint(dataPointName, value, registerMap);
      toast.success(`Successfully wrote value to ${dataPointName}`);
      return true;
    } catch (err: any) {
      console.error(`Error writing data point "${dataPointName}":`, err);
      toast.error(`Failed to write to ${dataPointName}: ${err.message}`);
      throw err;
    }
  }, [registerMap]);

  /**
   * Read all data points in register map
   */
  const readAllDataPoints = useCallback(async () => {
    if (!modbusClient.isConnected()) {
      throw new Error('Modbus client not connected');
    }

    setIsReading(true);
    setError(null);

    try {
      const values: Record<string, number | boolean> = {};
      const errors: string[] = [];

      // Read each data point in the register map
      for (const [name, config] of Object.entries(registerMap)) {
        try {
          values[name] = await modbusClient.readDataPoint(name, registerMap);
        } catch (err: any) {
          console.error(`Error reading data point "${name}":`, err);
          errors.push(`${name}: ${err.message}`);
        }
      }

      const data: ModbusDeviceData = {
        deviceId,
        timestamp: new Date().toISOString(),
        values
      };

      // If there were any errors, add them to the data
      if (errors.length > 0) {
        data.error = errors.join('; ');
      }

      setLastData(data);
      
      // Save reading to database
      await saveReading(data);
      
      return data;
    } catch (err: any) {
      const errorMsg = `Failed to read data: ${err.message}`;
      setError(errorMsg);
      console.error(errorMsg);
      throw err;
    } finally {
      setIsReading(false);
    }
  }, [deviceId, registerMap]);

  /**
   * Save reading to database
   */
  const saveReading = async (data: ModbusDeviceData) => {
    try {
      const { error: insertError } = await supabase
        .from('modbus_readings')
        .insert([{
          device_id: data.deviceId,
          timestamp: data.timestamp,
          values: data.values,
          error: data.error
        }]);

      if (insertError) {
        console.error('Error saving reading:', insertError);
      }
    } catch (err) {
      console.error('Error saving reading to database:', err);
    }
  };

  /**
   * Start polling for data
   */
  const startPolling = useCallback((interval: number = 5000) => {
    if (intervalId) {
      clearInterval(intervalId);
    }

    setPollingInterval(interval);
    
    const id = window.setInterval(() => {
      readAllDataPoints().catch(err => {
        console.error('Error during polling:', err);
      });
    }, interval);

    setIntervalId(id);
    return () => clearInterval(id);
  }, [intervalId, readAllDataPoints]);

  /**
   * Stop polling for data
   */
  const stopPolling = useCallback(() => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
      setPollingInterval(null);
    }
  }, [intervalId]);

  /**
   * Direct read from a Modbus address
   */
  const readAddress = useCallback(async (
    type: ModbusDataType,
    address: number,
    options: ModbusReadOptions = {}
  ) => {
    if (!modbusClient.isConnected()) {
      throw new Error('Modbus client not connected');
    }

    try {
      return await readModbusValue(type, address, options);
    } catch (err: any) {
      const errorMsg = `Failed to read address ${address}: ${err.message}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
  }, []);

  /**
   * Direct write to a Modbus address
   */
  const writeAddress = useCallback(async (
    type: 'coil' | 'holdingRegister',
    address: number,
    value: number | boolean | number[] | boolean[],
    options: ModbusWriteOptions = {}
  ) => {
    if (!modbusClient.isConnected()) {
      throw new Error('Modbus client not connected');
    }

    try {
      await writeModbusValue(type, address, value, options);
      return true;
    } catch (err: any) {
      const errorMsg = `Failed to write to address ${address}: ${err.message}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
  }, []);

  return {
    isReading,
    lastData,
    error,
    pollingInterval,
    registerMap,
    readDataPoint,
    writeDataPoint,
    readAllDataPoints,
    readAddress,
    writeAddress,
    startPolling,
    stopPolling,
    refreshRegisterMap: fetchRegisterMap
  };
}

/**
 * Hook for fetching historical Modbus readings
 */
export function useModbusReadings(deviceId: string, limit = 100) {
  const fetchReadings = async () => {
    const { data, error } = await supabase
      .from('modbus_readings')
      .select('*')
      .eq('device_id', deviceId)
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) throw new Error(error.message);
    return data || [];
  };

  return useQuery({
    queryKey: ['modbusReadings', deviceId, limit],
    queryFn: fetchReadings
  });
}

/**
 * Hook for real-time Modbus readings
 */
export function useRealtimeModbusData(deviceId: string) {
  const [latestReading, setLatestReading] = useState<ModbusDeviceData | null>(null);

  useEffect(() => {
    // Fetch initial reading
    supabase
      .from('modbus_readings')
      .select('*')
      .eq('device_id', deviceId)
      .order('timestamp', { ascending: false })
      .limit(1)
      .single()
      .then(({ data, error }) => {
        if (error) {
          if (error.code !== 'PGRST116') { // PGRST116 means no rows returned
            console.error('Error fetching initial Modbus reading:', error);
          }
          return;
        }
        
        if (data) {
          setLatestReading({
            deviceId: data.device_id,
            timestamp: data.timestamp,
            values: data.values,
            error: data.error
          });
        }
      });

    // Subscribe to new readings
    const subscription = supabase
      .channel(`modbus_readings_${deviceId}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'modbus_readings',
          filter: `device_id=eq.${deviceId}`
        },
        (payload) => {
          const newData = payload.new;
          setLatestReading({
            deviceId: newData.device_id,
            timestamp: newData.timestamp,
            values: newData.values,
            error: newData.error
          });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [deviceId]);

  return { latestReading };
}
