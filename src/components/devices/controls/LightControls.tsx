// src/components/device/controls/LightControls.tsx

import React from 'react';
import ControlDialog from './ControlDialog';

interface LightControlsProps {
  deviceId: string;
}

const LightControls: React.FC<LightControlsProps> = ({ deviceId }) => {
  return (
    <ControlDialog
      title="Lighting Control"
      description="Toggle lights and adjust brightness"
      actions={[
        {
          label: 'Turn On',
          onSubmit: () => console.log(`Turning on lights for ${deviceId}`),
        },
        {
          label: 'Turn Off',
          onSubmit: () => console.log(`Turning off lights for ${deviceId}`),
        },
        {
          label: 'Set Brightness (%)',
          inputType: 'number',
          onSubmit: (value) => console.log(`Set brightness for ${deviceId} to ${value}%`),
        }
      ]}
    />
  );
};

export default LightControls;
