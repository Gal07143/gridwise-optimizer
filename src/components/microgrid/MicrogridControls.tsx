import React from 'react';
import { Power, Activity, Battery, Cable, Clock as ClockIcon } from 'lucide-react';
import { MicrogridState } from './types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';

interface MicrogridControlsProps {
  microgridState: MicrogridState;
  minBatteryReserve: number;
  onModeChange: (mode: 'automatic' | 'manual' | 'island' | 'grid-connected') => void;
  onGridConnectionToggle: (enabled: boolean) => void;
  onBatteryDischargeToggle: (enabled: boolean) => void;
  onBatteryReserveChange: (value: number) => void;
}

const MicrogridControls: React.FC<MicrogridControlsProps> = ({
  microgridState,
  minBatteryReserve,
  onModeChange,
  onGridConnectionToggle,
  onBatteryDischargeToggle,
  onBatteryReserveChange
}) => {
  return (
    <Card>
      <CardHeader className="bg-primary/5">
        <CardTitle className="flex items-center text-lg">
          <Power className="mr-2 h-5 w-5 text-primary" />
          Microgrid Controls
        </CardTitle>
        <CardDescription>
          Manage operating mode, grid connection, and battery settings
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-base font-medium">Operating Mode</h3>
            <p className="text-sm text-muted-foreground">
              Select the desired operating mode for your microgrid
            </p>
            <RadioGroup defaultValue={microgridState.operatingMode} className="w-full flex justify-between">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="automatic" id="automatic" className="peer sr-only" />
                <Label
                  htmlFor="automatic"
                  className="cursor-pointer rounded-md p-3 text-sm font-medium ring-offset-background transition-colors data-[state=checked]:bg-secondary data-[state=checked]:text-secondary-foreground data-[state=checked]:ring-2 data-[state=checked]:ring-ring peer-data-[state=checked]:border-transparent"
                >
                  Automatic
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="manual" id="manual" className="peer sr-only" />
                <Label
                  htmlFor="manual"
                  className="cursor-pointer rounded-md p-3 text-sm font-medium ring-offset-background transition-colors data-[state=checked]:bg-secondary data-[state=checked]:text-secondary-foreground data-[state=checked]:ring-2 data-[state=checked]:ring-ring peer-data-[state=checked]:border-transparent"
                >
                  Manual
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="island" id="island" className="peer sr-only" />
                <Label
                  htmlFor="island"
                  className="cursor-pointer rounded-md p-3 text-sm font-medium ring-offset-background transition-colors data-[state=checked]:bg-secondary data-[state=checked]:text-secondary-foreground data-[state=checked]:ring-2 data-[state=checked]:ring-ring peer-data-[state=checked]:border-transparent"
                >
                  Island
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="grid-connected" id="grid-connected" className="peer sr-only" />
                <Label
                  htmlFor="grid-connected"
                  className="cursor-pointer rounded-md p-3 text-sm font-medium ring-offset-background transition-colors data-[state=checked]:bg-secondary data-[state=checked]:text-secondary-foreground data-[state=checked]:ring-2 data-[state=checked]:ring-ring peer-data-[state=checked]:border-transparent"
                >
                  Grid Connected
                </Label>
              </div>
            </RadioGroup>
            
            <div className="flex justify-around mt-4">
              <Button variant="outline" size="sm" onClick={() => onModeChange('automatic')}>Set Automatic</Button>
              <Button variant="outline" size="sm" onClick={() => onModeChange('manual')}>Set Manual</Button>
              <Button variant="outline" size="sm" onClick={() => onModeChange('island')}>Set Island</Button>
              <Button variant="outline" size="sm" onClick={() => onModeChange('grid-connected')}>Set Grid Connected</Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="grid-connection" className="text-base font-medium">Grid Connection</Label>
              <p className="text-sm text-muted-foreground mt-1">Enable or disable connection to the main grid</p>
            </div>
            <Switch 
              id="grid-connection" 
              checked={microgridState.gridConnection}
              onCheckedChange={onGridConnectionToggle}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="battery-discharge" className="text-base font-medium">Battery Discharge</Label>
              <p className="text-sm text-muted-foreground mt-1">Allow battery to discharge and supply power</p>
            </div>
            <Switch 
              id="battery-discharge" 
              checked={microgridState.batteryDischargeEnabled}
              onCheckedChange={onBatteryDischargeToggle}
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <Label htmlFor="battery-reserve" className="text-base font-medium">Minimum Battery Reserve</Label>
              <span>{minBatteryReserve}%</span>
            </div>
            <Slider 
              id="battery-reserve"
              min={10}
              max={50}
              step={5}
              value={[minBatteryReserve]}
              onValueChange={(value) => onBatteryReserveChange(value[0])}
            />
            <p className="text-sm text-muted-foreground mt-2">
              Set the minimum battery level to maintain as a reserve
            </p>
          </div>
          
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <div className="flex items-center mb-4">
              <ClockIcon className="h-5 w-5 text-slate-500 mr-2" />
              <h3 className="font-medium">Automation Schedule</h3>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Configure scheduled actions for different times of the day.
            </p>
            
            <div className="mt-4 space-y-2">
              <Badge variant="outline">
                <Activity className="h-4 w-4 mr-2" />
                Peak Hours: Reduce grid import by 30%
              </Badge>
              <Badge variant="outline">
                <Battery className="h-4 w-4 mr-2" />
                Night: Maximize battery discharge
              </Badge>
              <Badge variant="outline">
                <Cable className="h-4 w-4 mr-2" />
                Weekend: Prioritize renewable energy
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MicrogridControls;
