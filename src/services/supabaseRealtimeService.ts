
import { supabase } from '@/integrations/supabase/client';

/**
 * Subscribe to a Supabase table for real-time updates
 * 
 * @param table - The table to subscribe to
 * @param event - The event to subscribe to ('INSERT', 'UPDATE', 'DELETE', '*')
 * @param callback - The callback to execute when an event occurs
 * @returns - A function to unsubscribe from the channel
 */
export const subscribeToTable = (
  table: string,
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*',
  callback: (payload: any) => void
) => {
  const channel = supabase
    .channel(`${table}_${event}_${Date.now()}`)
    .on('postgres_changes', 
      { 
        event, 
        schema: 'public', 
        table
      }, 
      payload => callback(payload)
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

/**
 * Subscribe to a Supabase table for real-time updates with a filter
 * 
 * @param table - The table to subscribe to
 * @param event - The event to subscribe to ('INSERT', 'UPDATE', 'DELETE', '*')
 * @param filter - Filter for the subscription (e.g. { column: 'id', value: '123' })
 * @param callback - The callback to execute when an event occurs
 * @returns - A function to unsubscribe from the channel
 */
export const subscribeToTableWithFilter = (
  table: string,
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*',
  filter: { column: string; value: string | number },
  callback: (payload: any) => void
) => {
  const channel = supabase
    .channel(`${table}_${event}_${filter.column}_${filter.value}_${Date.now()}`)
    .on('postgres_changes',
      {
        event,
        schema: 'public',
        table,
        filter: `${filter.column}=eq.${filter.value}`
      },
      payload => callback(payload)
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

export default {
  subscribeToTable,
  subscribeToTableWithFilter
};
