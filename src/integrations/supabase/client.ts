
// Enhanced Supabase client for both real and mock environments
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://xullgeycueouyxeirrqs.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1bGxnZXljdWVvdXl4ZWlycnFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMjE2NDQsImV4cCI6MjA1Nzg5Nzg0NH0.n5z7ce0elijXBkrpgW_RhTAASKKe3vmzYHxwl8f2KRg";

// Create the actual Supabase client
const realSupabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  }
});

// Helper functions for mock implementations
const createMockPromise = (data: any) => {
  return Promise.resolve({ data, error: null });
};

// Create enhanced mock client
export const supabase = {
  from: (table: string) => {
    // Base query object with all required methods
    const baseQuery = {
      eq: (column: string, value: any) => ({
        single: () => createMockPromise({ id: value, [column]: value }),
        maybeSingle: () => createMockPromise({ id: value, [column]: value }),
        order: (column: string, { ascending = true } = {}) => ({
          limit: (limit: number) => createMockPromise([{ id: value, [column]: value }]),
          range: (start: number, end: number) => createMockPromise([{ id: value, [column]: value }]),
          then: (cb: Function) => Promise.resolve(cb({ data: [{ id: value, [column]: value }], error: null })),
        }),
        limit: (limit: number) => createMockPromise([{ id: value, [column]: value }]),
        range: (start: number, end: number) => createMockPromise([{ id: value, [column]: value }]),
        or: (filter: string) => ({
          order: (column: string, { ascending = true } = {}) => ({
            limit: (limit: number) => createMockPromise([{ id: value, [column]: value }]),
            then: (cb: Function) => Promise.resolve(cb({ data: [{ id: value, [column]: value }], error: null })),
          }),
          then: (cb: Function) => Promise.resolve(cb({ data: [{ id: value, [column]: value }], error: null })),
        }),
        gte: (column: string, value: any) => ({
          then: (cb: Function) => Promise.resolve(cb({ data: [{ id: value, [column]: value }], error: null })),
        }),
        then: (cb: Function) => Promise.resolve(cb({ data: [{ id: value, [column]: value }], error: null })),
      }),
      order: (column: string, { ascending = true } = {}) => ({
        limit: (limit: number) => createMockPromise([]),
        eq: (column: string, value: any) => ({
          then: (cb: Function) => Promise.resolve(cb({ data: [{ id: value, [column]: value }], error: null })),
        }),
        then: (cb: Function) => Promise.resolve(cb({ data: [], error: null })),
      }),
      limit: (limit: number) => ({
        eq: (column: string, value: any) => ({
          then: (cb: Function) => Promise.resolve(cb({ data: [{ id: value, [column]: value }], error: null })),
        }),
        or: (filter: string) => ({
          then: (cb: Function) => Promise.resolve(cb({ data: [], error: null })),
        }),
        range: (start: number, end: number) => createMockPromise([]),
        gte: (column: string, value: any) => ({
          then: (cb: Function) => Promise.resolve(cb({ data: [], error: null })),
        }),
        then: (cb: Function) => Promise.resolve(cb({ data: [], error: null })),
      }),
      range: (start: number, end: number) => ({
        eq: (column: string, value: any) => createMockPromise([{ id: value, [column]: value }]),
        then: (cb: Function) => Promise.resolve(cb({ data: [], error: null })),
      }),
      distinct: (column: string) => ({
        eq: (column: string, value: any) => createMockPromise([{ id: value, [column]: value }]),
        then: (cb: Function) => Promise.resolve(cb({ data: [], error: null })),
      }),
      then: (cb: Function) => Promise.resolve(cb({ data: [], error: null })),
    };

    return {
      select: (columns: string = '*') => baseQuery,
      insert: (data: any) => ({ 
        select: () => ({
          single: () => createMockPromise({ ...data, id: `mock-${Date.now()}` }),
          maybeSingle: () => createMockPromise({ ...data, id: `mock-${Date.now()}` }),
          then: (cb: Function) => Promise.resolve(cb({ data: { ...data, id: `mock-${Date.now()}` }, error: null })),
        }),
        then: (cb: Function) => Promise.resolve(cb({ data: { ...data, id: `mock-${Date.now()}` }, error: null })),
      }),
      update: (data: any) => ({ 
        eq: (column: string, value: any) => ({
          select: () => ({
            single: () => createMockPromise({ id: value, ...data }),
            then: (cb: Function) => Promise.resolve(cb({ data: { id: value, ...data }, error: null })),
          }),
          then: (cb: Function) => Promise.resolve(cb({ data: { id: value, ...data }, error: null })),
        }),
      }),
      delete: () => ({ 
        eq: (column: string, value: any) => createMockPromise({ id: value }),
      }),
      upsert: (data: any) => createMockPromise({ ...data, id: data.id || `mock-${Date.now()}` }),
      count: () => ({
        eq: (column: string, value: any) => createMockPromise({ count: 1 }),
        then: (cb: Function) => Promise.resolve(cb({ count: 0, error: null })),
      }),
    };
  },
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
    getUser: () => {
      const mockUser = {
        id: "mock-user-id",
        email: "user@example.com",
        app_metadata: {},
        user_metadata: { name: "Test User" }
      };
      return createMockPromise({ user: mockUser });
    },
    getSession: () => {
      return createMockPromise({
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
    signInWithPassword: ({ email, password }: { email: string, password: string }) => {
      return createMockPromise({
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
    signUp: ({ email, password, options }: { email: string, password: string, options?: any }) => {
      return createMockPromise({
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
    signOut: () => createMockPromise(null),
    updateUser: (updates: any) => createMockPromise({ user: { ...updates } }),
  },
  functions: {
    invoke: (name: string, options: any = {}) => createMockPromise(null),
  },
};

// Create a helper to handle async supabase calls
export const asyncSupabase = {
  from: (table: string) => ({
    select: async (columns: string = '*') => {
      return Promise.resolve(supabase.from(table).select(columns));
    },
    insert: async (data: any) => {
      return Promise.resolve(supabase.from(table).insert(data));
    },
    update: async (data: any) => {
      return {
        eq: async (column: string, value: any) => {
          return Promise.resolve(supabase.from(table).update(data).eq(column, value));
        }
      };
    },
    delete: async () => {
      return {
        eq: async (column: string, value: any) => {
          return Promise.resolve(supabase.from(table).delete().eq(column, value));
        }
      };
    }
  })
};

export default supabase;
