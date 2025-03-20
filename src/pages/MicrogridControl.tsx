
import React, { useState, useEffect, useContext } from 'react';
import { MicrogridContext } from '@/components/microgrid/MicrogridProvider';
import AppLayout from '@/components/layout/AppLayout';
import MicrogridHeader from '@/components/microgrid/MicrogridHeader';
import MicrogridNavMenu from '@/components/microgrid/MicrogridNavMenu';
import { MicrogridTabContent } from '@/components/microgrid/MicrogridTabContent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Battery, BatteryCharging, Workflow, Wind, ZapOff, Zap, Sun, GitBranch, BarChart3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface ModeOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

export const MicrogridControl = () => {
  const { state, dispatch } = useContext(MicrogridContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [batteryChargeRate, setBatteryChargeRate] = useState(state.batteryChargeRate);
  
  const modeOptions: ModeOption[] = [
    {
      id: 'auto',  // Changed from 'automatic' to 'auto'
      name: 'Automatic',
      description: 'System optimizes energy flow automatically based on current conditions',
      icon: <Workflow className="h-6 w-6" />
    },
    {
      id: 'manual',
      name: 'Manual',
      description: 'Full control over energy flow between components',
      icon: <GitBranch className="h-6 w-6" />
    },
    {
      id: 'eco',
      name: 'Economy',
      description: 'Prioritizes cost savings and grid arbitrage',
      icon: <BarChart3 className="h-6 w-6" />
    },
    {
      id: 'backup',
      name: 'Backup',
      description: 'Focuses on maintaining battery charge for backup power',
      icon: <BatteryCharging className="h-6 w-6" />
    }
  ];
  
  useEffect(() => {
    const timerID = setInterval(() => {
      // Simulate real-time data updates for the demo
      dispatch({ type: 'UPDATE_TIME', payload: new Date() });
      
      // Simulating random fluctuations in values
      const randomFluctuation = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };
      
      // Update production values
      dispatch({ 
        type: 'UPDATE_PRODUCTION', 
        payload: {
          solarProduction: state.solarOutput * randomFluctuation(0.95, 1.05),
          windProduction: state.windOutput * randomFluctuation(0.9, 1.1),
          batteryLevel: Math.min(Math.max(state.batteryLevel + randomFluctuation(-0.5, 0.8), 0), 100),
        }
      });
    }, 5000);
    
    return () => clearInterval(timerID);
  }, [dispatch, state.batteryLevel, state.solarOutput, state.windOutput]);
  
  const handleModeChange = (mode: 'auto' | 'manual' | 'eco' | 'backup') => {
    dispatch({ type: 'SET_SYSTEM_MODE', payload: mode });
    toast.success(`System mode changed to ${mode}`);
    
    // Log this action to command history
    logCommand(`Set system mode to ${mode}`);
  };
  
  const logCommand = (command: string) => {
    dispatch({
      type: 'LOG_COMMAND',
      payload: {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        command,
        success: true,
        user: 'Admin'
      }
    });
  };
  
  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <MicrogridHeader />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <MicrogridNavMenu activeTab={activeTab} setActiveTab={setActiveTab} />
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Solar Production</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center">
                      <Sun className="h-5 w-5 text-yellow-500 mr-2" />
                      <span className="text-2xl font-bold">{state.solarProduction.toFixed(1)} kW</span>
                    </div>
                    <p className="text-muted-foreground text-sm mt-1">
                      {state.solarConnected ? 'Connected' : 'Disconnected'}
                    </p>
                  </div>
                  <Badge variant={state.solarConnected ? "success" : "destructive"}>
                    {state.solarConnected ? 'Online' : 'Offline'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Wind Production</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center">
                      <Wind className="h-5 w-5 text-blue-500 mr-2" />
                      <span className="text-2xl font-bold">{state.windProduction.toFixed(1)} kW</span>
                    </div>
                    <p className="text-muted-foreground text-sm mt-1">
                      Wind speed: {state.windSpeed.toFixed(1)} m/s
                    </p>
                  </div>
                  <Badge variant={state.windConnected ? "success" : "destructive"}>
                    {state.windConnected ? 'Online' : 'Offline'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Battery Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <div className="flex items-center">
                      <Battery className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-2xl font-bold">{state.batteryLevel.toFixed(0)}%</span>
                    </div>
                    <p className="text-muted-foreground text-sm mt-1">
                      {state.batteryChargeEnabled ? 'Charging enabled' : 'Charging disabled'}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-medium">{(state.batteryLevel * state.batteryCapacity / 100).toFixed(1)} kWh</span>
                    <span className="text-xs text-muted-foreground">of {state.batteryCapacity} kWh</span>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mt-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${state.batteryLevel}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="control">Control</TabsTrigger>
                <TabsTrigger value="alerts">Alerts</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              
              <MicrogridTabContent activeTab={activeTab} />
            </Tabs>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Battery Controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="battery-charge">Charging</Label>
                      <p className="text-sm text-muted-foreground">
                        {state.batteryChargeEnabled ? 'Enabled' : 'Disabled'}
                      </p>
                    </div>
                    <Switch 
                      id="battery-charge"
                      checked={state.batteryChargeEnabled}
                      onCheckedChange={(checked) => {
                        dispatch({ type: 'SET_BATTERY_CHARGE_ENABLED', payload: checked });
                        logCommand(`${checked ? 'Enabled' : 'Disabled'} battery charging`);
                      }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="battery-discharge">Discharging</Label>
                      <p className="text-sm text-muted-foreground">
                        {state.batteryDischargeEnabled ? 'Enabled' : 'Disabled'}
                      </p>
                    </div>
                    <Switch 
                      id="battery-discharge"
                      checked={state.batteryDischargeEnabled}
                      onCheckedChange={(checked) => {
                        dispatch({ type: 'SET_BATTERY_DISCHARGE_ENABLED', payload: checked });
                        logCommand(`${checked ? 'Enabled' : 'Disabled'} battery discharging`);
                      }}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label htmlFor="charge-rate">Charge Rate: {state.batteryChargeRate.toFixed(1)} kW</Label>
                      <span className="text-sm text-muted-foreground">{state.batteryChargeRate.toFixed(1)} kW</span>
                    </div>
                    <Slider 
                      id="charge-rate" 
                      min={0} 
                      max={10} 
                      step={0.1}
                      value={[batteryChargeRate]}
                      onValueChange={(value) => setBatteryChargeRate(value[0])}
                      onValueCommit={(value) => {
                        dispatch({ type: 'SET_BATTERY_CHARGE_RATE', payload: value[0] });
                        logCommand(`Set battery charge rate to ${value[0].toFixed(1)} kW`);
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Grid Controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="grid-import">Grid Import</Label>
                      <p className="text-sm text-muted-foreground">
                        {state.gridImportEnabled ? 'Enabled' : 'Disabled'}
                      </p>
                    </div>
                    <Switch 
                      id="grid-import"
                      checked={state.gridImportEnabled}
                      onCheckedChange={(checked) => {
                        dispatch({ type: 'SET_GRID_IMPORT_ENABLED', payload: checked });
                        logCommand(`${checked ? 'Enabled' : 'Disabled'} grid import`);
                      }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="grid-export">Grid Export</Label>
                      <p className="text-sm text-muted-foreground">
                        {state.gridExportEnabled ? 'Enabled' : 'Disabled'}
                      </p>
                    </div>
                    <Switch 
                      id="grid-export"
                      checked={state.gridExportEnabled}
                      onCheckedChange={(checked) => {
                        dispatch({ type: 'SET_GRID_EXPORT_ENABLED', payload: checked });
                        logCommand(`${checked ? 'Enabled' : 'Disabled'} grid export`);
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>System Mode</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {modeOptions.map((mode) => (
                    <Button 
                      key={mode.id}
                      variant={state.systemMode === mode.id ? "default" : "outline"}
                      className="flex flex-col items-center justify-center h-32 p-4"
                      onClick={() => handleModeChange(mode.id as 'auto' | 'manual' | 'eco' | 'backup')}
                    >
                      <div className={`${state.systemMode === mode.id ? "text-primary-foreground" : "text-primary"} mb-2`}>
                        {mode.icon}
                      </div>
                      <div className={state.systemMode === mode.id ? "text-primary-foreground" : ""}>
                        <h3 className="font-medium">{mode.name}</h3>
                        <p className="text-xs mt-1 line-clamp-2">
                          {mode.description}
                        </p>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-0.5">
                      <Label>Self Consumption</Label>
                      <p className="text-sm text-muted-foreground">
                        Prioritize using generated energy on-site
                      </p>
                    </div>
                    <Switch 
                      checked={state.batterySelfConsumptionMode}
                      onCheckedChange={(checked) => {
                        dispatch({ type: 'SET_BATTERY_SELF_CONSUMPTION', payload: checked });
                        logCommand(`${checked ? 'Enabled' : 'Disabled'} self consumption mode`);
                      }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-0.5">
                      <Label>Economic Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Optimize for electricity price variations
                      </p>
                    </div>
                    <Switch 
                      checked={state.economicMode}
                      onCheckedChange={(checked) => {
                        dispatch({ type: 'SET_ECONOMIC_MODE', payload: checked });
                        logCommand(`${checked ? 'Enabled' : 'Disabled'} economic mode`);
                      }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-0.5">
                      <Label>Peak Shaving</Label>
                      <p className="text-sm text-muted-foreground">
                        Reduce peak load demand from the grid
                      </p>
                    </div>
                    <Switch 
                      checked={state.peakShavingEnabled}
                      onCheckedChange={(checked) => {
                        dispatch({ type: 'SET_PEAK_SHAVING', payload: checked });
                        logCommand(`${checked ? 'Enabled' : 'Disabled'} peak shaving`);
                      }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-0.5">
                      <Label>Demand Response</Label>
                      <p className="text-sm text-muted-foreground">
                        Participate in grid demand response events
                      </p>
                    </div>
                    <Switch 
                      checked={state.demandResponseEnabled}
                      onCheckedChange={(checked) => {
                        dispatch({ type: 'SET_DEMAND_RESPONSE', payload: checked });
                        logCommand(`${checked ? 'Enabled' : 'Disabled'} demand response`);
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default MicrogridControl;
