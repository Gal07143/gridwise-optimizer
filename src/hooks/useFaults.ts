import { useEffect, useState } from 'react';
import { supabase } from '@/supabase';

interface Fault {
  id: string;
  device_id: string;
  timestamp: string;
  description: string;
  severity: string;
  status: string;
}

export function useFaults(limit = 10) {
  const [faults, setFaults] = useState<Fault[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFaults() {
      const { data, error } = await supabase
        .from('faults')
        .select('*')
        .eq('status', 'open')
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (!error) {
        setFaults(data || []);
      } else {
        console.error("Error fetching faults:", error);
      }
      setLoading(false);
    }

    fetchFaults();

    const interval = setInterval(fetchFaults, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [limit]);

  return { faults, loading };
}
