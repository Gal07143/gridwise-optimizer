
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { 
  Battery,
  Bolt,
  Zap,
  Sun,
  Wind,
  Home,
  Settings,
  Save,
  RefreshCw,
  AlertTriangle,
  Shield,
  ArrowLeftRight
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import EnergyFlowVisualization from '@/components/microgrid/EnergyFlowVisualization';
import { MicrogridState } from '@/components/microgrid/types';

const initialMicrogridState: MicrogridState = {
  operatingMode: 'automatic',
  gridConnection: true,
  batteryChargeEnabled: true,
  batteryDischargeEnabled: true,
  gridImportEnabled: false,
  gridExportEnabled: false,
  solarProduction: 16.4,
  windProduction: 8.2,
  batteryCharge: 73.6,
  batteryLevel: 73.6,
  batteryChargeRate: 60,
  batterySelfConsumptionMode: true,
  systemMode: 'automatic',
  economicMode: false,
  peakShavingEnabled: true,
  demandResponseEnabled: false,
  loadConsumption: 10.8,
  gridImport: 0,
  gridExport: 12.8,
  frequency: 50.02,
  voltage: 232.1,
  lastUpdated: new Date().toISOString()
};

const MicrogridControl = () => {
  const [microgridState, setMicrogridState] = useState<MicrogridState>(initialMicrogridState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSettingChange = (key: keyof MicrogridState, value: any) => {
    setMicrogridState(prev => ({
      ...prev,
      [key]: value,
      lastUpdated: new Date().toISOString()
    }));
  };
  
  const handleSaveSettings = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Microgrid control settings saved successfully');
      setIsSubmitting(false);
    }, 1500);
  };
  
  const handleRefresh = () => {
    // Simulate fetching fresh data
    toast.info('Refreshing microgrid state...');
    
    setTimeout(() => {
      // Update with some slight variations to simulate real data changes
      setMicrogridState(prev => ({
        ...prev,
        solarProduction: Math.round((prev.solarProduction + (Math.random() * 2 - 1)) * 10) / 10,
        windProduction: Math.round((prev.windProduction + (Math.random() * 1.5 - 0.75)) * 10) / 10,
        batteryLevel: Math.min(100, Math.max(0, Math.round((prev.batteryLevel + (Math.random() * 2 - 1)) * 10) / 10)),
        lastUpdated: new Date().toISOString()
      }));
      toast.success('Microgrid state updated');
    }, 1000);
  };
  
  return (
    <AppLayout>
      <div className="animate-in fade-in duration-500 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-semibold mb-1">Microgrid Control</h1>
            <p className="text-muted-foreground">
              Configure and optimize your energy system in real-time
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              className="h-9"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button 
              onClick={handleSaveSettings}
              disabled={isSubmitting}
              className="h-9"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <EnergyFlowVisualization microgridState={microgridState} />
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Sun className="h-5 w-5 text-yellow-500" />
                    <CardTitle className="text-base">Solar Production</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{microgridState.solarProduction.toFixed(1)} kW</div>
                  <p className="text-sm text-muted-foreground">Currently operating at 94% efficiency</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Wind className="h-5 w-5 text-blue-500" />
                    <CardTitle className="text-base">Wind Production</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{microgridState.windProduction.toFixed(1)} kW</div>
                  <p className="text-sm text-muted-foreground">Stable wind conditions (10-12 mph)</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Battery className="h-5 w-5 text-purple-500" />
                    <CardTitle className="text-base">Battery Status</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <div className="text-3xl font-bold">{microgridState.batteryLevel.toFixed(1)}%</div>
                    {microgridState.batteryChargeEnabled && (
                      <div className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-full">
                        Charging
                      </div>
                    )}
                  </div>
                  <div className="mt-1 h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div 
                      className="h-2 bg-purple-500 rounded-full"
                      style={{ width: `${microgridState.batteryLevel}%` }}
                    ></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <Tabs defaultValue="controls">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="controls">
                  <Settings className="h-4 w-4 mr-2" />
                  Controls
                </TabsTrigger>
                <TabsTrigger value="modes">
                  <Bolt className="h-4 w-4 mr-2" />
                  Modes
                </TabsTrigger>
                <TabsTrigger value="advanced">
                  <Shield className="h-4 w-4 mr-2" />
                  Advanced
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="controls" className="space-y-4 mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Battery Controls</CardTitle>
                    <CardDescription>Configure battery charging and discharging</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Battery Charging</Label>
                        <p className="text-sm text-muted-foreground">Allow system to charge battery</p>
                      </div>
                      <Switch 
                        checked={microgridState.batteryChargeEnabled}
                        onCheckedChange={(checked) => handleSettingChange('batteryChargeEnabled', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Battery Discharging</Label>
                        <p className="text-sm text-muted-foreground">Allow battery to power loads</p>
                      </div>
                      <Switch 
                        checked={microgridState.batteryDischargeEnabled}
                        onCheckedChange={(checked) => handleSettingChange('batteryDischargeEnabled', checked)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Charge Rate Limit ({microgridState.batteryChargeRate}%)</Label>
                      </div>
                      <Slider 
                        value={[microgridState.batteryChargeRate]} 
                        min={10} 
                        max={100} 
                        step={5}
                        onValueChange={(value) => handleSettingChange('batteryChargeRate', value[0])}
                      />
                      <p className="text-xs text-muted-foreground">Limit battery charging rate to extend battery life</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Grid Connection</CardTitle>
                    <CardDescription>Configure grid import and export</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Grid Import</Label>
                        <p className="text-sm text-muted-foreground">Allow power from the grid</p>
                      </div>
                      <Switch 
                        checked={microgridState.gridImportEnabled}
                        onCheckedChange={(checked) => handleSettingChange('gridImportEnabled', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Grid Export</Label>
                        <p className="text-sm text-muted-foreground">Allow selling power to the grid</p>
                      </div>
                      <Switch 
                        checked={microgridState.gridExportEnabled}
                        onCheckedChange={(checked) => handleSettingChange('gridExportEnabled', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="modes" className="space-y-4 mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">System Operation Mode</CardTitle>
                    <CardDescription>Configure how your system operates</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant={microgridState.systemMode === 'automatic' ? 'default' : 'outline'}
                        onClick={() => handleSettingChange('systemMode', 'automatic')}
                        className="justify-start"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Automatic
                      </Button>
                      <Button
                        variant={microgridState.systemMode === 'manual' ? 'default' : 'outline'}
                        onClick={() => handleSettingChange('systemMode', 'manual')}
                        className="justify-start"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Manual
                      </Button>
                      <Button
                        variant={microgridState.systemMode === 'eco' ? 'default' : 'outline'}
                        onClick={() => handleSettingChange('systemMode', 'eco')}
                        className="justify-start"
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        Eco
                      </Button>
                      <Button
                        variant={microgridState.systemMode === 'backup' ? 'default' : 'outline'}
                        onClick={() => handleSettingChange('systemMode', 'backup')}
                        className="justify-start"
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        Backup
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Self-Consumption Mode</Label>
                        <p className="text-sm text-muted-foreground">Prioritize using your own energy</p>
                      </div>
                      <Switch 
                        checked={microgridState.batterySelfConsumptionMode}
                        onCheckedChange={(checked) => handleSettingChange('batterySelfConsumptionMode', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Economic Mode</Label>
                        <p className="text-sm text-muted-foreground">Optimize for cost savings</p>
                      </div>
                      <Switch 
                        checked={microgridState.economicMode}
                        onCheckedChange={(checked) => handleSettingChange('economicMode', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="advanced" className="space-y-4 mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Advanced Settings</CardTitle>
                    <CardDescription>Configure advanced power management features</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Peak Shaving</Label>
                        <p className="text-sm text-muted-foreground">Reduce peak demand charges</p>
                      </div>
                      <Switch 
                        checked={microgridState.peakShavingEnabled}
                        onCheckedChange={(checked) => handleSettingChange('peakShavingEnabled', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Demand Response</Label>
                        <p className="text-sm text-muted-foreground">Participate in utility demand response programs</p>
                      </div>
                      <Switch 
                        checked={microgridState.demandResponseEnabled}
                        onCheckedChange={(checked) => handleSettingChange('demandResponseEnabled', checked)}
                      />
                    </div>
                    
                    <div className="pt-2">
                      <Button 
                        variant="destructive" 
                        className="w-full justify-center items-center"
                        onClick={() => toast.info('System would reset to defaults')}
                      >
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Reset to Default Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Maintenance</CardTitle>
                    <CardDescription>System maintenance options</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button 
                      variant="outline" 
                      className="w-full justify-center items-center"
                      onClick={() => toast.info('Diagnostic test would start')}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Run System Diagnostic
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full justify-center items-center"
                      onClick={() => toast.info('Firmware update check would start')}
                    >
                      <ArrowLeftRight className="h-4 w-4 mr-2" />
                      Check for Firmware Updates
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default MicrogridControl;
