
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Droplets, 
  RefreshCw, 
  Power, 
  PanelTop, 
  Wrench, 
  BarChart4,
  Shield,
  SunDim
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

interface SolarControlsProps {
  deviceId: string;
}

const SolarControls: React.FC<SolarControlsProps> = ({ deviceId }) => {
  const [isPanelsCleaning, setIsPanelsCleaning] = useState(false);
  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false);
  const [optimizationMode, setOptimizationMode] = useState('balanced');
  const [throttlePercentage, setThrottlePercentage] = useState(100);
  const [isActive, setIsActive] = useState(true);
  
  const handleCleanPanels = () => {
    setIsPanelsCleaning(true);
    toast.info('Starting solar panel cleaning sequence...');
    
    // Simulate cleaning process
    setTimeout(() => {
      setIsPanelsCleaning(false);
      toast.success('Solar panel cleaning complete');
    }, 3000);
  };
  
  const handleRunDiagnostics = () => {
    setIsRunningDiagnostics(true);
    toast.info('Running solar system diagnostics...');
    
    // Simulate diagnostics process
    setTimeout(() => {
      setIsRunningDiagnostics(false);
      toast.success('Diagnostics complete: System operating normally');
    }, 4000);
  };
  
  const handleThrottleChange = (value: number[]) => {
    const percentage = value[0];
    setThrottlePercentage(percentage);
    toast.info(`Output throttled to ${percentage}%`);
  };
  
  const handleActivationToggle = (checked: boolean) => {
    setIsActive(checked);
    toast.success(checked ? 'Solar system activated' : 'Solar system deactivated');
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
              System Power
            </CardTitle>
            <CardDescription>
              Control the overall operation of the solar system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="system-active">System Active</Label>
              <Switch 
                id="system-active" 
                checked={isActive} 
                onCheckedChange={handleActivationToggle}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="throttle">Output Throttle: {throttlePercentage}%</Label>
              </div>
              <Slider 
                id="throttle"
                min={0}
                max={100}
                step={5}
                value={[throttlePercentage]} 
                onValueChange={handleThrottleChange}
                disabled={!isActive}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-auto"
              disabled={!isActive}
              onClick={() => toast.success('Settings applied')}
            >
              Apply Settings
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <SunDim className="mr-2 h-5 w-5 text-primary" />
              Operation Mode
            </CardTitle>
            <CardDescription>
              Set the optimization strategy for the solar system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              <Button 
                variant={optimizationMode === 'maximum' ? 'default' : 'outline'}
                className="w-full"
                onClick={() => setOptimizationMode('maximum')}
                disabled={!isActive}
              >
                <BarChart4 className="h-4 w-4 mr-2" />
                Maximum
              </Button>
              <Button 
                variant={optimizationMode === 'balanced' ? 'default' : 'outline'}
                className="w-full"
                onClick={() => setOptimizationMode('balanced')}
                disabled={!isActive}
              >
                <Shield className="h-4 w-4 mr-2" />
                Balanced
              </Button>
              <Button 
                variant={optimizationMode === 'eco' ? 'default' : 'outline'}
                className="w-full"
                onClick={() => setOptimizationMode('eco')}
                disabled={!isActive}
              >
                <Droplets className="h-4 w-4 mr-2" />
                Eco
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="settings" className="space-y-4 mt-4">
        <Card>
          <CardHeader>
            <CardTitle>System Settings</CardTitle>
            <CardDescription>
              Configure advanced solar system parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="automatic-tracking">Automatic Tracking</Label>
              <Switch id="automatic-tracking" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="weather-adaptation">Weather Adaptation</Label>
              <Switch id="weather-adaptation" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="grid-export">Grid Export</Label>
              <Switch id="grid-export" defaultChecked />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-auto"
              onClick={() => toast.success('Advanced settings saved')}
            >
              Save Settings
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="maintenance" className="space-y-4 mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Maintenance Actions</CardTitle>
            <CardDescription>
              Perform maintenance tasks on the solar system
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={handleCleanPanels}
              disabled={isPanelsCleaning}
            >
              <PanelTop className="h-8 w-8" />
              <div className="text-center">
                <p className="font-medium">Clean Panels</p>
                <p className="text-xs text-muted-foreground">Run cleaning sequence</p>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={handleRunDiagnostics}
              disabled={isRunningDiagnostics}
            >
              <Wrench className="h-8 w-8" />
              <div className="text-center">
                <p className="font-medium">Diagnostics</p>
                <p className="text-xs text-muted-foreground">Run system check</p>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => toast.info('Calibrating inverter...')}
            >
              <RefreshCw className="h-8 w-8" />
              <div className="text-center">
                <p className="font-medium">Calibrate</p>
                <p className="text-xs text-muted-foreground">Calibrate inverter</p>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => toast.info('Checking for firmware updates...')}
            >
              <Shield className="h-8 w-8" />
              <div className="text-center">
                <p className="font-medium">Update</p>
                <p className="text-xs text-muted-foreground">Check for updates</p>
              </div>
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default SolarControls;
