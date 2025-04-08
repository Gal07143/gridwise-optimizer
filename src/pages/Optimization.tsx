
import React, { useEffect } from 'react';
import { Main } from '@/components/ui/main';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Zap, Calendar, Clock } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import OptimizationControls from '@/components/dashboard/energy-optimization/OptimizationControls';

const Optimization: React.FC = () => {
  const { setDashboardView } = useAppStore();
  
  useEffect(() => {
    setDashboardView('energy');
  }, [setDashboardView]);
  
  return (
    <Main title="Energy Optimization">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <Zap className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            Energy Optimization
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Configure and run energy optimization strategies
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="control">
        <TabsList>
          <TabsTrigger value="control" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span>Control</span>
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Schedule</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>History</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="control" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <OptimizationControls />
            </div>
            
            <div className="md:col-span-2">
              <Card className="shadow-sm border border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <CardTitle className="text-lg">Optimization Results</CardTitle>
                  <CardDescription>
                    View the results of your optimization
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-slate-500 dark:text-slate-400">
                      Run an optimization to see results here
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="schedule" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Optimization Schedule</CardTitle>
              <CardDescription>
                Set up recurring optimization schedules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                Optimization scheduling coming soon
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Optimization History</CardTitle>
              <CardDescription>
                Review past optimization results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                No optimization history available
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Main>
  );
};

export default Optimization;
