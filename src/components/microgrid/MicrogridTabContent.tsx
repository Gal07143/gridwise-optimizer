
import React from 'react';
import StatusOverview from './StatusOverview';
import AlertsPanel from './AlertsPanel';
import CommandHistory from './CommandHistory';
import MicrogridControls from './MicrogridControls';
import AdvancedControlSettings from './AdvancedControlSettings';
import DeviceControlsPanel from './DeviceControlsPanel';
import EnergyFlowVisualization from './EnergyFlowVisualization';
import MicrogridSystemInsights from './MicrogridSystemInsights';
import { TabsContent } from '@/components/ui/tabs';
import { useMicrogrid } from './MicrogridProvider';

interface MicrogridTabContentProps {
  activeTab: string;
}

const MicrogridTabContent: React.FC<MicrogridTabContentProps> = ({ activeTab }) => {
  const { 
    microgridState, 
    alerts, 
    settings, 
    commandHistory,
    handleAcknowledgeAlert,
    handleModeChange,
    handleGridConnectionToggle,
    handleBatteryDischargeToggle,
    handleSettingsChange,
    handleSaveSettings
  } = useMicrogrid();

  return (
    <>
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
    </>
  );
};

export default MicrogridTabContent;
