
import React, { useState } from 'react';
import SettingsPageTemplate from '@/components/settings/SettingsPageTemplate';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { AlertTriangle, Battery, Gauge, Lightning, Zap, ThermometerSun } from 'lucide-react';

const ThresholdsSettings = () => {
  const [voltageThresholds, setVoltageThresholds] = useState({
    minVoltage: 210,
    maxVoltage: 245,
    alertEnabled: true
  });
  
  const [frequencyThresholds, setFrequencyThresholds] = useState({
    minFrequency: 49.5,
    maxFrequency: 50.5,
    alertEnabled: true
  });
  
  const [temperatureThresholds, setTemperatureThresholds] = useState({
    maxTemperature: 75,
    criticalTemperature: 85,
    alertEnabled: true
  });

  const [batteryThresholds, setBatteryThresholds] = useState({
    minStateOfCharge: 20,
    criticalStateOfCharge: 10,
    maxChargeRate: 80,
    alertEnabled: true
  });

  const [powerThresholds, setPowerThresholds] = useState({
    maxPowerImport: 15,
    maxPowerExport: 10,
    peakShavingThreshold: 12,
    alertEnabled: true
  });

  const handleSave = () => {
    // In a real application, you would save these values to the database
    toast.success("Operational thresholds saved successfully");
  };

  return (
    <SettingsPageTemplate 
      title="Operational Thresholds" 
      description="Configure system operational parameters and alerts"
      headerIcon={<Gauge size={24} />}
    >
      <Tabs defaultValue="voltage" className="w-full">
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="voltage">Voltage</TabsTrigger>
          <TabsTrigger value="frequency">Frequency</TabsTrigger>
          <TabsTrigger value="temperature">Temperature</TabsTrigger>
          <TabsTrigger value="battery">Battery</TabsTrigger>
          <TabsTrigger value="power">Power</TabsTrigger>
        </TabsList>
        
        <TabsContent value="voltage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightning className="mr-2 h-5 w-5 text-primary" />
                Voltage Thresholds
              </CardTitle>
              <CardDescription>
                Configure voltage thresholds for system operation and alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="min-voltage">Minimum Voltage (V): {voltageThresholds.minVoltage}</Label>
                </div>
                <Slider 
                  id="min-voltage" 
                  min={180} 
                  max={220} 
                  step={1} 
                  value={[voltageThresholds.minVoltage]}
                  onValueChange={(value) => setVoltageThresholds({...voltageThresholds, minVoltage: value[0]})}
                />
                <p className="text-xs text-muted-foreground">
                  System will alert if voltage drops below this threshold
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="max-voltage">Maximum Voltage (V): {voltageThresholds.maxVoltage}</Label>
                </div>
                <Slider 
                  id="max-voltage" 
                  min={230} 
                  max={260} 
                  step={1} 
                  value={[voltageThresholds.maxVoltage]}
                  onValueChange={(value) => setVoltageThresholds({...voltageThresholds, maxVoltage: value[0]})}
                />
                <p className="text-xs text-muted-foreground">
                  System will alert if voltage exceeds this threshold
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="voltage-alerts">Voltage Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable alerts for voltage threshold violations
                  </p>
                </div>
                <Switch 
                  id="voltage-alerts" 
                  checked={voltageThresholds.alertEnabled}
                  onCheckedChange={(checked) => setVoltageThresholds({...voltageThresholds, alertEnabled: checked})}
                />
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex items-center text-amber-600 text-sm">
                <AlertTriangle className="h-4 w-4 mr-2" />
                <span>Voltage thresholds should comply with local grid regulations</span>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="frequency" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Gauge className="mr-2 h-5 w-5 text-primary" />
                Frequency Thresholds
              </CardTitle>
              <CardDescription>
                Configure frequency thresholds for system operation and alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="min-frequency">Minimum Frequency (Hz): {frequencyThresholds.minFrequency}</Label>
                </div>
                <Slider 
                  id="min-frequency" 
                  min={45} 
                  max={50} 
                  step={0.1} 
                  value={[frequencyThresholds.minFrequency]}
                  onValueChange={(value) => setFrequencyThresholds({...frequencyThresholds, minFrequency: value[0]})}
                />
                <p className="text-xs text-muted-foreground">
                  System will alert if frequency drops below this threshold
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="max-frequency">Maximum Frequency (Hz): {frequencyThresholds.maxFrequency}</Label>
                </div>
                <Slider 
                  id="max-frequency" 
                  min={50} 
                  max={55} 
                  step={0.1} 
                  value={[frequencyThresholds.maxFrequency]}
                  onValueChange={(value) => setFrequencyThresholds({...frequencyThresholds, maxFrequency: value[0]})}
                />
                <p className="text-xs text-muted-foreground">
                  System will alert if frequency exceeds this threshold
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="frequency-alerts">Frequency Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable alerts for frequency threshold violations
                  </p>
                </div>
                <Switch 
                  id="frequency-alerts" 
                  checked={frequencyThresholds.alertEnabled}
                  onCheckedChange={(checked) => setFrequencyThresholds({...frequencyThresholds, alertEnabled: checked})}
                />
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex items-center text-amber-600 text-sm">
                <AlertTriangle className="h-4 w-4 mr-2" />
                <span>Frequency thresholds should comply with local grid regulations</span>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="temperature" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ThermometerSun className="mr-2 h-5 w-5 text-primary" />
                Temperature Thresholds
              </CardTitle>
              <CardDescription>
                Configure temperature thresholds for system operation and alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="max-temperature">Maximum Temperature (°C): {temperatureThresholds.maxTemperature}</Label>
                </div>
                <Slider 
                  id="max-temperature" 
                  min={50} 
                  max={90} 
                  step={1} 
                  value={[temperatureThresholds.maxTemperature]}
                  onValueChange={(value) => setTemperatureThresholds({...temperatureThresholds, maxTemperature: value[0]})}
                />
                <p className="text-xs text-muted-foreground">
                  System will throttle if temperature exceeds this threshold
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="critical-temperature">Critical Temperature (°C): {temperatureThresholds.criticalTemperature}</Label>
                </div>
                <Slider 
                  id="critical-temperature" 
                  min={75} 
                  max={100} 
                  step={1} 
                  value={[temperatureThresholds.criticalTemperature]}
                  onValueChange={(value) => setTemperatureThresholds({...temperatureThresholds, criticalTemperature: value[0]})}
                />
                <p className="text-xs text-muted-foreground">
                  System will shut down if temperature exceeds this threshold
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="temperature-alerts">Temperature Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable alerts for temperature threshold violations
                  </p>
                </div>
                <Switch 
                  id="temperature-alerts" 
                  checked={temperatureThresholds.alertEnabled}
                  onCheckedChange={(checked) => setTemperatureThresholds({...temperatureThresholds, alertEnabled: checked})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="battery" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Battery className="mr-2 h-5 w-5 text-primary" />
                Battery Thresholds
              </CardTitle>
              <CardDescription>
                Configure battery operation thresholds and protection parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="min-soc">Minimum State of Charge (%): {batteryThresholds.minStateOfCharge}</Label>
                </div>
                <Slider 
                  id="min-soc" 
                  min={5} 
                  max={40} 
                  step={1} 
                  value={[batteryThresholds.minStateOfCharge]}
                  onValueChange={(value) => setBatteryThresholds({...batteryThresholds, minStateOfCharge: value[0]})}
                />
                <p className="text-xs text-muted-foreground">
                  System will limit discharge when SoC drops below this threshold
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="critical-soc">Critical State of Charge (%): {batteryThresholds.criticalStateOfCharge}</Label>
                </div>
                <Slider 
                  id="critical-soc" 
                  min={1} 
                  max={20} 
                  step={1} 
                  value={[batteryThresholds.criticalStateOfCharge]}
                  onValueChange={(value) => setBatteryThresholds({...batteryThresholds, criticalStateOfCharge: value[0]})}
                />
                <p className="text-xs text-muted-foreground">
                  System will disable battery discharge below this threshold
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="max-charge-rate">Maximum Charge Rate (%): {batteryThresholds.maxChargeRate}</Label>
                </div>
                <Slider 
                  id="max-charge-rate" 
                  min={50} 
                  max={100} 
                  step={5} 
                  value={[batteryThresholds.maxChargeRate]}
                  onValueChange={(value) => setBatteryThresholds({...batteryThresholds, maxChargeRate: value[0]})}
                />
                <p className="text-xs text-muted-foreground">
                  Maximum charging rate as percentage of rated power
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="battery-alerts">Battery Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable alerts for battery threshold violations
                  </p>
                </div>
                <Switch 
                  id="battery-alerts" 
                  checked={batteryThresholds.alertEnabled}
                  onCheckedChange={(checked) => setBatteryThresholds({...batteryThresholds, alertEnabled: checked})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="power" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="mr-2 h-5 w-5 text-primary" />
                Power Thresholds
              </CardTitle>
              <CardDescription>
                Configure power flow thresholds for grid import/export
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="max-import">Maximum Grid Import (kW): {powerThresholds.maxPowerImport}</Label>
                </div>
                <Slider 
                  id="max-import" 
                  min={5} 
                  max={50} 
                  step={1} 
                  value={[powerThresholds.maxPowerImport]}
                  onValueChange={(value) => setPowerThresholds({...powerThresholds, maxPowerImport: value[0]})}
                />
                <p className="text-xs text-muted-foreground">
                  Maximum power import from grid
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="max-export">Maximum Grid Export (kW): {powerThresholds.maxPowerExport}</Label>
                </div>
                <Slider 
                  id="max-export" 
                  min={0} 
                  max={40} 
                  step={1} 
                  value={[powerThresholds.maxPowerExport]}
                  onValueChange={(value) => setPowerThresholds({...powerThresholds, maxPowerExport: value[0]})}
                />
                <p className="text-xs text-muted-foreground">
                  Maximum power export to grid
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="peak-shaving">Peak Shaving Threshold (kW): {powerThresholds.peakShavingThreshold}</Label>
                </div>
                <Slider 
                  id="peak-shaving" 
                  min={5} 
                  max={30} 
                  step={1} 
                  value={[powerThresholds.peakShavingThreshold]}
                  onValueChange={(value) => setPowerThresholds({...powerThresholds, peakShavingThreshold: value[0]})}
                />
                <p className="text-xs text-muted-foreground">
                  Grid import level at which peak shaving is activated
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="power-alerts">Power Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable alerts for power threshold violations
                  </p>
                </div>
                <Switch 
                  id="power-alerts" 
                  checked={powerThresholds.alertEnabled}
                  onCheckedChange={(checked) => setPowerThresholds({...powerThresholds, alertEnabled: checked})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end mt-8">
        <Button onClick={handleSave}>Save Thresholds</Button>
      </div>
    </SettingsPageTemplate>
  );
};

export default ThresholdsSettings;
