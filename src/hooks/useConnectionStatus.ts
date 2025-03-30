
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface ConnectionStatusOptions {
  showToasts?: boolean;
  checkEndpoint?: string;
  pollingInterval?: number;
}

// Enhanced connection status hook that monitors online/offline status and optionally checks a specific endpoint
export const useConnectionStatus = ({ 
  showToasts = true,
  checkEndpoint,
  pollingInterval = 30000  // 30 seconds default
}: ConnectionStatusOptions = {}) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isEndpointReachable, setIsEndpointReachable] = useState<boolean | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  
  // Function to check if a specific endpoint is reachable
  const checkEndpointReachability = useCallback(async () => {
    if (!checkEndpoint) return;
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(checkEndpoint, { 
        method: 'HEAD',
        cache: 'no-store',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      setIsEndpointReachable(response.ok);
      setLastChecked(new Date());
    } catch (error) {
      console.warn('Endpoint check failed:', error);
      setIsEndpointReachable(false);
      setLastChecked(new Date());
    }
  }, [checkEndpoint]);
  
  // Handler for when the user is online
  const handleOnline = useCallback(() => {
    const wasOffline = !isOnline;
    setIsOnline(true);
    
    if (wasOffline && showToasts) {
      toast.success('You are back online', {
        id: 'connection-status',
        duration: 3000,
      });
    }
    
    // Check endpoint when we come back online
    if (checkEndpoint) {
      checkEndpointReachability();
    }
  }, [isOnline, showToasts, checkEndpoint, checkEndpointReachability]);

  // Handler for when the user is offline
  const handleOffline = useCallback(() => {
    setIsOnline(false);
    setIsEndpointReachable(false);
    
    if (showToasts) {
      toast.error('You are offline. Some features may be unavailable.', {
        id: 'connection-status',
        duration: Infinity,
      });
    }
  }, [showToasts]);

  // Set up event listeners
  useEffect(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Initial offline check
    if (!navigator.onLine && showToasts) {
      toast.error('You are offline. Some features may be unavailable.', {
        id: 'connection-status',
        duration: Infinity,
      });
    }
    
    // Initial endpoint check
    if (navigator.onLine && checkEndpoint) {
      checkEndpointReachability();
    }
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleOnline, handleOffline, showToasts, checkEndpoint, checkEndpointReachability]);
  
  // Set up polling for endpoint check when online
  useEffect(() => {
    if (!checkEndpoint || !isOnline || pollingInterval <= 0) return;
    
    const intervalId = setInterval(() => {
      checkEndpointReachability();
    }, pollingInterval);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [isOnline, checkEndpoint, pollingInterval, checkEndpointReachability]);
  
  // Retry connection function
  const retryConnection = useCallback(() => {
    if (checkEndpoint) {
      checkEndpointReachability();
    }
  }, [checkEndpoint, checkEndpointReachability]);
  
  return { 
    isOnline, 
    isEndpointReachable, 
    lastChecked, 
    retryConnection
  };
};

export default useConnectionStatus;
