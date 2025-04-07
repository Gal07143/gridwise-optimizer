
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Bell, ArrowRight, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert } from '@/types/energy';
import { supabase } from '@/lib/supabase';
import { Link } from 'react-router-dom';

const AlertSummaryCard = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Get alerts that are not acknowledged
        const { data, error: alertsError } = await supabase
          .from('alerts')
          .select('*')
          .filter('acknowledged', 'eq', false)
          .order('timestamp', { ascending: false })
          .limit(5);
        
        if (alertsError) throw alertsError;
        
        setAlerts(data || []);
      } catch (err) {
        console.error('Error fetching alerts:', err);
        setError('Failed to load alerts');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAlerts();
  }, []);
  
  const getSeverityClass = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-7 w-7" />
        </CardHeader>
        <CardContent className="pb-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="mb-3">
              <Skeleton className="h-4 w-3/4 mb-1" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Skeleton className="h-9 w-full" />
        </CardFooter>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardHeader>Error Loading Alerts</CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <h3 className="text-sm font-medium">Recent Alerts</h3>
        {alerts.length > 0 ? (
          <div className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 h-7 w-7 rounded-full flex items-center justify-center">
            <AlertTriangle size={14} />
          </div>
        ) : (
          <div className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 h-7 w-7 rounded-full flex items-center justify-center">
            <Bell size={14} />
          </div>
        )}
      </CardHeader>
      <CardContent className="pb-2">
        {alerts.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No unacknowledged alerts</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert, i) => (
              <div key={alert.id} className="flex items-start gap-3">
                <div className={`flex-shrink-0 h-2 w-2 mt-2 rounded-full ${getSeverityClass(alert.severity)}`} />
                <div>
                  <p className="text-sm font-medium line-clamp-1">{alert.title || 'Untitled Alert'}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{alert.message || 'No details'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link to="/alerts">
            View All Alerts
            <ArrowRight size={14} className="ml-2" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AlertSummaryCard;
