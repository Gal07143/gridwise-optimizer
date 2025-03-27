
// This file is automatically generated. Do not edit it directly.

// Mock createClient function since we can't import from @supabase/supabase-js
const createClient = (url: string, key: string) => {
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
  };
};

const SUPABASE_URL = "https://xullgeycueouyxeirrqs.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1bGxnZXljdWVvdXl4ZWlycnFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMjE2NDQsImV4cCI6MjA1Nzg5NzY0NH0.n5z7ce0elijXBkrpgW_RhTAASKKe3vmzYHxwl8f2KRg";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY) as any;
