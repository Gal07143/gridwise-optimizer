
import React from 'react';
import { DeviceType } from '@/types/energy';
import SolarControls from './controls/SolarControls';
import WindControls from './controls/WindControls';
import BatteryControls from './controls/BatteryControls';
import GridControls from './controls/GridControls';
import LoadControls from './controls/LoadControls';
import EVChargerControls from './controls/EVChargerControls';
import { AlertTriangle, PowerOff } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface DeviceControlsProps {
  deviceId: string;
  deviceType: DeviceType;
  deviceStatus: string;
}

const DeviceControls: React.FC<DeviceControlsProps> = ({ deviceId, deviceType, deviceStatus }) => {
  const isDeviceOnline = deviceStatus === 'online';
  
  if (!isDeviceOnline) {
    return (
      <div className="space-y-4">
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Device Offline</AlertTitle>
          <AlertDescription>
            This device is currently offline. Control features are not available when the device is disconnected.
          </AlertDescription>
        </Alert>
        
        <div className="p-8 bg-muted/30 rounded-md text-center">
          <PowerOff className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            Control features are disabled when the device is offline
          </p>
        </div>
      </div>
    );
  }

  switch (deviceType) {
    case 'solar':
      return <SolarControls deviceId={deviceId} />;
    case 'wind':
      return <WindControls deviceId={deviceId} />;
    case 'battery':
      return <BatteryControls deviceId={deviceId} />;
    case 'grid':
      return <GridControls deviceId={deviceId} />;
    case 'load':
      return <LoadControls deviceId={deviceId} />;
    case 'ev_charger':
      return <EVChargerControls deviceId={deviceId} />;
    default:
      return (
        <div className="p-8 bg-secondary/20 rounded-md text-center">
          <p className="text-muted-foreground">No controls available for this device type</p>
        </div>
      );
  }
};

export default DeviceControls;
