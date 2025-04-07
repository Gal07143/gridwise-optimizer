
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface RealtimeOptions {
  table: string;
  schema?: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  filter?: string;
  showToasts?: boolean;
}

interface RealtimeResult<T> {
  data: T[];
  loading: boolean;
  error: Error | null;
}

/**
 * Hook for subscribing to real-time updates from Supabase
 */
export function useRealtimeUpdates<T = any>({
  table,
  schema = 'public',
  event = '*',
  filter,
  showToasts = false,
}: RealtimeOptions): RealtimeResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Fetch initial data
    const fetchInitialData = async () => {
      try {
        let query = supabase.from(table).select('*');

        if (filter) {
          // Example filter: 'status=eq.active'
          const [column, operation] = filter.split('=');
          const [op, value] = operation.split('.');
          
          if (op === 'eq') {
            query = query.eq(column, value);
          } else if (op === 'gt') {
            query = query.gt(column, value);
          } else if (op === 'lt') {
            query = query.lt(column, value);
          }
        }

        const { data: initialData, error: initialError } = await query;

        if (initialError) {
          throw initialError;
        }

        setData(initialData as T[]);
        setError(null);
      } catch (err) {
        console.error(`Error fetching ${table} data:`, err);
        setError(err instanceof Error ? err : new Error(`Failed to fetch ${table} data`));
        if (showToasts) {
          toast.error(`Failed to fetch data from ${table}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();

    // Subscribe to real-time updates
    const channel = supabase
      .channel(`${table}-changes`)
      .on(
        'postgres_changes',
        {
          event,
          schema,
          table,
          filter: filter ? `${filter}` : undefined,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setData((prevData) => [...prevData, payload.new as T]);
            if (showToasts) {
              toast.success(`New record added to ${table}`);
            }
          } else if (payload.eventType === 'UPDATE') {
            setData((prevData) =>
              prevData.map((item: any) =>
                item.id === (payload.new as any).id ? payload.new as T : item
              )
            );
            if (showToasts) {
              toast.info(`Record updated in ${table}`);
            }
          } else if (payload.eventType === 'DELETE') {
            setData((prevData) =>
              prevData.filter((item: any) => item.id !== (payload.old as any).id)
            );
            if (showToasts) {
              toast.info(`Record deleted from ${table}`);
            }
          }
        }
      )
      .subscribe();

    // Cleanup on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, schema, event, filter, showToasts]);

  return { data, loading, error };
}
