
import { useEffect, useState } from 'react';

export function useTariffHistory(hoursBack = 48) {
  const [tariffHistory, setTariffHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTariffHistory() {
      try {
        const now = new Date();
        const start = new Date(now.getTime() - hoursBack * 60 * 60 * 1000);
        const response = await fetch(
          'https://xullgeycueouyxeirrqs.supabase.co/rest/v1/tariffs?timestamp=gt.' + start.toISOString() + '&order=timestamp.asc',
          {
            headers: {
              apikey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1bGxnZXljdWVvdXl4ZWlycnFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMjE2NDQsImV4cCI6MjA1Nzg5NzY0NH0.n5z7ce0elijXBkrpgW_RhTAASKKe3vmzYHxwl8f2KRg',
              Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1bGxnZXljdWVvdXl4ZWlycnFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMjE2NDQsImV4cCI6MjA1Nzg5NzY0NH0.n5z7ce0elijXBkrpgW_RhTAASKKe3vmzYHxwl8f2KRg',
            },
          }
        );
        const data = await response.json();
        setTariffHistory(data);
      } catch (err) {
        console.error('Failed to fetch tariff history:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchTariffHistory();
  }, [hoursBack]);

  return { tariffHistory, loading };
}
