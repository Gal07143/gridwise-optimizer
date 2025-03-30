
import React from 'react';
import { useToast } from '@/components/ui/use-toast';
import MicrogridControls from "./MicrogridControls";
import StatusOverview from './StatusOverview';
import EnergyFlowVisualization from './EnergyFlowVisualization';
import AlertsPanel from './AlertsPanel';
import CommandHistory from './CommandHistory';
import DeviceControlsPanel from './DeviceControlsPanel';
import AdvancedControlSettings from './AdvancedControlSettings';
import MicrogridSystemInsights from './MicrogridSystemInsights';
import { useMicrogrid } from './MicrogridProvider';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MicrogridTabContentProps {
  activeTab: string;
}

const MicrogridTabContent: React.FC<MicrogridTabContentProps> = ({ activeTab }) => {
  const { toast } = useToast();
  
  const { 
    state: microgridState,
    dispatch,
    alerts,
    commandHistory,
    settings,
    handleAcknowledgeAlert,
    handleModeChange,
    handleSettingsChange,
    handleSaveSettings
  } = useMicrogrid();

  // Check if the microgrid state is loaded
  const isLoading = !microgridState || !alerts || !commandHistory;
  
  // Check if there's an error (simplified for example)
  const hasError = false; // In a real app, this would be determined by an error state

  // Mode mapping function to convert between different mode naming conventions
  const mapModeToControlsFormat = (mode: "auto" | "manual" | "eco" | "backup"): "automatic" | "manual" | "island" | "grid-connected" => {
    switch (mode) {
      case "auto": return "automatic";
      case "manual": return "manual";
      case "eco": return "island";
      case "backup": return "grid-connected";
      default: return "automatic";
    }
  };

  // Reverse mapping function
  const mapControlsFormatToMode = (mode: "automatic" | "manual" | "island" | "grid-connected"): "auto" | "manual" | "eco" | "backup" => {
    switch (mode) {
      case "automatic": return "auto";
      case "manual": return "manual";
      case "island": return "eco";
      case "grid-connected": return "backup";
      default: return "auto";
    }
  };

  // The adapter function for onModeChange
  const handleModeChangeAdapter = (mode: "automatic" | "manual" | "island" | "grid-connected") => {
    handleModeChange(mapControlsFormatToMode(mode));
    
    // Show a toast notification
    toast({
      title: "Mode Changed",
      description: `Microgrid mode set to ${mode}`,
    });
  };

  // Function to refresh data
  const handleRefresh = () => {
    // In a real app, this would trigger data refetching
    toast({
      title: "Refreshing Data",
      description: "Microgrid data is being refreshed...",
    });
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-[300px] w-full" />
          <Skeleton className="h-[300px] w-full" />
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[200px] w-full" />
        </div>
      </div>
    );
  }

  // Render error state
  if (hasError) {
    return (
      <div className="p-6 text-center">
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <AlertDescription>
            Failed to load microgrid data. Please check your connection and try again.
          </AlertDescription>
        </Alert>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  // Render the active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StatusOverview microgridState={microgridState} />
            <EnergyFlowVisualization microgridState={microgridState} />
            <AlertsPanel alerts={alerts} onAcknowledge={handleAcknowledgeAlert} />
            <CommandHistory commandHistory={commandHistory} />
          </div>
        );
      case 'control':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MicrogridControls 
              microgridState={microgridState}
              minBatteryReserve={settings.minBatteryReserve}
              onModeChange={handleModeChangeAdapter}
              onGridConnectionToggle={() => {
                dispatch({ type: 'UPDATE_PRODUCTION', payload: { gridConnection: !microgridState.gridConnection } });
                
                // Show toast
                toast({
                  title: microgridState.gridConnection ? "Grid Disconnected" : "Grid Connected",
                  description: microgridState.gridConnection 
                    ? "The system is now operating in island mode" 
                    : "The system is now connected to the grid",
                });
              }}
              onBatteryDischargeToggle={() => {
                dispatch({ type: 'SET_BATTERY_DISCHARGE_ENABLED', payload: !microgridState.batteryDischargeEnabled });
                
                // Show toast
                toast({
                  title: microgridState.batteryDischargeEnabled ? "Battery Discharge Disabled" : "Battery Discharge Enabled",
                  description: microgridState.batteryDischargeEnabled 
                    ? "Battery will not discharge to the system" 
                    : "Battery will discharge when needed",
                });
              }}
              onBatteryReserveChange={(value) => handleSettingsChange('minBatteryReserve', value)}
            />
            <DeviceControlsPanel />
          </div>
        );
      case 'advanced':
        return (
          <div className="space-y-6">
            <AdvancedControlSettings 
              settings={settings}
              onSettingsChange={handleSettingsChange}
              onSaveSettings={() => {
                handleSaveSettings();
                
                // Show toast
                toast({
                  title: "Settings Saved",
                  description: "Your advanced control settings have been updated",
                });
              }}
              microgridState={microgridState}
            />
            <MicrogridSystemInsights 
              microgridState={microgridState}
              minBatteryReserve={settings.minBatteryReserve}
            />
          </div>
        );
      default:
        return (
          <div className="p-6 text-center text-muted-foreground">
            Select a tab to view content
          </div>
        );
    }
  };

  return renderTabContent();
};

export default MicrogridTabContent;
