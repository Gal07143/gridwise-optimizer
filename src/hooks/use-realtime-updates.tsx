
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

type EventCallback = (payload: any) => void;
type SubscriptionStatus = 'SUBSCRIBED' | 'TIMED_OUT' | 'CLOSED' | 'CHANNEL_ERROR';

interface RealtimeSubscriptionOptions {
  schema?: string;
  table: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  filter?: string;
}

interface UseRealtimeOptions {
  enabled?: boolean;
}

function useSubscription(options: {
  schema?: string;
  table: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  filter?: string;
  on: EventCallback;
}) {
  const { schema = 'public', table, event = '*', filter, on } = options;
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    let subscription: RealtimeChannel;

    const setupSubscription = async () => {
      try {
        let channelName = `realtime:${schema}:${table}:${event}`;

        // Using .on('postgres_changes') since this is the correct method according to Supabase docs
        subscription = supabase.channel(channelName)
          .on('postgres_changes' as any, { // Type assertion to avoid type error
            event,
            schema,
            table,
            ...(filter && { filter })
          }, (payload) => {
            on(payload);
          })
          .subscribe((status) => setStatus(status));

        setChannel(subscription);
      } catch (err) {
        console.error('Error setting up realtime subscription:', err);
        setError(err instanceof Error ? err : new Error('Subscription error'));
      }
    };

    setupSubscription();

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, [schema, table, event, filter, on]);

  return {
    status,
    error,
    channel,
  };
}

// This hook handles subscribing to realtime updates from a Supabase table
function useRealtimeUpdates<T>(
  options: RealtimeSubscriptionOptions,
  callback: (item: T) => void,
  realtimeOptions: UseRealtimeOptions = {}
) {
  const { enabled = true } = realtimeOptions;
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const { status: subscriptionStatus, error: subscriptionError } = useSubscription({
    ...options,
    on: (payload) => {
      if (payload.new) {
        callback(payload.new as T);
      }
    }
  });

  useEffect(() => {
    if (subscriptionStatus) {
      setStatus(subscriptionStatus);
    }
    if (subscriptionError) {
      setError(subscriptionError);
    }
  }, [subscriptionStatus, subscriptionError]);

  return {
    status,
    error,
    isSubscribed: status === 'SUBSCRIBED'
  };
}

export { useRealtimeUpdates, useSubscription };
