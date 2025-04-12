
import { useState, useEffect } from 'react';
import { ConnectionStatusOptions, ConnectionStatusResult } from '@/types/modbus';
import { toast } from 'sonner';

export const useConnectionStatus = (options: ConnectionStatusOptions): ConnectionStatusResult => {
  // Default options with proper destructuring
  const { 
    deviceId, 
    autoReconnect = false, 
    timeout = 5000,
    retryInterval = 5000,
    maxRetries = 3,
    initialStatus = false,
    reconnectDelay = 3000,
    showToasts = true
  } = options;

  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected' | 'error' | 'ready'>('disconnected');
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

      setConnectionStatus('connecting');
      setMessage('Connecting...');

      // Simulate API call or connection attempt
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Randomly succeed or fail based on parameter (80% success rate by default)
      const success = Math.random() < 0.8;

      if (!success) {
        throw new Error('Failed to connect to device');
      }
      
      setConnectionStatus('connected');
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
      
      setConnectionStatus('error');
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

      setConnectionStatus('disconnected');
      setIsConnected(false);
      setLastOffline(new Date());
      setMessage('Disconnected successfully');
      
      if (showToasts) {
        toast.info(`Disconnected from device${deviceId ? ` ${deviceId}` : ''}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Disconnect failed';
      
      setConnectionStatus('error');
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
    if (autoReconnect) {
      connect();
    } else {
      setConnectionStatus('ready');
    }
    
    // Clean up on unmount
    return () => {
      // If needed, perform cleanup operations here
    };
  }, [autoReconnect]);

  return {
    isConnected,
    isOnline: isConnected,
    error,
    retryConnection,
    lastConnected,
    connect,
    disconnect,
    connectionAttempts: retryCount,
    status: connectionStatus,
    message
  };
};

export default useConnectionStatus;
