
// src/services/supabaseRealtimeService.ts
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SubscribeOptions<T = any> {
  table: string;
  schema?: string;
  events?: Array<'INSERT' | 'UPDATE' | 'DELETE' | '*'>;
  filter?: string;
  onData: (payload: { new: T; old: T | null; eventType: string }) => void;
  onError?: (error: any) => void;
  onReconnect?: () => void;
}

/**
 * Subscribe to real-time updates for a table
 * @returns An unsubscribe function
 */
export const subscribeToTable = <T = any>(options: SubscribeOptions<T>) => {
  const { 
    table, 
    schema = 'public',
    events = ['*'], 
    filter, 
    onData, 
    onError,
    onReconnect
  } = options;
  
  // Generate a unique channel name
  const channelName = `${table}_${events.join('_')}_${Math.random().toString(36).substring(2, 9)}`;
  
  try {
    // Create subscription configs for each event
    const subscriptionConfigs = events.map(event => ({
      event: event,
      schema: schema,
      table: table,
      ...(filter && { filter: filter })
    }));
    
    // Create channel with all subscription configs
    const channel = supabase
      .channel(channelName)
      .on('presence', { event: 'sync' }, () => {
        console.log(`Synced presence state for ${channelName}`);
      })
      .on('system', { event: 'reconnect' }, () => {
        console.log(`Reconnected to ${channelName}`);
        if (onReconnect) onReconnect();
      });
    
    // Add postgres_changes listeners for each subscription config
    subscriptionConfigs.forEach(config => {
      channel.on(
        'postgres_changes',
        config,
        (payload: any) => {
          try {
            const eventType = payload.eventType;
            onData({
              new: payload.new as T,
              old: payload.old as T | null,
              eventType
            });
          } catch (err) {
            console.error(`Error processing ${table} update:`, err);
            if (onError) onError(err);
          }
        }
      );
    });
    
    // Subscribe to the channel
    const subscription = channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log(`Subscribed to ${table} updates`);
      } else if (status === 'CHANNEL_ERROR') {
        console.error(`Error subscribing to ${table} updates`);
        toast.error(`Error connecting to real-time updates for ${table}`);
        if (onError) onError(new Error(`Subscription error: ${status}`));
      }
    });
    
    // Return unsubscribe function
    return () => {
      console.log(`Unsubscribing from ${table} updates`);
      if (supabase.removeChannel) {
        supabase.removeChannel(channel);
      }
    };
  } catch (error) {
    console.error(`Error creating subscription to ${table}:`, error);
    if (onError) onError(error);
    toast.error(`Failed to subscribe to updates for ${table}`);
    // Return no-op function as fallback
    return () => {};
  }
};

/**
 * Subscribe to multiple tables at once
 * @returns An array of unsubscribe functions
 */
export const subscribeToMultipleTables = <T = any>(optionsArray: SubscribeOptions<T>[]) => {
  const unsubscribeFunctions = optionsArray.map(options => subscribeToTable<T>(options));
  
  // Return a function that unsubscribes from all channels
  return () => {
    unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
  };
};

/**
 * Track presence of users in a channel
 * @returns An object with the track and untrack functions
 */
export const usePresenceTracking = (
  roomId: string,
  userData: Record<string, any>
) => {
  const channelName = `presence_${roomId}`;
  let channel: any = null;
  
  const initialize = () => {
    channel = supabase.channel(channelName);
    
    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        console.log('Presence state synced:', state);
        return state;
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }: any) => {
        console.log('User joined:', key, newPresences);
        return { key, newPresences };
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }: any) => {
        console.log('User left:', key, leftPresences);
        return { key, leftPresences };
      })
      .subscribe();
    
    return channel;
  };
  
  const track = async () => {
    if (!channel) {
      channel = initialize();
    }
    
    try {
      const status = await channel.track(userData);
      return status;
    } catch (error) {
      console.error('Error tracking presence:', error);
      return null;
    }
  };
  
  const untrack = async () => {
    if (channel) {
      try {
        await channel.untrack();
        supabase.removeChannel(channel);
        channel = null;
      } catch (error) {
        console.error('Error untracking presence:', error);
      }
    }
  };
  
  return {
    track,
    untrack,
    getState: () => channel?.presenceState() || {},
  };
};

// Export the utils
export const realtimeService = {
  subscribeToTable,
  subscribeToMultipleTables,
  usePresenceTracking
};
