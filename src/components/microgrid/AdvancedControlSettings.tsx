
import React from 'react';
import { Settings, Save } from 'lucide-react';
import { ControlSettings } from './types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';

interface AdvancedControlSettingsProps {
  settings: ControlSettings;
  onSettingsChange: (setting: keyof ControlSettings, value: any) => void;
  onSaveSettings: () => void;
}

const AdvancedControlSettings: React.FC<AdvancedControlSettingsProps> = ({
  settings,
  onSettingsChange,
  onSaveSettings
}) => {
  return (
    <Card>
      <CardHeader className="bg-primary/5">
        <CardTitle className="flex items-center text-lg">
          <Settings className="mr-2 h-5 w-5 text-primary" />
          Advanced Control Settings
        </CardTitle>
        <CardDescription>
          Configure optimization parameters and thresholds
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="self-consumption" className="text-base font-medium">Prioritize Self-Consumption</Label>
              <p className="text-sm text-muted-foreground mt-1">Use local power before importing from grid</p>
            </div>
            <Switch 
              id="self-consumption" 
              checked={settings.prioritizeSelfConsumption}
              onCheckedChange={(value) => onSettingsChange('prioritizeSelfConsumption', value)}
            />
          </div>
          
          <Separator />
          
          <div>
            <div className="flex justify-between mb-2">
              <Label htmlFor="export-limit" className="text-base font-medium">Grid Export Limit</Label>
              <span>{settings.gridExportLimit} kW</span>
            </div>
            <Slider 
              id="export-limit"
              min={0}
              max={50}
              step={1}
              value={[settings.gridExportLimit]}
              onValueChange={(value) => onSettingsChange('gridExportLimit', value[0])}
            />
            <p className="text-sm text-muted-foreground mt-2">
              Maximum power allowed to be exported to the grid
            </p>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="peak-shaving" className="text-base font-medium">Peak Shaving</Label>
              <p className="text-sm text-muted-foreground mt-1">Reduce peak grid consumption</p>
            </div>
            <Switch 
              id="peak-shaving" 
              checked={settings.peakShavingEnabled}
              onCheckedChange={(value) => onSettingsChange('peakShavingEnabled', value)}
            />
          </div>
          
          {settings.peakShavingEnabled && (
            <div>
              <div className="flex justify-between mb-2">
                <Label htmlFor="peak-threshold" className="text-base font-medium">Peak Threshold</Label>
                <span>{settings.peakShavingThreshold} kW</span>
              </div>
              <Slider 
                id="peak-threshold"
                min={5}
                max={30}
                step={1}
                value={[settings.peakShavingThreshold]}
                onValueChange={(value) => onSettingsChange('peakShavingThreshold', value[0])}
              />
            </div>
          )}
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="economic-optimization" className="text-base font-medium">Economic Optimization</Label>
              <p className="text-sm text-muted-foreground mt-1">Optimize for electricity cost savings</p>
            </div>
            <Switch 
              id="economic-optimization" 
              checked={settings.economicOptimizationEnabled}
              onCheckedChange={(value) => onSettingsChange('economicOptimizationEnabled', value)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="weather-predictive" className="text-base font-medium">Weather Predictive Control</Label>
              <p className="text-sm text-muted-foreground mt-1">Use weather forecasts to optimize energy usage</p>
            </div>
            <Switch 
              id="weather-predictive" 
              checked={settings.weatherPredictiveControlEnabled}
              onCheckedChange={(value) => onSettingsChange('weatherPredictiveControlEnabled', value)}
            />
          </div>
          
          <Button 
            className="w-full"
            onClick={onSaveSettings}
          >
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedControlSettings;
