
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

// Connection status hook that monitors online/offline status
export const useConnectionStatus = (showToasts: boolean = true) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    // Handler for when the user is online
    const handleOnline = () => {
      setIsOnline(true);
      if (showToasts) {
        toast.success('You are back online', {
          id: 'connection-status',
          duration: 3000,
        });
      }
    };

    // Handler for when the user is offline
    const handleOffline = () => {
      setIsOnline(false);
      if (showToasts) {
        toast.error('You are offline. Some features may be unavailable.', {
          id: 'connection-status',
          duration: Infinity,
        });
      }
    };

    // Subscribe to the online/offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check - if offline, show toast
    if (!navigator.onLine && showToasts) {
      toast.error('You are offline. Some features may be unavailable.', {
        id: 'connection-status',
        duration: Infinity,
      });
    }

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [showToasts]);

  return { isOnline };
};

export default useConnectionStatus;
