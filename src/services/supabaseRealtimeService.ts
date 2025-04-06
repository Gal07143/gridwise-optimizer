
import { supabase } from '@/integrations/supabase/client';

/**
 * Subscribe to table changes in Supabase
 * 
 * @param tableName - Name of the table to subscribe to
 * @param event - Event type to subscribe to (INSERT, UPDATE, DELETE, *)
 * @param callback - Function to call when an event occurs
 * @param filter - Optional filter
 * @returns Unsubscribe function
 */
export const subscribeToTable = (
  tableName: string,
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*',
  callback: (payload: any) => void,
  filter?: string
): () => void => {
  try {
    const channelName = `${tableName}-${event}-${Math.random().toString(36).slice(2, 7)}`;
    
    // Create configuration for the channel
    const config = {
      event,
      schema: 'public',
      table: tableName
    };
    
    // Add filter if provided
    if (filter) {
      // @ts-ignore - filter is valid but not in the types
      config.filter = filter;
    }
    
    // Subscribe to the channel
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', config, callback)
      .subscribe();
    
    // Return unsubscribe function
    return () => {
      supabase.removeChannel(channel);
    };
  } catch (error) {
    console.error('Error setting up Supabase realtime subscription:', error);
    // Return no-op function as fallback
    return () => {};
  }
};

export default {
  subscribeToTable
};
