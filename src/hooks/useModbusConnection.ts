import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { modbusClient, connectDevice, disconnectDevice } from '@/services/modbus/modbusClient';
import { ModbusDeviceConfig, ModbusConnectionStatus } from '@/types/modbus';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook for managing a Modbus device connection
 */
export function useModbusConnection(deviceId?: string) {
  const [device, setDevice] = useState<ModbusDeviceConfig | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<ModbusConnectionStatus>({
    connected: false
  });

  // Fetch device config
  const fetchDeviceConfig = useCallback(async () => {
    if (!deviceId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('modbus_devices')
        .select('*')
        .eq('id', deviceId)
        .single();

      if (fetchError) throw new Error(fetchError.message);
      if (!data) throw new Error(`Device with ID ${deviceId} not found`);

      setDevice(data as ModbusDeviceConfig);
    } catch (err: any) {
      console.error('Error fetching Modbus device:', err);
      setError(err.message);
      toast.error(`Error loading device: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [deviceId]);

  // Connect to the device
  const connect = useCallback(async (deviceConfig?: ModbusDeviceConfig) => {
    try {
      setStatus(prev => ({ ...prev, connected: false }));
      
      const configToUse = deviceConfig || device;
      if (!configToUse) {
        throw new Error('No device configuration provided');
      }

      const connected = await connectDevice(configToUse);
      
      setStatus({
        connected,
        lastError: connected ? undefined : 'Connection failed',
        lastConnectAttempt: new Date().toISOString()
      });

      if (connected) {
        // Update device status in database
        await supabase
          .from('modbus_devices')
          .update({ 
            status: 'online',
            last_connected: new Date().toISOString()
          })
          .eq('id', configToUse.id);

        toast.success(`Connected to ${configToUse.name}`);
      }

      return connected;
    } catch (err: any) {
      setStatus({
        connected: false,
        lastError: err.message,
        lastConnectAttempt: new Date().toISOString()
      });
      
      setError(err.message);
      toast.error(`Connection error: ${err.message}`);
      return false;
    }
  }, [device]);

  // Disconnect from the device
  const disconnect = useCallback(async () => {
    try {
      await disconnectDevice();
      
      setStatus({
        connected: false
      });

      if (device?.id) {
        // Update device status in database
        await supabase
          .from('modbus_devices')
          .update({ status: 'offline' })
          .eq('id', device.id);
      }

      toast.info('Disconnected from device');
      return true;
    } catch (err: any) {
      toast.error(`Error disconnecting: ${err.message}`);
      return false;
    }
  }, [device?.id]);

  // Load device on mount if deviceId is provided
  useEffect(() => {
    fetchDeviceConfig();
  }, [fetchDeviceConfig]);

  // Disconnect on unmount
  useEffect(() => {
    return () => {
      if (status.connected) {
        disconnectDevice().catch(console.error);
      }
    };
  }, [status.connected]);

  return {
    device,
    loading,
    error,
    status,
    isConnected: status.connected,
    connect,
    disconnect,
    refreshDevice: fetchDeviceConfig
  };
}

/**
 * Hook for listing all available Modbus devices
 */
export function useModbusDevices() {
  const [devices, setDevices] = useState<ModbusDeviceConfig[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDevices = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('modbus_devices')
        .select('*')
        .order('name');

      if (fetchError) throw new Error(fetchError.message);

      setDevices(data as ModbusDeviceConfig[]);
    } catch (err: any) {
      console.error('Error fetching Modbus devices:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDevices();
    
    // Setup real-time subscription for device updates
    const subscription = supabase
      .channel('modbus_devices_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'modbus_devices' 
        },
        () => {
          fetchDevices();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchDevices]);

  return {
    devices,
    loading,
    error,
    refreshDevices: fetchDevices
  };
}
