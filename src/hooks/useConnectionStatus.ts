import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

type ConnectionStatus = 'online' | 'offline' | 'reconnecting';

export const useConnectionStatus = () => {
  const [status, setStatus] = useState<ConnectionStatus>(() => 
    navigator.onLine ? 'online' : 'offline'
  );
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [lastOnline, setLastOnline] = useState<Date | null>(
    navigator.onLine ? new Date() : null
  );

  const handleOnline = useCallback(() => {
    setStatus('online');
    setLastOnline(new Date());
    setReconnectAttempts(0);
    toast.success('Connection restored', {
      description: 'You\'re back online'
    });
  }, []);

  const handleOffline = useCallback(() => {
    setStatus('offline');
    toast.error('Connection lost', {
      description: 'Please check your internet connection'
    });
  }, []);

  const attemptReconnect = useCallback(async () => {
    if (navigator.onLine) {
      setStatus('reconnecting');
      setReconnectAttempts(prev => prev + 1);

      try {
        // Try to fetch a small resource to verify actual connectivity
        const response = await fetch('/api/ping', { 
          method: 'HEAD',
          cache: 'no-cache',
          headers: { 'Cache-Control': 'no-cache' }
        });
        
        if (response.ok) {
          handleOnline();
        } else {
          setTimeout(attemptReconnect, Math.min(1000 * Math.pow(2, reconnectAttempts), 30000));
        }
      } catch (error) {
        setTimeout(attemptReconnect, Math.min(1000 * Math.pow(2, reconnectAttempts), 30000));
      }
    }
  }, [reconnectAttempts, handleOnline]);

  useEffect(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleOnline, handleOffline]);

  return {
    status,
    isOnline: status === 'online',
    isOffline: status === 'offline',
    isReconnecting: status === 'reconnecting',
    reconnectAttempts,
    lastOnline,
    attemptReconnect
  };
};

export default useConnectionStatus;
