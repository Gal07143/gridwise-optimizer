
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSite } from '@/contexts/SiteContext';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/components/layout/AppLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSummary from '@/components/dashboard/DashboardSummary';
import DashboardCharts from '@/components/dashboard/DashboardCharts';
import DashboardLoading from '@/components/dashboard/DashboardLoading';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BarChart3, Zap, LineChart, ArrowDownToLine } from 'lucide-react';
import EnergyFlowChart from '@/components/dashboard/EnergyFlowChart';

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentSite } = useSite();

  useEffect(() => {
    if (!currentSite) {
      toast({
        title: "No site selected",
        description: "Please select or create a site to view the dashboard",
      });
      navigate("/settings/sites");
    }
  }, [currentSite, navigate, toast]);

  // Handle the case where we don't have a site yet
  if (!currentSite) {
    return <DashboardLoading />;
  }

  return (
    <AppLayout>
      <ErrorBoundary>
        <div className="animate-in fade-in duration-500">
          <DashboardHeader siteName={currentSite.name} />
          
          <Tabs defaultValue="overview" className="mt-6">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="overview">
                <BarChart3 className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="energy-flow">
                <Zap className="h-4 w-4 mr-2" />
                Energy Flow
              </TabsTrigger>
              <TabsTrigger value="consumption">
                <LineChart className="h-4 w-4 mr-2" />
                Consumption
              </TabsTrigger>
              <TabsTrigger value="forecasts">
                <ArrowDownToLine className="h-4 w-4 mr-2" />
                Forecasts
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <DashboardSummary />
              <DashboardCharts />
            </TabsContent>
            
            <TabsContent value="energy-flow">
              <Card>
                <CardContent className="pt-6">
                  <EnergyFlowChart />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="consumption">
              <div className="text-center p-12 text-muted-foreground">
                Consumption details will be displayed here
              </div>
            </TabsContent>
            
            <TabsContent value="forecasts">
              <div className="text-center p-12 text-muted-foreground">
                Energy forecasts will be displayed here
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ErrorBoundary>
    </AppLayout>
  );
};

export default Dashboard;
