import { supabaseClient } from '@/integrations/supabase/client';
import { RealtimeChannel, REALTIME_LISTEN_TYPES, REALTIME_PRESENCE_LISTEN_EVENTS } from '@supabase/supabase-js';

interface SubscribeOptions<T> {
  table: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  callback: (payload: any) => void;
  filter?: string;
}

/**
 * Subscribe to changes in a Supabase table
 */
export function subscribeToTable<T>({
  table,
  event = '*',
  callback,
  filter
}: SubscribeOptions<T>): () => void {
  // Convert event string to REALTIME_LISTEN_TYPES
  const eventType = event === '*' 
    ? undefined 
    : event === 'INSERT' 
      ? REALTIME_LISTEN_TYPES.INSERT
      : event === 'UPDATE'
        ? REALTIME_LISTEN_TYPES.UPDATE
        : REALTIME_LISTEN_TYPES.DELETE;

  // Create channel
  let channel = supabaseClient
    .channel(`table-changes:${table}`)
    .on(
      'postgres_changes',
      {
        event: eventType,
        schema: 'public',
        table: table,
        filter: filter
      },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();

  // Return unsubscribe function
  return () => {
    if (channel) {
      supabaseClient.removeChannel(channel);
      channel = null as unknown as RealtimeChannel;
    }
  };
}

/**
 * Subscribe to presence changes in a Supabase channel
 */
export function subscribeToPresence(
  channelName: string,
  onJoin?: (payload: any) => void,
  onLeave?: (payload: any) => void
): () => void {
  let channel = supabaseClient.channel(channelName);

  if (onJoin) {
    channel = channel.on(
      REALTIME_PRESENCE_LISTEN_EVENTS.SYNC,
      () => {
        const state = channel.presenceState();
        if (onJoin) onJoin(state);
      }
    );

    channel = channel.on(
      REALTIME_PRESENCE_LISTEN_EVENTS.JOIN,
      ({ newPresences }) => {
        if (onJoin) onJoin(newPresences);
      }
    );
  }

  if (onLeave) {
    channel = channel.on(
      REALTIME_PRESENCE_LISTEN_EVENTS.LEAVE,
      ({ leftPresences }) => {
        if (onLeave) onLeave(leftPresences);
      }
    );
  }

  channel.subscribe();

  return () => {
    if (channel) {
      supabaseClient.removeChannel(channel);
    }
  };
}

export function unsubscribeFromTable(unsubscribeFunction: () => void) {
  if (unsubscribeFunction) {
    unsubscribeFunction();
  }
}

export default {
  subscribeToTable,
  unsubscribeFromTable,
  subscribeToPresence
};
