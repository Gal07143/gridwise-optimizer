
import { useState, useEffect, useCallback } from 'react';
import { ConnectionStatusOptions, ConnectionStatus } from '@/types/modbus';
import { isOnline as checkIsOnline } from '@/utils/connectionUtils';
import { toast } from 'sonner';

/**
 * Hook to monitor connection status to a device
 */
const useConnectionStatus = (options?: ConnectionStatusOptions): ConnectionStatus => {
  const { 
    deviceId, 
    interval = 30000, 
    onConnect, 
    onDisconnect, 
    onError, 
    showToasts = false 
  } = options || {};

  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [lastConnected, setLastConnected] = useState<Date | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(checkIsOnline());

  // Check network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

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
        if (showToasts) toast.success("Connection established");
      } else {
        if (onDisconnect) onDisconnect();
        if (showToasts) toast.error("Connection failed");
        throw new Error('Connection failed');
      }
    } catch (err: any) {
      setIsConnected(false);
      const errorObj = err instanceof Error ? err : new Error(err?.message || 'Unknown connection error');
      setError(errorObj);
      if (onError) onError(errorObj);
      if (showToasts) toast.error(`Connection error: ${errorObj.message}`);
    } finally {
      setIsConnecting(false);
    }
  }, [deviceId, isConnecting, onConnect, onDisconnect, onError, showToasts]);

  const connect = useCallback(async () => {
    await checkConnection();
  }, [checkConnection]);

  const disconnect = useCallback(async () => {
    setIsConnected(false);
    if (showToasts) toast.info("Disconnected");
  }, [showToasts]);

  const reconnect = useCallback(async () => {
    if (isConnecting) return;
    await checkConnection();
  }, [isConnecting, checkConnection]);

  // Check connection on mount and at intervals
  useEffect(() => {
    if (deviceId) {
      checkConnection();
      
      const intervalId = setInterval(() => {
        checkConnection();
      }, interval);
      
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [deviceId, interval, checkConnection]);

  return {
    isConnected,
    isConnecting,
    lastConnected,
    error,
    connect,
    disconnect,
    reconnect,
    retryConnection: reconnect,
    isOnline
  };
};

export default useConnectionStatus;
