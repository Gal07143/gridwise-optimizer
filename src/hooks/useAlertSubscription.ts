import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AlertItem } from '@/components/microgrid/types';

type AlertCallback = (alert: AlertItem) => void;

export const useAlertSubscription = (onNewAlert: AlertCallback) => {
  useEffect(() => {
    const channel = supabase
      .channel('realtime:alerts')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'alerts' },
        (payload) => {
          const newAlert = payload.new as AlertItem;
          onNewAlert(newAlert);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onNewAlert]);
};
