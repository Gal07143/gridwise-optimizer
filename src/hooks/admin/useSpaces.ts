// /src/hooks/admin/useSpaces.ts
import { useState, useEffect } from 'react';

// minimal example to fetch spaces
export function useSpaces() {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSpaces() {
      try {
        const url = 'https://<YOUR_PROJECT>.supabase.co/rest/v1/spaces?select=*';
        const res = await fetch(url, {
          headers: {
            apikey: '<YOUR_ANON_KEY>',
            Authorization: 'Bearer <YOUR_ANON_KEY>',
          },
        });
        const data = await res.json();
        setSpaces(data);
      } finally {
        setLoading(false);
      }
    }
    fetchSpaces();
  }, []);

  return { spaces, loading };
}
