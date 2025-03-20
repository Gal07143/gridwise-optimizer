
import React, { useState } from 'react';
import SettingsPageTemplate from '@/components/settings/SettingsPageTemplate';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  AlertOctagon, 
  Battery, 
  Zap, 
  Thermometer,
  BarChart4
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const ThresholdsSettings = () => {
  const [activeTab, setActiveTab] = useState('power');
  
  // Mock threshold values
  const [powerAlertThreshold, setPowerAlertThreshold] = useState(90);
  const [powerWarningThreshold, setPowerWarningThreshold] = useState(75);
  const [powerEnabled, setPowerEnabled] = useState(true);
  
  const [batteryMinThreshold, setBatteryMinThreshold] = useState(20);
  const [batteryMaxThreshold, setBatteryMaxThreshold] = useState(85);
  const [batteryEnabled, setBatteryEnabled] = useState(true);
  
  const [tempHighThreshold, setTempHighThreshold] = useState(40);
  const [tempLowThreshold, setTempLowThreshold] = useState(5);
  const [tempEnabled, setTempEnabled] = useState(true);
  
  const [consumptionPeakThreshold, setConsumptionPeakThreshold] = useState(15);
  const [consumptionEnabled, setConsumptionEnabled] = useState(true);
  
  const handleSaveThresholds = () => {
    toast.success("Threshold settings saved successfully");
  };
  
  return (
    <SettingsPageTemplate 
      title="Operational Thresholds" 
      description="Configure system thresholds and alert levels"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="mb-4">
          <TabsTrigger value="power">
            <Zap className="h-4 w-4 mr-2" />
            Power Thresholds
          </TabsTrigger>
          <TabsTrigger value="battery">
            <Battery className="h-4 w-4 mr-2" />
            Battery Thresholds
          </TabsTrigger>
          <TabsTrigger value="temperature">
            <Thermometer className="h-4 w-4 mr-2" />
            Temperature Thresholds
          </TabsTrigger>
          <TabsTrigger value="consumption">
            <BarChart4 className="h-4 w-4 mr-2" />
            Consumption Thresholds
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="power" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Power Thresholds</CardTitle>
                  <CardDescription>
                    Configure power threshold levels for alerts and warnings
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="power-enabled">Enabled</Label>
                  <Switch 
                    id="power-enabled" 
                    checked={powerEnabled} 
                    onCheckedChange={setPowerEnabled} 
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label htmlFor="power-alert">Alert Threshold (%)</Label>
                  <div className="flex items-center">
                    <AlertOctagon className="h-4 w-4 mr-1 text-red-500" />
                    <span>{powerAlertThreshold}%</span>
                  </div>
                </div>
                <Slider 
                  id="power-alert"
                  min={0} 
                  max={100} 
                  step={1} 
                  value={[powerAlertThreshold]} 
                  onValueChange={(value) => setPowerAlertThreshold(value[0])}
                  disabled={!powerEnabled}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">
                  Alert will be triggered when power utilization exceeds this threshold
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label htmlFor="power-warning">Warning Threshold (%)</Label>
                  <div className="flex items-center">
                    <AlertOctagon className="h-4 w-4 mr-1 text-amber-500" />
                    <span>{powerWarningThreshold}%</span>
                  </div>
                </div>
                <Slider 
                  id="power-warning"
                  min={0} 
                  max={100} 
                  step={1} 
                  value={[powerWarningThreshold]} 
                  onValueChange={(value) => setPowerWarningThreshold(value[0])}
                  disabled={!powerEnabled}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">
                  Warning will be issued when power utilization exceeds this threshold
                </p>
              </div>
              
              <Button 
                className="mt-4" 
                disabled={!powerEnabled}
                onClick={handleSaveThresholds}
              >
                Save Power Thresholds
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="battery" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Battery State of Charge Thresholds</CardTitle>
                  <CardDescription>
                    Configure minimum and maximum battery charge levels
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="battery-enabled">Enabled</Label>
                  <Switch 
                    id="battery-enabled" 
                    checked={batteryEnabled} 
                    onCheckedChange={setBatteryEnabled} 
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label htmlFor="battery-min">Minimum Charge Threshold (%)</Label>
                  <div className="flex items-center">
                    <Battery className="h-4 w-4 mr-1 text-red-500" />
                    <span>{batteryMinThreshold}%</span>
                  </div>
                </div>
                <Slider 
                  id="battery-min"
                  min={0} 
                  max={50} 
                  step={1} 
                  value={[batteryMinThreshold]} 
                  onValueChange={(value) => setBatteryMinThreshold(value[0])}
                  disabled={!batteryEnabled}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">
                  Alert will be triggered when battery charge falls below this threshold
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label htmlFor="battery-max">Maximum Charge Threshold (%)</Label>
                  <div className="flex items-center">
                    <Battery className="h-4 w-4 mr-1 text-green-500" />
                    <span>{batteryMaxThreshold}%</span>
                  </div>
                </div>
                <Slider 
                  id="battery-max"
                  min={50} 
                  max={100} 
                  step={1} 
                  value={[batteryMaxThreshold]} 
                  onValueChange={(value) => setBatteryMaxThreshold(value[0])}
                  disabled={!batteryEnabled}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">
                  System will limit charging when battery exceeds this threshold
                </p>
              </div>
              
              <Button 
                className="mt-4" 
                disabled={!batteryEnabled}
                onClick={handleSaveThresholds}
              >
                Save Battery Thresholds
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="temperature" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Temperature Thresholds</CardTitle>
                  <CardDescription>
                    Configure temperature threshold levels for system components
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="temp-enabled">Enabled</Label>
                  <Switch 
                    id="temp-enabled" 
                    checked={tempEnabled} 
                    onCheckedChange={setTempEnabled} 
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label htmlFor="temp-high">High Temperature Threshold (°C)</Label>
                  <div className="flex items-center">
                    <Thermometer className="h-4 w-4 mr-1 text-red-500" />
                    <span>{tempHighThreshold}°C</span>
                  </div>
                </div>
                <Slider 
                  id="temp-high"
                  min={20} 
                  max={60} 
                  step={1} 
                  value={[tempHighThreshold]} 
                  onValueChange={(value) => setTempHighThreshold(value[0])}
                  disabled={!tempEnabled}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">
                  Alert will be triggered when components exceed this temperature
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label htmlFor="temp-low">Low Temperature Threshold (°C)</Label>
                  <div className="flex items-center">
                    <Thermometer className="h-4 w-4 mr-1 text-blue-500" />
                    <span>{tempLowThreshold}°C</span>
                  </div>
                </div>
                <Slider 
                  id="temp-low"
                  min={-10} 
                  max={15} 
                  step={1} 
                  value={[tempLowThreshold]} 
                  onValueChange={(value) => setTempLowThreshold(value[0])}
                  disabled={!tempEnabled}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">
                  Alert will be triggered when components fall below this temperature
                </p>
              </div>
              
              <Button 
                className="mt-4" 
                disabled={!tempEnabled}
                onClick={handleSaveThresholds}
              >
                Save Temperature Thresholds
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="consumption" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Consumption Thresholds</CardTitle>
                  <CardDescription>
                    Configure energy consumption thresholds for peak load detection
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="consumption-enabled">Enabled</Label>
                  <Switch 
                    id="consumption-enabled" 
                    checked={consumptionEnabled} 
                    onCheckedChange={setConsumptionEnabled} 
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label htmlFor="consumption-peak">Peak Consumption Threshold (kW)</Label>
                  <div className="flex items-center">
                    <BarChart4 className="h-4 w-4 mr-1 text-amber-500" />
                    <span>{consumptionPeakThreshold} kW</span>
                  </div>
                </div>
                <Slider 
                  id="consumption-peak"
                  min={5} 
                  max={50} 
                  step={1} 
                  value={[consumptionPeakThreshold]} 
                  onValueChange={(value) => setConsumptionPeakThreshold(value[0])}
                  disabled={!consumptionEnabled}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">
                  System will detect peak demand when consumption exceeds this threshold
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="peak-duration">Peak Duration (minutes)</Label>
                  <Input 
                    id="peak-duration" 
                    type="number" 
                    defaultValue="15"
                    min="1" 
                    max="60"
                    disabled={!consumptionEnabled}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="peak-action">Action on Peak</Label>
                  <Input 
                    id="peak-action" 
                    defaultValue="Notify"
                    disabled={!consumptionEnabled}
                  />
                </div>
              </div>
              
              <Button 
                className="mt-4" 
                disabled={!consumptionEnabled}
                onClick={handleSaveThresholds}
              >
                Save Consumption Thresholds
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </SettingsPageTemplate>
  );
};

export default ThresholdsSettings;
