
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE';

export const useRealtimeUpdates = <T,>(
  table: string,
  event: RealtimeEvent | RealtimeEvent[] = ['INSERT', 'UPDATE', 'DELETE'],
  callback?: (payload: { new: T; old: T }) => void
) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const events = Array.isArray(event) ? event : [event];
    
    const channels = events.map((e) => {
      const channel = supabase
        .channel(`${table}_${e}`)
        .on(
          'postgres_changes',
          { event: e, schema: 'public', table },
          (payload) => {
            setData(payload.new as unknown as T);
            if (callback) callback(payload as unknown as { new: T; old: T });
          }
        )
        .subscribe();

      return channel;
    });

    return () => {
      channels.forEach((channel) => {
        supabase.removeChannel(channel);
      });
    };
  }, [table, event, callback]);

  return { data, isLoading };
};
