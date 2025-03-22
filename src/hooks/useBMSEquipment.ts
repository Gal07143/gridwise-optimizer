import { useEffect, useState } from 'react';

export interface BMSEquipment {
  id: string;
  name: string;
  manufacturer: string;
  model: string;
  // Add other fields as needed
}

export function useBMSEquipment() {
  const [equipment, setEquipment] = useState<BMSEquipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEquipment() {
      try {
        // Note: include `select=*` so that Supabase returns data
        const url = `https://xullgeycueouyxeirrqs.supabase.co/rest/v1/equipment?select=*&type=eq.BMS`;
        const res = await fetch(url, {
          headers: {
            // Replace with your actual anon/public key from Supabase settings:
            apikey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1bGxnZXljdWVvdXl4ZWlycnFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMjE2NDQsImV4cCI6MjA1Nzg5NzY0NH0.n5z7ce0elijXBkrpgW_RhTAASKKe3vmzYHxwl8f2KRg',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1bGxnZXljdWVvdXl4ZWlycnFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMjE2NDQsImV4cCI6MjA1Nzg5NzY0NH0.n5z7ce0elijXBkrpgW_RhTAASKKe3vmzYHxwl8f2KRg',
          },
        });
        const data = await res.json();
        setEquipment(data);
      } catch (error) {
        console.error('Failed to fetch BMS equipment:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchEquipment();
  }, []);

  return { equipment, loading };
}
