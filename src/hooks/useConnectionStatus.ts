import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { ConnectionStatusOptions, ConnectionStatusResult } from '@/types/modbus';

const useConnectionStatus = (options?: ConnectionStatusOptions): ConnectionStatusResult => {
  const {
    initialStatus = true,
    reconnectDelay = 5000,
    showToasts = true
  } = options || {};
  
  const [isOnline, setIsOnline] = useState<boolean>(initialStatus);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [lastOnline, setLastOnline] = useState<Date | null>(initialStatus ? new Date() : null);
  const [lastOffline, setLastOffline] = useState<Date | null>(initialStatus ? null : new Date());
  
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
    } catch (error) {
      console.error('Connection failed:', error);
      if (showToasts) toast.error('Failed to connect');
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
    } catch (error) {
      console.error('Disconnect error:', error);
      if (showToasts) toast.error('Failed to disconnect');
    }
  }, [isConnected, showToasts]);
  
  const retryConnection = useCallback(async () => {
    if (isConnecting) return;
    
    await disconnect();
    await connect();
  }, [isConnecting, disconnect, connect]);

  return {
    isOnline,
    lastOnline,
    lastOffline,
    isConnected,
    isConnecting,
    connect,
    disconnect,
    retryConnection
  };
};

export default useConnectionStatus;
