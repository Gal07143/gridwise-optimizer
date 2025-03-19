
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Grid, 
  Settings, 
  Power, 
  ZapOff, 
  BarChart3, 
  Battery, 
  Sun, 
  Wind, 
  Bolt,
  PanelTop,
  Cable,
  History,
  Save,
  Check,
  X,
  AlertTriangle,
  Clock,
  ArrowRightLeft,
  RefreshCw
} from 'lucide-react';

import { useSite } from '@/contexts/SiteContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

import WindControls from '@/components/devices/controls/WindControls';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

// Define types for our microgrid state
interface MicrogridState {
  operatingMode: 'automatic' | 'manual' | 'island' | 'grid-connected';
  gridConnection: boolean;
  batteryDischargeEnabled: boolean;
  solarProduction: number;
  windProduction: number;
  batteryCharge: number;
  loadConsumption: number;
  gridImport: number;
  gridExport: number;
  frequency: number;
  voltage: number;
  lastUpdated: string;
}

// Define types for control settings
interface ControlSettings {
  prioritizeSelfConsumption: boolean;
  gridExportLimit: number;
  minBatteryReserve: number;
  peakShavingEnabled: boolean;
  peakShavingThreshold: number;
  demandResponseEnabled: boolean;
  economicOptimizationEnabled: boolean;
  weatherPredictiveControlEnabled: boolean;
}

const MicrogridControl = () => {
  const { currentSite } = useSite();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // State for microgrid status and controls
  const [microgridState, setMicrogridState] = useState<MicrogridState>({
    operatingMode: 'automatic',
    gridConnection: true,
    batteryDischargeEnabled: true,
    solarProduction: 15.2,
    windProduction: 8.4,
    batteryCharge: 72,
    loadConsumption: 10.8,
    gridImport: 0,
    gridExport: 12.8,
    frequency: 50.02,
    voltage: 232.1,
    lastUpdated: new Date().toISOString()
  });
  
  // State for control settings
  const [settings, setSettings] = useState<ControlSettings>({
    prioritizeSelfConsumption: true,
    gridExportLimit: 15,
    minBatteryReserve: 20,
    peakShavingEnabled: true,
    peakShavingThreshold: 12,
    demandResponseEnabled: false,
    economicOptimizationEnabled: true,
    weatherPredictiveControlEnabled: true
  });
  
  // State for commands history
  const [commandHistory, setCommandHistory] = useState<Array<{
    timestamp: string;
    command: string;
    success: boolean;
    user: string;
  }>>([
    {
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      command: "Changed operating mode to automatic",
      success: true,
      user: "System"
    },
    {
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      command: "Battery discharge enabled",
      success: true,
      user: "Admin"
    }
  ]);
  
  // State for active alerts
  const [alerts, setAlerts] = useState<Array<{
    id: string;
    timestamp: string;
    message: string;
    severity: 'low' | 'medium' | 'high';
    acknowledged: boolean;
  }>>([
    {
      id: "1",
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      message: "Grid voltage fluctuation detected",
      severity: 'medium',
      acknowledged: false
    }
  ]);
  
  // Check if site is selected
  useEffect(() => {
    if (!currentSite) {
      toast({
        title: "No site selected",
        description: "Please select a site to control the microgrid",
      });
      navigate("/settings/sites");
    }
  }, [currentSite, navigate, toast]);
  
  // Simulate fetching real-time data
  useEffect(() => {
    const interval = setInterval(() => {
      // In a real app, we'd fetch this data from the database or API
      setMicrogridState(prev => ({
        ...prev,
        solarProduction: Math.max(0, prev.solarProduction + (Math.random() * 0.6 - 0.3)),
        windProduction: Math.max(0, prev.windProduction + (Math.random() * 0.4 - 0.2)),
        batteryCharge: Math.min(100, Math.max(0, prev.batteryCharge + (Math.random() * 0.6 - 0.3))),
        loadConsumption: Math.max(0, prev.loadConsumption + (Math.random() * 0.5 - 0.25)),
        gridExport: prev.gridConnection ? Math.max(0, (prev.solarProduction + prev.windProduction) - prev.loadConsumption) : 0,
        gridImport: prev.gridConnection ? Math.max(0, prev.loadConsumption - (prev.solarProduction + prev.windProduction)) : 0,
        frequency: prev.gridConnection ? 50 + (Math.random() * 0.1 - 0.05) : 49.8 + (Math.random() * 0.4 - 0.2),
        voltage: 230 + (Math.random() * 4 - 2),
        lastUpdated: new Date().toISOString()
      }));
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Handle mode change
  const handleModeChange = (mode: 'automatic' | 'manual' | 'island' | 'grid-connected') => {
    setMicrogridState(prev => ({
      ...prev,
      operatingMode: mode
    }));
    
    // Add to command history
    setCommandHistory(prev => ([
      {
        timestamp: new Date().toISOString(),
        command: `Changed operating mode to ${mode}`,
        success: true,
        user: "User"
      },
      ...prev
    ]));
    
    toast.success(`Microgrid operating mode changed to ${mode}`);
  };
  
  // Handle grid connection toggle
  const handleGridConnectionToggle = (enabled: boolean) => {
    setMicrogridState(prev => ({
      ...prev,
      gridConnection: enabled,
      operatingMode: enabled ? 'grid-connected' : 'island'
    }));
    
    // Add to command history
    setCommandHistory(prev => ([
      {
        timestamp: new Date().toISOString(),
        command: enabled ? "Connected to grid" : "Disconnected from grid (island mode)",
        success: true,
        user: "User"
      },
      ...prev
    ]));
    
    toast.success(enabled ? "Connected to grid" : "Disconnected from grid (island mode)");
  };
  
  // Handle battery discharge toggle
  const handleBatteryDischargeToggle = (enabled: boolean) => {
    setMicrogridState(prev => ({
      ...prev,
      batteryDischargeEnabled: enabled
    }));
    
    // Add to command history
    setCommandHistory(prev => ([
      {
        timestamp: new Date().toISOString(),
        command: enabled ? "Battery discharge enabled" : "Battery discharge disabled",
        success: true,
        user: "User"
      },
      ...prev
    ]));
    
    toast.success(enabled ? "Battery discharge enabled" : "Battery discharge disabled");
  };
  
  // Handle settings change
  const handleSettingsChange = (setting: keyof ControlSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };
  
  // Handle saving settings
  const handleSaveSettings = () => {
    // In a real app, we'd save these to the database
    toast.success("Control settings saved successfully");
    
    // Add to command history
    setCommandHistory(prev => ([
      {
        timestamp: new Date().toISOString(),
        command: "Updated control settings",
        success: true,
        user: "User"
      },
      ...prev
    ]));
  };
  
  // Handle acknowledging an alert
  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, acknowledged: true }
          : alert
      )
    );
    
    toast.success("Alert acknowledged");
  };
  
  // Function to format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString() + ', ' + date.toLocaleDateString();
  };
  
  // Energy flow indicators
  const getFlowIndicator = (value: number, threshold: number = 0.1) => {
    if (Math.abs(value) < threshold) return '—';
    return value > 0 ? '↑' : '↓';
  };

  // Render alert badge
  const renderAlertBadge = (severity: 'low' | 'medium' | 'high') => {
    const colorMap = {
      low: "bg-blue-500",
      medium: "bg-yellow-500",
      high: "bg-red-500"
    };
    
    return (
      <Badge className={`${colorMap[severity]} text-white`}>
        {severity.charAt(0).toUpperCase() + severity.slice(1)}
      </Badge>
    );
  };
  
  return (
    <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
      <Card className="p-6 mb-8 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Microgrid Control</h1>
            <p className="text-muted-foreground mt-1">
              Advanced monitoring and management of your microgrid system
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={`${microgridState.gridConnection ? 'bg-green-500' : 'bg-orange-500'} text-white px-3 py-1.5`}>
              {microgridState.gridConnection ? 'Grid Connected' : 'Island Mode'}
            </Badge>
            <Badge className="bg-primary px-3 py-1.5">
              {microgridState.operatingMode.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Badge>
          </div>
        </div>
      </Card>
      
      <div className="mb-6">
        <NavigationMenu>
          <NavigationMenuList className="w-full gap-1">
            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                asChild
              >
                <a href="#status">
                  <Grid className="mr-2 h-4 w-4" />
                  Status
                </a>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                asChild
              >
                <a href="#controls">
                  <Settings className="mr-2 h-4 w-4" />
                  Controls
                </a>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                asChild
              >
                <a href="#devices">
                  <PanelTop className="mr-2 h-4 w-4" />
                  Devices
                </a>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                asChild
              >
                <a href="#analysis">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Analysis
                </a>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                asChild
              >
                <a href="#history">
                  <History className="mr-2 h-4 w-4" />
                  History
                </a>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8" id="status">
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden">
            <CardHeader className="bg-primary/5">
              <CardTitle className="flex items-center text-lg">
                <Power className="mr-2 h-5 w-5 text-primary" />
                Microgrid Status Overview
              </CardTitle>
              <CardDescription>
                Real-time energy flow and system status
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <Sun className="h-10 w-10 text-yellow-500 mx-auto mb-2" />
                    <h3 className="font-semibold">Solar</h3>
                    <div className="text-2xl font-bold">{microgridState.solarProduction.toFixed(1)} kW</div>
                    <div className="text-sm text-muted-foreground">Production</div>
                  </div>
                  
                  <div className="text-center">
                    <Wind className="h-10 w-10 text-blue-500 mx-auto mb-2" />
                    <h3 className="font-semibold">Wind</h3>
                    <div className="text-2xl font-bold">{microgridState.windProduction.toFixed(1)} kW</div>
                    <div className="text-sm text-muted-foreground">Production</div>
                  </div>
                </div>
                
                <div className="flex flex-col items-center justify-center">
                  <div className="relative w-32 h-32 border-4 border-primary/30 rounded-full flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-4 border-primary" 
                         style={{ 
                           clipPath: `inset(${100 - microgridState.batteryCharge}% 0 0 0)`,
                           transition: 'clip-path 1s ease-in-out'
                         }}></div>
                    <div className="text-center">
                      <Battery className="h-8 w-8 text-primary mx-auto mb-1" />
                      <div className="text-2xl font-bold">{microgridState.batteryCharge.toFixed(0)}%</div>
                    </div>
                  </div>
                  <div className="mt-2 text-center">
                    <h3 className="font-semibold">Battery Storage</h3>
                    <div className="text-sm text-muted-foreground">
                      {microgridState.batteryDischargeEnabled ? 'Discharge Enabled' : 'Discharge Disabled'}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="text-center">
                    <Bolt className="h-10 w-10 text-orange-500 mx-auto mb-2" />
                    <h3 className="font-semibold">Load</h3>
                    <div className="text-2xl font-bold">{microgridState.loadConsumption.toFixed(1)} kW</div>
                    <div className="text-sm text-muted-foreground">Consumption</div>
                  </div>
                  
                  <div className="text-center">
                    <Cable className="h-10 w-10 text-slate-500 mx-auto mb-2" />
                    <h3 className="font-semibold">Grid</h3>
                    <div className="flex justify-center gap-2">
                      <div>
                        <div className="text-xl font-bold">{microgridState.gridImport.toFixed(1)} kW</div>
                        <div className="text-xs text-muted-foreground">Import</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold">{microgridState.gridExport.toFixed(1)} kW</div>
                        <div className="text-xs text-muted-foreground">Export</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex flex-wrap gap-4 justify-center">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full">
                  <Clock className="h-4 w-4 text-slate-500" />
                  <span className="text-sm">Last updated: {new Date(microgridState.lastUpdated).toLocaleTimeString()}</span>
                </div>
                
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full">
                  <ArrowRightLeft className="h-4 w-4 text-slate-500" />
                  <span className="text-sm">Frequency: {microgridState.frequency.toFixed(2)} Hz</span>
                </div>
                
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full">
                  <Bolt className="h-4 w-4 text-slate-500" />
                  <span className="text-sm">Voltage: {microgridState.voltage.toFixed(1)} V</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader className="bg-red-500/5">
              <CardTitle className="flex items-center text-lg">
                <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
                Active Alerts
              </CardTitle>
              <CardDescription>
                System warnings and notifications
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6">
              {alerts.length > 0 ? (
                <div className="space-y-4">
                  {alerts.map(alert => (
                    <div key={alert.id} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="mt-0.5">
                        <AlertTriangle className={`h-5 w-5 ${
                          alert.severity === 'high' ? 'text-red-500' : 
                          alert.severity === 'medium' ? 'text-yellow-500' : 
                          'text-blue-500'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div className="font-medium">{alert.message}</div>
                          {renderAlertBadge(alert.severity)}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {formatDate(alert.timestamp)}
                        </div>
                      </div>
                      {!alert.acknowledged && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleAcknowledgeAlert(alert.id)}
                        >
                          Acknowledge
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <Check className="h-12 w-12 text-green-500 mb-2" />
                  <h3 className="text-lg font-medium">No Active Alerts</h3>
                  <p className="text-sm text-muted-foreground">
                    Your microgrid system is operating normally
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8" id="controls">
        <Card>
          <CardHeader className="bg-primary/5">
            <CardTitle className="flex items-center text-lg">
              <Settings className="mr-2 h-5 w-5 text-primary" />
              Microgrid Controls
            </CardTitle>
            <CardDescription>
              Change operating modes and system behavior
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6">
            <Tabs defaultValue="mode">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="mode">Operating Modes</TabsTrigger>
                <TabsTrigger value="connection">Grid Connection</TabsTrigger>
                <TabsTrigger value="battery">Battery Control</TabsTrigger>
              </TabsList>
              
              <TabsContent value="mode" className="pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    variant={microgridState.operatingMode === 'automatic' ? 'default' : 'outline'}
                    className="flex flex-col h-auto py-4"
                    onClick={() => handleModeChange('automatic')}
                  >
                    <RefreshCw className="h-10 w-10 mb-2" />
                    <span className="font-semibold">Automatic</span>
                    <span className="text-xs mt-1">Optimized control</span>
                  </Button>
                  
                  <Button 
                    variant={microgridState.operatingMode === 'manual' ? 'default' : 'outline'}
                    className="flex flex-col h-auto py-4"
                    onClick={() => handleModeChange('manual')}
                  >
                    <Settings className="h-10 w-10 mb-2" />
                    <span className="font-semibold">Manual</span>
                    <span className="text-xs mt-1">User-defined settings</span>
                  </Button>
                  
                  <Button 
                    variant={microgridState.operatingMode === 'island' ? 'default' : 'outline'}
                    className="flex flex-col h-auto py-4"
                    onClick={() => handleModeChange('island')}
                    disabled={microgridState.gridConnection}
                  >
                    <ZapOff className="h-10 w-10 mb-2" />
                    <span className="font-semibold">Island Mode</span>
                    <span className="text-xs mt-1">Off-grid operation</span>
                  </Button>
                  
                  <Button 
                    variant={microgridState.operatingMode === 'grid-connected' ? 'default' : 'outline'}
                    className="flex flex-col h-auto py-4"
                    onClick={() => handleModeChange('grid-connected')}
                    disabled={!microgridState.gridConnection}
                  >
                    <Cable className="h-10 w-10 mb-2" />
                    <span className="font-semibold">Grid Connected</span>
                    <span className="text-xs mt-1">Grid-tied operation</span>
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="connection" className="pt-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="grid-connection" className="text-base font-medium">Grid Connection</Label>
                      <p className="text-sm text-muted-foreground mt-1">Connect or disconnect from the utility grid</p>
                    </div>
                    <Switch 
                      id="grid-connection" 
                      checked={microgridState.gridConnection}
                      onCheckedChange={handleGridConnectionToggle}
                    />
                  </div>
                  
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <h4 className="font-medium mb-2">Grid Connection Status</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Import Power</div>
                        <div className="text-lg font-semibold">{microgridState.gridImport.toFixed(1)} kW</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Export Power</div>
                        <div className="text-lg font-semibold">{microgridState.gridExport.toFixed(1)} kW</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Frequency</div>
                        <div className="text-lg font-semibold">{microgridState.frequency.toFixed(2)} Hz</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Voltage</div>
                        <div className="text-lg font-semibold">{microgridState.voltage.toFixed(1)} V</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-200 dark:border-yellow-900">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-700 dark:text-yellow-400">Important Notice</h4>
                        <p className="text-sm mt-1">
                          Disconnecting from the grid will immediately switch the system to island mode. 
                          Ensure you have sufficient battery capacity before disconnecting.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="battery" className="pt-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="battery-discharge" className="text-base font-medium">Battery Discharge</Label>
                      <p className="text-sm text-muted-foreground mt-1">Allow the battery to discharge for energy supply</p>
                    </div>
                    <Switch 
                      id="battery-discharge" 
                      checked={microgridState.batteryDischargeEnabled}
                      onCheckedChange={handleBatteryDischargeToggle}
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label htmlFor="min-reserve" className="text-base font-medium">Minimum Reserve Level</Label>
                      <span>{settings.minBatteryReserve}%</span>
                    </div>
                    <Slider 
                      id="min-reserve"
                      min={5}
                      max={50}
                      step={5}
                      value={[settings.minBatteryReserve]}
                      onValueChange={(value) => handleSettingsChange('minBatteryReserve', value[0])}
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      The battery will not discharge below this level to preserve battery health and emergency capacity
                    </p>
                  </div>
                  
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <h4 className="font-medium mb-2">Battery Status</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Charge Level</div>
                        <div className="text-lg font-semibold">{microgridState.batteryCharge.toFixed(0)}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Discharge Status</div>
                        <div className="text-lg font-semibold">{microgridState.batteryDischargeEnabled ? 'Enabled' : 'Disabled'}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Minimum Reserve</div>
                        <div className="text-lg font-semibold">{settings.minBatteryReserve}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Estimated Runtime</div>
                        <div className="text-lg font-semibold">
                          {Math.floor((microgridState.batteryCharge - settings.minBatteryReserve) / 10)}h {Math.floor(((microgridState.batteryCharge - settings.minBatteryReserve) % 10) * 6)}m
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
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
                  onCheckedChange={(value) => handleSettingsChange('prioritizeSelfConsumption', value)}
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
                  onValueChange={(value) => handleSettingsChange('gridExportLimit', value[0])}
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
                  onCheckedChange={(value) => handleSettingsChange('peakShavingEnabled', value)}
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
                    onValueChange={(value) => handleSettingsChange('peakShavingThreshold', value[0])}
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
                  onCheckedChange={(value) => handleSettingsChange('economicOptimizationEnabled', value)}
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
                  onCheckedChange={(value) => handleSettingsChange('weatherPredictiveControlEnabled', value)}
                />
              </div>
              
              <Button 
                className="w-full"
                onClick={handleSaveSettings}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8" id="devices">
        <Card>
          <CardHeader className="bg-primary/5">
            <CardTitle className="flex items-center text-lg">
              <PanelTop className="mr-2 h-5 w-5 text-primary" />
              Device Controls
            </CardTitle>
            <CardDescription>
              Individual device management and configuration
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6">
            <Tabs defaultValue="wind">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="wind">
                  <Wind className="mr-2 h-4 w-4" />
                  Wind Turbine
                </TabsTrigger>
                <TabsTrigger value="solar">
                  <Sun className="mr-2 h-4 w-4" />
                  Solar Array
                </TabsTrigger>
                <TabsTrigger value="battery">
                  <Battery className="mr-2 h-4 w-4" />
                  Battery System
                </TabsTrigger>
                <TabsTrigger value="loads">
                  <Bolt className="mr-2 h-4 w-4" />
                  Loads
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="wind" className="pt-6">
                <WindControls deviceId="wind-1" />
              </TabsContent>
              
              <TabsContent value="solar" className="pt-6">
                <div className="p-8 text-center">
                  <Sun className="h-16 w-16 mx-auto text-yellow-500 mb-4" />
                  <h3 className="text-xl font-medium">Solar Array Control</h3>
                  <p className="text-muted-foreground mt-2 mb-4">
                    Solar array control interface is currently being upgraded
                  </p>
                  <Button>Go to Solar Controls</Button>
                </div>
              </TabsContent>
              
              <TabsContent value="battery" className="pt-6">
                <div className="p-8 text-center">
                  <Battery className="h-16 w-16 mx-auto text-blue-500 mb-4" />
                  <h3 className="text-xl font-medium">Battery System Control</h3>
                  <p className="text-muted-foreground mt-2 mb-4">
                    Battery system control interface is currently being upgraded
                  </p>
                  <Button>Go to Battery Controls</Button>
                </div>
              </TabsContent>
              
              <TabsContent value="loads" className="pt-6">
                <div className="p-8 text-center">
                  <Bolt className="h-16 w-16 mx-auto text-orange-500 mb-4" />
                  <h3 className="text-xl font-medium">Load Management</h3>
                  <p className="text-muted-foreground mt-2 mb-4">
                    Load management interface is currently being upgraded
                  </p>
                  <Button>Go to Load Controls</Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-8" id="history">
        <Card>
          <CardHeader className="bg-primary/5">
            <CardTitle className="flex items-center text-lg">
              <History className="mr-2 h-5 w-5 text-primary" />
              Command History
            </CardTitle>
            <CardDescription>
              Recent control actions and system commands
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6">
            <div className="relative">
              <div className="absolute inset-0 w-0.5 bg-slate-200 dark:bg-slate-700 ml-4 mt-6 mb-6"></div>
              <div className="space-y-6 relative">
                {commandHistory.map((command, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center z-10">
                      {command.success ? 
                        <Check className="h-5 w-5 text-primary" /> : 
                        <X className="h-5 w-5 text-red-500" />
                      }
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <div className="font-medium">{command.command}</div>
                        <div className="text-sm text-muted-foreground">{formatDate(command.timestamp)}</div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Initiated by: {command.user}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MicrogridControl;
