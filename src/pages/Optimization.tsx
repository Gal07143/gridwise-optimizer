
import React, { useEffect } from 'react';
import { Main } from '@/components/ui/main';
import { useAppStore } from '@/store/appStore';
import { Grid2X2, LineChart, Zap } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OptimizationControls from '@/components/dashboard/energy-optimization/OptimizationControls';
import RecommendationsCard from '@/components/dashboard/energy-optimization/RecommendationsCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { generateAIForecasts } from '@/services/energyOptimizationService';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { fetchLatestTariff, fetchTariffHistory } from '@/services/supabase/supabaseService';
import { Skeleton } from '@/components/ui/skeleton';

const Optimization: React.FC = () => {
  const { currentSite, setDashboardView } = useAppStore();
  const siteId = currentSite?.id || '';
  
  // Fetch forecasts
  const { data: forecasts = [], isLoading: isLoadingForecasts, refetch: refetchForecasts } = useQuery({
    queryKey: ['forecasts', siteId],
    queryFn: () => generateAIForecasts(siteId),
    enabled: !!siteId,
  });
  
  // Fetch tariffs
  const { data: tariffHistory = [], isLoading: isLoadingTariffs } = useQuery({
    queryKey: ['tariffHistory'],
    queryFn: () => fetchTariffHistory(48),
    enabled: !!siteId,
  });
  
  // Fetch latest tariff
  const { data: latestTariff } = useQuery({
    queryKey: ['latestTariff'],
    queryFn: fetchLatestTariff,
  });
  
  // Process forecast data for charts
  const processedForecasts = forecasts.map((f: any) => {
    const date = new Date(f.forecast_time);
    return {
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: date.toLocaleDateString(),
      fullDate: date,
      generation: f.generation_forecast,
      consumption: f.consumption_forecast,
      netEnergy: f.generation_forecast - f.consumption_forecast,
    };
  }).sort((a: any, b: any) => a.fullDate.getTime() - b.fullDate.getTime());
  
  // Process tariff data for charts
  const processedTariffs = tariffHistory.map((t: any) => {
    const date = new Date(t.timestamp);
    return {
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: date.toLocaleDateString(),
      fullDate: date,
      price: t.price_eur_kwh,
    };
  }).sort((a: any, b: any) => a.fullDate.getTime() - b.fullDate.getTime());
  
  // Set page context
  useEffect(() => {
    setDashboardView('optimization');
  }, [setDashboardView]);
  
  return (
    <Main title="Energy Optimization">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Zap className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              AI-Powered Energy Optimization
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Optimize your energy usage based on forecasts, tariffs, and AI recommendations
            </p>
          </div>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => refetchForecasts()}
          >
            <LineChart className="h-4 w-4" />
            Refresh Forecasts
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Grid2X2 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="forecasts" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            Forecasts & Tariffs
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              {currentSite ? (
                <OptimizationControls />
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-slate-500">Please select a site to view optimization controls</p>
                  </CardContent>
                </Card>
              )}
            </div>
            
            <div>
              {currentSite ? (
                <RecommendationsCard />
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-slate-500">Please select a site to view recommendations</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Current Energy Insights</CardTitle>
              <CardDescription>
                Real-time energy metrics and optimization potential
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Current Tariff Rate</div>
                  {latestTariff ? (
                    <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                      {latestTariff.price_eur_kwh.toFixed(3)} €/kWh
                    </div>
                  ) : (
                    <Skeleton className="h-8 w-1/2" />
                  )}
                  <div className="text-sm text-slate-500">
                    Updated {latestTariff ? new Date(latestTariff.timestamp).toLocaleTimeString() : 'recently'}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Self-Consumption Rate</div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    76%
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">
                    ↑ 12% this week
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">AI Savings Potential</div>
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    34.60 € / month
                  </div>
                  <div className="text-sm text-slate-500">
                    Based on current usage patterns
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="forecasts" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Energy Forecasts (24h)</CardTitle>
                <CardDescription>
                  AI-generated forecasts for the next 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingForecasts ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={processedForecasts}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis 
                        dataKey="time" 
                        tickMargin={8}
                        style={{ fontSize: '12px' }}
                      />
                      <YAxis
                        style={{ fontSize: '12px' }}
                        tickMargin={8}
                        label={{ value: 'Power (kW)', angle: -90, position: 'insideLeft', dy: 40, fontSize: '12px' }}
                      />
                      <Tooltip
                        formatter={(value: number) => [`${value.toFixed(2)} kW`, 'Power']}
                        labelFormatter={(label) => `Time: ${label}`}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="generation" 
                        name="Generation" 
                        stroke="#10b981" 
                        fill="#10b981"
                        fillOpacity={0.2} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="consumption" 
                        name="Consumption" 
                        stroke="#3b82f6" 
                        fill="#3b82f6"
                        fillOpacity={0.2} 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
                <div className="text-xs text-center mt-4 text-slate-500">
                  Forecasts are updated regularly based on weather predictions and historical patterns
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Electricity Tariffs (48h)</CardTitle>
                <CardDescription>
                  Historical and predicted electricity prices
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingTariffs ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={processedTariffs}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis 
                        dataKey="time" 
                        tickMargin={8}
                        style={{ fontSize: '12px' }}
                      />
                      <YAxis
                        style={{ fontSize: '12px' }}
                        tickMargin={8}
                        label={{ value: 'Price (€/kWh)', angle: -90, position: 'insideLeft', dy: 50, fontSize: '12px' }}
                      />
                      <Tooltip
                        formatter={(value: number) => [`${value.toFixed(3)} €/kWh`, 'Price']}
                        labelFormatter={(label) => `Time: ${label}`}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="price" 
                        name="Price" 
                        stroke="#8884d8" 
                        fill="#8884d8"
                        fillOpacity={0.2} 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
                <div className="text-xs text-center mt-4 text-slate-500">
                  Current: {latestTariff ? `${latestTariff.price_eur_kwh.toFixed(3)} €/kWh` : 'Loading...'} • 
                  Avg: {processedTariffs.length > 0 ? 
                    `${(processedTariffs.reduce((sum, t) => sum + t.price, 0) / processedTariffs.length).toFixed(3)} €/kWh` : 
                    'Loading...'}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </Main>
  );
};

export default Optimization;
