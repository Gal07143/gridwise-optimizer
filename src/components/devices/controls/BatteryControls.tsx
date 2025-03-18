
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Activity,
  Battery, 
  BatteryCharging, 
  BatteryFull, 
  BatteryLow,
  RefreshCw, 
  Power, 
  Shield, 
  ZapOff,
  Zap
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
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface BatteryControlsProps {
  deviceId: string;
}

const BatteryControls: React.FC<BatteryControlsProps> = ({ deviceId }) => {
  const [chargingLimit, setChargingLimit] = useState(85);
  const [dischargingLimit, setDischargingLimit] = useState(20);
  const [operatingMode, setOperatingMode] = useState('normal');
  const [isActive, setIsActive] = useState(true);
  const [isCharging, setIsCharging] = useState(true);
  const [isForceCharging, setIsForceCharging] = useState(false);
  const [isForcedDischarging, setIsForcedDischarging] = useState(false);
  
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
  
  const handleBalanceCells = () => {
    toast.info('Starting cell balancing procedure...');
    setTimeout(() => {
      toast.success('Cell balancing complete');
    }, 3000);
  };
  
  return (
    <Tabs defaultValue="control">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="control">Control</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
        <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
      </TabsList>
      
      <TabsContent value="control" className="space-y-4 mt-4">
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
            
            {operatingMode === 'normal' && (
              <p className="text-sm text-muted-foreground">
                Standard operation with balanced charging and discharging.
              </p>
            )}
            
            {operatingMode === 'eco' && (
              <p className="text-sm text-muted-foreground">
                Optimizes charging to use excess solar energy and minimize grid usage.
              </p>
            )}
            
            {operatingMode === 'backup' && (
              <p className="text-sm text-muted-foreground">
                Maintains a high charge level to ensure backup power is available.
              </p>
            )}
            
            {operatingMode === 'peak' && (
              <p className="text-sm text-muted-foreground">
                Discharges during peak rate periods to minimize electricity costs.
              </p>
            )}
            
            {operatingMode === 'grid' && (
              <p className="text-sm text-muted-foreground">
                Optimizes for grid stability and response to grid signals.
              </p>
            )}
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
      </TabsContent>
      
      <TabsContent value="settings" className="space-y-4 mt-4">
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
      </TabsContent>
      
      <TabsContent value="maintenance" className="space-y-4 mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Maintenance Actions</CardTitle>
            <CardDescription>
              Perform maintenance tasks on the battery system
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={handleBalanceCells}
              disabled={!isActive}
            >
              <BatteryFull className="h-8 w-8" />
              <div className="text-center">
                <p className="font-medium">Balance Cells</p>
                <p className="text-xs text-muted-foreground">Equalize cell charge</p>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => toast.info('Running battery diagnostics...')}
              disabled={!isActive}
            >
              <Activity className="h-8 w-8" />
              <div className="text-center">
                <p className="font-medium">Diagnostics</p>
                <p className="text-xs text-muted-foreground">Check battery health</p>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => toast.info('Checking for firmware updates...')}
              disabled={!isActive}
            >
              <Shield className="h-8 w-8" />
              <div className="text-center">
                <p className="font-medium">Update</p>
                <p className="text-xs text-muted-foreground">Check for updates</p>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => toast.info('Resetting battery management system...')}
              disabled={!isActive}
            >
              <RefreshCw className="h-8 w-8" />
              <div className="text-center">
                <p className="font-medium">Reset BMS</p>
                <p className="text-xs text-muted-foreground">Battery Management</p>
              </div>
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default BatteryControls;
