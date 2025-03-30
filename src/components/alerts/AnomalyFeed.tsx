
// components/alerts/AnomalyFeed.tsx
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { ExclamationTriangleIcon } from 'lucide-react';

interface Anomaly {
  id: string;
  device_id: string;
  message: string;
  timestamp: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  status?: 'new' | 'acknowledged' | 'resolved';
}

const fetchAnomalies = async (): Promise<Anomaly[]> => {
  try {
    const res = await axios.get('/api/anomaly');
    return res.data;
  } catch (err) {
    console.error('Failed to fetch anomalies:', err);
    // Return empty array instead of throwing to avoid crashing the UI
    return [];
  }
};

const AnomalyFeed = () => {
  const { data: logs = [], isLoading, error } = useQuery({
    queryKey: ['anomalies'],
    queryFn: fetchAnomalies,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Function to determine severity color
  const getSeverityClass = (severity?: string) => {
    switch(severity) {
      case 'critical': return 'bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800/50';
      case 'high': return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800/50';
      case 'medium': return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800/50';
      case 'low':
      default: return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50';
    }
  };

  if (isLoading) {
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

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Anomaly Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-4 text-red-500">
            <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
            <span>Failed to load anomalies</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ExclamationTriangleIcon className="h-5 w-5 mr-2 text-red-500" />
          Anomaly Events
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm max-h-[400px] overflow-y-auto">
        {logs.length === 0 && (
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
