
import { useState, useEffect } from 'react';

export interface ModbusDevice {
  id: string;
  ip: string;
  port: number;
  unit_id: number;
  name: string;
  is_active: boolean;
}

export interface ConnectionStatusResult {
  isConnected: boolean;
  error: Error | null;
  device: ModbusDevice | null;
  loading: boolean;
  refreshDevice: () => Promise<void>;
}

export function useModbusConnection(deviceId: string): ConnectionStatusResult {
  const [device, setDevice] = useState<ModbusDevice | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchDevice = async () => {
    setLoading(true);
    try {
      // Mocked device data
      const mockDevice: ModbusDevice = {
        id: deviceId || 'mock-device-1',
        ip: '192.168.1.100',
        port: 502,
        unit_id: 1,
        name: 'Simulated Modbus Device',
        is_active: true,
      };
      
      setDevice(mockDevice);
      setIsConnected(mockDevice.is_active);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch device'));
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevice();
  }, [deviceId]);

  return {
    isConnected,
    error,
    device,
    loading,
    refreshDevice: fetchDevice
  };
}

export function useModbusDevices() {
  const [devices, setDevices] = useState<ModbusDevice[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDevices = async () => {
    setIsLoading(true);
    try {
      // Mock data
      const mockDevices: ModbusDevice[] = [
        {
          id: 'mock-device-1',
          ip: '192.168.1.100',
          port: 502,
          unit_id: 1,
          name: 'Inverter',
          is_active: true,
        },
        {
          id: 'mock-device-2',
          ip: '192.168.1.101',
          port: 502,
          unit_id: 1,
          name: 'Battery',
          is_active: false,
        }
      ];
      
      setDevices(mockDevices);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch devices'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  return {
    devices,
    isLoading,
    error,
    refetch: fetchDevices
  };
}

export default useModbusConnection;
