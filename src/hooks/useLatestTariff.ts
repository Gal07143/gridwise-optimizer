
// File: useLatestTariff.ts (place in your hooks folder)

import { useEffect, useState } from 'react';

export function useLatestTariff() {
  const [tariff, setTariff] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTariff() {
      try {
        const res = await fetch('https://xullgeycueouyxeirrqs.supabase.co/functions/v1/get-latest-tariff');
        const data = await res.json();
        setTariff(data[0]); // latest tariff
      } catch (err) {
        console.error('Tariff fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchTariff();
  }, []);

  return { tariff, loading };
}
