
import { useState, useEffect } from 'react';
import { ConnectionStatusOptions, ConnectionStatusResult } from '@/types/modbus';
import { toast } from 'sonner';

export const useConnectionStatus = (options: ConnectionStatusOptions = {}): ConnectionStatusResult => {
  const autoConnect = options.autoConnect ?? false;
  const retryInterval = options.retryInterval ?? 5000;
  const maxRetries = options.maxRetries ?? 3;
  const initialStatus = options.initialStatus ?? false;
  const reconnectDelay = options.reconnectDelay ?? 3000;
  const showToasts = options.showToasts ?? true;
  const deviceId = options.deviceId;

  const [status, setStatus] = useState<'connected' | 'connecting' | 'disconnected' | 'error' | 'ready'>('disconnected');
  const [error, setError] = useState<Error | null>(null);
  const [lastOnline, setLastOnline] = useState<Date | null>(null);
  const [lastOffline, setLastOffline] = useState<Date | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isConnected, setIsConnected] = useState(initialStatus);
  const [message, setMessage] = useState<string>('');
  const [lastConnected, setLastConnected] = useState<Date | undefined>(undefined);

  // Simulate connection process
  const connect = async (): Promise<void> => {
    try {
      if (isConnected) {
        setMessage('Already connected');
        return;
      }

      setStatus('connecting');
      setMessage('Connecting...');

      // Simulate API call or connection attempt
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Randomly succeed or fail based on parameter (80% success rate by default)
      const success = Math.random() < 0.8;

      if (!success) {
        throw new Error('Failed to connect to device');
      }
      
      setStatus('connected');
      setIsConnected(true);
      setRetryCount(0);
      setLastOnline(new Date());
      setLastConnected(new Date());
      setError(null);
      setMessage('Connected successfully');
      
      if (showToasts) {
        toast.success(`Successfully connected to device${deviceId ? ` ${deviceId}` : ''}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Connection failed';
      
      setStatus('error');
      setError(err instanceof Error ? err : new Error(errorMessage));
      setMessage(errorMessage);
      setIsConnected(false);
      setLastOffline(new Date());
      
      if (showToasts) {
        toast.error(`Connection failed: ${errorMessage}`);
      }
      
      // Try to reconnect if within retry limits
      if (retryCount < maxRetries) {
        setRetryCount(prevCount => prevCount + 1);
        setTimeout(retryConnection, retryInterval);
      }
    }
  };

  const disconnect = async (): Promise<void> => {
    try {
      if (!isConnected) {
        setMessage('Already disconnected');
        return;
      }

      // Simulate disconnect call
      await new Promise(resolve => setTimeout(resolve, 500));

      setStatus('disconnected');
      setIsConnected(false);
      setLastOffline(new Date());
      setMessage('Disconnected successfully');
      
      if (showToasts) {
        toast.info(`Disconnected from device${deviceId ? ` ${deviceId}` : ''}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Disconnect failed';
      
      setStatus('error');
      setError(err instanceof Error ? err : new Error(errorMessage));
      setMessage(errorMessage);
      
      if (showToasts) {
        toast.error(`Disconnect failed: ${errorMessage}`);
      }
    }
  };

  const retryConnection = async (): Promise<void> => {
    setMessage(`Retrying connection (${retryCount + 1}/${maxRetries})...`);
    
    // Add a delay before retry to avoid hammering the service
    await new Promise(resolve => setTimeout(resolve, reconnectDelay));
    
    connect();
  };

  // Auto-connect on initialization if requested
  useEffect(() => {
    if (autoConnect) {
      connect();
    } else {
      setStatus('ready');
    }
    
    // Clean up on unmount
    return () => {
      // If needed, perform cleanup operations here
    };
  }, [autoConnect]);

  return {
    status,
    message,
    isOnline: isConnected,
    isConnected,
    isConnecting: status === 'connecting',
    lastOnline,
    lastOffline,
    connect,
    disconnect,
    retryConnection,
    error,
    lastConnected
  };
};

export default useConnectionStatus;
