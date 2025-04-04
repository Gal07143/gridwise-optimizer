
import React from 'react';
import { DeviceType } from '@/types/energy';
import SolarControls from './controls/SolarControls';
import WindControls from './controls/WindControls';
import BatteryControls from './controls/BatteryControls';
import GridControls from './controls/GridControls';
import LoadControls from './controls/LoadControls';
import EVChargerControls from './controls/EVChargerControls';
import InverterControls from './controls/InverterControls';
import MeterControls from './controls/MeterControls';
import LightControls from './controls/LightControls';
import GeneratorControls from './controls/GeneratorControls';
import HydroControls from './controls/HydroControls';
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
        <Alert variant="destructive">
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

  // Since DeviceType is now a string, use string comparison
  if (deviceType === 'solar') {
    return <SolarControls deviceId={deviceId} />;
  } else if (deviceType === 'wind') {
    return <WindControls deviceId={deviceId} />;
  } else if (deviceType === 'battery') {
    return <BatteryControls deviceId={deviceId} />;
  } else if (deviceType === 'grid') {
    return <GridControls deviceId={deviceId} />;
  } else if (deviceType === 'load') {
    return <LoadControls deviceId={deviceId} />;
  } else if (deviceType === 'ev_charger') {
    return <EVChargerControls deviceId={deviceId} />;
  } else if (deviceType === 'inverter') {
    return <InverterControls deviceId={deviceId} />;
  } else if (deviceType === 'meter') {
    return <MeterControls deviceId={deviceId} />;
  } else if (deviceType === 'light') {
    return <LightControls deviceId={deviceId} />;
  } else if (deviceType === 'generator') {
    return <GeneratorControls deviceId={deviceId} />;
  } else if (deviceType === 'hydro') {
    return <HydroControls deviceId={deviceId} />;
  } else {
    return (
      <div className="p-8 bg-secondary/20 rounded-md text-center">
        <p className="text-muted-foreground">
          No controls available for this device type: <strong>{deviceType}</strong>
        </p>
      </div>
    );
  }
};

export default React.memo(DeviceControls);
