
// src/services/supabaseRealtimeService.ts
import { supabase } from "@/integrations/supabase/client";

interface SubscribeOptions {
  table: string;
  events: string[];
  enabled: boolean;
  onData: (payload: any) => void;
}

// Subscribe function for real-time events
export const subscribeToTable = (
  options: SubscribeOptions
) => {
  const { table, events, enabled, onData } = options;
  
  const channel = supabase
    .channel(`${table}_channel`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table },
      (payload) => {
        onData(payload);
      },
    )
    .subscribe();

  return channel;
};

// Unsubscribe helper
export const unsubscribeFromTable = (channel: any) => {
  supabase.removeChannel(channel);
};
