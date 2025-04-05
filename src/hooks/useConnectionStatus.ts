
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface ConnectionOptions {
  showToasts?: boolean;
}

export default function useConnectionStatus(options: ConnectionOptions = {}) {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const { showToasts = true } = options;

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (showToasts) {
        toast.success('Connection restored');
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      if (showToasts) {
        toast.error('Connection lost. Some features may be unavailable');
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [showToasts]);

  const retryConnection = () => {
    // Implement a fetch to check if we can connect to the server
    fetch('/api/health-check', { cache: 'no-store' })
      .then(() => {
        setIsOnline(true);
        if (showToasts) {
          toast.success('Connection restored');
        }
      })
      .catch(() => {
        setIsOnline(false);
        if (showToasts) {
          toast.error('Still offline. Please check your connection');
        }
      });
  };

  return { isOnline, retryConnection };
}
