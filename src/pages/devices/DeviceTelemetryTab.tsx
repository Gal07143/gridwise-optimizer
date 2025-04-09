
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Device } from '@/types/device';

interface DeviceTelemetryTabProps {
  device: Device;
}

const DeviceTelemetryTab: React.FC<DeviceTelemetryTabProps> = ({ device }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Telemetry Data</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center py-6 text-muted-foreground">
          Telemetry data for {device.name} will be displayed here.
        </p>
      </CardContent>
    </Card>
  );
};

export default DeviceTelemetryTab;
