// components/ai/AnomalyAlerts.tsx
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import axios from 'axios';
import { AlertTriangle } from 'lucide-react';

interface Alert {
  id: string;
  timestamp: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

const AnomalyAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get('/api/anomaly');
        setAlerts(res.data.alerts || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching anomaly data:', err);
        setError('Failed to load anomaly alerts');
        // Use some fallback data when API fails
        setAlerts([
          {
            id: 'fallback-1',
            timestamp: new Date().toISOString(),
            message: 'Network connection issue - using cached data',
            severity: 'medium'
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlerts();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchAlerts, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
          Anomaly Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-6 bg-muted animate-pulse rounded"></div>
            <div className="h-6 bg-muted animate-pulse rounded"></div>
          </div>
        ) : error ? (
          <div className="text-center p-4 text-muted-foreground">
            <p>{error}</p>
          </div>
        ) : alerts.length === 0 ? (
          <p className="text-center text-muted-foreground">No alerts detected</p>
        ) : (
          <ul className="space-y-2">
            {alerts.map((alert) => (
              <li key={alert.id} className={`p-2 rounded text-sm border ${
                alert.severity === 'critical' ? 'border-red-200 bg-red-50 text-red-700 dark:bg-red-900/20 dark:border-red-800/30 dark:text-red-300' :
                alert.severity === 'high' ? 'border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800/30 dark:text-amber-300' :
                'border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800/30 dark:text-blue-300'
              }`}>
                <div className="flex items-start">
                  <AlertTriangle className={`h-4 w-4 mt-0.5 mr-2 ${
                    alert.severity === 'critical' ? 'text-red-500' :
                    alert.severity === 'high' ? 'text-amber-500' : 
                    'text-blue-500'
                  }`} />
                  <div>
                    <p>{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default AnomalyAlerts;
