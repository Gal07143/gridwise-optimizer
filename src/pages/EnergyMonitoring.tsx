
import React, { useState } from 'react';
import { Main } from '@/components/ui/main';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart4, 
  Activity, 
  AlertTriangle, 
  Leaf, 
  Settings,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/appStore';
import EnergyMonitoringDashboard from '@/components/energy-monitoring/EnergyMonitoringDashboard';
import AnomalyDetectionPanel from '@/components/energy-monitoring/AnomalyDetectionPanel';
import CarbonFootprintDashboard from '@/components/energy-monitoring/CarbonFootprintDashboard';

const EnergyMonitoring: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { currentSite } = useAppStore();
  
  return (
    <Main>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Energy Monitoring</h1>
          <p className="text-muted-foreground">
            {currentSite ? currentSite.name : 'All Sites'} • Comprehensive energy monitoring and analysis
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center">
            <Clock className="mr-1 h-4 w-4" />
            <span>Last 24 Hours</span>
          </Button>
          <Button size="sm" className="flex items-center">
            <Settings className="mr-1 h-4 w-4" />
            <span>Configure</span>
          </Button>
        </div>
      </div>

      <Tabs
        defaultValue="dashboard"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="w-full justify-start border-b rounded-none bg-transparent px-0">
          <TabsTrigger 
            value="dashboard" 
            className="data-[state=active]:bg-background rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none px-4 py-2"
          >
            <BarChart4 className="mr-2 h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger 
            value="anomalies" 
            className="data-[state=active]:bg-background rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none px-4 py-2"
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            Anomaly Detection
          </TabsTrigger>
          <TabsTrigger 
            value="carbon" 
            className="data-[state=active]:bg-background rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none px-4 py-2"
          >
            <Leaf className="mr-2 h-4 w-4" />
            Carbon Footprint
          </TabsTrigger>
          <TabsTrigger 
            value="reports" 
            className="data-[state=active]:bg-background rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none px-4 py-2"
          >
            <Activity className="mr-2 h-4 w-4" />
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6 space-y-4">
          <EnergyMonitoringDashboard siteId={currentSite?.id} />
        </TabsContent>

        <TabsContent value="anomalies" className="mt-6 space-y-4">
          <AnomalyDetectionPanel />
        </TabsContent>

        <TabsContent value="carbon" className="mt-6 space-y-4">
          <CarbonFootprintDashboard siteId={currentSite?.id} />
        </TabsContent>

        <TabsContent value="reports" className="mt-6 space-y-4">
          <div className="h-96 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg">
            <div className="text-center">
              <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Energy Reports</h3>
              <p className="text-muted-foreground mb-4 max-w-md">
                Generate detailed reports about your energy usage, savings, and system performance.
              </p>
              <Button>Create Report</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Main>
  );
};

export default EnergyMonitoring;
