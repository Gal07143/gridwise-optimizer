
import React, { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert } from '@/types/energy';
import { supabase } from '@/integrations/supabase/client';
import { subscribeToTable } from '@/services/supabaseRealtimeService';
import { formatDistanceToNow } from 'date-fns';

interface CriticalAlertWidgetProps {
  onAcknowledge?: (alertId: string) => Promise<void>;
  onViewAll?: () => void;
}

const CriticalAlertWidget: React.FC<CriticalAlertWidgetProps> = ({ onAcknowledge, onViewAll }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const { data, error } = await supabase
          .from('alerts')
          .select('*')
          .eq('severity', 'critical')
          .eq('acknowledged', false)
          .order('timestamp', { ascending: false })
          .limit(3);

        if (error) throw error;
        
        setAlerts(data as Alert[] || []);
      } catch (error) {
        console.error('Error fetching critical alerts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToTable(
      'alerts', 
      'INSERT',
      (payload) => {
        const newAlert = payload.new as Alert;
        if (newAlert.severity === 'critical' && !newAlert.acknowledged) {
          setAlerts(prev => [newAlert, ...prev]);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  const handleAcknowledge = async (alertId: string) => {
    if (onAcknowledge) {
      await onAcknowledge(alertId);
    } else {
      try {
        await supabase
          .from('alerts')
          .update({ acknowledged: true })
          .eq('id', alertId);

        setAlerts(prev => prev.filter(alert => alert.id !== alertId));
      } catch (error) {
        console.error('Error acknowledging alert:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse h-full w-full border rounded-lg p-4 bg-background">
        <div className="h-5 w-1/3 bg-muted rounded mb-4"></div>
        <div className="space-y-3">
          <div className="h-16 bg-muted rounded"></div>
          <div className="h-16 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="w-full border border-red-200 bg-red-50 dark:bg-red-950/20 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-red-700 flex items-center font-semibold">
          <AlertTriangle className="mr-2 h-4 w-4" />
          Critical Alerts Requiring Attention
        </h3>
        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">
          {alerts.length} alerts
        </span>
      </div>
      <div className="divide-y divide-red-200">
        {alerts.map(alert => (
          <div key={alert.id} className="py-3 first:pt-0 last:pb-0">
            <div className="flex justify-between">
              <h4 className="text-sm font-medium text-red-700">{alert.title}</h4>
              <span className="text-xs text-red-600">
                {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
              </span>
            </div>
            <p className="text-xs mt-1 text-red-700">{alert.message}</p>
            <div className="mt-2 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                className="text-xs bg-white hover:bg-red-50 border-red-200 text-red-700 hover:text-red-800"
                onClick={() => handleAcknowledge(alert.id)}
              >
                Acknowledge
              </Button>
            </div>
          </div>
        ))}
      </div>
      {alerts.length > 1 && onViewAll && (
        <div className="mt-3 text-center border-t border-red-200 pt-3">
          <Button variant="ghost" className="text-red-700 hover:text-red-800 hover:bg-red-100 text-xs" onClick={onViewAll}>
            View all critical alerts
          </Button>
        </div>
      )}
    </div>
  );
};

export default CriticalAlertWidget;
