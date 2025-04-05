
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusOverview, EnergyFlowVisualization, MicrogridControls, CommandHistory } from '.';
import { useMicrogrid } from './MicrogridProvider';
import { CommandHistoryItem, AlertItem } from './types';
import AlertsPanel from './AlertsPanel';

const MicrogridTabContent = () => {
  const { state, handleModeChange, handleGridConnectionToggle } = useMicrogrid();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock command history
  const [commands, setCommands] = useState<CommandHistoryItem[]>([
    {
      id: '1',
      timestamp: new Date().toISOString(),
      command: 'Set system mode to Auto',
      success: true,
      user: 'System Admin',
      details: 'System automatically switched to optimize energy flow'
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      command: 'Connect to grid',
      success: true,
      user: 'System Admin',
      details: 'Manual grid connection established'
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      command: 'Battery charge limit to 90%',
      success: true,
      user: 'System',
      details: 'Automated adjustment based on forecast'
    }
  ]);
  
  // Mock alerts
  const mockAlerts: AlertItem[] = [
    {
      id: '1',
      timestamp: new Date().toISOString(),
      title: 'Battery charge low',
      message: 'Battery charge is below 20%. Consider connecting to grid.',
      severity: 'medium',
      deviceId: 'battery-01',
      acknowledged: false
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
      title: 'Solar production drop',
      message: 'Solar production dropped by more than 50% in the last hour.',
      severity: 'low',
      deviceId: 'solar-array-01',
      acknowledged: true
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
      title: 'Grid connection unstable',
      message: 'Grid connection has been unstable in the last 30 minutes.',
      severity: 'high',
      deviceId: 'grid-connection',
      acknowledged: false
    }
  ];
  
  // Handle command execution
  const handleExecuteCommand = (command: string) => {
    const newCommand: CommandHistoryItem = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      command,
      success: Math.random() > 0.1, // 90% chance of success
      user: 'Current User',
      details: `Manual command execution: ${command}`
    };
    
    setCommands([newCommand, ...commands]);
    
    // Handle specific commands
    if (command.includes('battery') && command.includes('reserve')) {
      const match = command.match(/(\d+)%/);
      if (match && match[1]) {
        const percentage = parseInt(match[1]);
        handleModeChange('manual');
      }
    }
    
    return newCommand.success;
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 md:w-2/3 lg:w-1/2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="controls">Controls</TabsTrigger>
          <TabsTrigger value="commands">Commands</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>System Status</CardTitle>
                <CardDescription>Current status of all microgrid components</CardDescription>
              </CardHeader>
              <CardContent>
                <StatusOverview microgridState={state} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Energy Flow</CardTitle>
                <CardDescription>Visualize energy flow between components</CardDescription>
              </CardHeader>
              <CardContent>
                <EnergyFlowVisualization microgridState={state} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="controls" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Controls</CardTitle>
              <CardDescription>Configure and control microgrid operations</CardDescription>
            </CardHeader>
            <CardContent>
              <MicrogridControls 
                microgridState={state} 
                onUpdateMode={handleExecuteCommand}
                onToggleConnection={handleExecuteCommand}
                disabled={false} 
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="commands" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Command History</CardTitle>
              <CardDescription>Recent commands and their results</CardDescription>
            </CardHeader>
            <CardContent>
              <CommandHistory commandHistory={commands} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
              <CardDescription>Warnings and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <AlertsPanel alerts={mockAlerts} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MicrogridTabContent;
