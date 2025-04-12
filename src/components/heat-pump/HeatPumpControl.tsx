
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Flame, 
  Snowflake, 
  ThermometerSun, 
  Calendar, 
  Settings, 
  ZapOff, 
  Zap,
  CheckCircle,
  Timer,
  LineChart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { HeatPumpSettings } from '@/types/energy';
import { toast } from 'sonner';

interface HeatPumpControlProps {
  className?: string;
}

const HeatPumpControl: React.FC<HeatPumpControlProps> = ({ className }) => {
  // Sample data - would connect to a real API in production
  const [settings, setSettings] = useState<HeatPumpSettings>({
    mode: 'heating',
    target_temperature: 21,
    min_temperature: 18,
    max_temperature: 23,
    energy_priority: 'efficiency',
    schedule: [
      { 
        day: 'weekday', 
        start_time: '06:00', 
        end_time: '09:00', 
        target_temperature: 21 
      },
      { 
        day: 'weekday', 
        start_time: '16:00', 
        end_time: '22:00', 
        target_temperature: 21 
      },
      { 
        day: 'weekend', 
        start_time: '08:00', 
        end_time: '23:00', 
        target_temperature: 22 
      }
    ],
    boost_mode_enabled: false,
    boost_duration_minutes: 60
  });
  
  const [isUpdating, setIsUpdating] = useState(false);
  
  const handleModeChange = (mode: 'heating' | 'cooling' | 'auto' | 'off') => {
    setSettings(prev => ({ ...prev, mode }));
  };
  
  const handleTemperatureChange = (value: number[]) => {
    setSettings(prev => ({ ...prev, target_temperature: value[0] }));
  };
  
  const handlePriorityChange = (priority: 'comfort' | 'efficiency' | 'balanced') => {
    setSettings(prev => ({ ...prev, energy_priority: priority }));
  };
  
  const handleBoostModeToggle = (enabled: boolean) => {
    setSettings(prev => ({ ...prev, boost_mode_enabled: enabled }));
    if (enabled) {
      toast.info('Boost mode activated for 60 minutes');
    }
  };
  
  const saveSettings = async () => {
    setIsUpdating(true);
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Heat pump settings updated successfully');
    } catch (error) {
      toast.error('Failed to update heat pump settings');
      console.error('Error updating heat pump settings:', error);
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <Card className={cn("shadow-sm", className)}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Heat Pump Control</CardTitle>
            <CardDescription>Optimize heating and cooling for energy efficiency</CardDescription>
          </div>
          <Badge variant={settings.mode === 'off' ? 'outline' : 'default'}>
            {settings.mode === 'heating' && <Flame className="h-3 w-3 mr-1" />}
            {settings.mode === 'cooling' && <Snowflake className="h-3 w-3 mr-1" />}
            {settings.mode === 'auto' && <ThermometerSun className="h-3 w-3 mr-1" />}
            {settings.mode === 'off' && <ZapOff className="h-3 w-3 mr-1" />}
            {settings.mode.charAt(0).toUpperCase() + settings.mode.slice(1)} Mode
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="control" className="space-y-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="control">Control</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
          </TabsList>
          
          <TabsContent value="control" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Operating Mode</h3>
                <div className="grid grid-cols-4 gap-2">
                  <Button
                    variant={settings.mode === 'heating' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleModeChange('heating')}
                    className="flex gap-1 items-center justify-center"
                  >
                    <Flame className="h-4 w-4" />
                    Heat
                  </Button>
                  <Button
                    variant={settings.mode === 'cooling' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleModeChange('cooling')}
                    className="flex gap-1 items-center justify-center"
                  >
                    <Snowflake className="h-4 w-4" />
                    Cool
                  </Button>
                  <Button
                    variant={settings.mode === 'auto' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleModeChange('auto')}
                    className="flex gap-1 items-center justify-center"
                  >
                    <ThermometerSun className="h-4 w-4" />
                    Auto
                  </Button>
                  <Button
                    variant={settings.mode === 'off' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleModeChange('off')}
                    className="flex gap-1 items-center justify-center"
                  >
                    <ZapOff className="h-4 w-4" />
                    Off
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <h3 className="text-sm font-medium">Target Temperature</h3>
                  <span className="text-sm font-medium">{settings.target_temperature}°C</span>
                </div>
                <Slider
                  disabled={settings.mode === 'off'}
                  value={[settings.target_temperature]}
                  min={17}
                  max={26}
                  step={0.5}
                  onValueChange={handleTemperatureChange}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>17°C</span>
                  <span>26°C</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="boost-mode"
                    checked={settings.boost_mode_enabled}
                    onCheckedChange={handleBoostModeToggle}
                    disabled={settings.mode === 'off'}
                  />
                  <Label htmlFor="boost-mode">Boost Mode (60 min)</Label>
                </div>
                <Button 
                  onClick={saveSettings} 
                  disabled={isUpdating || settings.mode === 'off'}
                >
                  {isUpdating ? 'Updating...' : 'Save Settings'}
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="schedule" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Heating Schedule</h3>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-1" />
                Edit Schedule
              </Button>
            </div>
            
            <div className="space-y-3">
              {settings.schedule.map((scheduledTime, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 border rounded-md">
                  <div>
                    <Badge variant="outline" className="mb-1">
                      {scheduledTime.day === 'weekday' ? 'Mon-Fri' : 'Sat-Sun'}
                    </Badge>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1">
                        <Timer className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm">{scheduledTime.start_time} - {scheduledTime.end_time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ThermometerSun className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm">{scheduledTime.target_temperature}°C</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <Button variant="outline" className="w-full">
                + Add Schedule
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="efficiency" className="space-y-4">
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Energy Priority</h3>
              
              <RadioGroup 
                value={settings.energy_priority}
                onValueChange={(value) => handlePriorityChange(value as any)}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="efficiency" id="efficiency" />
                  <Label htmlFor="efficiency" className="font-medium">Efficiency First</Label>
                </div>
                <p className="text-xs text-muted-foreground ml-6 mb-3">
                  Optimize for energy efficiency and cost savings. May result in slightly slower temperature changes.
                </p>
                
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="comfort" id="comfort" />
                  <Label htmlFor="comfort" className="font-medium">Comfort First</Label>
                </div>
                <p className="text-xs text-muted-foreground ml-6 mb-3">
                  Prioritize comfort and rapid temperature adjustment. May use more energy.
                </p>
                
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="balanced" id="balanced" />
                  <Label htmlFor="balanced" className="font-medium">Balanced Mode</Label>
                </div>
                <p className="text-xs text-muted-foreground ml-6">
                  Balance between comfort and efficiency with moderate energy usage.
                </p>
              </RadioGroup>
            </div>
            
            <div className="mt-6 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Smart Energy Features</h3>
                <Button variant="ghost" size="sm" className="h-8">
                  <LineChart className="h-4 w-4 mr-1" />
                  Details
                </Button>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-900/10 rounded-md">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-green-700 dark:text-green-300">
                      Dynamic Rate Optimization
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400">
                      Your heat pump will run when electricity prices are lowest, saving an estimated 18% on energy costs.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-md">
                  <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      PV Self-Consumption Mode
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      Heat pump operation is synchronized with solar production to maximize self-consumption.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-md">
                  <CheckCircle className="h-4 w-4 text-slate-600 dark:text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Grid Protection §14a
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      System complies with §14a EnWG requirements for grid protection during high load periods.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default HeatPumpControl;
