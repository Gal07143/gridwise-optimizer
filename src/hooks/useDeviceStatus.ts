// src/hooks/useDeviceStatus.ts
import { useEffect, useState } from "react";

export const useDeviceStatus = (deviceId: string) => {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`/api/devices/status/${deviceId}`);
        const data = await res.json();
        setStatus(data);
      } catch (err) {
        console.error("Status fetch error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, [deviceId]);

  return { status, loading };
};
