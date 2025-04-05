
// Enhanced Supabase client for both real and mock environments
export const supabase = {
  from: (table: string) => ({
    insert: (data: any) => ({ 
      select: () => ({
        single: () => Promise.resolve({ data: null, error: null }),
        maybeSingle: () => Promise.resolve({ data: null, error: null }),
        then: (cb: Function) => cb({ data: null, error: null }),
      }),
      then: (cb: Function) => cb({ data: null, error: null }),
    }),
    select: (columns: string = '*') => ({
      eq: (column: string, value: any) => ({
        single: () => Promise.resolve({ data: null, error: null }),
        maybeSingle: () => Promise.resolve({ data: null, error: null }),
        order: (column: string, { ascending = true } = {}) => ({
          limit: (limit: number) => Promise.resolve({ data: [], error: null }),
          range: (start: number, end: number) => Promise.resolve({ data: [], error: null }),
          then: (cb: Function) => cb({ data: [], error: null }),
        }),
        limit: (limit: number) => Promise.resolve({ data: [], error: null }),
        range: (start: number, end: number) => Promise.resolve({ data: [], error: null }),
        or: (filter: string) => ({
          order: (column: string, { ascending = true } = {}) => ({
            limit: (limit: number) => Promise.resolve({ data: [], error: null }),
            then: (cb: Function) => cb({ data: [], error: null }),
          }),
          then: (cb: Function) => cb({ data: [], error: null }),
        }),
        gte: (column: string, value: any) => ({
          then: (cb: Function) => cb({ data: [], error: null }),
        }),
        then: (cb: Function) => cb({ data: [], error: null }),
      }),
      order: (column: string, { ascending = true } = {}) => ({
        limit: (limit: number) => Promise.resolve({ data: [], error: null }),
        eq: (column: string, value: any) => ({
          then: (cb: Function) => cb({ data: [], error: null }),
        }),
        then: (cb: Function) => cb({ data: [], error: null }),
      }),
      limit: (limit: number) => ({
        eq: (column: string, value: any) => ({
          then: (cb: Function) => cb({ data: [], error: null }),
        }),
        or: (filter: string) => ({
          then: (cb: Function) => cb({ data: [], error: null }),
        }),
        range: (start: number, end: number) => Promise.resolve({ data: [], error: null }),
        gte: (column: string, value: any) => ({
          then: (cb: Function) => cb({ data: [], error: null }),
        }),
        then: (cb: Function) => cb({ data: [], error: null }),
      }),
      range: (start: number, end: number) => ({
        eq: (column: string, value: any) => Promise.resolve({ data: [], error: null }),
        then: (cb: Function) => cb({ data: [], error: null }),
      }),
      distinct: (column: string) => ({
        eq: (column: string, value: any) => Promise.resolve({ data: [], error: null }),
        then: (cb: Function) => cb({ data: [], error: null }),
      }),
      then: (cb: Function) => cb({ data: [], error: null }),
    }),
    update: (data: any) => ({ 
      eq: (column: string, value: any) => ({
        select: () => ({
          single: () => Promise.resolve({ data: null, error: null }),
          then: (cb: Function) => cb({ data: null, error: null }),
        }),
        then: (cb: Function) => cb({ data: null, error: null }),
      }),
    }),
    delete: () => ({ 
      eq: (column: string, value: any) => Promise.resolve({ data: null, error: null }),
    }),
    upsert: (data: any) => Promise.resolve({ data: null, error: null }),
    count: () => ({
      eq: (column: string, value: any) => Promise.resolve({ count: 0, error: null }),
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
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    signIn: (params: any) => Promise.resolve({ data: null, error: null }),
    signUp: (params: any) => Promise.resolve({ data: null, error: null }),
    signOut: () => Promise.resolve({ error: null }),
  },
  functions: {
    invoke: (name: string, options: any = {}) => Promise.resolve({ data: null, error: null }),
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
