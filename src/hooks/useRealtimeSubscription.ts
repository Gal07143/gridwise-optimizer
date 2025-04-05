
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SubscriptionOptions {
  table: string;
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  filter?: string;
  schema?: string;
  onError?: (error: any) => void;
  showToasts?: boolean;
}

/**
 * Hook for subscribing to Supabase realtime events
 */
export function useRealtimeSubscription<T = any>(
  options: SubscriptionOptions,
  callback: (payload: any) => void
) {
  const { 
    table, 
    event, 
    filter, 
    schema = 'public', 
    onError,
    showToasts = false
  } = options;
  
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const subscribe = useCallback(() => {
    try {
      // Build configuration
      const config = {
        event: event,
        schema: schema,
        table: table,
        filter: filter
      };
      
      // Create a unique channel name
      const channelName = `${table}-${event}-${Math.random().toString(36).substring(2, 9)}`;
      
      // Subscribe to changes
      const channel = supabase
        .channel(channelName)
        .on('postgres_changes', config, callback)
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            setIsSubscribed(true);
            if (showToasts) {
              toast.success(`Connected to ${table} realtime updates`);
            }
          } else {
            setIsSubscribed(false);
            setError(new Error(`Failed to subscribe: ${status}`));
            if (showToasts) {
              toast.error(`Connection issue with ${table} updates`);
            }
          }
        });
        
      // Return unsubscribe function
      return () => {
        if (channel) {
          supabase.removeChannel(channel);
          setIsSubscribed(false);
        }
      };
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown subscription error'));
      if (onError) {
        onError(err);
      }
      return () => {}; // Return no-op cleanup function
    }
  }, [table, event, filter, schema, callback, showToasts, onError]);
  
  useEffect(() => {
    const unsubscribe = subscribe();
    return unsubscribe;
  }, [subscribe]);
  
  return { isSubscribed, error };
}

export default useRealtimeSubscription;
