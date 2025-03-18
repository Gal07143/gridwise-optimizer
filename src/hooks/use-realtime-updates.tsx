
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

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
    
    // Create a channel for db changes
    const channel = supabase.channel('db-changes');
    
    // Track subscription status
    let isSubscribed = false;
    
    // Configure presence events
    channel
      .on('presence', { event: 'sync' }, () => {
        setConnected(true);
        console.log(`Connected to realtime updates for ${table}`);
      })
      .on('presence', { event: 'join' }, () => {
        console.log(`Joined realtime channel for ${table}`);
      })
      .on('presence', { event: 'leave' }, () => {
        setConnected(false);
        console.log(`Left realtime channel for ${table}`);
      });
    
    // Configure PostgreSQL change listeners for each event type
    events.forEach(event => {
      channel.on(
        'postgres_changes', 
        { 
          event: event, 
          schema: 'public', 
          table: table 
        } as any,
        (payload: RealtimePostgresChangesPayload<any>) => {
          console.log(`Realtime ${event} received:`, payload);
          if (onData) {
            onData(payload);
          }
        }
      );
    });
    
    // Subscribe to the channel
    channel.subscribe((status, err) => {
      if (status === 'SUBSCRIBED') {
        isSubscribed = true;
        console.log(`Successfully subscribed to ${table} changes`);
      } else if (err) {
        setError(new Error(`Failed to subscribe to realtime updates: ${err.message}`));
        console.error('Realtime subscription error:', err);
      }
    });
    
    // Clean up subscription on unmount
    return () => {
      if (isSubscribed) {
        console.log(`Removing channel for ${table}`);
        supabase.removeChannel(channel);
      }
    };
  }, [table, events, onData, enabled]);
  
  return { connected, error };
}
