
import { supabase } from '@/integrations/supabase/client';

/**
 * Type definition for subscription options
 */
export interface SubscriptionOptions {
  table: string;
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  callback: (payload: any) => void;
  filter?: { column: string; value: string | number };
}

/**
 * Subscribe to a Supabase table for real-time updates
 * 
 * @param table - The table to subscribe to
 * @param event - The event to subscribe to ('INSERT', 'UPDATE', 'DELETE', '*')
 * @param callback - The callback to execute when an event occurs
 * @returns - A function to unsubscribe from the channel
 */
export const subscribeToTable = (
  tableOrOptions: string | SubscriptionOptions,
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*',
  callback?: (payload: any) => void
) => {
  let table: string;
  let eventType: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  let callbackFn: (payload: any) => void;
  let filter: { column: string; value: string | number } | undefined;
  
  // Handle different parameter options
  if (typeof tableOrOptions === 'object') {
    // Object-based call
    table = tableOrOptions.table;
    eventType = tableOrOptions.event;
    callbackFn = tableOrOptions.callback;
    filter = tableOrOptions.filter;
  } else {
    // Parameter-based call
    table = tableOrOptions;
    eventType = event || '*';
    callbackFn = callback || (() => {});
  }

  let channelName = `${table}_${eventType}_${Date.now()}`;
  if (filter) {
    channelName += `_${filter.column}_${filter.value}`;
  }
  
  let config: any = {
    event: eventType,
    schema: 'public',
    table
  };
  
  if (filter) {
    config.filter = `${filter.column}=eq.${filter.value}`;
  }
  
  const channel = supabase
    .channel(channelName)
    .on('postgres_changes', config, callbackFn)
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

export default {
  subscribeToTable
};
