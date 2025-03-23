// src/components/device/controls/MeterControls.tsx

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getLatestReadingForDevice } from '@/lib/api';
import { formatTimestamp } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

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
  const [prevReading, setPrevReading] = useState<MeterReading | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLatestReading = async () => {
      try {
        setLoading(true);
        const result = await getLatestReadingForDevice(deviceId);
        setPrevReading(reading); // Keep previous reading for trend comparison
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

  const getTrendIcon = (current: number, prev: number | undefined) => {
    if (prev === undefined) return <Minus className="h-4 w-4 text-muted-foreground" />;
    if (current > prev) return <ArrowUpRight className="h-4 w-4 text-green-600" />;
    if (current < prev) return <ArrowDownRight className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getVoltageStatus = (v: number) => {
    if (v >= 215 && v <= 235) return 'success';
    if (v < 210 || v > 240) return 'error';
    return 'warning';
  };

  const badgeClass = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-700';
      case 'warning': return 'bg-yellow-100 text-yellow-700';
      case 'error': return 'bg-red-100 text-red-700';
      default: return 'bg-muted';
    }
  };

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
          <Label className="flex items-center gap-2">
            Voltage {getTrendIcon(reading.voltage, prevReading?.voltage)}
          </Label>
          <span className={`text-sm px-2 py-1 rounded ${badgeClass(getVoltageStatus(reading.voltage))}`}>
            {reading.voltage} V
          </span>
        </div>
        <div>
          <Label className="flex items-center gap-2">
            Current {getTrendIcon(reading.current, prevReading?.current)}
          </Label>
          <Badge variant="outline">{reading.current} A</Badge>
        </div>
        <div>
          <Label className="flex items-center gap-2">
            Power {getTrendIcon(reading.power, prevReading?.power)}
          </Label>
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
        <div>
          <Label>Status</Label>
          <Badge variant="outline" className="bg-blue-100 text-blue-700">Live</Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default MeterControls;
