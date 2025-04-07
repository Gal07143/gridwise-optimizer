
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

export function useRealtimeUpdates<T = any>(
  tableName: string,
  event: RealtimeEvent = '*',
  callback?: (item: T, eventType: RealtimeEvent) => void
) {
  const [items, setItems] = useState<T[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    
    // Set up subscription
    const channel = supabase
      .channel('realtime-updates-' + tableName)
      .on(
        'postgres_changes',
        {
          event: event as any,
          schema: 'public',
          table: tableName,
        },
        (payload) => {
          const eventType = payload.eventType as RealtimeEvent;
          const item = (payload.new || payload.old) as T;
          
          // Call the callback if provided
          if (callback && item) {
            callback(item, eventType);
          }
          
          // Update state based on event type
          if (eventType === 'INSERT') {
            setItems((prev) => [...prev, payload.new as T]);
          } else if (eventType === 'UPDATE') {
            setItems((prev) => 
              prev.map((prevItem: any) => 
                prevItem.id === (payload.new as any).id ? payload.new as T : prevItem
              )
            );
          } else if (eventType === 'DELETE') {
            setItems((prev) => 
              prev.filter((prevItem: any) => prevItem.id !== (payload.old as any).id)
            );
          }
        }
      )
      .subscribe();

    setIsLoading(false);
    
    // Cleanup
    return () => {
      supabase.removeChannel(channel);
    };
  }, [tableName, event, callback]);

  return { items, error, isLoading };
}
