
import React from 'react';
import { Main } from '@/components/ui/main';
import EnergyFlowVisualization from '@/components/dashboard/EnergyFlowVisualization';
import RealtimeDispatchAdvice from '@/components/ai/RealtimeDispatchAdvice';
import SmartOptimizerPanel from '@/components/ai/SmartOptimizerPanel';
import OptimizationControls from '@/components/dashboard/energy-optimization/OptimizationControls';
import SystemRecommendationsCard from '@/components/analytics/SystemRecommendationsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Battery, ChevronRight, CreditCard, Home, BarChart2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/appStore';
import { useQuery } from '@tanstack/react-query';
import { fetchAIRecommendations } from '@/services/supabase/supabaseService';

const Dashboard = () => {
  const { currentSite } = useAppStore();

  const { data: recommendations = [], isLoading: isLoadingRecommendations } = useQuery({
    queryKey: ['ai-recommendations', currentSite?.id],
    queryFn: () => fetchAIRecommendations(currentSite?.id || ''),
    enabled: !!currentSite?.id,
  });

  return (
    <Main title="Dashboard">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Energy Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor and optimize your energy system in real-time
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-6">
        {/* Key Stats Section */}
        <Card className="xl:col-span-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Energy Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-4 rounded-full p-2 bg-blue-100 dark:bg-blue-900/20">
                    <Battery className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Battery Level</p>
                    <h3 className="text-xl font-medium">78%</h3>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-4 rounded-full p-2 bg-yellow-100 dark:bg-yellow-900/20">
                    <Zap className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Solar Production</p>
                    <h3 className="text-xl font-medium">3.8 kW</h3>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-4 rounded-full p-2 bg-green-100 dark:bg-green-900/20">
                    <Home className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Home Consumption</p>
                    <h3 className="text-xl font-medium">2.1 kW</h3>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-4 rounded-full p-2 bg-purple-100 dark:bg-purple-900/20">
                    <CreditCard className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Today's Savings</p>
                    <h3 className="text-xl font-medium">€4.32</h3>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-4 rounded-full p-2 bg-indigo-100 dark:bg-indigo-900/20">
                    <BarChart2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Self-Consumption</p>
                    <h3 className="text-xl font-medium">87%</h3>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* AI Recommendations */}
        <div className="xl:col-span-4">
          <SystemRecommendationsCard
            recommendations={recommendations.map(rec => ({
              id: rec.id,
              title: rec.title,
              description: rec.description,
              potentialSavings: rec.potential_savings ? parseFloat(rec.potential_savings) : undefined,
              impact: rec.priority as 'low' | 'medium' | 'high',
              type: rec.type as 'energy' | 'cost' | 'maintenance' | 'carbon',
              createdAt: rec.created_at || new Date().toISOString(),
              priority: rec.priority as 'low' | 'medium' | 'high',
              status: rec.applied ? 'applied' : 'pending',
              confidence: rec.confidence || 85 // Add default confidence if not provided
            }))}
            isLoading={isLoadingRecommendations}
          />
        </div>
        
        {/* Smart Optimizer */}
        <div className="xl:col-span-4">
          <SmartOptimizerPanel />
        </div>
        
        {/* Energy Flow Visualization - Full Width */}
        <EnergyFlowVisualization />
        
        {/* AI Dispatch Advice */}
        <RealtimeDispatchAdvice />
        
        {/* Optimization Controls */}
        <div className="xl:col-span-4">
          <OptimizationControls />
        </div>
      </div>
    </Main>
  );
};

export default Dashboard;
