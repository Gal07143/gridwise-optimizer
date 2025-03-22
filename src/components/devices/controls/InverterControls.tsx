import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface InverterControlsProps {
  deviceId: string;
}

const InverterControls: React.FC<InverterControlsProps> = ({ deviceId }) => {
  const [powerLimit, setPowerLimit] = useState(5000);

  const handleStart = () => {
    console.log(`Start inverter ${deviceId}`);
    // TODO: Call backend API
  };

  const handleStop = () => {
    console.log(`Stop inverter ${deviceId}`);
    // TODO: Call backend API
  };

  const handlePowerChange = () => {
    console.log(`Set inverter ${deviceId} power to ${powerLimit}W`);
    // TODO: Send power limit to backend
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inverter Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <Button onClick={handleStart}>Start</Button>
          <Button onClick={handleStop} variant="destructive">Stop</Button>
        </div>

        <div className="space-y-2">
          <label htmlFor="power">Set Output Power (W)</label>
          <Input
            type="number"
            id="power"
            value={powerLimit}
            onChange={(e) => setPowerLimit(Number(e.target.value))}
            className="w-48"
          />
          <Button onClick={handlePowerChange}>Apply Power Limit</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InverterControls;
