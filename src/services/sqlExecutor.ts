
import { supabase } from '@/integrations/supabase/client';

/**
 * Execute SQL queries via the secure edge function
 */
export const executeSql = async <T = any>(query: string, params: any[] = []): Promise<T[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('execute-sql', {
      body: { query, params },
    });

    if (error) {
      console.error('Error executing SQL:', error);
      throw error;
    }

    return data as T[];
  } catch (error) {
    console.error('Error invoking SQL execution:', error);
    throw error;
  }
};
