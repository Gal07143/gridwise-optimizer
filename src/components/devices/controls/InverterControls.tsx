import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

interface InverterControlsProps {
  deviceId: string;
}

const InverterControls: React.FC<InverterControlsProps> = ({ deviceId }) => {
  const [mode, setMode] = useState('grid-tie');
  const [powerFactor, setPowerFactor] = useState('1.0');
  const [outputPower, setOutputPower] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Simulated fetch logic (replace with Supabase or API call)
    const fetchData = async () => {
      setIsLoading(true);
      setTimeout(() => {
        setOutputPower(6200); // Simulate 6.2kW output
        setMode('grid-tie');
        setPowerFactor('0.98');
        setIsLoading(false);
      }, 800);
    };

    fetchData();
  }, [deviceId]);

  const handleModeChange = (value: string) => {
    setMode(value);
    toast({ title: 'Inverter mode updated', description: `New mode: ${value}` });
  };

  const handlePowerFactorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPowerFactor(value);
  };

  const handleApply = () => {
    toast({ title: 'Settings applied', description: `Mode: ${mode}, Power Factor: ${powerFactor}` });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Inverter Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="mode">Operating Mode</Label>
            <Select value={mode} onValueChange={handleModeChange} disabled={isLoading}>
              <SelectTrigger id="mode">
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grid-tie">Grid-Tie</SelectItem>
                <SelectItem value="off-grid">Off-Grid</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="powerFactor">Power Factor</Label>
            <Input
              id="powerFactor"
              type="number"
              step="0.01"
              max="1.0"
              min="0.8"
              value={powerFactor}
              onChange={handlePowerFactorChange}
              disabled={isLoading}
            />
          </div>
        </div>

        <Button onClick={handleApply} disabled={isLoading}>
          Apply Settings
        </Button>

        <div className="text-sm text-muted-foreground">
          <strong>Current Output Power:</strong>{' '}
          {outputPower !== null ? `${outputPower} W` : 'Loading...'}
        </div>
      </CardContent>
    </Card>
  );
};

export default InverterControls;
