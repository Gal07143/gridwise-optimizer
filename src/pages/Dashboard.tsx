
import React, { useState } from 'react';
import { Main } from '@/components/ui/main';
import DashboardCharts from '@/components/dashboard/DashboardCharts';
import DashboardSummary from '@/components/dashboard/DashboardSummary';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import LoadingScreen from '@/components/LoadingScreen';
import { TooltipProvider } from '@/components/ui/tooltip';
import { BarChart2, PieChart, LineChart, Activity, Database, AlertTriangle, Gauge, Zap } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSiteContext } from '@/contexts/SiteContext';
import AnalyticsCard from '@/components/ems/AnalyticsCard';
import AlertsFeed from '@/components/ems/AlertsFeed';
import TelemetryPanel from '@/components/ems/TelemetryPanel';
import OptimizationLog from '@/components/ems/OptimizationLog';

// Dashboard tabs
const tabs = [
  {
    id: 'overview',
    label: 'Overview',
    icon: <BarChart2 className="h-4 w-4 mr-2" />,
  },
  {
    id: 'consumption',
    label: 'Consumption',
    icon: <PieChart className="h-4 w-4 mr-2" />,
  },
  {
    id: 'production',
    label: 'Production',
    icon: <LineChart className="h-4 w-4 mr-2" />,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: <Activity className="h-4 w-4 mr-2" />,
  },
];

const Dashboard: React.FC = () => {
  const { activeSite, loading } = useSiteContext();
  const [activeTab, setActiveTab] = useState('overview');

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <TooltipProvider>
      <Main containerSize="default" className="max-w-[1600px] mx-auto pt-0">
        <DashboardHeader />

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm mb-6 -mx-4 px-4 pt-4 pb-2">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-gray-100/50 dark:bg-gray-900/50 backdrop-blur-md p-1 rounded-lg">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex items-center data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-md transition-all duration-200"
                >
                  {tab.icon}
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6 animate-in fade-in">
            <DashboardSummary />
            <DashboardCharts />
          </TabsContent>

          <TabsContent value="consumption" className="animate-in fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <TelemetryPanel />
              <AlertsFeed />
            </div>
          </TabsContent>

          <TabsContent value="production" className="animate-in fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <AnalyticsCard />
              <OptimizationLog />
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="card p-6 glass-panel flex flex-col items-center justify-center text-center md:col-span-3">
                <h2 className="text-2xl font-bold mb-4">Energy Management System Analytics</h2>
                <p className="text-muted-foreground mb-6">
                  Comprehensive analytics and insights for your energy management system. 
                  Monitor performance, identify optimization opportunities, and make data-driven decisions.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
                  <div className="flex flex-col items-center">
                    <Database className="h-8 w-8 mb-2 text-blue-500" />
                    <h3 className="font-medium">Data Analysis</h3>
                    <p className="text-sm text-muted-foreground">Historical data analysis</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <AlertTriangle className="h-8 w-8 mb-2 text-amber-500" />
                    <h3 className="font-medium">Alerts</h3>
                    <p className="text-sm text-muted-foreground">System alerts and notifications</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <Gauge className="h-8 w-8 mb-2 text-green-500" />
                    <h3 className="font-medium">Performance</h3>
                    <p className="text-sm text-muted-foreground">System performance metrics</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <Zap className="h-8 w-8 mb-2 text-purple-500" />
                    <h3 className="font-medium">Optimization</h3>
                    <p className="text-sm text-muted-foreground">Energy optimization strategies</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <TelemetryPanel />
              <div className="lg:col-span-2">
                <OptimizationLog />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Main>
    </TooltipProvider>
  );
};

export default Dashboard;
