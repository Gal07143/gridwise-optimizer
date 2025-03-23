
import React from 'react';
import ControlDialog from './ControlDialog';

interface MeterControlsProps {
  deviceId: string;
}

const MeterControls: React.FC<MeterControlsProps> = ({ deviceId }) => {
  return (
    <ControlDialog
      title="Energy Meter"
      description="View and reset meter counters"
      actions={[
        {
          label: 'Reset Energy Counter',
          onSubmit: () => console.log(`Reset energy counter on meter ${deviceId}`),
        },
        {
          label: 'Sync Time',
          onSubmit: () => console.log(`Sync time on meter ${deviceId}`),
        }
      ]}
    />
  );
};

export default MeterControls;
