
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

interface SubscriptionProps {
  /** The event to subscribe to */
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  /** The database schema */
  schema?: string;
  /** The database table */
  table: string;
  /** The filter to apply */
  filter?: string;
  /** Callback when a matching event occurs */
  on: (payload: RealtimePostgresChangesPayload<any>) => void;
}

/**
 * React hook for Supabase real-time subscriptions
 */
export function useSubscription(props: SubscriptionProps) {
  const { event, schema = 'public', table, filter, on } = props;
  const channelRef = useRef<any>(null);

  useEffect(() => {
    // Build subscription params
    const subscription = {
      event,
      schema,
      table
    } as any;

    // Add filter if provided
    if (filter) {
      subscription.filter = filter;
    }

    // Create a unique channel name
    const channelId = `${table}-${event}-${Math.random().toString(36).substring(2, 7)}`;
    
    // Create and subscribe to the channel
    const channel = supabase
      .channel(channelId)
      .on('postgres_changes', subscription, on)
      .subscribe();
    
    // Store the channel reference
    channelRef.current = channel;

    // Clean up on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [event, schema, table, filter, on]);

  return channelRef.current;
}
