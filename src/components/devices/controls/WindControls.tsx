
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Activity,
  Wind,
  ArrowUpDown,
  RotateCw,
  Wrench,
  Power
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

interface WindControlsProps {
  deviceId: string;
}

const WindControls: React.FC<WindControlsProps> = ({ deviceId }) => {
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
              Turbine Control
            </CardTitle>
            <CardDescription>
              Control wind turbine operation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="turbine-active">Turbine Active</Label>
              <Switch 
                id="turbine-active" 
                defaultChecked 
                onCheckedChange={(checked) => 
                  toast.success(checked ? "Turbine activated" : "Turbine deactivated")
                }
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="pitch-angle">Blade Pitch Angle</Label>
                <span>15°</span>
              </div>
              <Slider 
                id="pitch-angle"
                min={0}
                max={30}
                step={1}
                defaultValue={[15]}
                onValueChange={(value) => toast.info(`Blade pitch set to ${value[0]}°`)}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="max-rpm">Maximum RPM</Label>
                <span>1200 RPM</span>
              </div>
              <Slider 
                id="max-rpm"
                min={800}
                max={1500}
                step={50}
                defaultValue={[1200]}
                onValueChange={(value) => toast.info(`Max RPM set to ${value[0]}`)}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="settings" className="space-y-4 mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Operation Settings</CardTitle>
            <CardDescription>
              Configure wind turbine operation parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-yaw">Automatic Yaw Control</Label>
              <Switch id="auto-yaw" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-brake">Automatic Braking</Label>
              <Switch id="auto-brake" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="storm-protection">Storm Protection Mode</Label>
              <Switch id="storm-protection" defaultChecked />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-auto"
              onClick={() => toast.success('Settings saved')}
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
              Perform maintenance tasks on the wind turbine
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => toast.info('Running diagnostics...')}
            >
              <Activity className="h-8 w-8" />
              <div className="text-center">
                <p className="font-medium">Diagnostics</p>
                <p className="text-xs text-muted-foreground">Check turbine health</p>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => toast.info('Brake test in progress...')}
            >
              <ArrowUpDown className="h-8 w-8" />
              <div className="text-center">
                <p className="font-medium">Brake Test</p>
                <p className="text-xs text-muted-foreground">Test emergency brake</p>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => toast.info('Starting yaw calibration...')}
            >
              <RotateCw className="h-8 w-8" />
              <div className="text-center">
                <p className="font-medium">Calibrate Yaw</p>
                <p className="text-xs text-muted-foreground">Align with wind direction</p>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => toast.info('Checking for updates...')}
            >
              <Wrench className="h-8 w-8" />
              <div className="text-center">
                <p className="font-medium">Update</p>
                <p className="text-xs text-muted-foreground">Check for firmware updates</p>
              </div>
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default WindControls;
