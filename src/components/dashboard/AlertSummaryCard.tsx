
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { subscribeToTable } from '@/services/supabaseRealtimeService';

interface Alert {
  id: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  type?: string;
  acknowledged: boolean;
  timestamp: string;
  device_id?: string;
}

const AlertSummaryCard: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      
      // Fix the Promise handling here
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      
      setAlerts(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching alerts:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch alerts'));
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  const acknowledgeAlert = async (id: string) => {
    try {
      const { error } = await supabase
        .from('alerts')
        .update({ acknowledged: true, acknowledged_at: new Date().toISOString() })
        .match({ id });
      
      if (error) throw error;
      
      setAlerts(prev => prev.map(alert => 
        alert.id === id ? { ...alert, acknowledged: true } : alert
      ));
    } catch (err) {
      console.error('Error acknowledging alert:', err);
    }
  };

  useEffect(() => {
    fetchAlerts();
    
    // Subscribe to real-time alerts using the updated subscribeToTable function
    const unsubscribe = subscribeToTable(
      'alerts',
      '*',
      (payload) => {
        console.log('Alert real-time update:', payload);
        
        if (payload.eventType === 'INSERT') {
          setAlerts(prev => [payload.new, ...prev].slice(0, 5));
        } else if (payload.eventType === 'UPDATE') {
          setAlerts(prev => prev.map(alert => 
            alert.id === payload.new.id ? payload.new : alert
          ));
        } else if (payload.eventType === 'DELETE') {
          setAlerts(prev => prev.filter(alert => alert.id !== payload.old.id));
        }
      }
    );
    
    return unsubscribe;
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-destructive';
      case 'warning': return 'text-warning';
      case 'info': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="h-4 w-4 mr-1" />;
      case 'warning': return <AlertCircle className="h-4 w-4 mr-1" />;
      case 'info': return <CheckCircle className="h-4 w-4 mr-1" />;
      default: return <AlertCircle className="h-4 w-4 mr-1" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="w-full h-8 bg-secondary animate-pulse rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-destructive">Error loading alerts: {error.message}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Recent Alerts</span>
          {alerts.length > 0 && (
            <Badge variant="outline">{alerts.length}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="text-center text-muted-foreground py-6">
            No alerts to display
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map(alert => (
              <div key={alert.id} className="flex items-center justify-between group">
                <div className="flex items-center space-x-2">
                  <span className={getSeverityColor(alert.severity)}>
                    {getSeverityIcon(alert.severity)}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                {!alert.acknowledged && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => acknowledgeAlert(alert.id)}
                  >
                    Acknowledge
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AlertSummaryCard;
