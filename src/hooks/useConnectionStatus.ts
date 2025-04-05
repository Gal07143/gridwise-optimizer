
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface ConnectionStatusOptions {
  checkInterval?: number;
  showToasts?: boolean;
}

export interface ConnectionStatus {
  isOnline: boolean;
  lastChecked: Date | null;
  checkNow: () => Promise<boolean>;
  retryConnection: () => Promise<boolean>;
}

/**
 * Hook to check and monitor internet connection status
 */
const useConnectionStatus = (options: ConnectionStatusOptions = {}): ConnectionStatus => {
  const { 
    checkInterval = 30000, // Check every 30 seconds by default
    showToasts = false 
  } = options;
  
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  
  const checkConnection = useCallback(async (): Promise<boolean> => {
    try {
      // Try to fetch a tiny resource to check actual connectivity
      // We use a timestamp to prevent caching
      const response = await fetch(`/api/health-check?_=${Date.now()}`, {
        method: 'HEAD',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      const online = response.ok;
      setIsOnline(online);
      setLastChecked(new Date());
      
      if (!online && showToasts) {
        toast.error('Connection lost. You\'re working offline.');
      } else if (online && !isOnline && showToasts) {
        toast.success('Connection restored!');
      }
      
      return online;
    } catch (error) {
      setIsOnline(false);
      setLastChecked(new Date());
      
      if (showToasts && isOnline) {
        toast.error('Connection lost. You\'re working offline.');
      }
      
      return false;
    }
  }, [isOnline, showToasts]);
  
  const retryConnection = useCallback(async (): Promise<boolean> => {
    if (showToasts) {
      toast.info('Attempting to reconnect...');
    }
    
    return await checkConnection();
  }, [checkConnection, showToasts]);
  
  useEffect(() => {
    // Check connection immediately
    checkConnection();
    
    // Set up event listeners for online/offline events
    const handleOnline = () => {
      checkConnection(); // Verify we're really online
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setLastChecked(new Date());
      if (showToasts) {
        toast.error('Connection lost. You\'re working offline.');
      }
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Set up interval for regular checks
    const intervalId = setInterval(() => {
      checkConnection();
    }, checkInterval);
    
    // Clean up
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(intervalId);
    };
  }, [checkConnection, checkInterval, showToasts]);
  
  return {
    isOnline,
    lastChecked,
    checkNow: checkConnection,
    retryConnection
  };
};

export default useConnectionStatus;
