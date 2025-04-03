
/**
 * Connection and network utilities for the Energy Management System
 */

/**
 * Check if the browser is online
 */
export const isOnline = (): boolean => {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
};

/**
 * Ping an endpoint to check server connectivity
 * @param url The URL to ping
 * @param timeout Timeout in milliseconds
 * @returns Promise resolving to boolean indicating connectivity status
 */
export const pingEndpoint = async (
  url: string = '/api/health',
  timeout: number = 3000
): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(url, {
      method: 'HEAD',
      cache: 'no-store',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.warn(`Failed to ping ${url}:`, error);
    return false;
  }
};

/**
 * Add event listener for online/offline events
 * @param onOnline Callback for when connection comes online
 * @param onOffline Callback for when connection goes offline
 * @returns Cleanup function to remove event listeners
 */
export const addConnectionListeners = (
  onOnline: () => void,
  onOffline: () => void
): (() => void) => {
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);
  
  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
};

/**
 * Measures connection latency to a specific endpoint
 * @param url The URL to measure latency to
 * @param samples Number of samples to collect
 * @returns Promise resolving to average latency in milliseconds
 */
export const measureConnectionLatency = async (
  url: string = '/api/ping',
  samples: number = 3
): Promise<number> => {
  const latencies: number[] = [];
  
  for (let i = 0; i < samples; i++) {
    try {
      const startTime = performance.now();
      await fetch(`${url}?t=${Date.now()}`, { method: 'HEAD', cache: 'no-store' });
      const endTime = performance.now();
      
      latencies.push(endTime - startTime);
      
      // Wait a short time between requests
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      console.warn(`Failed to measure latency (sample ${i + 1}):`, error);
    }
  }
  
  if (latencies.length === 0) {
    return -1; // Error case
  }
  
  // Calculate average latency
  return latencies.reduce((sum, latency) => sum + latency, 0) / latencies.length;
};

/**
 * Connection quality levels based on latency
 */
export enum ConnectionQuality {
  Excellent = 'excellent',
  Good = 'good',
  Fair = 'fair',
  Poor = 'poor',
  Unknown = 'unknown'
}

/**
 * Determine connection quality based on latency
 * @param latencyMs Latency in milliseconds
 * @returns ConnectionQuality enum value
 */
export const getConnectionQuality = (latencyMs: number): ConnectionQuality => {
  if (latencyMs < 0) return ConnectionQuality.Unknown;
  if (latencyMs < 100) return ConnectionQuality.Excellent;
  if (latencyMs < 300) return ConnectionQuality.Good;
  if (latencyMs < 600) return ConnectionQuality.Fair;
  return ConnectionQuality.Poor;
};

/**
 * Check WebSocket capability and connectivity
 * @param url WebSocket URL to test
 * @param timeout Timeout in milliseconds
 * @returns Promise resolving to boolean indicating WebSocket connectivity
 */
export const checkWebSocketSupport = async (
  url: string = `wss://${window.location.host}/ws`,
  timeout: number = 5000
): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof WebSocket === 'undefined') {
      resolve(false);
      return;
    }
    
    try {
      const socket = new WebSocket(url);
      const timeoutId = setTimeout(() => {
        socket.close();
        resolve(false);
      }, timeout);
      
      socket.onopen = () => {
        clearTimeout(timeoutId);
        socket.close();
        resolve(true);
      };
      
      socket.onerror = () => {
        clearTimeout(timeoutId);
        socket.close();
        resolve(false);
      };
    } catch (error) {
      console.warn('Error checking WebSocket support:', error);
      resolve(false);
    }
  });
};

/**
 * Connection utilities export
 */
export const connectionUtils = {
  isOnline,
  pingEndpoint,
  addConnectionListeners,
  measureConnectionLatency,
  getConnectionQuality,
  checkWebSocketSupport
};
