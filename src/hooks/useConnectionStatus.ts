
import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { 
  pingEndpoint, 
  addConnectionListeners, 
  measureConnectionLatency, 
  getConnectionQuality,
  ConnectionQuality
} from '@/utils/connectionUtils';

interface ConnectionStatusOptions {
  showToasts?: boolean;
  checkEndpoint?: string;
  pollingInterval?: number;
  pingTimeout?: number;
  onStatusChange?: (status: ConnectionStatus) => void;
}

export interface ConnectionStatus {
  isOnline: boolean;
  isEndpointReachable: boolean | null;
  lastChecked: Date | null;
  latency: number | null;
  quality: ConnectionQuality;
}

/**
 * Enhanced connection status hook that monitors online/offline status
 * and optionally checks a specific endpoint with quality metrics
 */
export const useConnectionStatus = ({ 
  showToasts = true,
  checkEndpoint,
  pollingInterval = 30000,  // 30 seconds default
  pingTimeout = 5000,       // 5 seconds timeout
  onStatusChange
}: ConnectionStatusOptions = {}): ConnectionStatus & {
  retryConnection: () => Promise<boolean>;
  checkLatency: () => Promise<number>;
} => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isEndpointReachable, setIsEndpointReachable] = useState<boolean | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [quality, setQuality] = useState<ConnectionQuality>(ConnectionQuality.Unknown);
  
  // Use a ref to track the active toast to prevent duplicates
  const toastIdRef = useRef<string | number | null>(null);
  
  // Track polling interval
  const intervalRef = useRef<number | null>(null);
  
  // Function to check if a specific endpoint is reachable
  const checkEndpointReachability = useCallback(async (): Promise<boolean> => {
    if (!checkEndpoint) return isOnline;
    
    try {
      const isReachable = await pingEndpoint(checkEndpoint, pingTimeout);
      setIsEndpointReachable(isReachable);
      setLastChecked(new Date());
      
      return isReachable;
    } catch (error) {
      console.warn('Endpoint check failed:', error);
      setIsEndpointReachable(false);
      setLastChecked(new Date());
      
      return false;
    }
  }, [checkEndpoint, pingTimeout, isOnline]);
  
  // Check and measure connection latency
  const checkLatency = useCallback(async (): Promise<number> => {
    if (!isOnline || !isEndpointReachable) return -1;
    
    try {
      const measureEndpoint = checkEndpoint || '/api/ping';
      const measuredLatency = await measureConnectionLatency(measureEndpoint, 3);
      setLatency(measuredLatency);
      
      // Determine connection quality
      const connectionQuality = getConnectionQuality(measuredLatency);
      setQuality(connectionQuality);
      
      return measuredLatency;
    } catch (error) {
      console.warn('Latency measurement failed:', error);
      setLatency(null);
      setQuality(ConnectionQuality.Unknown);
      
      return -1;
    }
  }, [isOnline, isEndpointReachable, checkEndpoint]);
  
  // Handler for when the user is online
  const handleOnline = useCallback(() => {
    const wasOffline = !isOnline;
    setIsOnline(true);
    
    if (wasOffline) {
      if (showToasts) {
        // Clear any offline toast
        if (toastIdRef.current) {
          toast.dismiss(toastIdRef.current);
          toastIdRef.current = null;
        }
        
        // Show online toast
        toast.success('You are back online', {
          id: 'connection-status-online',
          duration: 3000,
        });
      }
      
      // Check endpoint when we come back online
      if (checkEndpoint) {
        checkEndpointReachability().then(reachable => {
          if (reachable) {
            // Measure latency when endpoint is reachable
            checkLatency();
          }
        });
      }
    }
  }, [isOnline, showToasts, checkEndpoint, checkEndpointReachability, checkLatency]);

  // Handler for when the user is offline
  const handleOffline = useCallback(() => {
    setIsOnline(false);
    setIsEndpointReachable(false);
    setQuality(ConnectionQuality.Unknown);
    
    if (showToasts && !toastIdRef.current) {
      // Show persistent offline toast
      toastIdRef.current = toast.error('You are offline. Some features may be unavailable.', {
        id: 'connection-status-offline',
        duration: Infinity,
      });
    }
  }, [showToasts]);

  // Set up initial checks and event listeners
  useEffect(() => {
    // Initial offline check
    if (!navigator.onLine) {
      handleOffline();
    } else {
      // Initial endpoint check
      if (checkEndpoint) {
        checkEndpointReachability().then(reachable => {
          if (reachable) {
            // Initial latency check if endpoint is reachable
            checkLatency();
          }
        });
      }
    }
    
    // Set up network event listeners
    const cleanup = addConnectionListeners(handleOnline, handleOffline);
    
    return cleanup;
  }, []); // Run only on mount
  
  // Set up polling for endpoint check when online
  useEffect(() => {
    if (!checkEndpoint || !isOnline || pollingInterval <= 0) return;
    
    const checkStatus = async () => {
      const isReachable = await checkEndpointReachability();
      if (isReachable) {
        await checkLatency();
      }
      
      // Call status change handler if provided
      if (onStatusChange) {
        onStatusChange({
          isOnline,
          isEndpointReachable,
          lastChecked,
          latency,
          quality
        });
      }
    };
    
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Set new interval
    intervalRef.current = window.setInterval(checkStatus, pollingInterval);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [
    isOnline, 
    checkEndpoint, 
    pollingInterval, 
    checkEndpointReachability, 
    checkLatency,
    onStatusChange,
    isEndpointReachable,
    lastChecked,
    latency,
    quality
  ]);
  
  // Retry connection function
  const retryConnection = useCallback(async (): Promise<boolean> => {
    if (!isOnline) {
      toast.warning('Cannot check connection while offline', {
        duration: 3000,
      });
      return false;
    }
    
    toast.loading('Checking connection...', {
      id: 'retry-connection',
    });
    
    try {
      const isReachable = await checkEndpointReachability();
      
      if (isReachable) {
        const currentLatency = await checkLatency();
        const qualityText = quality === ConnectionQuality.Unknown ? '' : ` (${quality} quality)`;
        
        toast.success(`Connected successfully${currentLatency > 0 ? ` - ${Math.round(currentLatency)}ms latency${qualityText}` : ''}`, {
          id: 'retry-connection',
        });
      } else {
        toast.error('Connection failed - server unreachable', {
          id: 'retry-connection',
        });
      }
      
      return isReachable;
    } catch (error) {
      toast.error('Connection check failed', {
        id: 'retry-connection',
      });
      return false;
    }
  }, [isOnline, checkEndpointReachability, checkLatency, quality]);
  
  // When unmounting, clean up toasts
  useEffect(() => {
    return () => {
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
      }
    };
  }, []);
  
  return { 
    isOnline, 
    isEndpointReachable, 
    lastChecked, 
    latency,
    quality,
    retryConnection,
    checkLatency
  };
};

export default useConnectionStatus;
