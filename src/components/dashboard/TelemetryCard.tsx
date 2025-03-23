
// src/components/dashboard/TelemetryCard.tsx
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '@/integrations/supabase/client'; // Import the shared client instead

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
      // Use the imported supabase client
      const { data: latestData, error } = await supabase
        .from('telemetry_log')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(1)
        .single();

      if (!error && latestData) {
        // Transform the data to match our TelemetryData interface
        const telemetryData: TelemetryData = {
          device_id: latestData.device_id,
          // Use received_at or created_at as timestamp
          timestamp: latestData.timestamp || latestData.received_at || latestData.created_at,
          // Extract telemetry values from the message if it's in JSON format
          ...(typeof latestData.message === 'object' 
            ? latestData.message 
            : typeof latestData.message === 'string' 
              ? JSON.parse(latestData.message) 
              : {}),
          // Also check for direct properties on the record
          voltage: latestData.voltage,
          current: latestData.current,
          power: latestData.power,
          temperature: latestData.temperature
        };
        
        setData(telemetryData);
      }
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
