
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Activity,
  Power,
  Clock,
  BarChart3,
  Calendar
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

interface LoadControlsProps {
  deviceId: string;
}

const LoadControls: React.FC<LoadControlsProps> = ({ deviceId }) => {
  return (
    <Tabs defaultValue="control">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="control">Control</TabsTrigger>
        <TabsTrigger value="schedule">Schedule</TabsTrigger>
        <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
      </TabsList>
      
      <TabsContent value="control" className="space-y-4 mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Power className="mr-2 h-5 w-5 text-primary" />
              Load Control
            </CardTitle>
            <CardDescription>
              Control load operation and power consumption
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="load-active">Load Enabled</Label>
              <Switch 
                id="load-active" 
                defaultChecked 
                onCheckedChange={(checked) => 
                  toast.success(checked ? "Load enabled" : "Load disabled")
                }
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="max-power">Maximum Power: 5.5 kW</Label>
              </div>
              <Slider 
                id="max-power"
                min={1}
                max={10}
                step={0.5}
                defaultValue={[5.5]}
                onValueChange={(value) => toast.info(`Maximum power set to ${value[0]} kW`)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="eco-mode">Eco Mode</Label>
              <Switch 
                id="eco-mode" 
                onCheckedChange={(checked) => 
                  toast.info(checked ? "Eco mode enabled" : "Eco mode disabled")
                }
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="ml-auto"
              onClick={() => toast.success('Load settings applied')}
            >
              Apply
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="schedule" className="space-y-4 mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-primary" />
              Operation Schedule
            </CardTitle>
            <CardDescription>
              Set operation schedules for the load
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Weekday Schedule</p>
                  <p className="text-xs text-muted-foreground">8:00 AM - 6:00 PM</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toast.info('Weekday schedule editor will open here')}
                >
                  Edit
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Weekend Schedule</p>
                  <p className="text-xs text-muted-foreground">10:00 AM - 4:00 PM</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toast.info('Weekend schedule editor will open here')}
                >
                  Edit
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Holiday Schedule</p>
                  <p className="text-xs text-muted-foreground">Disabled</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toast.info('Holiday schedule editor will open here')}
                >
                  Edit
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="ml-auto"
              onClick={() => toast.success('Schedules saved')}
            >
              Save All Schedules
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="monitoring" className="space-y-4 mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5 text-primary" />
              Load Monitoring
            </CardTitle>
            <CardDescription>
              Monitor load usage and performance
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => toast.info('Generating load profile report...')}
            >
              <BarChart3 className="h-8 w-8" />
              <div className="text-center">
                <p className="font-medium">Usage Report</p>
                <p className="text-xs text-muted-foreground">Generate usage profile</p>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => toast.info('Checking efficiency metrics...')}
            >
              <Activity className="h-8 w-8" />
              <div className="text-center">
                <p className="font-medium">Efficiency</p>
                <p className="text-xs text-muted-foreground">Check power efficiency</p>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => toast.info('Setting up power alerts...')}
            >
              <Power className="h-8 w-8" />
              <div className="text-center">
                <p className="font-medium">Power Alerts</p>
                <p className="text-xs text-muted-foreground">Configure notifications</p>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => toast.info('Checking historical usage...')}
            >
              <Clock className="h-8 w-8" />
              <div className="text-center">
                <p className="font-medium">History</p>
                <p className="text-xs text-muted-foreground">View historical data</p>
              </div>
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default LoadControls;
