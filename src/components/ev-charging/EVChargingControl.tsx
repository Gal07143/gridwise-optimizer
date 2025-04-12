
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Battery, 
  BatteryCharging, 
  Car, 
  Clock, 
  LineChart, 
  Plug, 
  Sun, 
  Timer, 
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { EVChargingSettings } from '@/types/energy';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

interface EVChargingControlProps {
  className?: string;
}

const EVChargingControl: React.FC<EVChargingControlProps> = ({ className }) => {
  // Sample data - would be replaced with real API data
  const [settings, setSettings] = useState<EVChargingSettings>({
    charging_strategy: 'smart',
    min_soc: 20,
    target_soc: 80,
    max_power: 11,
    ready_by_time: '07:30',
    price_threshold: 0.25,
    use_solar_surplus: true,
    priority_over_home_battery: false
  });
  
  const [currentSOC, setCurrentSOC] = useState(42);
  const [isCharging, setIsCharging] = useState(true);
  const [chargingPower, setChargingPower] = useState(7.4);
  const [timeToTarget, setTimeToTarget] = useState('3:15');
  const [isUpdating, setIsUpdating] = useState(false);
  
  const handleStrategyChange = (strategy: 'immediate' | 'scheduled' | 'dynamic' | 'smart') => {
    setSettings(prev => ({ ...prev, charging_strategy: strategy }));
  };
  
  const handleTargetSOCChange = (value: number[]) => {
    setSettings(prev => ({ ...prev, target_soc: value[0] }));
  };
  
  const handleMaxPowerChange = (value: string) => {
    setSettings(prev => ({ ...prev, max_power: parseFloat(value) }));
  };
  
  const handleSolarSurplusToggle = (checked: boolean) => {
    setSettings(prev => ({ ...prev, use_solar_surplus: checked }));
  };
  
  const handleChargingToggle = (checked: boolean) => {
    setIsCharging(checked);
    if (checked) {
      toast.success('Charging started');
    } else {
      toast.info('Charging paused');
    }
  };
  
  const saveSettings = async () => {
    setIsUpdating(true);
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Charging settings updated successfully');
    } catch (error) {
      toast.error('Failed to update charging settings');
      console.error('Error updating charging settings:', error);
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <Card className={cn("shadow-sm", className)}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">EV Charging Control</CardTitle>
            <CardDescription>Smart charging optimization for your electric vehicle</CardDescription>
          </div>
          <Badge variant={isCharging ? 'default' : 'outline'}>
            {isCharging ? (
              <>
                <BatteryCharging className="h-3 w-3 mr-1" />
                Charging ({chargingPower} kW)
              </>
            ) : (
              <>
                <Battery className="h-3 w-3 mr-1" />
                Idle
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Car className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium">Tesla Model 3</h3>
                <p className="text-xs text-muted-foreground">Connected via Home Charger</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="charging-enabled"
                checked={isCharging}
                onCheckedChange={handleChargingToggle}
              />
              <Label htmlFor="charging-enabled">Charging</Label>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Battery Status</h3>
              <span className="text-sm">{currentSOC}% of {settings.target_soc}%</span>
            </div>
            
            <div className="h-8 relative">
              <Progress value={currentSOC} max={100} className="h-8" />
              <div className="absolute top-0 h-8 border-r-2 border-dashed border-black/60 dark:border-white/60" 
                   style={{ left: `${settings.target_soc}%` }} />
            </div>
            
            <div className="flex justify-between text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <Battery className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">Current: {currentSOC}%</span>
                </div>
              </div>
              
              {isCharging && (
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">Time to {settings.target_soc}%: {timeToTarget}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Charging Strategy</h3>
            
            <RadioGroup 
              value={settings.charging_strategy}
              onValueChange={(value) => handleStrategyChange(value as any)}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              <div className={cn(
                "flex items-start space-x-3 p-3 rounded-md",
                settings.charging_strategy === 'immediate' ? "bg-blue-50 dark:bg-blue-900/10" : "border"
              )}>
                <RadioGroupItem value="immediate" id="immediate" className="mt-1" />
                <div className="space-y-1">
                  <Label htmlFor="immediate" className="font-medium">Immediate Charging</Label>
                  <p className="text-xs text-muted-foreground">
                    Charge at maximum rate until target is reached
                  </p>
                </div>
              </div>
              
              <div className={cn(
                "flex items-start space-x-3 p-3 rounded-md",
                settings.charging_strategy === 'scheduled' ? "bg-blue-50 dark:bg-blue-900/10" : "border"
              )}>
                <RadioGroupItem value="scheduled" id="scheduled" className="mt-1" />
                <div className="space-y-1">
                  <Label htmlFor="scheduled" className="font-medium">Schedule Charging</Label>
                  <p className="text-xs text-muted-foreground">
                    Set specific time to start/stop charging
                  </p>
                </div>
              </div>
              
              <div className={cn(
                "flex items-start space-x-3 p-3 rounded-md",
                settings.charging_strategy === 'dynamic' ? "bg-blue-50 dark:bg-blue-900/10" : "border"
              )}>
                <RadioGroupItem value="dynamic" id="dynamic" className="mt-1" />
                <div className="space-y-1">
                  <Label htmlFor="dynamic" className="font-medium">Dynamic Pricing</Label>
                  <p className="text-xs text-muted-foreground">
                    Charge when electricity prices are lowest
                  </p>
                </div>
              </div>
              
              <div className={cn(
                "flex items-start space-x-3 p-3 rounded-md",
                settings.charging_strategy === 'smart' ? "bg-blue-50 dark:bg-blue-900/10" : "border"
              )}>
                <RadioGroupItem value="smart" id="smart" className="mt-1" />
                <div className="space-y-1">
                  <Label htmlFor="smart" className="font-medium">Smart Optimization</Label>
                  <p className="text-xs text-muted-foreground">
                    AI-based charging considering multiple factors
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label htmlFor="target-soc" className="text-sm font-medium">Target SOC</Label>
                <span className="text-sm">{settings.target_soc}%</span>
              </div>
              <Slider
                id="target-soc"
                value={[settings.target_soc]}
                min={20}
                max={100}
                step={5}
                onValueChange={handleTargetSOCChange}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>20%</span>
                <span>100%</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="max-power" className="text-sm font-medium">Max Charging Power</Label>
              <Select value={settings.max_power.toString()} onValueChange={handleMaxPowerChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select charging power" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3.7">3.7 kW (16A)</SelectItem>
                  <SelectItem value="7.4">7.4 kW (32A)</SelectItem>
                  <SelectItem value="11">11 kW (16A 3-phase)</SelectItem>
                  <SelectItem value="22">22 kW (32A 3-phase)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {settings.charging_strategy === 'scheduled' && (
              <div className="space-y-3">
                <Label htmlFor="ready-time" className="text-sm font-medium">Ready By Time</Label>
                <div className="flex items-center gap-2">
                  <Timer className="h-4 w-4 text-muted-foreground" />
                  <input 
                    type="time" 
                    value={settings.ready_by_time}
                    onChange={(e) => setSettings(prev => ({ ...prev, ready_by_time: e.target.value }))}
                    className="border rounded-md px-3 py-1.5"
                  />
                </div>
              </div>
            )}
            
            {(settings.charging_strategy === 'dynamic' || settings.charging_strategy === 'smart') && (
              <div className="space-y-3">
                <Label htmlFor="price-threshold" className="text-sm font-medium">Price Threshold</Label>
                <div className="flex items-center gap-2">
                  <LineChart className="h-4 w-4 text-muted-foreground" />
                  <input 
                    type="number" 
                    value={settings.price_threshold}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      price_threshold: parseFloat(e.target.value) 
                    }))}
                    step="0.01"
                    min="0"
                    className="border rounded-md px-3 py-1.5 w-full"
                  />
                  <span className="text-sm">€/kWh</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="solar-surplus"
                  checked={settings.use_solar_surplus}
                  onCheckedChange={handleSolarSurplusToggle}
                />
                <div className="space-y-0.5">
                  <Label htmlFor="solar-surplus">
                    <div className="flex items-center">
                      <Sun className="h-3.5 w-3.5 mr-1 text-yellow-500" />
                      Use Solar Surplus
                    </div>
                  </Label>
                  <p className="text-xs text-muted-foreground">Prioritize charging with excess solar</p>
                </div>
              </div>
            </div>
            
            <Button onClick={saveSettings} disabled={isUpdating}>
              {isUpdating ? 'Updating...' : 'Save Settings'}
            </Button>
          </div>
          
          {settings.charging_strategy === 'smart' && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-md">
              <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center gap-1">
                <Zap className="h-4 w-4" /> Smart Charging Active
              </h4>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                Your EV will charge based on solar production, electricity prices, and scheduled departure time.
                Estimated savings: €5.20 compared to immediate charging.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EVChargingControl;
