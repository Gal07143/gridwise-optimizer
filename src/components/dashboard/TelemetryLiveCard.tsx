// src/components/dashboard/TelemetryLiveCard.tsx

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface TelemetryData {
  device_id: string;
  timestamp: string;
  power?: number;
  voltage?: number;
  current?: number;
  frequency?: number;
  state_of_charge?: number;
}

const TelemetryLiveCard: React.FC = () => {
  const [data, setData] = useState<TelemetryData | null>(null);

  const fetchLatestTelemetry = async () => {
    const { data: latest, error } = await supabase
      .from('telemetry_log')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(1)
      .single();

    if (!error && latest) {
      setData(latest);
    }
  };

  useEffect(() => {
    fetchLatestTelemetry();

    const interval = setInterval(() => {
      fetchLatestTelemetry();
    }, 10000); // refresh every 10 seconds

    return () => clearInterval(interval);
  }, []);

  if (!data) {
    return <p>Loading latest telemetry...</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Telemetry</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 text-sm">
        <p><strong>Device:</strong> {data.device_id}</p>
        <p><strong>Power:</strong> {data.power ?? '-'} W</p>
        <p><strong>Voltage:</strong> {data.voltage ?? '-'} V</p>
        <p><strong>Current:</strong> {data.current ?? '-'} A</p>
        <p><strong>Freq:</strong> {data.frequency ?? '-'} Hz</p>
        <p><strong>SOC:</strong> {data.state_of_charge ?? '-'}%</p>
        <p className="text-xs text-muted-foreground">Last updated: {new Date(data.timestamp).toLocaleTimeString()}</p>
      </CardContent>
    </Card>
  );
};

export default TelemetryLiveCard;
