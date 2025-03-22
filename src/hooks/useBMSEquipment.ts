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
            apikey: 'YOUR_ANON_KEY',
            Authorization: 'Bearer YOUR_ANON_KEY',
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
