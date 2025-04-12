
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Battery, Coins, Leaf, Zap } from 'lucide-react';
import { useEnergyOptimization } from '@/hooks/useEnergyOptimization';
import { useAppStore } from '@/store/appStore';
import { fetchDevices } from '@/services/supabase/supabaseService';
import { useQuery } from '@tanstack/react-query';
import { EnergyDevice } from '@/types/energy';
import { OptimizationPriority } from '@/types/optimization';

const OptimizationControls = () => {
  const { currentSite } = useAppStore();
  const siteId = currentSite?.id || '';
  
  const { 
    runOptimization, 
    updateSettings, 
    currentSettings, 
    isOptimizing 
  } = useEnergyOptimization(siteId);
  
  const [optimizeEV, setOptimizeEV] = useState(false);
  
  // Fetch devices for this site
  const { data: devices = [] } = useQuery<EnergyDevice[]>({
    queryKey: ['devices', siteId],
    queryFn: () => fetchDevices(siteId),
    enabled: !!siteId,
  });
  
  // Filter devices by type
  const batteryDevices = devices.filter(device => device.type === 'battery');
  const evChargers = devices.filter(device => device.type === 'ev_charger');
  
  const handleRunOptimization = () => {
    const deviceIds = [
      ...batteryDevices.map(d => d.id),
      ...(optimizeEV ? evChargers.map(d => d.id) : [])
    ];
    
    if (deviceIds.length === 0) {
      return; // No devices to optimize
    }
    
    runOptimization(deviceIds);
  };

  const handleTabChange = (value: string) => {
    // Handle objective change safely with type casting
    if (value === 'cost' || value === 'self_consumption' || 
        value === 'carbon' || value === 'peak_shaving') {
      updateSettings({ priority: value as OptimizationPriority });
    }
  };
  
  return (
    <Card className="shadow-sm border border-slate-200 dark:border-slate-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Zap className="h-5 w-5 text-indigo-500" />
          Energy Optimization
        </CardTitle>
        <CardDescription>
          Optimize your energy usage based on forecasts and preferences
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="self_consumption" onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="self_consumption" className="flex flex-col py-2 h-auto">
              <Leaf className="h-4 w-4 mb-1" />
              <span className="text-xs">Self-Use</span>
            </TabsTrigger>
            <TabsTrigger value="cost" className="flex flex-col py-2 h-auto">
              <Coins className="h-4 w-4 mb-1" />
              <span className="text-xs">Cost</span>
            </TabsTrigger>
            <TabsTrigger value="peak_shaving" className="flex flex-col py-2 h-auto">
              <Zap className="h-4 w-4 mb-1" />
              <span className="text-xs">Peak</span>
            </TabsTrigger>
            <TabsTrigger value="carbon" className="flex flex-col py-2 h-auto">
              <Leaf className="h-4 w-4 mb-1" />
              <span className="text-xs">Carbon</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="self_consumption">
            <div className="text-sm text-slate-600 dark:text-slate-300 mb-4">
              Maximize the use of your own renewable energy and minimize grid imports.
            </div>
          </TabsContent>
          
          <TabsContent value="cost">
            <div className="text-sm text-slate-600 dark:text-slate-300 mb-4">
              Minimize your electricity costs by using battery storage during high-price periods.
            </div>
          </TabsContent>
          
          <TabsContent value="peak_shaving">
            <div className="text-sm text-slate-600 dark:text-slate-300 mb-4">
              Reduce peak demand charges by limiting your maximum power draw from the grid.
            </div>
          </TabsContent>
          
          <TabsContent value="carbon">
            <div className="text-sm text-slate-600 dark:text-slate-300 mb-4">
              Minimize your carbon footprint by using energy when the grid is cleanest.
            </div>
          </TabsContent>
        </Tabs>
        
        {batteryDevices.length > 0 && (
          <div className="space-y-6 mt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Battery SoC Limits</Label>
                <div className="text-sm text-slate-500">
                  {currentSettings.min_soc || 20}% - {currentSettings.max_soc || 85}%
                </div>
              </div>
              
              <div className="pt-4 px-2">
                <Slider
                  defaultValue={[currentSettings.min_soc || 20, currentSettings.max_soc || 85]}
                  min={0}
                  max={100}
                  step={5}
                  onValueChange={(value) => {
                    updateSettings({
                      min_soc: value[0],
                      max_soc: value[1]
                    });
                  }}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Battery className="h-4 w-4 text-purple-500" />
                <Label>Batteries ({batteryDevices.length})</Label>
              </div>
              <div className="text-xs text-slate-500">
                {batteryDevices.map(d => d.name).join(', ')}
              </div>
            </div>
          </div>
        )}
        
        {evChargers.length > 0 && (
          <div className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label className="text-base font-medium">EV Optimization</Label>
              </div>
              <Switch
                checked={optimizeEV}
                onCheckedChange={setOptimizeEV}
              />
            </div>
            
            {optimizeEV && (
              <div className="space-y-4 pt-2 border-t">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Departure Time</Label>
                    <Input 
                      type="time" 
                      value={currentSettings.time_window_end || "08:00"}
                      onChange={(e) => updateSettings({ time_window_end: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Target SoC</Label>
                      <div className="text-sm text-slate-500">
                        {currentSettings.max_soc || 80}%
                      </div>
                    </div>
                    <Slider
                      defaultValue={[currentSettings.max_soc || 80]}
                      min={20}
                      max={100}
                      step={5}
                      onValueChange={(value) => updateSettings({ max_soc: value[0] })}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {batteryDevices.length === 0 && evChargers.length === 0 && (
          <div className="text-center py-6 text-slate-500">
            <p>No optimizable devices found.</p>
            <p className="text-sm mt-1">Add battery or EV charger devices to enable optimization.</p>
          </div>
        )}
        
        {(batteryDevices.length > 0 || evChargers.length > 0) && (
          <Button 
            className="w-full mt-6" 
            onClick={handleRunOptimization}
            disabled={isOptimizing}
          >
            {isOptimizing ? 'Optimizing...' : 'Run Optimization'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default OptimizationControls;
