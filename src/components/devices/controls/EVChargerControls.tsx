
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Activity,
  BatteryCharging,
  Calendar,
  Car,
  Clock,
  Power,
  Wallet
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
import { Progress } from '@/components/ui/progress';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface EVChargerControlsProps {
  deviceId: string;
}

const EVChargerControls: React.FC<EVChargerControlsProps> = ({ deviceId }) => {
  const [isCharging, setIsCharging] = useState(false);
  const [chargeRate, setChargeRate] = useState(22);
  const [chargeLimit, setChargeLimit] = useState(80);
  const [chargingMode, setChargingMode] = useState('standard');
  
  const handleStartCharging = () => {
    setIsCharging(true);
    toast.success('EV charging started');
  };
  
  const handleStopCharging = () => {
    setIsCharging(false);
    toast.info('EV charging stopped');
  };
  
  const handleChargeRateChange = (value: number[]) => {
    const rate = value[0];
    setChargeRate(rate);
    toast.info(`Charging rate set to ${rate} kW`);
  };
  
  const handleChargeLimitChange = (value: number[]) => {
    const limit = value[0];
    setChargeLimit(limit);
    toast.info(`Charging will stop at ${limit}%`);
  };
  
  return (
    <Tabs defaultValue="control">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="control">Control</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
        <TabsTrigger value="schedule">Schedule</TabsTrigger>
        <TabsTrigger value="payment">Payment</TabsTrigger>
      </TabsList>
      
      <TabsContent value="control" className="space-y-4 mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Car className="mr-2 h-5 w-5 text-primary" />
              EV Charging
            </CardTitle>
            <CardDescription>
              Control EV charging operations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid place-items-center py-2">
              {isCharging ? (
                <>
                  <BatteryCharging size={48} className="text-green-500 mb-2" />
                  <p className="text-green-500 font-medium">Charging in Progress</p>
                  <Progress value={45} className="w-full mt-2" />
                  <p className="text-sm text-muted-foreground mt-1">45% Charged • 2h 15m remaining</p>
                </>
              ) : (
                <>
                  <Car size={48} className="text-muted-foreground mb-2" />
                  <p className="font-medium">Ready to Charge</p>
                  <p className="text-sm text-muted-foreground mt-1">Connect vehicle to begin</p>
                </>
              )}
            </div>
            
            <div className="flex justify-center gap-4">
              {isCharging ? (
                <Button 
                  variant="destructive"
                  className="w-full"
                  onClick={handleStopCharging}
                >
                  <Power className="mr-2 h-4 w-4" />
                  Stop Charging
                </Button>
              ) : (
                <Button 
                  className="w-full"
                  onClick={handleStartCharging}
                >
                  <BatteryCharging className="mr-2 h-4 w-4" />
                  Start Charging
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BatteryCharging className="mr-2 h-5 w-5 text-primary" />
              Charging Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="charge-rate">Charging Rate: {chargeRate} kW</Label>
              </div>
              <Slider 
                id="charge-rate"
                min={3.7}
                max={22}
                step={3.7}
                value={[chargeRate]} 
                onValueChange={handleChargeRateChange}
              />
              <div className="grid grid-cols-3 text-xs text-muted-foreground">
                <div>Slow (3.7kW)</div>
                <div className="text-center">Medium (11kW)</div>
                <div className="text-right">Fast (22kW)</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="charge-limit">Charge Limit: {chargeLimit}%</Label>
              </div>
              <Slider 
                id="charge-limit"
                min={10}
                max={100}
                step={5}
                value={[chargeLimit]} 
                onValueChange={handleChargeLimitChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Charging Mode</Label>
              <Select
                value={chargingMode}
                onValueChange={(value) => {
                  setChargingMode(value);
                  toast.success(`Charging mode set to ${value}`);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select charging mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eco">Eco (Optimize for Cost)</SelectItem>
                  <SelectItem value="standard">Standard (Balanced)</SelectItem>
                  <SelectItem value="fast">Fast (Optimize for Speed)</SelectItem>
                  <SelectItem value="solar">Solar Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="settings" className="space-y-4 mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Advanced Settings</CardTitle>
            <CardDescription>
              Configure advanced EV charger parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Authentication Required</Label>
                <p className="text-xs text-muted-foreground">Require user authentication to charge</p>
              </div>
              <Switch id="auth-required" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Dynamic Load Balancing</Label>
                <p className="text-xs text-muted-foreground">Adjust charge rate based on total load</p>
              </div>
              <Switch id="load-balancing" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Smart Grid Integration</Label>
                <p className="text-xs text-muted-foreground">Allow grid to regulate charging</p>
              </div>
              <Switch id="smart-grid" />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Vehicle Preconditioning</Label>
                <p className="text-xs text-muted-foreground">Allow charger to warm up vehicle</p>
              </div>
              <Switch id="preconditioning" />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="ml-auto"
              onClick={() => toast.success('Settings saved')}
            >
              Save Settings
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="schedule" className="space-y-4 mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-primary" />
              Charging Schedule
            </CardTitle>
            <CardDescription>
              Set charging schedules and timers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Peak Avoidance</p>
                <p className="text-xs text-muted-foreground">Avoid charging during peak hours</p>
              </div>
              <Switch 
                id="peak-avoidance"
                defaultChecked
                onCheckedChange={(checked) => 
                  toast.info(checked ? "Peak avoidance enabled" : "Peak avoidance disabled")
                }
              />
            </div>
            
            <div className="space-y-4">
              <div className="border rounded-md p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-primary" />
                    <p className="font-medium">Weekday Schedule</p>
                  </div>
                  <Switch id="weekday-schedule" defaultChecked />
                </div>
                <p className="text-xs text-muted-foreground">Charge between 10:00 PM - 6:00 AM</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toast.info('Schedule editor will open here')}
                >
                  Edit Schedule
                </Button>
              </div>
              
              <div className="border rounded-md p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-primary" />
                    <p className="font-medium">Weekend Schedule</p>
                  </div>
                  <Switch id="weekend-schedule" />
                </div>
                <p className="text-xs text-muted-foreground">No schedule configured</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toast.info('Schedule editor will open here')}
                >
                  Add Schedule
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="ml-auto"
              onClick={() => toast.success('Schedule saved')}
            >
              Save Schedule
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="payment" className="space-y-4 mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wallet className="mr-2 h-5 w-5 text-primary" />
              Billing & Payment
            </CardTitle>
            <CardDescription>
              Manage charging costs and payment settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">Current Session</h3>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <div className="text-muted-foreground">Energy Used:</div>
                <div className="text-right">12.4 kWh</div>
                
                <div className="text-muted-foreground">Time Active:</div>
                <div className="text-right">1h 45m</div>
                
                <div className="text-muted-foreground">Rate:</div>
                <div className="text-right">$0.15/kWh</div>
                
                <div className="font-medium">Estimated Cost:</div>
                <div className="text-right font-medium">$1.86</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">Payment Methods</h3>
              <div className="border rounded-md p-3 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="bg-primary/10 p-2 rounded-md mr-3">
                    <Wallet size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Credit Card</p>
                    <p className="text-xs text-muted-foreground">VISA ending in 4242</p>
                  </div>
                </div>
                <div>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => toast.info('Payment method form will open here')}
              >
                Add Payment Method
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2">
            <p className="text-xs text-muted-foreground">
              You will be charged automatically at the end of each charging session.
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => toast.info('Viewing billing history...')}
            >
              View Billing History
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default EVChargerControls;
