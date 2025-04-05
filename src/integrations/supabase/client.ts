// Placeholder for actual Supabase client configuration
export const supabase = {
  from: (table: string) => ({
    insert: (data: any) => ({ error: null }),
    select: (columns: string) => ({
      eq: (column: string, value: any) => ({
        then: (cb: Function) => cb({ data: [], error: null }),
      }),
    }),
  }),
  channel: (name: string) => ({
    on: (event: string, table: string, callback: Function) => ({
      subscribe: (cb: Function) => {
        cb();
        return () => {};
      },
    }),
  }),
  removeChannel: (channel: any) => {},
  auth: {
    getUser: () => Promise.resolve({ data: { user: null } }),
  },
  functions: {
    invoke: (name: string, options: any) => Promise.resolve({ data: null, error: null }),
  },
};

export default supabase;
