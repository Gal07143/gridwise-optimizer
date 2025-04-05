
import { supabase } from '@/integrations/supabase/client';

// Define the REALTIME_LISTEN_TYPES object to match Supabase's constants
const REALTIME_LISTEN_TYPES = {
  INSERT: 'INSERT',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  ALL: '*',
};

interface SubscribeToTableOptions {
  table: string;
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  callback: (payload: any) => void;
  filter?: string;
}

/**
 * Subscribe to real-time changes on a Supabase table
 */
export function subscribeToTable({
  table,
  event,
  callback,
  filter,
}: SubscribeToTableOptions): () => void {
  let eventType: string;

  switch (event) {
    case 'INSERT':
      eventType = REALTIME_LISTEN_TYPES.INSERT;
      break;
    case 'UPDATE':
      eventType = REALTIME_LISTEN_TYPES.UPDATE;
      break;
    case 'DELETE':
      eventType = REALTIME_LISTEN_TYPES.DELETE;
      break;
    default:
      eventType = REALTIME_LISTEN_TYPES.ALL;
  }

  const channel = supabase
    .channel(`public:${table}`)
    .on(eventType, filter ? `public:${table}:${filter}` : `public:${table}`, callback)
    .subscribe((status: any) => {
      console.log(`Subscription status for ${table}: ${status}`);
    });

  // Return an unsubscribe function
  return () => {
    if (typeof channel === 'object' && channel.unsubscribe) {
      channel.unsubscribe();
    }
  };
}

export function unsubscribeFromTable(unsubscribeFn: () => void): void {
  if (typeof unsubscribeFn === 'function') {
    unsubscribeFn();
  }
}
