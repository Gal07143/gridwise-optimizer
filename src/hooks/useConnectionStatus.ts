import { useState, useEffect, useCallback } from 'react';

export interface ConnectionStatusResult {
  isOnline: boolean;
  lastChecked: Date | null;
  checkConnection: () => Promise<boolean>;
  retryConnection: () => Promise<boolean>;
}

const useConnectionStatus = (
  pingInterval: number = 30000
): ConnectionStatusResult => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkConnection = useCallback(async (): Promise<boolean> => {
    try {
      // Try to fetch a small resource to verify connectivity
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch('/api/ping', {
        method: 'HEAD',
        cache: 'no-cache',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      const online = response.ok;
      setIsOnline(online);
      setLastChecked(new Date());
      return online;
    } catch (error) {
      // Any error means we're offline
      setIsOnline(false);
      setLastChecked(new Date());
      return false;
    }
  }, []);

  const retryConnection = useCallback(async (): Promise<boolean> => {
    // This provides an explicit way to check connection on demand
    return await checkConnection();
  }, [checkConnection]);

  useEffect(() => {
    // Check connection status initially
    checkConnection();
    
    // Set up regular interval for checking connection
    const intervalId = setInterval(() => {
      checkConnection();
    }, pingInterval);
    
    // Listen to browser's online/offline events as a fallback
    const handleOnline = () => {
      setIsOnline(true);
      setLastChecked(new Date());
      // Verify it's really online
      checkConnection();
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setLastChecked(new Date());
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [checkConnection, pingInterval]);

  return { isOnline, lastChecked, checkConnection, retryConnection };
};

export default useConnectionStatus;
