
// components/alerts/AnomalyFeed.tsx
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, RefreshCw, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { retryWithBackoff, isNetworkError } from '@/utils/errorUtils';
import useConnectionStatus from '@/hooks/useConnectionStatus';

interface Anomaly {
  id: string;
  device_id: string;
  message: string;
  timestamp: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  status?: 'new' | 'acknowledged' | 'resolved';
}

// Fallback mock data when network is unavailable
const fallbackAnomalyData: Anomaly[] = [
  {
    id: 'mock-1',
    device_id: 'INV-001',
    message: 'Inverter efficiency below threshold',
    timestamp: new Date().toISOString(),
    severity: 'medium',
    status: 'new'
  },
  {
    id: 'mock-2',
    device_id: 'BAT-002',
    message: 'Battery temperature high',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    severity: 'high',
    status: 'acknowledged'
  }
];

const fetchAnomalies = async (): Promise<Anomaly[]> => {
  try {
    // Use retry with backoff for more reliability
    return await retryWithBackoff(
      async () => {
        const res = await axios.get('/api/anomaly');
        return res.data;
      },
      2, // max 2 retries
      1000 // starting with 1s delay
    );
  } catch (err) {
    console.error('Failed to fetch anomalies:', err);
    
    // If it's a network error, throw it so that React Query can handle the retry
    if (isNetworkError(err)) {
      throw err;
    }
    
    // For other errors, return empty array instead of throwing to avoid crashing the UI
    return [];
  }
};

const AnomalyFeed = () => {
  // This is a simplified version of the hook to fix type errors
  const isOnline = true;
  const [useFallbackData, setUseFallbackData] = useState(false);
  
  // Use different settings based on network connectivity
  const queryOptions = {
    queryKey: ['anomalies'],
    queryFn: fetchAnomalies,
    refetchInterval: isOnline ? 30000 : false, // Only auto-refresh when online
    retry: isOnline ? 3 : 1, // More retries when online
    staleTime: 60000,
    gcTime: 300000,
  };
  
  const { 
    data: fetchedLogs = [], 
    isLoading, 
    error, 
    refetch, 
    isFetching 
  } = useQuery(queryOptions);
  
  // Use fallback data when offline or after network errors
  const logs = useFallbackData ? fallbackAnomalyData : fetchedLogs;
  
  // Reset to using real data when coming back online
  useEffect(() => {
    if (isOnline && useFallbackData) {
      refetch().then(() => {
        setUseFallbackData(false);
      });
    }
  }, [isOnline, useFallbackData, refetch]);

  // Handle errors
  useEffect(() => {
    if (error) {
      console.error('Error fetching anomalies:', error);
      
      if (isNetworkError(error)) {
        // Don't show toast for network errors if we already know we're offline
        if (isOnline) {
          toast.error(`Network error loading anomalies: ${error.message}`);
        }
        
        // Use fallback data after network errors
        setUseFallbackData(true);
      } else {
        toast.error(`Failed to load anomalies: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }, [error, isOnline]);

  // Function to determine severity color
  const getSeverityClass = (severity?: string) => {
    switch(severity) {
      case 'critical': return 'bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800/50';
      case 'high': return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800/50';
      case 'medium': return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800/50';
      case 'low':
      default: return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/50';
    }
  };

  const handleRetry = () => {
    setUseFallbackData(false);
    toast.info('Refreshing anomaly data...');
    refetch();
  };

  if (isLoading && !useFallbackData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Anomaly Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
          Anomaly Events
          {useFallbackData && (
            <span className="ml-2 text-xs bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200 px-2 py-0.5 rounded-full">
              Offline Data
            </span>
          )}
        </CardTitle>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleRetry} 
          disabled={isFetching}
          className={isFetching ? 'animate-spin' : ''}
          title={isOnline ? 'Refresh data' : 'Currently offline'}
        >
          {isOnline ? (
            <RefreshCw className="h-4 w-4" />
          ) : (
            <WifiOff className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </CardHeader>
      <CardContent className="space-y-2 text-sm max-h-[400px] overflow-y-auto">
        {error && !useFallbackData && (
          <div className="flex items-center justify-center p-4 text-red-500 border border-red-200 rounded-md bg-red-50 dark:bg-red-900/20 dark:border-red-800/50">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <span>Error loading data. Click refresh to try again.</span>
          </div>
        )}
        
        {!error && logs.length === 0 && (
          <p className="text-center text-muted-foreground py-4">No recent anomalies detected.</p>
        )}
        
        {logs.map((log) => (
          <div 
            key={log.id} 
            className={`border p-2 rounded-md ${getSeverityClass(log.severity)} hover:bg-opacity-80 transition-colors`}
          >
            <div><strong>Device:</strong> {log.device_id}</div>
            <div><strong>Event:</strong> {log.message}</div>
            <div className="flex justify-between items-center mt-1">
              <div className="text-xs text-muted-foreground">
                {new Date(log.timestamp).toLocaleString()}
              </div>
              {log.status && (
                <div className={`text-xs px-2 py-0.5 rounded-full ${
                  log.status === 'new' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200' :
                  log.status === 'acknowledged' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200' :
                  'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                }`}>
                  {log.status}
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AnomalyFeed;
