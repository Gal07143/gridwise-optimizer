
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Subscription types
export type SubscriptionCallback<T = any> = (payload: T) => void;

export interface SubscriptionOptions {
  table: string;
  schema?: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  filter?: string;
}

let activeChannels = new Map();

export const subscribeToChanges = <T>(
  options: SubscriptionOptions,
  callback: SubscriptionCallback<T>
) => {
  const { table, schema = 'public', event = '*', filter } = options;
  
  try {
    const channel = supabase.channel('realtime-changes');
    
    // Store channel reference for later cleanup
    const channelKey = `${schema}-${table}-${event}-${filter || 'all'}`;
    activeChannels.set(channelKey, channel);
    
    // Configure channel
    channel
      .on('presence', { event: 'sync' }, () => {
        console.log('Presence synced');
      })
      .on('broadcast', { event: 'cursor-pos' }, (payload) => {
        console.log('Broadcast received:', payload);
      })
      .subscribe((status) => {
        if (status !== 'SUBSCRIBED') {
          console.error('Subscription error:', status);
        }
      });
    
    return () => {
      // Unsubscribe and clean up
      if (activeChannels.has(channelKey)) {
        supabase.removeChannel(channel);
        activeChannels.delete(channelKey);
      }
    };
  } catch (error) {
    console.error('Error setting up realtime subscription:', error);
    toast.error('Failed to subscribe to real-time updates');
    return () => {};
  }
};

export const unsubscribeAll = () => {
  activeChannels.forEach((channel) => {
    supabase.removeChannel(channel);
  });
  activeChannels.clear();
};
