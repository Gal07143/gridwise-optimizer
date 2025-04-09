
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

// Subscription types
export type SubscriptionCallback<T = any> = (payload: T) => void;

export interface SubscriptionOptions {
  table: string;
  schema?: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  filter?: string;
}

let activeChannels = new Map<string, RealtimeChannel>();

export const subscribeToTable = (
  tableName: string,
  eventType: 'INSERT' | 'UPDATE' | 'DELETE' | '*' = '*',
  callback: SubscriptionCallback
): string | null => {
  try {
    const channelName = `realtime-${tableName}-${eventType}`;
    const channel = supabase.channel(channelName);
    
    channel
      .on('postgres_changes', 
        { 
          event: eventType, 
          schema: 'public', 
          table: tableName 
        } as any, 
        (payload) => {
          callback(payload);
        }
      )
      .subscribe((status) => {
        if (status !== 'SUBSCRIBED') {
          console.error(`Failed to subscribe to ${tableName}:`, status);
        }
      });
      
    // Store reference for cleanup
    activeChannels.set(channelName, channel);
    
    return channelName; // Return channel name for unsubscribing
  } catch (error) {
    console.error(`Error subscribing to ${tableName}:`, error);
    return null;
  }
};

export const subscribeToChanges = <T>(
  options: SubscriptionOptions,
  callback: SubscriptionCallback<T>
): (() => void) => {
  const { table, schema = 'public', event = '*', filter } = options;
  
  try {
    const channelName = `${schema}-${table}-${event}-${filter || 'all'}`;
    const channel = supabase.channel(channelName);
    
    // Store channel reference for later cleanup
    activeChannels.set(channelName, channel);
    
    // Configure channel
    channel
      .on('postgres_changes', 
        { 
          event: event, 
          schema: schema, 
          table: table,
          filter: filter
        } as any, 
        (payload: any) => {
          callback(payload as T);
        }
      )
      .subscribe((status) => {
        if (status !== 'SUBSCRIBED') {
          console.error('Subscription error:', status);
        }
      });
    
    return () => {
      // Unsubscribe and clean up
      if (activeChannels.has(channelName)) {
        supabase.removeChannel(channel);
        activeChannels.delete(channelName);
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
