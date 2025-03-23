// src/components/device/controls/MeterControls.tsx

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getLatestReadingForDevice } from '@/lib/api';
import { formatTimestamp } from '@/lib/utils';

interface MeterControlsProps {
  deviceId: string;
}

interface MeterReading {
  voltage: number;
  current: number;
  power: number;
  frequency: number;
  energy: number;
  timestamp: string;
}

const MeterControls: React.FC<MeterControlsProps> = ({ deviceId }) => {
  const [reading, setReading] = useState<MeterReading | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLatestReading = async () => {
      try {
        setLoading(true);
        const result = await getLatestReadingForDevice(deviceId);
        setReading(result);
      } catch (error) {
        console.error('Error fetching meter reading:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestReading();
    const interval = setInterval(fetchLatestReading, 10000); // update every 10s
    return () => clearInterval(interval);
  }, [deviceId]);

  if (loading || !reading) {
    return <Skeleton className="h-48 w-full rounded-lg" />;
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Smart Meter Readings</CardTitle>
        <p className="text-muted-foreground text-sm">
          Last updated: {formatTimestamp(reading.timestamp)}
        </p>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <Label>Voltage</Label>
          <Badge variant="outline">{reading.voltage} V</Badge>
        </div>
        <div>
          <Label>Current</Label>
          <Badge variant="outline">{reading.current} A</Badge>
        </div>
        <div>
          <Label>Power</Label>
          <Badge variant="outline">{reading.power} kW</Badge>
        </div>
        <div>
          <Label>Frequency</Label>
          <Badge variant="outline">{reading.frequency} Hz</Badge>
        </div>
        <div>
          <Label>Energy</Label>
          <Badge variant="outline">{reading.energy} kWh</Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default MeterControls;
