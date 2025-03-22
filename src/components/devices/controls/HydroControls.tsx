import React from 'react';
import ControlDialog from './ControlDialog';

interface HydroControlsProps {
  deviceId: string;
}

const HydroControls: React.FC<HydroControlsProps> = ({ deviceId }) => {
  return (
    <ControlDialog
      title="Hydro Turbine Control"
      description="Manage hydro turbine flow and output"
      actions={[
        {
          label: 'Adjust Turbine Flow (L/s)',
          inputType: 'number',
          onSubmit: (value) => console.log(`Set hydro turbine ${deviceId} flow to ${value} L/s`),
        },
        {
          label: 'Activate Emergency Stop',
          onSubmit: () => console.log(`Emergency stop triggered on hydro ${deviceId}`),
        }
      ]}
    />
  );
};

export default HydroControls;
