
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
    handleAcknowledgeAlert,
    handleModeChange,
    settings
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
              onModeChange={handleModeChange}
            />
            <DeviceControlsPanel />
          </div>
        );
      case 'advanced':
        return (
          <div className="space-y-6">
            <AdvancedControlSettings 
              minBatteryReserve={settings.minBatteryReserve}
              setMinBatteryReserve={(value) => {
                // Handle setting change
              }}
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
