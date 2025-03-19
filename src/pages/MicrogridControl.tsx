import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Power } from 'lucide-react';
import { useSite } from '@/contexts/SiteContext';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/components/layout/AppLayout';

// Import the refactored components
import MicrogridNavMenu from '@/components/microgrid/MicrogridNavMenu';
import StatusOverview from '@/components/microgrid/StatusOverview';
import AlertsPanel from '@/components/microgrid/AlertsPanel';
import MicrogridControls from '@/components/microgrid/MicrogridControls';
import AdvancedControlSettings from '@/components/microgrid/AdvancedControlSettings';
import DeviceControlsPanel from '@/components/microgrid/DeviceControlsPanel';
import CommandHistory from '@/components/microgrid/CommandHistory';

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
  
  return (
    <AppLayout>
      <div className="animate-in fade-in duration-500">
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
          <MicrogridNavMenu />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8" id="status">
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
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8" id="controls">
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

        <div className="mb-8" id="devices">
          <DeviceControlsPanel />
        </div>
        
        <div className="mb-8" id="history">
          <CommandHistory commandHistory={commandHistory} />
        </div>
      </div>
    </AppLayout>
  );
};

export default MicrogridControl;
