
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
    handleSettingsChange
  } = useMicrogrid();

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
              systemMode={microgridState.systemMode} 
              // Cast the function to match the expected props type
              onModeChange={handleModeChange as (mode: "manual" | "automatic" | "island" | "grid-connected") => void}
            />
            <DeviceControlsPanel />
          </div>
        );
      case 'advanced':
        return (
          <div className="space-y-6">
            <AdvancedControlSettings 
              // Make sure we pass props that match the component's interface
              settings={settings}
              onSettingsChange={handleSettingsChange}
              microgridState={microgridState}
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
