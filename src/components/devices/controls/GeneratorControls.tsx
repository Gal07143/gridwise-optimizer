import React from 'react';
import ControlDialog from './ControlDialog';

interface GeneratorControlsProps {
  deviceId: string;
}

const GeneratorControls: React.FC<GeneratorControlsProps> = ({ deviceId }) => {
  return (
    <ControlDialog
      title="Generator Controls"
      description="Start, stop and test generator"
      actions={[
        {
          label: 'Start Generator',
          onSubmit: () => console.log(`Starting generator ${deviceId}`),
        },
        {
          label: 'Stop Generator',
          onSubmit: () => console.log(`Stopping generator ${deviceId}`),
        },
        {
          label: 'Run Self-Test',
          onSubmit: () => console.log(`Running self-test on generator ${deviceId}`),
        }
      ]}
    />
  );
};

export default GeneratorControls;
