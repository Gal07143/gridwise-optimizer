
import { useState, useEffect, useCallback } from 'react';
import { ConnectionStatusOptions, ConnectionStatus } from '@/types/modbus';

/**
 * Hook to monitor connection status to a device
 */
const useConnectionStatus = (options: ConnectionStatusOptions): ConnectionStatus => {
  const { deviceId, interval = 30000, onConnect, onDisconnect, onError } = options;

  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [lastConnected, setLastConnected] = useState<Date | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const checkConnection = useCallback(async () => {
    if (!deviceId || isConnecting) return;
    
    setIsConnecting(true);
    try {
      // Here in a real application, we would actually check the connection
      // This is a mock implementation
      const connected = Math.random() > 0.3; // 70% chance of success
      
      setIsConnected(connected);
      
      if (connected) {
        setLastConnected(new Date());
        setError(null);
        if (onConnect) onConnect();
      } else {
        if (onDisconnect) onDisconnect();
        throw new Error('Connection failed');
      }
    } catch (err: any) {
      setIsConnected(false);
      setError(err instanceof Error ? err : new Error(err?.message || 'Unknown connection error'));
      if (onError) onError(err instanceof Error ? err : new Error(err?.message || 'Unknown connection error'));
    } finally {
      setIsConnecting(false);
    }
  }, [deviceId, isConnecting, onConnect, onDisconnect, onError]);

  const connect = useCallback(async () => {
    await checkConnection();
  }, [checkConnection]);

  const disconnect = useCallback(async () => {
    setIsConnected(false);
  }, []);

  const reconnect = useCallback(async () => {
    if (isConnecting) return;
    await checkConnection();
  }, [isConnecting, checkConnection]);

  // Check connection on mount and at intervals
  useEffect(() => {
    checkConnection();
    
    const intervalId = setInterval(() => {
      checkConnection();
    }, interval);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [deviceId, interval, checkConnection]);

  return {
    isConnected,
    isConnecting,
    lastConnected,
    error,
    connect,
    disconnect,
    reconnect,
    retryConnection: reconnect
  };
};

export default useConnectionStatus;
