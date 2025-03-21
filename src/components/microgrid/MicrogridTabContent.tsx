
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
    commandHistory,
    alerts,
    acknowledgeAlert,
    systemMode,
    setSystemMode,
    minBatteryReserve,
    setMinBatteryReserve
  } = useMicrogrid();

  // Function to handle mode changes
  const handleModeChange = (mode: "auto" | "manual" | "eco" | "backup") => {
    setSystemMode(mode);
  };

  // Render the active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StatusOverview microgridState={microgridState} />
            <EnergyFlowVisualization microgridState={microgridState} />
            <AlertsPanel alerts={alerts} onAcknowledge={acknowledgeAlert} />
            <CommandHistory commandHistory={commandHistory} />
          </div>
        );
      case 'controls':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MicrogridControls 
              systemMode={systemMode} 
              onModeChange={handleModeChange}
              microgridState={microgridState}
            />
            <DeviceControlsPanel microgridState={microgridState} dispatch={dispatch} />
          </div>
        );
      case 'advanced':
        return (
          <div className="space-y-6">
            <AdvancedControlSettings 
              minBatteryReserve={minBatteryReserve}
              setMinBatteryReserve={setMinBatteryReserve}
              microgridState={microgridState}
            />
            <MicrogridSystemInsights 
              microgridState={microgridState}
              minBatteryReserve={minBatteryReserve}
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
