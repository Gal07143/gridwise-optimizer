// /src/hooks/useModbusReadings.ts
import { useEffect, useState } from 'react';

interface ModbusReading {
  id: string;
  device_id: string;
  timestamp: string;
  voltage: number;
  current: number;
  power_kw: number;
  energy_kwh: number;
}

export function useModbusReadings(limit = 20) {
  const [readings, setReadings] = useState<ModbusReading[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Replace with your actual Supabase REST endpoint
        // or use supabase-js client if you have it set up in the frontend
        const url = `https://xullgeycueouyxeirrqs.supabase.co/rest/v1/modbus_readings?select=*&order=timestamp.desc&limit=${limit}`;
        
        const res = await fetch(url, {
          headers: {
            apikey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1bGxnZXljdWVvdXl4ZWlycnFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMjE2NDQsImV4cCI6MjA1Nzg5NzY0NH0.n5z7ce0elijXBkrpgW_RhTAASKKe3vmzYHxwl8f2KRg',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1bGxnZXljdWVvdXl4ZWlycnFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMjE2NDQsImV4cCI6MjA1Nzg5NzY0NH0.n5z7ce0elijXBkrpgW_RhTAASKKe3vmzYHxwl8f2KRg',
          },
        });
        const data = await res.json();
        setReadings(data);
      } catch (err) {
        console.error('Failed to fetch modbus readings:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [limit]);

  return { readings, loading };
}
