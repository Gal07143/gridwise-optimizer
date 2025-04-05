
import { useState, useCallback, useEffect } from 'react';

// Mock implementations since we don't have the actual modbusClient
const modbusClient = {
  connect: async (ip: string, port: number) => {
    console.log(`Connecting to ${ip}:${port}`);
    return true;
  },
  disconnect: async () => {
    console.log('Disconnecting');
    return true;
  },
  isConnected: () => {
    return Math.random() > 0.2; // 80% chance of being connected in this mock
  }
};

export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'error';

export interface ConnectionStatusResult {
  status: ConnectionStatus;
  error?: Error;
  isConnected: boolean;
  connect: (ip: string, port: number) => Promise<boolean>;
  disconnect: () => Promise<boolean>;
  lastConnected?: Date;
  retryConnection: () => Promise<boolean>;
}

export function useModbusConnection(
  initialIp?: string,
  initialPort?: number
): ConnectionStatusResult {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [error, setError] = useState<Error | undefined>();
  const [lastConnected, setLastConnected] = useState<Date | undefined>();

  const connect = useCallback(
    async (ip: string, port: number): Promise<boolean> => {
      setStatus('connecting');
      try {
        const result = await modbusClient.connect(ip, port);
        if (result) {
          setStatus('connected');
          setLastConnected(new Date());
          setError(undefined);
        } else {
          setStatus('error');
          setError(new Error('Failed to connect'));
        }
        return result;
      } catch (err) {
        setStatus('error');
        setError(err instanceof Error ? err : new Error('Unknown error'));
        return false;
      }
    },
    []
  );

  const disconnect = useCallback(async (): Promise<boolean> => {
    try {
      const result = await modbusClient.disconnect();
      if (result) {
        setStatus('disconnected');
      }
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      return false;
    }
  }, []);

  const retryConnection = useCallback(async (): Promise<boolean> => {
    if (!initialIp || !initialPort) {
      return false;
    }
    return connect(initialIp, initialPort);
  }, [connect, initialIp, initialPort]);

  // Check connection status periodically
  useEffect(() => {
    if (status === 'connected') {
      const interval = setInterval(() => {
        if (!modbusClient.isConnected()) {
          setStatus('disconnected');
        }
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [status]);

  // Initial connection if IP and port are provided
  useEffect(() => {
    if (initialIp && initialPort && status === 'disconnected') {
      connect(initialIp, initialPort);
    }
  }, []);

  return {
    status,
    error,
    isConnected: status === 'connected',
    connect,
    disconnect,
    lastConnected,
    retryConnection
  };
}

// Mock implementation of useModbusDevices
export function useModbusDevices() {
  return {
    devices: [],
    isLoading: false,
    error: null,
    refetch: async () => {}
  };
}

export default useModbusConnection;
