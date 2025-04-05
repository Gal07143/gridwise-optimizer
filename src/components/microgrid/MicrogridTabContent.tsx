
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useMicrogrid } from './MicrogridProvider';
import StatusOverview from './StatusOverview';
import EnergyFlowVisualization from './EnergyFlowVisualization';
import MicrogridControls from './MicrogridControls';
import CommandHistory from './CommandHistory';
import AlertsPanel from './AlertsPanel';
import { MicrogridState, AlertItem, CommandHistoryItem } from './types';

const MicrogridTabContent: React.FC = () => {
  const { state, handleModeChange, handleGridConnectionToggle, updateBatteryReserve } = useMicrogrid();
  const [activeTab, setActiveTab] = useState('overview');
  const [commandHistory, setCommandHistory] = useState<CommandHistoryItem[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  // Initialize some sample data
  useEffect(() => {
    // Sample command history
    setCommandHistory([
      {
        id: '1',
        timestamp: new Date().toISOString(),
        command: 'Change Mode: Auto',
        success: true,
        user: 'System',
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        command: 'Toggle Grid Connection',
        success: true,
        user: 'Admin',
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        command: 'Set Battery Reserve: 20%',
        success: false,
        user: 'Admin',
        details: 'Insufficient permissions',
      },
    ]);

    // Sample alerts
    setAlerts([
      {
        id: '1',
        timestamp: new Date().toISOString(),
        title: 'Low Battery Warning',
        message: 'Battery level below 20%, consider charging.',
        severity: 'medium',
        deviceId: 'battery-01',
        acknowledged: false,
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        title: 'Grid Connection Lost',
        message: 'Grid connection temporarily lost, switched to battery power.',
        severity: 'high',
        deviceId: 'grid-01',
        acknowledged: true,
      },
    ]);
  }, []);

  // Handle command execution
  const handleCommandExecution = (command: string): boolean => {
    const newCommand: CommandHistoryItem = {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toISOString(),
      command,
      success: Math.random() > 0.2, // 80% chance of success for demo
      user: 'User',
    };
    
    setCommandHistory(prev => [newCommand, ...prev]);
    return newCommand.success;
  };

  // Update mode handler
  const onUpdateMode = (mode: string): boolean => {
    const success = handleCommandExecution(`Change Mode: ${mode}`);
    if (success) {
      handleModeChange(mode as 'auto' | 'manual' | 'eco' | 'backup');
    }
    return success;
  };

  // Toggle grid connection handler
  const onToggleConnection = (action: string): boolean => {
    const success = handleCommandExecution(`Grid: ${action}`);
    if (success) {
      handleGridConnectionToggle();
    }
    return success;
  };

  // Update battery reserve handler
  const onUpdateBatteryReserve = (level: number): boolean => {
    const success = handleCommandExecution(`Set Battery Reserve: ${level}%`);
    if (success && updateBatteryReserve) {
      updateBatteryReserve(level);
    }
    return success;
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="controls">Controls</TabsTrigger>
          <TabsTrigger value="history">Command History</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatusOverview microgridState={state} />
            <div className="md:col-span-2">
              <EnergyFlowVisualization microgridState={state} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="controls" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MicrogridControls 
              microgridState={state} 
              onUpdateMode={onUpdateMode}
              onToggleConnection={onToggleConnection}
            />
            
            <Card>
              <CardHeader>
                <CardTitle>Battery Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Battery management controls will be displayed here.</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <CommandHistory commandHistory={commandHistory} />
        </TabsContent>

        <TabsContent value="alerts">
          <AlertsPanel alerts={alerts.map(alert => ({
            id: alert.id,
            timestamp: alert.timestamp,
            title: alert.title,
            message: alert.message,
            severity: alert.severity as "low" | "medium" | "high" | "critical",
            deviceId: alert.deviceId,
            acknowledged: alert.acknowledged
          }))} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MicrogridTabContent;
