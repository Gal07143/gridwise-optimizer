
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE';
type RealtimeTable = 'devices' | 'energy_readings' | 'alerts';

interface UseRealtimeUpdatesProps {
  table: RealtimeTable;
  events?: RealtimeEvent[];
  onData?: (payload: any) => void;
  enabled?: boolean;
}

export function useRealtimeUpdates({
  table,
  events = ['INSERT', 'UPDATE', 'DELETE'],
  onData,
  enabled = true
}: UseRealtimeUpdatesProps) {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    if (!enabled) return;
    
    const channel = supabase
      .channel('db-changes')
      .on(
        'postgres_changes',
        { 
          event: events,
          schema: 'public',
          table
        },
        (payload) => {
          console.log('Realtime update received:', payload);
          if (onData) {
            onData(payload);
          }
        }
      )
      .on('system', { event: '*' }, (status) => {
        if (status.extension === 'realtime') {
          if (status.status === 'SUBSCRIBED') {
            setConnected(true);
            console.log(`Connected to realtime updates for ${table}`);
          } else {
            setConnected(false);
          }
        }
      })
      .subscribe((status, err) => {
        if (status !== 'SUBSCRIBED') {
          setError(new Error(`Failed to subscribe to realtime updates: ${err?.message}`));
          console.error('Realtime subscription error:', err);
        }
      });
    
    // Clean up subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, events, onData, enabled]);
  
  return { connected, error };
}
