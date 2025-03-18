
import React from 'react';
import { DeviceType } from '@/types/energy';
import SolarControls from './controls/SolarControls';
import WindControls from './controls/WindControls';
import BatteryControls from './controls/BatteryControls';
import GridControls from './controls/GridControls';
import LoadControls from './controls/LoadControls';
import EVChargerControls from './controls/EVChargerControls';

interface DeviceControlsProps {
  deviceId: string;
  deviceType: DeviceType;
  deviceStatus: string;
}

const DeviceControls: React.FC<DeviceControlsProps> = ({ deviceId, deviceType, deviceStatus }) => {
  const isDeviceOnline = deviceStatus === 'online';
  
  if (!isDeviceOnline) {
    return (
      <div className="p-4 bg-amber-950/10 rounded-md text-center">
        <p className="text-amber-500 font-medium">Device is offline</p>
        <p className="text-sm text-muted-foreground mt-1">
          Control features are disabled when the device is offline
        </p>
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
        <div className="p-4 bg-secondary/20 rounded-md text-center">
          <p className="text-muted-foreground">No controls available for this device type</p>
        </div>
      );
  }
};

export default DeviceControls;
