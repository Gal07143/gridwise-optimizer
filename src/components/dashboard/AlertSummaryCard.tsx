
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, ExclamationTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { subscribeToTable } from '@/services/supabaseRealtimeService';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { Alert } from '@/types/alert';
import { Skeleton } from '@/components/ui/skeleton';

interface AlertSummaryCardProps {
  limit?: number;
  showFooter?: boolean;
  onViewAll?: () => void;
}

const AlertSummaryCard: React.FC<AlertSummaryCardProps> = ({ 
  limit = 5,
  showFooter = true,
  onViewAll
}) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAlertsCount, setNewAlertsCount] = useState(0);
  const [criticalCount, setCriticalCount] = useState(0);

  // Load initial alerts
  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true);
      try {
        // Get critical alerts count
        const { data: criticalData } = await supabase
          .from('alerts')
          .select('*')
          .eq('severity', 'critical')
          .eq('acknowledged', false);
          
        setCriticalCount(criticalData?.length || 0);
        
        // Get recent alerts
        const { data: alertsData } = await supabase
          .from('alerts')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(limit);
          
        if (alertsData) {
          setAlerts(alertsData as Alert[]);
        }
      } catch (error) {
        console.error('Error fetching alerts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [limit]);

  // Subscribe to new alerts
  useEffect(() => {
    const unsubscribe = subscribeToTable(
      'alerts',
      'INSERT',
      (payload) => {
        const newAlert = payload.new as Alert;
        setAlerts(prev => [newAlert, ...prev].slice(0, limit));
        setNewAlertsCount(prev => prev + 1);
        
        if (newAlert.severity === 'critical') {
          setCriticalCount(prev => prev + 1);
        }
      }
    );

    return () => unsubscribe();
  }, [limit]);

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-amber-100 text-amber-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Alerts
            {newAlertsCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {newAlertsCount} new
              </Badge>
            )}
          </CardTitle>
          {criticalCount > 0 && (
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              <ExclamationTriangle className="mr-1 h-3 w-3" />
              {criticalCount} critical
            </Badge>
          )}
        </div>
        <CardDescription>Recent system alerts and notifications</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              </div>
            ))}
          </div>
        ) : alerts.length > 0 ? (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 pb-3 last:pb-0">
                <div className="flex-shrink-0">
                  <Badge variant="outline" className={`${getSeverityColor(alert.severity)} h-7 w-7 rounded-full p-1`}>
                    <ExclamationTriangle className="h-5 w-5" />
                  </Badge>
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{alert.title}</p>
                  <p className="text-xs text-muted-foreground">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <p className="text-muted-foreground">No alerts found</p>
          </div>
        )}
      </CardContent>
      {showFooter && (
        <CardFooter className="border-t pt-3">
          <Button variant="ghost" className="w-full" onClick={onViewAll}>
            View all alerts
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default AlertSummaryCard;
