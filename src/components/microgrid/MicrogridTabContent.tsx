
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
              onModeChange={handleModeChange}
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
