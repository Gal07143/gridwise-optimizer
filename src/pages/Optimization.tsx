
import React, { useEffect } from 'react';
import { Main } from '@/components/ui/main';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Zap, Calendar, Clock, ChevronRight, BarChart3 } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import OptimizationControls from '@/components/dashboard/energy-optimization/OptimizationControls';
import EnhancedEnergyFlow from '@/components/energy/EnhancedEnergyFlow';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AreaChart, Area, CartesianGrid, Tooltip, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';

// Sample optimization result data
const sampleOptimizationData = [
  { time: '00:00', battery: -2.1, grid: 0.5, solar: 0, load: 1.2 },
  { time: '03:00', battery: -1.5, grid: 0.3, solar: 0, load: 0.9 },
  { time: '06:00', battery: -0.8, grid: 0.2, solar: 0.7, load: 1.1 },
  { time: '09:00', battery: 1.2, grid: -0.5, solar: 3.2, load: 1.5 },
  { time: '12:00', battery: 1.5, grid: -1.2, solar: 4.1, load: 1.4 },
  { time: '15:00', battery: 0.9, grid: -0.4, solar: 2.8, load: 1.7 },
  { time: '18:00', battery: -1.2, grid: 0.3, solar: 0.5, load: 2.0 },
  { time: '21:00', battery: -1.8, grid: 0.6, solar: 0, load: 1.8 },
];

const Optimization: React.FC = () => {
  const { setDashboardView, currentSite } = useAppStore();
  
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
            Configure and run energy optimization strategies for {currentSite?.name || 'your site'}
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
              
              <Card className="shadow-sm border border-slate-200 dark:border-slate-800 mt-6">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-500" />
                    Energy Savings
                  </CardTitle>
                  <CardDescription>Potential savings with optimization</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                      <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Cost Savings</div>
                      <div className="text-xl font-bold mt-1">€4.32 <span className="text-xs text-green-500">today</span></div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                      <div className="text-sm font-medium text-slate-500 dark:text-slate-400">CO₂ Reduction</div>
                      <div className="text-xl font-bold mt-1">12.5 <span className="text-xs text-green-500">kg</span></div>
                    </div>
                  </div>
                  
                  <Alert className="mt-4 bg-blue-50 dark:bg-blue-950/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-900">
                    <AlertTitle className="text-sm font-semibold">Optimization tip</AlertTitle>
                    <AlertDescription className="text-xs">
                      Shifting your EV charging to 2:00-6:00 AM could save an additional €2.18 per day.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2">
              <Card className="shadow-sm border border-slate-200 dark:border-slate-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Optimization Results</CardTitle>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1 text-xs">
                      View Details <ChevronRight className="h-3 w-3" />
                    </Button>
                  </div>
                  <CardDescription>
                    24-hour optimization plan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={sampleOptimizationData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                        <defs>
                          <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#fbbf24" stopOpacity={0.2} />
                          </linearGradient>
                          <linearGradient id="colorBattery" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2} />
                          </linearGradient>
                          <linearGradient id="colorGrid" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#a855f7" stopOpacity={0.2} />
                          </linearGradient>
                          <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.2} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                        <YAxis tickFormatter={(value) => `${value} kW`} tick={{ fontSize: 12 }} />
                        <Tooltip 
                          formatter={(value) => [`${value} kW`, '']}
                          labelFormatter={(label) => `Time: ${label}`}
                        />
                        <Area
                          type="monotone"
                          dataKey="solar"
                          stackId="1"
                          stroke="#fbbf24"
                          fillOpacity={1}
                          fill="url(#colorSolar)"
                          name="Solar"
                        />
                        <Area
                          type="monotone"
                          dataKey="battery"
                          stackId="2"
                          stroke="#3b82f6"
                          fillOpacity={1}
                          fill="url(#colorBattery)"
                          name="Battery"
                        />
                        <Area
                          type="monotone"
                          dataKey="grid"
                          stackId="3"
                          stroke="#a855f7"
                          fillOpacity={1}
                          fill="url(#colorGrid)"
                          name="Grid"
                        />
                        <Area
                          type="monotone"
                          dataKey="load"
                          stroke="#10b981"
                          fillOpacity={0}
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          name="Load"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 mt-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center">
                        <div className="w-3 h-3 bg-amber-400 rounded-full mr-2"></div>
                        <span className="text-sm">Solar</span>
                      </div>
                      <p className="text-lg font-semibold mt-1">11.3 kWh</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                        <span className="text-sm">Battery</span>
                      </div>
                      <p className="text-lg font-semibold mt-1">±5.7 kWh</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center">
                        <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                        <span className="text-sm">Grid</span>
                      </div>
                      <p className="text-lg font-semibold mt-1">-0.2 kWh</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-sm">Load</span>
                      </div>
                      <p className="text-lg font-semibold mt-1">16.8 kWh</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="mt-6">
                <EnhancedEnergyFlow 
                  siteId={currentSite?.id}
                  title="Current Energy Flow" 
                />
              </div>
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
                <BarChart3 className="h-16 w-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                <p className="text-lg">Optimization scheduling coming soon</p>
                <p className="text-sm mt-2 max-w-md mx-auto">
                  This feature will allow you to set up recurring optimization tasks based on time of day, electricity prices, and weather forecasts.
                </p>
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
                <Clock className="h-16 w-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                <p className="text-lg">No optimization history available</p>
                <p className="text-sm mt-2 max-w-md mx-auto">
                  Run your first optimization on the Control tab to see your history and performance metrics.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Main>
  );
};

export default Optimization;
