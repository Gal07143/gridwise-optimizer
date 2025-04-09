
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/useToast';
import { ConnectionStatusOptions, ConnectionStatusResult } from '@/types/modbus';

const useConnectionStatus = (options: ConnectionStatusOptions = {}): ConnectionStatusResult => {
  const {
    initialStatus = false,
    reconnectDelay = 10000,
    showToasts = false,
    deviceId
  } = options;
  
  const [isOnline, setIsOnline] = useState<boolean>(initialStatus);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [lastConnected, setLastConnected] = useState<Date | undefined>(undefined);
  const [lastOnline, setLastOnline] = useState<Date | null>(null);
  const [lastOffline, setLastOffline] = useState<Date | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [connectionAttempts, setConnectionAttempts] = useState<number>(0);

  const toast = useToast();

  useEffect(() => {
    // Simulate a connection check
    const checkConnection = () => {
      // You would replace this with an actual connection check
      const online = Math.random() > 0.2; // 80% chance of being online

      if (online !== isOnline) {
        if (online) {
          setLastOnline(new Date());
          if (showToasts) {
            toast.success(`Device ${deviceId || ''} is online`);
          }
        } else {
          setLastOffline(new Date());
          if (showToasts) {
            toast.error(`Device ${deviceId || ''} went offline`);
          }
        }
      }

      setIsOnline(online);
    };

    // Check connection immediately
    checkConnection();

    // Set up periodic checks
    const interval = setInterval(checkConnection, reconnectDelay);

    return () => {
      clearInterval(interval);
    };
  }, [deviceId, reconnectDelay, showToasts]);

  const connect = async (): Promise<void> => {
    if (isConnecting || isConnected) return;

    setIsConnecting(true);
    setConnectionAttempts(prev => prev + 1);

    try {
      // Simulate connection logic
      await new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.3) { // 70% success rate
            resolve();
          } else {
            reject(new Error('Failed to connect'));
          }
        }, 1500);
      });

      setIsConnected(true);
      setLastConnected(new Date());
      setIsOnline(true);
      setError(null);
      if (showToasts) {
        toast.success(`Connected to device ${deviceId || ''}`);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown connection error');
      setError(error);
      if (showToasts) {
        toast.error(`Connection failed: ${error.message}`);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async (): Promise<void> => {
    if (!isConnected) return;

    try {
      // Simulate disconnect logic
      await new Promise<void>(resolve => {
        setTimeout(resolve, 500);
      });

      setIsConnected(false);
      if (showToasts) {
        toast.info(`Disconnected from device ${deviceId || ''}`);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown disconnect error');
      setError(error);
      if (showToasts) {
        toast.error(`Disconnect failed: ${error.message}`);
      }
    }
  };

  return {
    isOnline,
    isConnecting,
    isConnected,
    lastConnected,
    lastOnline,
    lastOffline,
    error,
    connect,
    disconnect,
    retryConnection: connect,
    status: isConnected ? 'connected' : isConnecting ? 'connecting' : isOnline ? 'ready' : 'disconnected',
    message: error?.message
  };
};

export default useConnectionStatus;
