
// src/services/supabaseRealtimeService.ts
import { supabase } from "@/integrations/supabase/client";

// Subscribe function for real-time events
export const subscribeToTable = (
  table: string,
  callback: (payload: any) => void,
) => {
  const channel = supabase
    .channel(`${table}_channel`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table },
      (payload) => {
        callback(payload);
      },
    )
    .subscribe();

  return channel;
};

// Unsubscribe helper
export const unsubscribeFromTable = (channel: any) => {
  supabase.removeChannel(channel);
};
