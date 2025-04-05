
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export type ConnectionStatus = 'online' | 'offline' | 'reconnecting';

interface ConnectionStatusOptions {
  showToasts?: boolean;
}

interface ConnectionStatusResult {
  status: ConnectionStatus;
  isOnline: boolean;
  isOffline: boolean;
  isReconnecting: boolean;
  reconnectAttempts: number;
  lastOnline: Date;
  attemptReconnect: () => Promise<boolean>;
}

/**
 * Hook to track and manage online/offline status
 */
const useConnectionStatus = (options: ConnectionStatusOptions = {}): ConnectionStatusResult => {
  const { showToasts = true } = options;
  const [status, setStatus] = useState<ConnectionStatus>(navigator.onLine ? 'online' : 'offline');
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [lastOnline, setLastOnline] = useState(new Date());

  // Handle online event
  const handleOnline = () => {
    setStatus('online');
    setLastOnline(new Date());
    setReconnectAttempts(0);
    
    if (showToasts) {
      toast.success('Back online!', {
        description: 'Your internet connection has been restored.',
        duration: 3000,
      });
    }
  };

  // Handle offline event
  const handleOffline = () => {
    setStatus('offline');
    
    if (showToasts) {
      toast.error('Connection lost', {
        description: 'Please check your internet connection.',
        duration: 0, // Don't auto-dismiss
      });
    }
  };

  // Try to reconnect
  const attemptReconnect = async (): Promise<boolean> => {
    if (status === 'online') return true;
    
    setStatus('reconnecting');
    setReconnectAttempts((prev) => prev + 1);
    
    // Try to fetch a small resource to check connectivity
    try {
      // Use a timestamp to prevent caching
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/health?t=${timestamp}`, { 
        method: 'HEAD',
        cache: 'no-cache',
        mode: 'no-cors',
        timeout: 5000,
      });
      
      // If we got a response, we're online
      setStatus('online');
      setLastOnline(new Date());
      
      if (showToasts) {
        toast.success('Connected', { 
          description: 'Connection restored successfully.',
        });
      }
      
      return true;
    } catch (error) {
      // Still offline
      setStatus('offline');
      
      if (showToasts) {
        toast.error('Still offline', {
          description: `Reconnect attempt failed (${reconnectAttempts + 1})`,
        });
      }
      
      return false;
    }
  };

  // Listen for online/offline events
  useEffect(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    status,
    isOnline: status === 'online',
    isOffline: status === 'offline',
    isReconnecting: status === 'reconnecting',
    reconnectAttempts,
    lastOnline,
    attemptReconnect,
  };
};

export default useConnectionStatus;
