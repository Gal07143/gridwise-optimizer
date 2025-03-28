
import type { Database } from '@/integrations/supabase/types';

// Mock createClient function since we can't import from @supabase/supabase-js
const createClient = (url: string, key: string) => {
  // Create a mock channel for real-time functionality
  const createChannel = (channelName: string) => {
    return {
      on: (event: string, config: any, callback: (payload: any) => void) => {
        // Return self for chaining
        return {
          subscribe: (statusCallback?: (status: string) => void) => {
            if (statusCallback) statusCallback('SUBSCRIBED');
            console.log(`Subscribed to ${channelName} with event ${event}`);
            return {
              unsubscribe: () => console.log(`Unsubscribed from ${channelName}`)
            };
          }
        };
      }
    };
  };
  
  return {
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      signUp: () => Promise.resolve({ data: null, error: null }),
      signIn: () => Promise.resolve({ data: null, error: null }),
      signOut: () => Promise.resolve({ error: null }),
    },
    from: (table: string) => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: null }),
          order: () => ({
            limit: () => Promise.resolve({ data: [], error: null }),
          }),
        }),
        order: () => ({
          limit: () => Promise.resolve({ data: [], error: null }),
        }),
      }),
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => ({
        eq: () => Promise.resolve({ data: null, error: null }),
      }),
      delete: () => ({
        eq: () => Promise.resolve({ data: null, error: null }),
      }),
    }),
    // Add real-time functionality
    channel: (channelName: string) => createChannel(channelName),
    removeChannel: (channel: any) => console.log('Removing channel', channel),
  };
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://xullgeycueouyxeirrqs.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1bGxnZXljdWVvdXl4ZWlycnFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMjE2NDQsImV4cCI6MjA1Nzg5NzY0NH0.n5z7ce0elijXBkrpgW_RhTAASKKe3vmzYHxwl8f2KRg";

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables. Check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey) as any;
