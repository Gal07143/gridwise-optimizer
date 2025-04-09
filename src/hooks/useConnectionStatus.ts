
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { ConnectionStatusOptions, ConnectionStatusResult } from '@/types/modbus';

const useConnectionStatus = (options?: ConnectionStatusOptions): ConnectionStatusResult => {
  const {
    initialStatus = true,
    reconnectDelay = 5000,
    showToasts = true,
    deviceId = undefined
  } = options || {};
  
  const [isOnline, setIsOnline] = useState<boolean>(initialStatus);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [lastOnline, setLastOnline] = useState<Date | null>(initialStatus ? new Date() : null);
  const [lastOffline, setLastOffline] = useState<Date | null>(initialStatus ? null : new Date());
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<'connected' | 'disconnected' | 'connecting' | 'error'>(
    isConnected ? 'connected' : (isConnecting ? 'connecting' : 'disconnected')
  );
  
  // Handle online/offline status changes
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setLastOnline(new Date());
      if (showToasts) toast.success('Your connection has been restored');
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setLastOffline(new Date());
      if (showToasts) toast.error('You appear to be offline');
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Set initial status based on navigator.onLine
    setIsOnline(navigator.onLine);
    if (navigator.onLine) {
      setLastOnline(new Date());
    } else {
      setLastOffline(new Date());
    }
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [showToasts]);

  // Connection management functions
  const connect = useCallback(async () => {
    if (isConnecting || isConnected) return;
    
    setIsConnecting(true);
    
    try {
      // Simulate connection process
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsConnected(true);
      if (showToasts) toast.success('Connected successfully');
      setStatus('connected');
    } catch (err) {
      console.error('Connection failed:', err);
      if (showToasts) toast.error('Failed to connect');
      setError(err instanceof Error ? err : new Error('Connection failed'));
      setStatus('error');
    } finally {
      setIsConnecting(false);
    }
  }, [isConnecting, isConnected, showToasts]);
  
  const disconnect = useCallback(async () => {
    if (!isConnected) return;
    
    try {
      // Simulate disconnect process
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsConnected(false);
      if (showToasts) toast.info('Disconnected');
      setStatus('disconnected');
    } catch (err) {
      console.error('Disconnect error:', err);
      if (showToasts) toast.error('Failed to disconnect');
      setError(err instanceof Error ? err : new Error('Disconnect failed'));
    }
  }, [isConnected, showToasts]);
  
  const retryConnection = useCallback(async () => {
    if (isConnecting) return;
    
    await disconnect();
    await connect();
  }, [isConnecting, disconnect, connect]);

  return {
    isOnline,
    isConnected,
    isConnecting,
    lastOnline,
    lastOffline,
    error,
    connect,
    disconnect,
    retryConnection,
    status,
  };
};

export default useConnectionStatus;
