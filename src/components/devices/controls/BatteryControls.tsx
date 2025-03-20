
import React from 'react';
import BatteryControlPanel from './battery/BatteryControlPanel';

interface BatteryControlsProps {
  deviceId: string;
}

const BatteryControls: React.FC<BatteryControlsProps> = ({ deviceId }) => {
  return <BatteryControlPanel deviceId={deviceId} />;
};

export default BatteryControls;
