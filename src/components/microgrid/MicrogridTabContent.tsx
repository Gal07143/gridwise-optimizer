
import React from 'react';
import { MicrogridControls } from './MicrogridControls';
import { useMicrogrid } from './MicrogridProvider';
import { MicrogridOperatingMode } from '@/types/energy';
import StatusOverview from './StatusOverview';
import AlertsPanel from './AlertsPanel';
import CommandHistory from './CommandHistory';
import DeviceControlsPanel from './DeviceControlsPanel';
import EnergyFlowVisualization from './EnergyFlowVisualization';
import MicrogridSystemInsights from './MicrogridSystemInsights';

interface MicrogridTabContentProps {
  activeTab: string;
}

/**
 * Component that renders the content for the selected microgrid tab
 */
const MicrogridTabContent: React.FC<MicrogridTabContentProps> = ({ activeTab }) => {
  const { state, dispatch } = useMicrogrid();

  const handleModeChange = (mode: MicrogridOperatingMode) => {
    dispatch({ type: 'SET_OPERATING_MODE', payload: mode });
  };

  const handleGridConnectionToggle = () => {
    dispatch({ type: 'TOGGLE_GRID_CONNECTION' });
  };

  return (
    <div className="space-y-6">
      {activeTab === 'dashboard' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <StatusOverview />
            </div>
            <div>
              <MicrogridControls 
                operatingMode={state.operatingMode}
                onModeChange={handleModeChange}
                gridConnected={state.gridConnection}
                onGridConnectionToggle={handleGridConnectionToggle}
              />
            </div>
          </div>
          <EnergyFlowVisualization />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <AlertsPanel alerts={state.alerts} />
            </div>
            <div>
              <CommandHistory commandHistory={state.commandHistory} />
            </div>
          </div>
        </>
      )}

      {activeTab === 'devices' && (
        <DeviceControlsPanel />
      )}

      {activeTab === 'analytics' && (
        <MicrogridSystemInsights />
      )}
    </div>
  );
};

export default MicrogridTabContent;
