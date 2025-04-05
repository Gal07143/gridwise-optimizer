
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel, RealtimePostgresInsertPayload } from '@supabase/supabase-js';

export type RealtimeCallback<T> = (payload: RealtimePostgresInsertPayload<T>) => void;

export interface SubscribeOptions<T> {
  table: string;
  schema?: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  filter?: string;
  callback: RealtimeCallback<T>;
}

const channels: Map<string, RealtimeChannel> = new Map();

/**
 * Subscribe to realtime updates from a table
 */
export function subscribeToTable<T>({ table, schema = 'public', event = '*', filter, callback }: SubscribeOptions<T>) {
  const channelKey = `${schema}:${table}:${event}:${filter || 'all'}`;
  
  // Check if we already have this channel
  if (channels.has(channelKey)) {
    console.log(`Already subscribed to ${channelKey}`);
    return () => unsubscribeFromTable(channelKey);
  }

  try {
    console.log(`Subscribing to ${channelKey}`);
    
    let channel = supabase.channel(channelKey);
    let subscription = channel
      .on('postgres_changes', {
        event,
        schema,
        table,
        filter,
      }, (payload) => {
        callback(payload as RealtimePostgresInsertPayload<T>);
      })
      .subscribe((status) => {
        console.log(`Supabase realtime subscription status (${channelKey}):`, status);
      });

    channels.set(channelKey, subscription);
    
    // Return unsubscribe function
    return () => unsubscribeFromTable(channelKey);
    
  } catch (error) {
    console.error(`Error subscribing to ${channelKey}:`, error);
    return () => {}; // Return no-op function
  }
}

/**
 * Unsubscribe from a specific channel
 */
export function unsubscribeFromTable(channelKey: string): void {
  const channel = channels.get(channelKey);
  
  if (channel) {
    console.log(`Unsubscribing from ${channelKey}`);
    supabase.removeChannel(channel);
    channels.delete(channelKey);
  }
}

/**
 * Unsubscribe from all channels
 */
export function unsubscribeAll(): void {
  channels.forEach((channel, key) => {
    console.log(`Unsubscribing from ${key}`);
    supabase.removeChannel(channel);
  });
  
  channels.clear();
}

export default {
  subscribeToTable,
  unsubscribeFromTable,
  unsubscribeAll
};
