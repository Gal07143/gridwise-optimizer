
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Options for subscriptions
 */
export interface SubscriptionOptions {
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  schema?: string;
  filter?: string;
  context?: string;
  showToast?: boolean;
}

/**
 * Subscribe to changes in a Supabase table
 * @param tableName - Name of the table to subscribe to
 * @param callback - Function to call when an event occurs
 * @param options - Subscription options
 * @returns A subscription object with an unsubscribe method
 */
export const subscribeToTable = (
  tableName: string,
  callback: (payload: any) => void,
  options: string | SubscriptionOptions = {}
) => {
  // Convert string format to options object
  const opts = typeof options === 'string' 
    ? { context: options, showToast: true } 
    : options;
  
  const {
    event = '*',
    schema = 'public',
    filter,
    context = 'default',
    showToast = true
  } = opts;

  try {
    // Create a channel with a unique name to avoid conflicts
    const channelName = `${tableName}-${context}-${Date.now()}`;
    const channel = supabase.channel(channelName);

    // Set up the subscription
    channel
      .on(
        'postgres_changes', 
        { 
          event, 
          schema, 
          table: tableName,
          filter
        }, 
        (payload) => {
          if (showToast) {
            const action = payload.eventType === 'INSERT' ? 'added' : 
                          payload.eventType === 'UPDATE' ? 'updated' : 'removed';
            toast.info(`${tableName.replace('_', ' ')} ${action}`);
          }
          
          callback(payload);
        }
      )
      .subscribe();

    // Return an object with an unsubscribe method
    return {
      unsubscribe: () => {
        supabase.removeChannel(channel);
      }
    };
  } catch (error) {
    console.error(`Error subscribing to ${tableName}:`, error);
    return {
      unsubscribe: () => {}
    };
  }
};

/**
 * Unsubscribe from changes in a Supabase table
 * @deprecated Use the unsubscribe method from the subscription object instead
 * @param subscription - Subscription object returned from subscribeToTable
 */
export const unsubscribeFromTable = (subscription: { unsubscribe: () => void }) => {
  if (subscription && typeof subscription.unsubscribe === 'function') {
    subscription.unsubscribe();
  }
};
