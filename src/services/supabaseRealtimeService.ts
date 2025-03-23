// src/services/supabaseRealtimeService.ts
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL!;
const SUPABASE_API_KEY = process.env.REACT_APP_SUPABASE_API_KEY!;

export const supabaseRealtimeClient: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_API_KEY);

// Subscribe function for real-time events
export const subscribeToTable = (
  table: string,
  callback: (payload: any) => void,
) => {
  const channel = supabaseRealtimeClient
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
  supabaseRealtimeClient.removeChannel(channel);
};
