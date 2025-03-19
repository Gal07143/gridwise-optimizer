
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Power, Bolt, Chip, LineChart } from 'lucide-react';
import { useSite } from '@/contexts/SiteContext';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/components/layout/AppLayout';

// Import the refactored components
import MicrogridNavMenu from '@/components/microgrid/MicrogridNavMenu';
import StatusOverview from '@/components/microgrid/StatusOverview';
import AlertsPanel from '@/components/microgrid/AlertsPanel';
import MicrogridControls from '@/components/microgrid/MicrogridControls';
import AdvancedControlSettings from '@/components/microgrid/AdvancedControlSettings';
import DeviceControlsPanel from '@/components/microgrid/DeviceControlsPanel';
import CommandHistory from '@/components/microgrid/CommandHistory';
import MicrogridSystemInsights from '@/components/microgrid/MicrogridSystemInsights';
import EnergyFlowVisualization from '@/components/microgrid/EnergyFlowVisualization';

// Import the shared types
import { 
  MicrogridState, 
  ControlSettings, 
  CommandHistoryItem, 
  AlertItem 
} from '@/components/microgrid/types';

const MicrogridControl = () => {
  const { currentSite } = useSite();
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
  const [commandHistory, setCommandHistory] = useState<CommandHistoryItem[]>([
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
  const [alerts, setAlerts] = useState<AlertItem[]>([
    {
      id: "1",
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      message: "Grid voltage fluctuation detected",
      severity: 'medium',
      acknowledged: false
    }
  ]);

  // State for active tab
  const [activeTab, setActiveTab] = useState('overview');
  
  // Check if site is selected
  useEffect(() => {
    if (!currentSite) {
      toast.error("No site selected", {
        description: "Please select a site to control the microgrid"
      });
      navigate("/settings/sites");
    }
  }, [currentSite, navigate]);
  
  // Simulate fetching real-time data
  useEffect(() => {
    const interval = setInterval(() => {
      // In a real app, we'd fetch this data from the database or API
      setMicrogridState(prev => {
        const timeOfDay = new Date().getHours();
        const isDaytime = timeOfDay >= 7 && timeOfDay <= 19;
        const isPeakSolar = timeOfDay >= 10 && timeOfDay <= 15;
        
        // Adjust solar production based on time of day
        let newSolarProduction = isDaytime 
          ? isPeakSolar 
            ? prev.solarProduction + (Math.random() * 0.6 - 0.2) 
            : Math.max(0, prev.solarProduction + (Math.random() * 0.4 - 0.3))
          : Math.max(0, prev.solarProduction - 0.5);
        
        if (!isDaytime && newSolarProduction < 1) newSolarProduction = 0;
        
        // Wind fluctuates less predictably
        const newWindProduction = Math.max(0, prev.windProduction + (Math.random() * 0.8 - 0.4));
        
        // Load consumption variations
        const newLoadConsumption = Math.max(0, prev.loadConsumption + (Math.random() * 0.7 - 0.35));
        
        // Total generation
        const totalGeneration = newSolarProduction + newWindProduction;
        
        // Battery charge changes based on net energy
        const netEnergy = totalGeneration - newLoadConsumption;
        const batteryChargeChange = prev.batteryDischargeEnabled 
          ? netEnergy > 0 ? Math.min(0.2, netEnergy * 0.1) : -Math.min(0.3, Math.abs(netEnergy) * 0.15)
          : netEnergy > 0 ? Math.min(0.2, netEnergy * 0.1) : 0;
        
        const newBatteryCharge = Math.min(100, Math.max(0, prev.batteryCharge + batteryChargeChange));
        
        // Grid import/export
        let newGridExport = 0;
        let newGridImport = 0;
        
        if (prev.gridConnection) {
          if (netEnergy > 0) {
            newGridExport = netEnergy;
            newGridImport = 0;
          } else {
            newGridExport = 0;
            newGridImport = Math.abs(netEnergy);
          }
        }
        
        // Frequency and voltage variations
        const newFrequency = prev.gridConnection 
          ? 50 + (Math.random() * 0.1 - 0.05) 
          : 49.8 + (Math.random() * 0.4 - 0.2);
        
        const newVoltage = 230 + (Math.random() * 4 - 2);
        
        return {
          ...prev,
          solarProduction: Number(newSolarProduction.toFixed(1)),
          windProduction: Number(newWindProduction.toFixed(1)),
          batteryCharge: Number(newBatteryCharge.toFixed(1)),
          loadConsumption: Number(newLoadConsumption.toFixed(1)),
          gridExport: prev.gridConnection ? Number(newGridExport.toFixed(1)) : 0,
          gridImport: prev.gridConnection ? Number(newGridImport.toFixed(1)) : 0,
          frequency: Number(newFrequency.toFixed(2)),
          voltage: Number(newVoltage.toFixed(1)),
          lastUpdated: new Date().toISOString()
        };
      });
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
  
  return (
    <AppLayout>
      <div className="animate-in fade-in duration-500">
        <Card className="p-6 mb-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-slate-200/60 dark:border-slate-800/60 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <Power className="mr-3 h-8 w-8 text-primary" />
                Microgrid Control
              </h1>
              <p className="text-muted-foreground mt-2">
                Advanced monitoring and management of your microgrid system
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={`${microgridState.gridConnection ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 hover:bg-yellow-600'} text-white px-3 py-1.5 flex items-center gap-1`}>
                <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse"></div>
                {microgridState.gridConnection ? 'Grid Connected' : 'Island Mode'}
              </Badge>
              <Badge className="bg-primary hover:bg-primary/90 px-3 py-1.5 flex items-center gap-1">
                <Chip className="h-3 w-3" />
                {microgridState.operatingMode.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Badge>
            </div>
          </div>
        </Card>
        
        <div className="mb-6">
          <MicrogridNavMenu />
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
          <TabsList className="grid grid-cols-4 w-full mb-6">
            <TabsTrigger value="overview" className="text-sm">
              <Bolt className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="control" className="text-sm">
              <Power className="h-4 w-4 mr-2" />
              Controls
            </TabsTrigger>
            <TabsTrigger value="flow" className="text-sm">
              <Grid className="h-4 w-4 mr-2" />
              Energy Flow
            </TabsTrigger>
            <TabsTrigger value="insights" className="text-sm">
              <LineChart className="h-4 w-4 mr-2" />
              Insights
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="status">
              <div className="lg:col-span-2 space-y-6">
                <StatusOverview microgridState={microgridState} />
              </div>
              
              <div>
                <AlertsPanel 
                  alerts={alerts}
                  onAcknowledge={handleAcknowledgeAlert}
                />
              </div>
            </div>
            
            <CommandHistory commandHistory={commandHistory} />
          </TabsContent>
          
          <TabsContent value="control" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="controls">
              <MicrogridControls
                microgridState={microgridState}
                minBatteryReserve={settings.minBatteryReserve}
                onModeChange={handleModeChange}
                onGridConnectionToggle={handleGridConnectionToggle}
                onBatteryDischargeToggle={handleBatteryDischargeToggle}
                onBatteryReserveChange={(value) => handleSettingsChange('minBatteryReserve', value)}
              />
              
              <AdvancedControlSettings
                settings={settings}
                onSettingsChange={handleSettingsChange}
                onSaveSettings={handleSaveSettings}
              />
            </div>

            <DeviceControlsPanel />
          </TabsContent>
          
          <TabsContent value="flow" className="space-y-6">
            <EnergyFlowVisualization microgridState={microgridState} />
          </TabsContent>
          
          <TabsContent value="insights" className="space-y-6">
            <MicrogridSystemInsights 
              microgridState={microgridState}
              minBatteryReserve={settings.minBatteryReserve}
            />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default MicrogridControl;
