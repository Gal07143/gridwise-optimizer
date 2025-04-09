
import { createClient } from '@supabase/supabase-js';

// Get environment variables for Supabase connection
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://xullgeycueouyxeirrqs.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1bGxnZXljdWVvdXl4ZWlycnFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMjE2NDQsImV4cCI6MjA1Nzg5NzY0NH0.n5z7ce0elijXBkrpgW_RhTAASKKe3vmzYHxwl8f2KRg";

// Validate environment variables to provide helpful error messages
if (!supabaseUrl) {
  console.error('Missing VITE_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  console.error('Missing VITE_SUPABASE_ANON_KEY environment variable');
}

// Create and export the Supabase client with proper configuration for auth persistence
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage,
    detectSessionInUrl: true,
  }
});

// Log successful initialization
console.info('Supabase client initialized');

// Add error logging wrapper
const originalRequest = supabase.auth.signInWithPassword;
supabase.auth.signInWithPassword = async (credentials) => {
  try {
    console.log("Attempting authentication with Supabase...");
    const response = await originalRequest.call(supabase.auth, credentials);
    if (response.error) {
      console.error("Supabase authentication error:", response.error);
    } else {
      console.log("Authentication successful");
    }
    return response;
  } catch (error) {
    console.error("Fatal authentication error:", error);
    throw error;
  }
};
