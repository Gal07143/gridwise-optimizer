
import React from 'react';
import MicrogridControls from "./MicrogridControls";
import StatusOverview from './StatusOverview';
import EnergyFlowVisualization from './EnergyFlowVisualization';
import AlertsPanel from './AlertsPanel';
import CommandHistory from './CommandHistory';
import DeviceControlsPanel from './DeviceControlsPanel';
import AdvancedControlSettings from './AdvancedControlSettings';
import MicrogridSystemInsights from './MicrogridSystemInsights';
import { useMicrogrid } from './MicrogridProvider';

interface MicrogridTabContentProps {
  activeTab: string;
}

const MicrogridTabContent: React.FC<MicrogridTabContentProps> = ({ activeTab }) => {
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
  };

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
              onGridConnectionToggle={() => dispatch({ type: 'UPDATE_PRODUCTION', payload: { gridConnection: !microgridState.gridConnection } })}
              onBatteryDischargeToggle={() => dispatch({ type: 'SET_BATTERY_DISCHARGE_ENABLED', payload: !microgridState.batteryDischargeEnabled })}
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
              onSaveSettings={handleSaveSettings}
              microgridState={microgridState} // Add the missing required prop
            />
            <MicrogridSystemInsights 
              microgridState={microgridState}
              minBatteryReserve={settings.minBatteryReserve}
            />
          </div>
        );
      default:
        return <div>Select a tab to view content</div>;
    }
  };

  return renderTabContent();
};

export default MicrogridTabContent;
