
import React, { useState } from 'react';
import { 
  Battery, 
  BatteryCharging, 
  ZapOff,
  Power, 
  Activity 
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { BatteryOperatingModeInfo } from './BatteryOperatingModeInfo';

interface BatteryControlTabProps {
  deviceId: string;
}

const BatteryControlTab: React.FC<BatteryControlTabProps> = ({ deviceId }) => {
  const [operatingMode, setOperatingMode] = useState('normal');
  const [isActive, setIsActive] = useState(true);
  const [isForceCharging, setIsForceCharging] = useState(false);
  const [isForcedDischarging, setIsForcedDischarging] = useState(false);
  
  const handleActivationToggle = (checked: boolean) => {
    setIsActive(checked);
    toast.success(checked ? 'Battery system activated' : 'Battery system deactivated');
  };
  
  const handleForceCharge = () => {
    if (isForceCharging) {
      setIsForceCharging(false);
      toast.info('Stopped forced charging');
    } else {
      setIsForceCharging(true);
      setIsForcedDischarging(false);
      toast.info('Started forced charging');
    }
  };
  
  const handleForceDischarge = () => {
    if (isForcedDischarging) {
      setIsForcedDischarging(false);
      toast.info('Stopped forced discharging');
    } else {
      setIsForcedDischarging(true);
      setIsForceCharging(false);
      toast.info('Started forced discharging');
    }
  };
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Power className="mr-2 h-5 w-5 text-primary" />
            Battery Control
          </CardTitle>
          <CardDescription>
            Control the charging and discharging of the battery
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="battery-active">System Active</Label>
            <Switch 
              id="battery-active" 
              checked={isActive} 
              onCheckedChange={handleActivationToggle}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant={isForceCharging ? "default" : "outline"}
              className="w-full"
              onClick={handleForceCharge}
              disabled={!isActive}
            >
              <BatteryCharging className="h-4 w-4 mr-2" />
              {isForceCharging ? "Stop Charging" : "Force Charge"}
            </Button>
            
            <Button 
              variant={isForcedDischarging ? "default" : "outline"}
              className="w-full"
              onClick={handleForceDischarge}
              disabled={!isActive}
            >
              <ZapOff className="h-4 w-4 mr-2" />
              {isForcedDischarging ? "Stop Discharging" : "Force Discharge"}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="mr-2 h-5 w-5 text-primary" />
            Operating Mode
          </CardTitle>
          <CardDescription>
            Select how the battery operates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select
            disabled={!isActive}
            value={operatingMode}
            onValueChange={setOperatingMode}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select operating mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal Operation</SelectItem>
              <SelectItem value="eco">Economy Mode</SelectItem>
              <SelectItem value="backup">Backup Ready Mode</SelectItem>
              <SelectItem value="peak">Peak Shaving Mode</SelectItem>
              <SelectItem value="grid">Grid Support Mode</SelectItem>
            </SelectContent>
          </Select>
          
          <BatteryOperatingModeInfo mode={operatingMode} />
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-auto"
            disabled={!isActive}
            onClick={() => toast.success(`Mode set to ${operatingMode}`)}
          >
            Apply Mode
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default BatteryControlTab;
