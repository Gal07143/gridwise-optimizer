import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

interface InverterControlsProps {
  deviceId: string;
}

const InverterControls: React.FC<InverterControlsProps> = ({ deviceId }) => {
  const [isOn, setIsOn] = useState<boolean>(true);
  const [mode, setMode] = useState<string>('grid-tied');
  const [power, setPower] = useState<number>(5);
  const { toast } = useToast();

  const handleToggle = () => {
    setIsOn(!isOn);
    toast({
      title: `Inverter ${isOn ? 'turned off' : 'turned on'}`,
      description: `Device ID: ${deviceId}`,
    });
  };

  const handleModeChange = (value: string) => {
    setMode(value);
    toast({
      title: 'Inverter mode changed',
      description: `Mode set to ${value}`,
    });
  };

  const handlePowerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPower(Number(e.target.value));
  };

  const handleReset = () => {
    toast({
      title: 'Fault Reset',
      description: 'Inverter fault has been reset',
    });
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Inverter Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Label>Power Switch</Label>
          <Switch checked={isOn} onCheckedChange={handleToggle} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mode">Operation Mode</Label>
          <Select value={mode} onValueChange={handleModeChange}>
            <SelectTrigger id="mode">
              <SelectValue placeholder="Select mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grid-tied">Grid-Tied</SelectItem>
              <SelectItem value="off-grid">Off-Grid</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="power">Power Output (kW)</Label>
          <Input
            id="power"
            type="number"
            min={0}
            step={0.1}
            value={power}
            onChange={handlePowerChange}
          />
        </div>

        <Button variant="destructive" onClick={handleReset}>
          Reset Fault
        </Button>
      </CardContent>
    </Card>
  );
};

export default InverterControls;
