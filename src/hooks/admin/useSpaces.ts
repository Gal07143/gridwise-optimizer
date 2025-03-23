
// /src/hooks/admin/useSpaces.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client'; // Import the shared client

// minimal example to fetch spaces
export function useSpaces() {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSpaces() {
      try {
        const { data, error } = await supabase
          .from('spaces')
          .select('*');
          
        if (!error && data) {
          setSpaces(data);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchSpaces();
  }, []);

  return { spaces, loading };
}
