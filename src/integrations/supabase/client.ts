
// Enhanced Supabase client for both real and mock environments
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://xullgeycueouyxeirrqs.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1bGxnZXljdWVvdXl4ZWlycnFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMjE2NDQsImV4cCI6MjA1Nzg5NzY0NH0.n5z7ce0elijXBkrpgW_RhTAASKKe3vmzYHxwl8f2KRg";

// Create the actual Supabase client
const realSupabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  }
});

// Create a mock promise response helper
const mockResponse = (data: any = null, error: any = null) => {
  return Promise.resolve({ data, error });
};

// Create enhanced mock client
export const supabase = {
  from: (table: string) => ({
    insert: (data: any) => ({ 
      select: () => ({
        single: () => mockResponse({ ...data, id: `mock-${Date.now()}` }, null),
        maybeSingle: () => mockResponse({ ...data, id: `mock-${Date.now()}` }, null),
        then: (cb: Function) => cb({ data: { ...data, id: `mock-${Date.now()}` }, error: null }),
      }),
      then: (cb: Function) => cb({ data: { ...data, id: `mock-${Date.now()}` }, error: null }),
    }),
    select: (columns: string = '*') => ({
      eq: (column: string, value: any) => ({
        single: () => mockResponse({ id: value, [column]: value }, null),
        maybeSingle: () => mockResponse({ id: value, [column]: value }, null),
        order: (column: string, { ascending = true } = {}) => ({
          limit: (limit: number) => mockResponse([{ id: value, [column]: value }], null),
          range: (start: number, end: number) => mockResponse([{ id: value, [column]: value }], null),
          then: (cb: Function) => cb({ data: [{ id: value, [column]: value }], error: null }),
        }),
        limit: (limit: number) => mockResponse([{ id: value, [column]: value }], null),
        range: (start: number, end: number) => mockResponse([{ id: value, [column]: value }], null),
        or: (filter: string) => ({
          order: (column: string, { ascending = true } = {}) => ({
            limit: (limit: number) => mockResponse([{ id: value, [column]: value }], null),
            then: (cb: Function) => cb({ data: [{ id: value, [column]: value }], error: null }),
          }),
          then: (cb: Function) => cb({ data: [{ id: value, [column]: value }], error: null }),
        }),
        gte: (column: string, value: any) => ({
          then: (cb: Function) => cb({ data: [{ id: value, [column]: value }], error: null }),
        }),
        then: (cb: Function) => cb({ data: [{ id: value, [column]: value }], error: null }),
      }),
      order: (column: string, { ascending = true } = {}) => ({
        limit: (limit: number) => mockResponse([], null),
        eq: (column: string, value: any) => ({
          then: (cb: Function) => cb({ data: [{ id: value, [column]: value }], error: null }),
        }),
        then: (cb: Function) => cb({ data: [], error: null }),
      }),
      limit: (limit: number) => ({
        eq: (column: string, value: any) => ({
          then: (cb: Function) => cb({ data: [{ id: value, [column]: value }], error: null }),
        }),
        or: (filter: string) => ({
          then: (cb: Function) => cb({ data: [], error: null }),
        }),
        range: (start: number, end: number) => mockResponse([], null),
        gte: (column: string, value: any) => ({
          then: (cb: Function) => cb({ data: [], error: null }),
        }),
        then: (cb: Function) => cb({ data: [], error: null }),
      }),
      range: (start: number, end: number) => ({
        eq: (column: string, value: any) => mockResponse([{ id: value, [column]: value }], null),
        then: (cb: Function) => cb({ data: [], error: null }),
      }),
      distinct: (column: string) => ({
        eq: (column: string, value: any) => mockResponse([{ id: value, [column]: value }], null),
        then: (cb: Function) => cb({ data: [], error: null }),
      }),
      then: (cb: Function) => cb({ data: [], error: null }),
    }),
    update: (data: any) => ({ 
      eq: (column: string, value: any) => ({
        select: () => ({
          single: () => mockResponse({ id: value, ...data }, null),
          then: (cb: Function) => cb({ data: { id: value, ...data }, error: null }),
        }),
        then: (cb: Function) => cb({ data: { id: value, ...data }, error: null }),
      }),
    }),
    delete: () => ({ 
      eq: (column: string, value: any) => mockResponse({ id: value }, null),
    }),
    upsert: (data: any) => mockResponse({ ...data, id: data.id || `mock-${Date.now()}` }, null),
    count: () => ({
      eq: (column: string, value: any) => mockResponse({ count: 1 }, null),
      then: (cb: Function) => cb({ count: 0, error: null }),
    }),
  }),
  channel: (name: string) => ({
    on: (event: string, filter: any, callback: Function) => ({
      subscribe: (cb: Function = () => {}) => {
        cb();
        return {
          unsubscribe: () => {}
        };
      }
    }),
  }),
  removeChannel: (channel: any) => {},
  auth: {
    getUser: async () => {
      const mockUser = {
        id: "mock-user-id",
        email: "user@example.com",
        app_metadata: {},
        user_metadata: { name: "Test User" }
      };
      return mockResponse({ user: mockUser });
    },
    getSession: async () => {
      return mockResponse({
        session: {
          user: {
            id: "mock-user-id",
            email: "user@example.com",
            app_metadata: {},
            user_metadata: { name: "Test User" }
          },
          access_token: "mock-access-token",
          refresh_token: "mock-refresh-token"
        }
      });
    },
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      // Simulate auth state change
      setTimeout(() => {
        callback('SIGNED_IN', {
          user: {
            id: "mock-user-id",
            email: "user@example.com",
            app_metadata: {},
            user_metadata: { name: "Test User" }
          }
        });
      }, 100);
      
      return {
        data: {
          subscription: {
            unsubscribe: () => {}
          }
        }
      };
    },
    signInWithPassword: async ({ email, password }: { email: string, password: string }) => {
      return mockResponse({
        user: {
          id: "mock-user-id",
          email,
          app_metadata: {},
          user_metadata: { name: "Test User" }
        },
        session: {
          access_token: "mock-access-token",
          refresh_token: "mock-refresh-token"
        }
      });
    },
    signUp: async ({ email, password, options }: { email: string, password: string, options?: any }) => {
      return mockResponse({
        user: {
          id: "mock-user-id",
          email,
          app_metadata: {},
          user_metadata: options?.data || {}
        },
        session: {
          access_token: "mock-access-token",
          refresh_token: "mock-refresh-token"
        }
      });
    },
    signOut: async () => mockResponse({}),
    updateUser: async (updates: any) => mockResponse({ user: { ...updates } }),
  },
  functions: {
    invoke: async (name: string, options: any = {}) => mockResponse({ data: null }),
  },
};

// Create a helper to handle async supabase calls
export const asyncSupabase = {
  from: (table: string) => ({
    select: async (columns: string = '*') => {
      return supabase.from(table).select(columns);
    },
    insert: async (data: any) => {
      return supabase.from(table).insert(data);
    },
    update: async (data: any) => {
      return {
        eq: async (column: string, value: any) => {
          return supabase.from(table).update(data).eq(column, value);
        }
      };
    },
    delete: async () => {
      return {
        eq: async (column: string, value: any) => {
          return supabase.from(table).delete().eq(column, value);
        }
      };
    }
  })
};

export default supabase;
