
import { supabase } from '@/integrations/supabase/client';
import { RealtimePostgresInsertPayload, RealtimePostgresUpdatePayload, RealtimePostgresDeletePayload } from '@supabase/supabase-js';

type ChangeEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*';
type PayloadHandler = (payload: RealtimePostgresInsertPayload<any> | RealtimePostgresUpdatePayload<any> | RealtimePostgresDeletePayload<any>) => void;

/**
 * Subscribe to real-time changes for a specific table
 * @param table The table to subscribe to
 * @param event The event to subscribe to (INSERT, UPDATE, DELETE, or * for all)
 * @param callback The callback function to execute when an event occurs
 * @returns A function to unsubscribe from the channel
 */
export const subscribeToTable = (
  table: string,
  event: ChangeEvent = '*',
  callback?: PayloadHandler
): (() => void) | string => {
  if (typeof table === 'string' && table.startsWith('SUPABASE_SUB_')) {
    // This is an unsubscribe call with a subscription ID
    const channels = supabase.getChannels();
    const channel = channels.find(ch => ch.id === table);
    if (channel) {
      supabase.removeChannel(channel);
    }
    return () => {};
  }

  const channel = supabase
    .channel(`table-changes-${table}-${event}`)
    .on(
      'postgres_changes',
      {
        event: event,
        schema: 'public',
        table: table
      },
      (payload) => {
        if (callback) {
          callback(payload);
        }
      }
    )
    .subscribe();

  // Return a function to unsubscribe
  return () => {
    supabase.removeChannel(channel);
  };
};

/**
 * Unsubscribe from a real-time subscription
 * @param subscriptionId The subscription ID to unsubscribe from
 */
export const unsubscribeFromTable = (
  subscriptionId: string
): void => {
  if (subscriptionId.startsWith('SUPABASE_SUB_')) {
    const channels = supabase.getChannels();
    const channel = channels.find(ch => ch.id === subscriptionId);
    if (channel) {
      supabase.removeChannel(channel);
    }
  }
};
