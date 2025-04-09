
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Device } from '@/types/device';

interface DeviceMaintenanceTabProps {
  device: Device;
}

const DeviceMaintenanceTab: React.FC<DeviceMaintenanceTabProps> = ({ device }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Maintenance</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center py-6 text-muted-foreground">
          Maintenance information for {device.name} will be displayed here.
        </p>
      </CardContent>
    </Card>
  );
};

export default DeviceMaintenanceTab;
