
/**
 * Connection and network utilities
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
 * Enumerate connection quality levels
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
 */
export const getConnectionQuality = (latencyMs: number): ConnectionQuality => {
  if (latencyMs < 0) return ConnectionQuality.Unknown;
  if (latencyMs < 100) return ConnectionQuality.Excellent;
  if (latencyMs < 300) return ConnectionQuality.Good;
  if (latencyMs < 600) return ConnectionQuality.Fair;
  return ConnectionQuality.Poor;
};
