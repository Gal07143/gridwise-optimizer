
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnergyDevice } from '@/types/energy';
import { AlertTriangle } from 'lucide-react';

interface DeviceControlsPanelProps {
  device: EnergyDevice;
}

const DeviceControlsPanel: React.FC<DeviceControlsPanelProps> = ({ device }) => {
  // This is a simplified version of the component
  // In a real implementation, this would include actual device controls
  return (
    <Card>
      <CardHeader>
        <CardTitle>Device Controls</CardTitle>
      </CardHeader>
      <CardContent>
        {device.status === 'offline' ? (
          <div className="p-4 flex items-center space-x-4 bg-amber-50 dark:bg-amber-950/20 rounded-md">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <p className="text-sm">Device is offline. Controls are unavailable.</p>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            <p>Controls for {device.type} devices are available when connected.</p>
            <p className="mt-2">Device status: {device.status}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeviceControlsPanel;
