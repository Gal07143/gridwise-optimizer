
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { AlertsPanel } from './index';
import StatusOverview from './StatusOverview';
import EnergyFlowVisualization from './EnergyFlowVisualization';
import MicrogridControls from './MicrogridControls';
import CommandHistory from './CommandHistory';
import { AnimatePresence, motion } from 'framer-motion';

// Mock microgrid context
const useMicrogrid = () => {
  const [batteryReserve, setBatteryReserve] = useState(20);
  
  return {
    state: {
      batteryCharge: 75,
      batteryCharging: true,
      batteryCurrent: 10.5,
      batteryCapacity: 100,
      solarOutput: 3.2,
      solarConnected: true,
      solarEfficiency: 92,
      windOutput: 1.5,
      windConnected: true,
      windSpeed: 12,
      gridPower: 5.0,
      gridConnection: true,
      gridConnected: true,
      loadDemand: 8.5,
      loadConnected: true,
      buildingEfficiency: 87,
      timestamp: new Date(),
      systemMode: 'auto' as const,
      solarProduction: 3.2,
      windProduction: 1.5,
      batteryLevel: 75,
      batteryDischargeEnabled: false,
      batteryChargeEnabled: true,
      loadConsumption: 8.5,
      gridImport: 5.0,
      gridExport: 0,
      frequency: 50,
      voltage: 230,
      lastUpdated: new Date().toISOString(),
      operatingMode: 'auto' as const,
      batteryChargeRate: 2.5,
      gridImportEnabled: true,
      gridExportEnabled: false,
      batterySelfConsumptionMode: true,
      economicMode: false,
      peakShavingEnabled: true,
      demandResponseEnabled: false
    },
    batteryReserve,
    handleModeChange: (mode: string) => console.log('Mode changed to', mode),
    handleGridConnectionToggle: () => console.log('Grid connection toggled'),
    updateBatteryReserve: (value: number) => setBatteryReserve(value),
    dispatch: (action: any) => console.log('Dispatch called with', action)
  };
};

const MicrogridTabContent = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { state: microgridState, batteryReserve, handleModeChange, handleGridConnectionToggle, updateBatteryReserve } = useMicrogrid();
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  // Sample command history data
  const commandHistoryData = [
    {
      id: '1',
      timestamp: new Date().toISOString(),
      command: 'SET_MODE_ECO',
      success: true,
      user: 'System',
      details: 'Auto-switched to eco mode based on time settings'
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      command: 'CHARGE_BATTERY',
      success: true,
      user: 'Operator',
      details: 'Manual override to charge battery'
    }
  ];
  
  // Sample alerts data with correctly typed severity
  const alerts = [
    {
      id: '1',
      timestamp: new Date().toISOString(),
      title: 'Battery Alert',
      message: 'Battery SoC below threshold',
      severity: 'high' as 'high',
      deviceId: 'battery-01',
      acknowledged: false
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      title: 'Grid Alert',
      message: 'Grid connection unstable',
      severity: 'medium' as 'medium',
      deviceId: 'grid-connection',
      acknowledged: false
    }
  ];
  
  const handleAcknowledge = (id: string) => {
    console.log(`Alert ${id} acknowledged`);
  };

  return (
    <AnimatePresence mode="wait">
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="energy-flow">Energy Flow</TabsTrigger>
          <TabsTrigger value="controls">Controls</TabsTrigger>
          <TabsTrigger value="history">Command History</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-0">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <StatusOverview microgridState={microgridState} />
          </motion.div>
        </TabsContent>
        
        <TabsContent value="energy-flow" className="mt-0">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <EnergyFlowVisualization microgridState={microgridState} />
          </motion.div>
        </TabsContent>
        
        <TabsContent value="controls" className="mt-0">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <MicrogridControls 
              microgridState={microgridState} 
              minBatteryReserve={batteryReserve}
              onModeChange={handleModeChange}
              onGridConnectionToggle={handleGridConnectionToggle}
              onBatteryReserveChange={updateBatteryReserve}
              disabled={false}
            />
          </motion.div>
        </TabsContent>
        
        <TabsContent value="history" className="mt-0">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <CommandHistory commandHistory={commandHistoryData} />
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="alerts" className="mt-0">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <AlertsPanel 
              alerts={alerts} 
              onAcknowledge={handleAcknowledge} 
            />
          </motion.div>
        </TabsContent>
      </Tabs>
    </AnimatePresence>
  );
};

export default MicrogridTabContent;
