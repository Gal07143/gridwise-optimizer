
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface ConnectionStatusOptions {
  showToasts?: boolean;
  checkInterval?: number;
}

export default function useConnectionStatus(options: ConnectionStatusOptions = {}) {
  const { showToasts = true, checkInterval = 30000 } = options;
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline && showToasts) {
        toast.success('Connection restored');
      }
      setWasOffline(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      if (showToasts) {
        toast.error('Connection lost');
      }
      setWasOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Periodic check for connection status
    const intervalId = setInterval(() => {
      const online = navigator.onLine;
      
      // If our state doesn't match the actual state
      if (online !== isOnline) {
        if (online) {
          handleOnline();
        } else {
          handleOffline();
        }
      }
    }, checkInterval);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(intervalId);
    };
  }, [isOnline, wasOffline, showToasts, checkInterval]);

  return { isOnline };
}
