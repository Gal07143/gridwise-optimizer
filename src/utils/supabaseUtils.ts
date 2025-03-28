
import { supabase } from '@/integrations/supabase/client';

/**
 * Creates a real-time subscription to a Supabase table
 * 
 * @param tableName - The name of the table to subscribe to
 * @param event - The event type ('INSERT', 'UPDATE', 'DELETE', or '*' for all)
 * @param callback - Function to call when an event occurs
 * @param filter - Optional filter condition for the subscription
 * @returns A function to unsubscribe from the real-time updates
 */
export const subscribeToTableChanges = (
  tableName: string, 
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*',
  callback: (payload: any) => void,
  filter?: string
) => {
  try {
    const channelName = `${tableName}-${event}-${Math.random().toString(36).slice(2, 9)}`;
    
    let config: any = {
      event: event,
      schema: 'public',
      table: tableName
    };
    
    // Add filter if provided
    if (filter) {
      config.filter = filter;
    }
    
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', config, callback)
      .subscribe();
    
    // Return unsubscribe function
    return () => {
      if (supabase.removeChannel) {
        supabase.removeChannel(channel);
      }
    };
  } catch (error) {
    console.error('Error creating Supabase real-time subscription:', error);
    // Return no-op function as fallback
    return () => {};
  }
};

// Export the utils
export const supabaseUtils = {
  subscribeToTableChanges
};
