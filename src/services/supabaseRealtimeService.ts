
import { supabase } from '@/integrations/supabase/client';

/**
 * Subscribe to real-time changes on a Supabase table
 */
export function subscribeToTable(
  table: string,
  eventType: 'INSERT' | 'UPDATE' | 'DELETE' | '*',
  callback: (payload: any) => void,
  filter?: string
): () => void {
  // Create a unique channel name
  const channelName = `${table}-${eventType}-${Math.random().toString(36).slice(2, 9)}`;

  // Create the channel
  const channel = supabase
    .channel(channelName);
  
  // Configure the subscription
  const subscription = channel.on('postgres_changes', {
    event: eventType,
    schema: 'public',
    table: table,
    filter: filter
  }, callback);
  
  // Subscribe to the channel
  subscription.subscribe();

  // Return an unsubscribe function
  return () => {
    if (channel) {
      supabase.removeChannel(channel);
    }
  };
}

export function unsubscribeFromTable(unsubscribeFn: () => void): void {
  if (typeof unsubscribeFn === 'function') {
    unsubscribeFn();
  }
}
