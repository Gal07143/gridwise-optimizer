
import React, { useState } from 'react';
import { Main } from '@/components/ui/main';
import DashboardCharts from '@/components/dashboard/DashboardCharts';
import DashboardSummary from '@/components/dashboard/DashboardSummary';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import LoadingScreen from '@/components/LoadingScreen';
import { TooltipProvider } from '@/components/ui/tooltip';
import { BarChart2, PieChart, LineChart, Activity } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSiteContext } from '@/contexts/SiteContext';

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
            <div className="glass-panel p-8 flex items-center justify-center">
              <p className="text-xl text-muted-foreground">Consumption Analysis</p>
            </div>
          </TabsContent>

          <TabsContent value="production" className="animate-in fade-in">
            <div className="glass-panel p-8 flex items-center justify-center">
              <p className="text-xl text-muted-foreground">Production Analysis</p>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="animate-in fade-in">
            <div className="glass-panel p-8 flex items-center justify-center">
              <p className="text-xl text-muted-foreground">Analytics Dashboard</p>
            </div>
          </TabsContent>
        </Tabs>
      </Main>
    </TooltipProvider>
  );
};

export default Dashboard;
