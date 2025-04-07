
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

type ChannelEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*';
type ChannelCallback = (payload: any) => void;

interface ChannelSubscription {
  channel: RealtimeChannel;
  id: string;
}

// Store active channel subscriptions
const activeSubscriptions: ChannelSubscription[] = [];

/**
 * Subscribe to realtime changes on a table
 * @param tableName - The name of the table to subscribe to
 * @param event - The event to listen for (INSERT, UPDATE, DELETE, *)
 * @param callback - The callback to execute when the event occurs
 * @returns A subscription ID that can be used to unsubscribe
 */
export const subscribeToTable = (
  tableName: string,
  event: ChannelEvent = '*',
  callback: ChannelCallback
): string => {
  // Generate a unique subscription ID
  const subscriptionId = `${tableName}-${event}-${Date.now()}`;
  
  // Create and subscribe to the channel
  const channel = supabase
    .channel(`table-changes-${subscriptionId}`)
    .on(
      'postgres_changes',
      {
        event: event,
        schema: 'public',
        table: tableName,
      },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe((status) => {
      console.log(`Subscription status for ${tableName}:`, status);
    });
  
  // Store the subscription
  activeSubscriptions.push({
    channel,
    id: subscriptionId,
  });
  
  return subscriptionId;
};

/**
 * Unsubscribe from a table subscription
 * @param subscriptionId - The ID of the subscription to unsubscribe from
 */
export const unsubscribeFromTable = async (subscriptionId: string): Promise<void> => {
  const index = activeSubscriptions.findIndex((sub) => sub.id === subscriptionId);
  
  if (index !== -1) {
    const { channel } = activeSubscriptions[index];
    
    // Remove the subscription from our tracking array
    activeSubscriptions.splice(index, 1);
    
    // Unsubscribe from the channel
    await supabase.removeChannel(channel);
  }
};

/**
 * Unsubscribe from all active subscriptions
 */
export const unsubscribeFromAll = async (): Promise<void> => {
  for (const subscription of activeSubscriptions) {
    await supabase.removeChannel(subscription.channel);
  }
  
  // Clear the tracking array
  activeSubscriptions.length = 0;
};
