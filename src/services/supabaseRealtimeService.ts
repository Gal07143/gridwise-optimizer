
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

  // Create the postgres_changes config object
  const pgConfig: any = {
    event: eventType,
    schema: 'public',
    table: table
  };
  
  // Add filter if provided
  if (filter) {
    pgConfig.filter = filter;
  }

  // Subscribe to the channel with the proper config
  const channel = supabase
    .channel(channelName)
    .on('postgres_changes', pgConfig, callback)
    .subscribe();

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
