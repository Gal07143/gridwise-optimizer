
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface ConnectionStatusOptions {
  showToasts?: boolean;
  autoConnect?: boolean;
  deviceId?: string;
}

export interface ConnectionStatus {
  isOnline: boolean;
  lastConnected?: Date;
  connectionAttempts: number;
  error?: Error;
}

export interface ConnectionStatusResult {
  isOnline: boolean;
  isConnecting?: boolean;
  lastConnected?: Date;
  error: Error | null;
  connect?: () => Promise<void>;
  disconnect?: () => void;
}

const useConnectionStatus = (options: ConnectionStatusOptions = {}): ConnectionStatusResult => {
  const { showToasts = true, autoConnect = false, deviceId } = options;
  
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [lastConnected, setLastConnected] = useState<Date | undefined>(undefined);
  const [error, setError] = useState<Error | null>(null);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      // Simulate connection logic
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Update state on successful connection
      setIsOnline(true);
      setLastConnected(new Date());
      
      if (showToasts) {
        toast.success('Connection established successfully');
      }
    } catch (err) {
      const connectionError = err instanceof Error ? err : new Error('Connection failed');
      setError(connectionError);
      setIsOnline(false);
      
      if (showToasts) {
        toast.error(`Connection failed: ${connectionError.message}`);
      }
    } finally {
      setIsConnecting(false);
    }
  }, [showToasts]);

  const disconnect = useCallback(() => {
    setIsOnline(false);
    
    if (showToasts) {
      toast.info('Disconnected');
    }
  }, [showToasts]);

  // Listen for browser online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (showToasts) toast.success('Network connection restored');
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      if (showToasts) toast.error('Network connection lost');
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [showToasts]);

  // Auto-connect on mount if requested
  useEffect(() => {
    if (autoConnect && !isOnline && !isConnecting) {
      connect();
    }
  }, [autoConnect, connect, isOnline, isConnecting]);

  return {
    isOnline,
    isConnecting,
    lastConnected,
    error,
    connect,
    disconnect
  };
};

export default useConnectionStatus;
