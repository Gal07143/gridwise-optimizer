// components/alerts/AnomalyFeed.tsx
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import axios from 'axios';

interface Anomaly {
  id: string;
  device_id: string;
  message: string;
  timestamp: string;
}

const AnomalyFeed = () => {
  const [logs, setLogs] = useState<Anomaly[]>([]);

  useEffect(() => {
    const fetchAnomalies = async () => {
      try {
        const res = await axios.get('/api/anomaly');
        setLogs(res.data);
      } catch (err) {
        console.error('Failed to fetch anomalies');
      }
    };
    fetchAnomalies();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Anomaly Events</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {logs.length === 0 && <p>No recent anomalies detected.</p>}
        {logs.map((log) => (
          <div key={log.id} className="border p-2 rounded-md bg-red-50 dark:bg-red-900/20">
            <div><strong>Device:</strong> {log.device_id}</div>
            <div><strong>Event:</strong> {log.message}</div>
            <div className="text-xs text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AnomalyFeed;
