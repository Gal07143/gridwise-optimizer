
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface ConnectionStatusOptions {
  showToasts?: boolean;
  onOffline?: () => void;
  onOnline?: () => void;
}

function useConnectionStatus(options: ConnectionStatusOptions = {}) {
  const { showToasts = true, onOffline, onOnline } = options;
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);

  const handleOnline = useCallback(() => {
    setIsOnline(true);
    setWasOffline(false);
    if (showToasts && wasOffline) {
      toast.success('You are back online', {
        description: 'Connection restored. Your data will now sync automatically.'
      });
    }
    if (onOnline) onOnline();
  }, [showToasts, wasOffline, onOnline]);

  const handleOffline = useCallback(() => {
    setIsOnline(false);
    setWasOffline(true);
    if (showToasts) {
      toast.warning('You are offline', {
        description: 'Data will be saved locally and synced when you reconnect.'
      });
    }
    if (onOffline) onOffline();
  }, [showToasts, onOffline]);
  
  const retryConnection = useCallback(() => {
    // Try to fetch a small resource to test connectivity
    fetch('/api/ping', { method: 'GET', cache: 'no-store' })
      .then(() => {
        if (!isOnline) {
          handleOnline();
        }
      })
      .catch(() => {
        if (isOnline) {
          handleOffline();
        }
      });
  }, [isOnline, handleOnline, handleOffline]);

  useEffect(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleOnline, handleOffline]);

  return { isOnline, retryConnection };
}

export default useConnectionStatus;
