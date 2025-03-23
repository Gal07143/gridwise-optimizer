
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
      const { data: telemetryRecord, error } = await supabase
        .from('telemetry_log')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(1)
        .single();

      if (!error && telemetryRecord) {
        try {
          // Extract message data - it might be a string that needs parsing or already a JSON object
          let messageData = {};
          if (telemetryRecord.message) {
            if (typeof telemetryRecord.message === 'string') {
              try {
                messageData = JSON.parse(telemetryRecord.message);
              } catch (e) {
                console.error('Failed to parse message:', e);
              }
            } else if (typeof telemetryRecord.message === 'object') {
              messageData = telemetryRecord.message;
            }
          }

          // Create telemetry data object, prioritizing fields from the message
          const telemetryData: TelemetryData = {
            device_id: telemetryRecord.device_id,
            // Use the first available timestamp field
            timestamp: telemetryRecord.received_at || telemetryRecord.created_at,
            // Add values from message or directly from record if they exist
            ...messageData
          };
          
          setData(telemetryData);
        } catch (e) {
          console.error('Error processing telemetry data:', e);
        }
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
