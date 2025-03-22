// src/components/dashboard/TelemetryCard.tsx
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';

interface TelemetryData {
  device_id: string;
  timestamp: string;
  voltage?: number;
  current?: number;
  power?: number;
  temperature?: number;
}

const TelemetryCard = () => {
  const [data, setData] = useState<TelemetryData | null>(null);

  useEffect(() => {
    const fetchTelemetry = async () => {
      const res = await fetch('/api/telemetry/latest');
      const json = await res.json();
      setData(json.data);
    };

    fetchTelemetry();

    const interval = setInterval(fetchTelemetry, 5000); // Refresh every 5s
    return () => clearInterval(interval);
  }, []);

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Telemetry</CardTitle>
        </CardHeader>
        <CardContent>Loading latest data...</CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Telemetry</CardTitle>
        <p className="text-sm text-muted-foreground">
          Updated {formatDistanceToNow(new Date(data.timestamp))} ago
        </p>
      </CardHeader>
      <CardContent className="space-y-1 text-sm">
        <div><strong>Device ID:</strong> {data.device_id}</div>
        <div><strong>Power:</strong> {data.power ?? '—'} W</div>
        <div><strong>Voltage:</strong> {data.voltage ?? '—'} V</div>
        <div><strong>Current:</strong> {data.current ?? '—'} A</div>
        <div><strong>Temperature:</strong> {data.temperature ?? '—'} °C</div>
      </CardContent>
    </Card>
  );
};

export default TelemetryCard;
