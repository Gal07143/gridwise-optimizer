import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEMSStore } from '@/store/emsStore';
import StatusOverview from './StatusOverview';
import EnergyFlowVisualization from './EnergyFlowVisualization';
import CommandHistory from './CommandHistory';
import AlertsPanel from './AlertsPanel';
import MicrogridControls from './MicrogridControls';
import { motion } from 'framer-motion';

interface MicrogridTabContentProps {
  // Any props needed
}

const MicrogridTabContent: React.FC<MicrogridTabContentProps> = () => {
  const [activeTab, setActiveTab] = React.useState('overview');
  const emsState = useEMSStore();
  
  // Animation variants
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };
  
  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-2 md:grid-cols-5 lg:w-auto lg:inline-flex">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="energy-flow">Energy Flow</TabsTrigger>
          <TabsTrigger value="controls">Controls</TabsTrigger>
          <TabsTrigger value="history">Command History</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>
      
        <TabsContent value="overview" className="mt-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={contentVariants}
          >
            <StatusOverview />
          </motion.div>
        </TabsContent>
        
        <TabsContent value="energy-flow" className="mt-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={contentVariants}
          >
            <EnergyFlowVisualization />
          </motion.div>
        </TabsContent>
        
        <TabsContent value="controls" className="mt-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={contentVariants}
          >
            <MicrogridControls />
          </motion.div>
        </TabsContent>
        
        <TabsContent value="history" className="mt-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={contentVariants}
          >
            <CommandHistory commandHistory={[
              {
                id: 'cmd-1',
                timestamp: new Date().toISOString(),
                command: 'System started',
                success: true,
                user: 'System',
                details: 'Initial system boot'
              }
            ]} />
          </motion.div>
        </TabsContent>
        
        <TabsContent value="alerts" className="mt-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={contentVariants}
          >
            <AlertsPanel />
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MicrogridTabContent;
