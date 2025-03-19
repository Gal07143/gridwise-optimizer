
import React from 'react';
import { DeviceType } from '@/types/energy';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SolarControls from './SolarControls';
import WindControls from './WindControls';
import BatteryControls from './BatteryControls';
import LoadControls from './LoadControls';
import { Sun, Wind, Battery, Bolt } from 'lucide-react';

interface ControlDialogProps {
  isOpen: boolean;
  onClose: () => void;
  deviceType: DeviceType;
  deviceId: string;
}

const getDialogTitle = (deviceType: DeviceType) => {
  switch (deviceType) {
    case 'solar': return 'Solar Array Controls';
    case 'wind': return 'Wind Turbine Controls';
    case 'battery': return 'Battery System Controls';
    case 'load': return 'Load Management Controls';
    default: return 'Device Controls';
  }
};

const getDialogIcon = (deviceType: DeviceType) => {
  switch (deviceType) {
    case 'solar': return <Sun className="h-6 w-6 text-yellow-500" />;
    case 'wind': return <Wind className="h-6 w-6 text-blue-500" />;
    case 'battery': return <Battery className="h-6 w-6 text-green-500" />;
    case 'load': return <Bolt className="h-6 w-6 text-orange-500" />;
    default: return null;
  }
};

const getDialogDescription = (deviceType: DeviceType) => {
  switch (deviceType) {
    case 'solar': return 'Configure and control solar array operations';
    case 'wind': return 'Manage wind turbine settings and operations';
    case 'battery': return 'Control battery charging and discharging operations';
    case 'load': return 'Manage load balancing and power consumption';
    default: return 'Manage device settings and operations';
  }
};

const ControlDialog: React.FC<ControlDialogProps> = ({ 
  isOpen, 
  onClose, 
  deviceType, 
  deviceId 
}) => {
  const renderControls = () => {
    switch (deviceType) {
      case 'solar':
        return <SolarControls deviceId={deviceId} />;
      case 'wind':
        return <WindControls deviceId={deviceId} />;
      case 'battery':
        return <BatteryControls deviceId={deviceId} />;
      case 'load':
        return <LoadControls deviceId={deviceId} />;
      default:
        return <div>No controls available for this device type</div>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {getDialogIcon(deviceType)}
            {getDialogTitle(deviceType)}
          </DialogTitle>
          <DialogDescription>
            {getDialogDescription(deviceType)}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {renderControls()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ControlDialog;
