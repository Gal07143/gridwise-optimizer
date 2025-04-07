import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RealtimeUpdateOptions {
  table: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  filter?: Record<string, any>;
}

export function useRealtimeUpdates<T = any>(
  options: RealtimeUpdateOptions,
  onDataReceived?: (payload: T) => void
) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { table, event = '*', filter } = options;

  useEffect(() => {
    if (!table) return;

    // Create a unique channel name based on table and event
    const channelName = `realtime-${table}-${event}-${Date.now()}`;
    
    let changesConfig = {
      event: event,
      schema: 'public',
      table: table,
    };
    
    // Add filter if provided
    if (filter) {
      changesConfig = { ...changesConfig, ...filter };
    }

    // Subscribe to the channel
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        changesConfig,
        (payload) => {
          if (onDataReceived) {
            onDataReceived(payload.new as T);
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsSubscribed(true);
        }
      });

    // Cleanup function to remove the channel when the component unmounts
    return () => {
      supabase.removeChannel(channel);
      setIsSubscribed(false);
    };
  }, [table, event, filter, onDataReceived]);

  return { isSubscribed };
}
