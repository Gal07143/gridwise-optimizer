
import { useState, useEffect } from 'react';
import { ConnectionStatusOptions, ConnectionStatusResult } from '@/types/modbus';
import { toast } from 'sonner';

const useConnectionStatus = (options: ConnectionStatusOptions = {}): ConnectionStatusResult => {
  const {
    initialStatus = false,
    reconnectDelay = 5000,
    showToasts = false,
    deviceId = '',
    autoConnect = false,
    retryInterval = 30000,
    maxRetries = 3
  } = options;

  const [isOnline, setIsOnline] = useState<boolean>(initialStatus);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [lastConnected, setLastConnected] = useState<Date | undefined>(undefined);
  const [lastOnline, setLastOnline] = useState<Date | null>(null);
  const [lastOffline, setLastOffline] = useState<Date | null>(null);
  const [connectionAttempts, setConnectionAttempts] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Connection handling
  const connect = async () => {
    if (isConnecting || isConnected) return;
    
    try {
      setIsConnecting(true);
      setErrorMessage(null);
      
      // Simulate connection request with deviceId
      await new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.3) { // 70% success rate
            resolve();
          } else {
            reject(new Error('Connection failed'));
          }
        }, 800);
      });
      
      // Connection successful
      setIsConnected(true);
      setIsOnline(true);
      setLastConnected(new Date());
      setLastOnline(new Date());
      setConnectionAttempts(0);
      
      if (showToasts) {
        toast.success('Device connected successfully');
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown connection error');
      setErrorMessage(error.message);
      setConnectionAttempts((prev) => prev + 1);
      setLastOffline(new Date());
      
      if (showToasts) {
        toast.error(`Connection failed: ${error.message}`);
      }
    } finally {
      setIsConnecting(false);
    }
  };
  
  const disconnect = async () => {
    if (!isConnected) return;
    
    try {
      // Simulate disconnection
      await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 300);
      });
      
      setIsConnected(false);
      setIsOnline(false);
      setLastOffline(new Date());
      
      if (showToasts) {
        toast.info('Device disconnected');
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to disconnect');
      setErrorMessage(error.message);
      
      if (showToasts) {
        toast.error(`Disconnect failed: ${error.message}`);
      }
    }
  };
  
  const retryConnection = async () => {
    if (connectionAttempts >= maxRetries) {
      if (showToasts) {
        toast.error(`Maximum retry attempts (${maxRetries}) reached`);
      }
      return;
    }
    
    await connect();
  };

  // Auto connect on mount if requested
  useEffect(() => {
    let reconnectTimer: NodeJS.Timeout;
    
    if (autoConnect && !isConnected && !isConnecting) {
      connect();
    }
    
    return () => {
      clearTimeout(reconnectTimer);
    };
  }, [autoConnect]);

  // Status string getter
  const getStatusString = (): 'connected' | 'connecting' | 'disconnected' | 'error' | 'ready' => {
    if (isConnecting) return 'connecting';
    if (isConnected) return 'connected';
    if (errorMessage) return 'error';
    if (isOnline && !isConnected) return 'ready';
    return 'disconnected';
  };

  return {
    isOnline,
    isConnecting,
    isConnected,
    lastConnected,
    lastOnline,
    lastOffline,
    error: errorMessage ? new Error(errorMessage) : null,
    connect,
    disconnect,
    retryConnection,
    status: getStatusString(),
    message: errorMessage || undefined
  };
};

export default useConnectionStatus;
