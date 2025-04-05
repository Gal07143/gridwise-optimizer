
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useAlertSubscription() {
  const [hasNewAlerts, setHasNewAlerts] = useState(false);
  const [criticalCount, setCriticalCount] = useState(0);

  useEffect(() => {
    // Set up subscription for alerts
    const channel = supabase
      .channel('alerts-subscription')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'alerts',
        },
        (payload) => {
          setHasNewAlerts(true);
          if (payload.new.severity === 'critical') {
            setCriticalCount(prev => prev + 1);
          }
        }
      )
      .subscribe();

    // Cleanup
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const clearNotifications = () => {
    setHasNewAlerts(false);
    setCriticalCount(0);
  };

  return { hasNewAlerts, criticalCount, clearNotifications };
}
