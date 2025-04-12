import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://xullgeycueouyxeirrqs.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1bGxnZXljdWVvdXl4ZWlycnFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMjE2NDQsImV4cCI6MjA1Nzg5NzY0NH0.n5z7ce0elijXBkrpgW_RhTAASKKe3vmzYHxwl8f2KRg";

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables. Check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        storage: localStorage,
        detectSessionInUrl: true,
        flowType: 'implicit'
    }
});

export const fetchEnergyAnalytics = async (
  startDate: string,
  endDate: string,
  timeInterval: 'hour' | 'day' | 'week' | 'month' = 'day'
) => {
  const { data, error } = await supabase
    .from('energy_consumption')
    .select('*')
    .gte('timestamp', startDate)
    .lte('timestamp', endDate)
    .order('timestamp', { ascending: true });

  if (error) throw error;

  // Group data by time interval
  const groupedData = data.reduce((acc, record) => {
    const date = new Date(record.timestamp);
    let key: string;

    switch (timeInterval) {
      case 'hour':
        key = date.toISOString().slice(0, 13);
        break;
      case 'day':
        key = date.toISOString().slice(0, 10);
        break;
      case 'week':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().slice(0, 10);
        break;
      case 'month':
        key = date.toISOString().slice(0, 7);
        break;
    }

    if (!acc[key]) {
      acc[key] = {
        timestamp: key,
        consumption: 0,
        production: 0,
        grid_import: 0,
        grid_export: 0,
        count: 0
      };
    }

    acc[key].consumption += record.consumption;
    acc[key].production += record.production;
    acc[key].grid_import += record.grid_import;
    acc[key].grid_export += record.grid_export;
    acc[key].count += 1;

    return acc;
  }, {} as Record<string, any>);

  // Calculate averages
  return Object.values(groupedData).map((group: any) => ({
    timestamp: group.timestamp,
    consumption: group.consumption / group.count,
    production: group.production / group.count,
    grid_import: group.grid_import / group.count,
    grid_export: group.grid_export / group.count
  }));
};

export default supabase;
