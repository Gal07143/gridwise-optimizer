import React from 'react';
import ControlDialog from './ControlDialog';

interface LightControlsProps {
  deviceId: string;
}

const LightControls: React.FC<LightControlsProps> = ({ deviceId }) => {
  return (
    <ControlDialog
      title="Lighting Controls"
      description="Turn lights on/off or set brightness"
      actions={[
        {
          label: 'Turn On',
          onSubmit: () => console.log(`Turned on lights ${deviceId}`),
        },
        {
          label: 'Turn Off',
          onSubmit: () => console.log(`Turned off lights ${deviceId}`),
        },
        {
          label: 'Set Brightness (%)',
          inputType: 'number',
          onSubmit: (value) => console.log(`Set brightness of lights ${deviceId} to ${value}%`),
        }
      ]}
    />
  );
};

export default LightControls;
