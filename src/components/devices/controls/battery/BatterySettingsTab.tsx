
import React, { useState } from 'react';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

interface BatterySettingsTabProps {
  deviceId: string;
}

const BatterySettingsTab: React.FC<BatterySettingsTabProps> = ({ deviceId }) => {
  const [chargingLimit, setChargingLimit] = useState(85);
  const [dischargingLimit, setDischargingLimit] = useState(20);
  const [isActive, setIsActive] = useState(true);
  
  const handleChargingLimitChange = (value: number[]) => {
    const limit = value[0];
    setChargingLimit(limit);
    toast.info(`Charging limit set to ${limit}%`);
  };
  
  const handleDischargingLimitChange = (value: number[]) => {
    const limit = value[0];
    setDischargingLimit(limit);
    toast.info(`Discharging limit set to ${limit}%`);
  };
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Charge/Discharge Limits</CardTitle>
          <CardDescription>
            Configure battery charging and discharging thresholds
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="charge-limit">Upper Charge Limit: {chargingLimit}%</Label>
            </div>
            <Slider 
              id="charge-limit"
              min={50}
              max={100}
              step={5}
              value={[chargingLimit]} 
              onValueChange={handleChargingLimitChange}
              disabled={!isActive}
            />
            <p className="text-xs text-muted-foreground">
              Setting a lower upper limit can extend battery life
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="discharge-limit">Lower Discharge Limit: {dischargingLimit}%</Label>
            </div>
            <Slider 
              id="discharge-limit"
              min={5}
              max={50}
              step={5}
              value={[dischargingLimit]} 
              onValueChange={handleDischargingLimitChange}
              disabled={!isActive}
            />
            <p className="text-xs text-muted-foreground">
              Setting a higher lower limit can extend battery life
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-auto"
            disabled={!isActive}
            onClick={() => toast.success('Charge limits updated')}
          >
            Update Limits
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Advanced Settings</CardTitle>
          <CardDescription>
            Configure advanced battery parameters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="grid-charging">Allow Grid Charging</Label>
            <Switch id="grid-charging" disabled={!isActive} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="fast-charge">Fast Charging</Label>
            <Switch id="fast-charge" disabled={!isActive} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="thermal-management">Enhanced Thermal Management</Label>
            <Switch id="thermal-management" defaultChecked disabled={!isActive} />
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default BatterySettingsTab;
