
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface UseConnectionStatusOptions {
  showToasts?: boolean;
  pollingInterval?: number;
  timeoutDuration?: number;
}

interface ConnectionStatus {
  isOnline: boolean;
}

const useConnectionStatus = (options: UseConnectionStatusOptions = {}): ConnectionStatus => {
  const {
    showToasts = true,
    pollingInterval = 30000,
    timeoutDuration = 5000
  } = options;

  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (showToasts) {
        toast.success('You are back online');
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      if (showToasts) {
        toast.error('You appear to be offline. Some features may be limited.');
      }
    };

    // Set up browser online/offline event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Also poll for connectivity in case events don't fire reliably
    const checkServerConnection = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);
        
        // Use a tiny image or API endpoint that should always be available
        const res = await fetch('/api/health-check', {
          method: 'HEAD',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!res.ok) {
          throw new Error('Server responded with error');
        }
        
        if (!isOnline) {
          setIsOnline(true);
          if (showToasts) {
            toast.success('Connection restored');
          }
        }
      } catch (error) {
        // Only change status if we're currently considered online
        // This prevents repeated offline notifications
        if (isOnline && navigator.onLine) {
          setIsOnline(false);
          if (showToasts) {
            toast.error('Server connection lost. Some features may be limited.');
          }
        }
      }
    };
    
    // Run the check immediately and then on interval
    if (pollingInterval > 0) {
      const interval = setInterval(checkServerConnection, pollingInterval);
      return () => {
        clearInterval(interval);
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isOnline, showToasts, pollingInterval, timeoutDuration]);

  return { isOnline };
};

export default useConnectionStatus;
