
import { useEffect, useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useConnectionStatus } from './useConnectionStatus';

export interface TelemetryData {
  id: string;
  device_id: string;
  timestamp?: string;
  received_at?: string;
  created_at: string;
  message: any;
  voltage?: number;
  current?: number;
  power?: number;
  temperature?: number;
  state_of_charge?: number;
  [key: string]: any;
}

interface UseLiveTelemetryOptions {
  pollingFallbackInterval?: number;
  historyLimit?: number;
  enableLocalFallback?: boolean;
}

export const useLiveTelemetry = (
  deviceId: string,
  options: UseLiveTelemetryOptions = {}
) => {
  const {
    pollingFallbackInterval = 10000,
    historyLimit = 50,
    enableLocalFallback = true,
  } = options;

  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [telemetryHistory, setTelemetryHistory] = useState<TelemetryData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  
  const channelRef = useRef<any>(null);
  const pollingIntervalRef = useRef<number | null>(null);
  const lastUpdatedRef = useRef<Date | null>(null);
  
  const { isOnline } = useConnectionStatus({
    showToasts: false
  });

  // Function to fetch the latest telemetry data
  const fetchLatest = useCallback(async () => {
    if (!deviceId || !isOnline) return;
    
    try {
      setLoading(true);
      const { data, error: supabaseError } = await supabase
        .from('telemetry_log')
        .select('*')
        .eq('device_id', deviceId)
        .order('created_at', { ascending: false })
        .limit(historyLimit);

      if (supabaseError) {
        // Only set error if no data is found (not for 'empty result' errors)
        if (supabaseError.code !== 'PGRST116') {
          throw new Error(supabaseError.message);
        }
        
        // If no data, set fallback data if enabled
        if (enableLocalFallback) {
          const fallbackData = generateFallbackData(deviceId);
          setTelemetry(fallbackData);
          setTelemetryHistory(prev => [...prev, fallbackData].slice(0, historyLimit));
          lastUpdatedRef.current = new Date();
        }
        
        return;
      }

      if (data && data.length > 0) {
        // Process the telemetry history
        const processedData = data.map(item => processMessageData(item));
        setTelemetryHistory(processedData);
        
        // Set the latest telemetry as the current one
        setTelemetry(processedData[0]);
        lastUpdatedRef.current = new Date();
      } else if (enableLocalFallback) {
        // No data found, generate fallback data
        const fallbackData = generateFallbackData(deviceId);
        setTelemetry(fallbackData);
        setTelemetryHistory(prev => [...prev, fallbackData].slice(0, historyLimit));
        lastUpdatedRef.current = new Date();
      }

      setError(null);
    } catch (err) {
      console.error('Error fetching telemetry:', err);
      setError(err instanceof Error ? err : new Error('Unknown error fetching telemetry'));
      
      // Provide fallback data even on error if enabled
      if (enableLocalFallback) {
        const fallbackData = generateFallbackData(deviceId);
        setTelemetry(fallbackData);
        setTelemetryHistory(prev => [...prev, fallbackData].slice(0, historyLimit));
        lastUpdatedRef.current = new Date();
      }
    } finally {
      setLoading(false);
    }
  }, [deviceId, historyLimit, enableLocalFallback, isOnline]);

  // Process message data from telemetry
  const processMessageData = (data: any): TelemetryData => {
    let processedData = { ...data };
    
    if (data.message) {
      if (typeof data.message === 'string') {
        try {
          const parsedMessage = JSON.parse(data.message);
          processedData = { ...processedData, ...parsedMessage };
        } catch (e) {
          console.warn('Could not parse message as JSON:', e);
        }
      } else if (typeof data.message === 'object') {
        processedData = { ...processedData, ...data.message };
      }
    }
    
    // Ensure timestamp is set properly
    processedData.timestamp = 
      processedData.timestamp || 
      processedData.received_at || 
      processedData.created_at;
    
    return processedData;
  };

  // Generate fallback telemetry data for demo or when offline
  const generateFallbackData = (deviceId: string): TelemetryData => {
    const now = new Date();
    // Create a deterministic but varying value based on time
    const timeComponent = now.getHours() + now.getMinutes() / 60;
    const dayComponent = now.getDate() / 31;
    
    // Generate a sine wave pattern for values
    const sinValue = Math.sin(timeComponent * Math.PI) * 0.5 + 0.5;
    const trendValue = (sinValue + dayComponent) / 2;
    
    // Generate a unique ID for this reading
    const readingId = `fallback-${deviceId}-${now.getTime()}`;
    
    return {
      id: readingId,
      device_id: deviceId,
      created_at: now.toISOString(),
      timestamp: now.toISOString(),
      message: {
        power: 3 + trendValue * 4,  // 3-7 kW
        voltage: 220 + trendValue * 20, // 220-240V
        current: 8 + trendValue * 5,  // 8-13A
        temperature: 35 + trendValue * 10, // 35-45°C
        state_of_charge: Math.min(100, Math.max(20, 60 + trendValue * 40)), // 60-100%
      },
      power: 3 + trendValue * 4,
      voltage: 220 + trendValue * 20,
      current: 8 + trendValue * 5,
      temperature: 35 + trendValue * 10,
      state_of_charge: Math.min(100, Math.max(20, 60 + trendValue * 40)),
      source: 'fallback',
    };
  };

  // Set up real-time subscription and polling
  useEffect(() => {
    if (!deviceId) return;
    
    // Initial data fetch
    fetchLatest();
    
    // Set up real-time subscription if online
    if (isOnline) {
      console.log(`Setting up real-time subscription for device ${deviceId}`);
      
      channelRef.current = supabase
        .channel(`telemetry-${deviceId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'telemetry_log',
            filter: `device_id=eq.${deviceId}`
          },
          (payload) => {
            console.log('New telemetry data received:', payload);
            
            // Process the new telemetry data
            const processedData = processMessageData(payload.new);
            
            // Update the current telemetry
            setTelemetry(processedData);
            
            // Add to history and maintain limit
            setTelemetryHistory(prev => [processedData, ...prev].slice(0, historyLimit));
            
            // Update connection status and last updated time
            setIsConnected(true);
            lastUpdatedRef.current = new Date();
          }
        )
        .subscribe((status) => {
          console.log(`Subscription status for ${deviceId}:`, status);
          
          if (status === 'SUBSCRIBED') {
            setIsConnected(true);
          } else if (status === 'CHANNEL_ERROR') {
            setIsConnected(false);
            toast.error(`Lost connection to device ${deviceId}. Retrying...`, {
              id: `telemetry-connection-${deviceId}`
            });
          }
        });
    }
    
    // Set up polling as a fallback or for offline mode
    if (pollingFallbackInterval > 0) {
      pollingIntervalRef.current = window.setInterval(() => {
        // Check if we need to fetch new data (no real-time updates for a while)
        const now = new Date();
        const timeSinceLastUpdate = lastUpdatedRef.current
          ? now.getTime() - lastUpdatedRef.current.getTime()
          : Infinity;
          
        if (timeSinceLastUpdate > pollingFallbackInterval) {
          if (isOnline) {
            fetchLatest();
          } else if (enableLocalFallback) {
            // If offline, generate fallback data
            const fallbackData = generateFallbackData(deviceId);
            setTelemetry(fallbackData);
            setTelemetryHistory(prev => [fallbackData, ...prev].slice(0, historyLimit));
            lastUpdatedRef.current = now;
          }
        }
      }, pollingFallbackInterval);
    }

    // Cleanup
    return () => {
      // Remove real-time subscription
      if (channelRef.current) {
        console.log(`Removing real-time subscription for device ${deviceId}`);
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      
      // Clear polling interval
      if (pollingIntervalRef.current !== null) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [deviceId, fetchLatest, historyLimit, pollingFallbackInterval, enableLocalFallback, isOnline]);

  // Status for telemetry health
  const getStatus = useCallback(() => {
    if (loading) return 'loading';
    if (error) return 'error';
    if (!isOnline) return 'offline';
    if (!telemetry) return 'no-data';
    if (!isConnected) return 'disconnected';
    return 'connected';
  }, [loading, error, isOnline, telemetry, isConnected]);

  // Force refresh function
  const refresh = useCallback(() => {
    return fetchLatest();
  }, [fetchLatest]);

  return { 
    telemetry, 
    telemetryHistory,
    loading, 
    error, 
    isConnected,
    isOnline,
    status: getStatus(),
    refresh,
    lastUpdated: lastUpdatedRef.current
  };
};

export default useLiveTelemetry;
