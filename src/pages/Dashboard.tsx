import React, { useEffect } from 'react';
import { Main } from '@/components/ui/main';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import LoadingScreen from '@/components/LoadingScreen';
import { TooltipProvider } from '@/components/ui/tooltip';
import { BarChart2, PieChart, LineChart, Activity, Gauge } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSiteContext } from '@/contexts/SiteContext';
import DashboardSummary from '@/components/dashboard/DashboardSummary';
import DashboardCharts from '@/components/dashboard/DashboardCharts';
import EnergyManagementDashboard from '@/components/ems/EnergyManagementDashboard';
import AppLayout from '@/components/layout/AppLayout';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/appStore';

// Dashboard tabs
const tabs = [
  {
    id: 'overview',
    label: 'Overview',
    icon: <BarChart2 className="h-4 w-4 mr-2" />,
  },
  {
    id: 'energy',
    label: 'Energy Management',
    icon: <Gauge className="h-4 w-4 mr-2" />,
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
  const { activeTab, setActiveTab } = useAppStore();

  useEffect(() => {
    // Track page view
    console.log('Dashboard viewed');
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  // Animation variants for the content
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <AppLayout>
      <TooltipProvider>
        <Main containerSize="default" className="max-w-[1600px] mx-auto pt-0">
          <DashboardHeader />

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm mb-6 -mx-4 px-4 pt-4 pb-2">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 bg-muted/50 backdrop-blur-md p-1 rounded-lg">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex items-center data-[state=active]:bg-background data-[state=active]:shadow-md transition-all duration-200"
                  >
                    {tab.icon}
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <TabsContent value="overview" className="space-y-6">
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={contentVariants}
              >
                <DashboardSummary />
                <DashboardCharts />
              </motion.div>
            </TabsContent>

            <TabsContent value="energy">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={contentVariants}
              >
                <EnergyManagementDashboard />
              </motion.div>
            </TabsContent>

            <TabsContent value="consumption">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={contentVariants}
              >
                <div className="p-6 text-center">
                  <h2 className="text-2xl font-bold mb-4">Energy Consumption Dashboard</h2>
                  <p className="text-muted-foreground mb-6">
                    This tab will display detailed consumption metrics and analysis.
                    Please use the Analytics page for the full consumption overview.
                  </p>
                  <div className="flex justify-center">
                    <img 
                      src="/placeholder.svg" 
                      alt="Consumption Dashboard" 
                      className="max-w-md rounded-lg border shadow-md" 
                    />
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="production">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={contentVariants}
              >
                <div className="p-6 text-center">
                  <h2 className="text-2xl font-bold mb-4">Energy Production Dashboard</h2>
                  <p className="text-muted-foreground mb-6">
                    This tab will display detailed production metrics and analysis.
                    Please use the Analytics page for the full production overview.
                  </p>
                  <div className="flex justify-center">
                    <img 
                      src="/placeholder.svg" 
                      alt="Production Dashboard" 
                      className="max-w-md rounded-lg border shadow-md" 
                    />
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="analytics">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={contentVariants}
              >
                <div className="p-6 text-center">
                  <h2 className="text-2xl font-bold mb-4">Energy Analytics Dashboard</h2>
                  <p className="text-muted-foreground mb-6">
                    This tab provides a summary of analytics. For detailed analysis,
                    please visit the dedicated Analytics page.
                  </p>
                  <div className="flex justify-center">
                    <img 
                      src="/placeholder.svg" 
                      alt="Analytics Dashboard" 
                      className="max-w-md rounded-lg border shadow-md" 
                    />
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </Main>
      </TooltipProvider>
    </AppLayout>
  );
};

export default Dashboard;
