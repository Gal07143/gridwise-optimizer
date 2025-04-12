
import React, { useEffect } from 'react';
import { Main } from '@/components/ui/main';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/store/appStore';
import { EnergyFlowProvider } from '@/components/dashboard/energy-flow/EnergyFlowContext';
import HighTechEnergyFlow from '@/components/energy/HighTechEnergyFlow';
import EnergyDashboardWidget from '@/components/dashboard/EnergyDashboardWidget';
import { Button } from '@/components/ui/button';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Gauge } from 'lucide-react';

// Sample data for quick visualization
const energyData = [
  { name: '00:00', consumption: 2.1, generation: 0, battery: -0.5 },
  { name: '02:00', consumption: 1.9, generation: 0, battery: -0.3 },
  { name: '04:00', consumption: 1.8, generation: 0.2, battery: 0 },
  { name: '06:00', consumption: 2.0, generation: 0.8, battery: 0.2 },
  { name: '08:00', consumption: 2.5, generation: 1.5, battery: 0.5 },
  { name: '10:00', consumption: 3.1, generation: 2.4, battery: 0.7 },
  { name: '12:00', consumption: 2.8, generation: 3.5, battery: 1.2 },
  { name: '14:00', consumption: 2.4, generation: 3.2, battery: 0.8 },
  { name: '16:00', consumption: 2.3, generation: 2.1, battery: 0.4 },
  { name: '18:00', consumption: 3.2, generation: 1.5, battery: -0.2 },
  { name: '20:00', consumption: 3.5, generation: 0.6, battery: -0.8 },
  { name: '22:00', consumption: 2.9, generation: 0, battery: -0.6 },
];

const Dashboard: React.FC = () => {
  const { setDashboardView, currentSite } = useAppStore();
  
  useEffect(() => {
    setDashboardView('energy'); // Change to a valid view value
  }, [setDashboardView]);
  
  return (
    <EnergyFlowProvider>
      <Main>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Energy Dashboard</h1>
            <p className="text-slate-600 dark:text-slate-400">
              {currentSite?.name || 'Site'} overview and real-time energy monitoring
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Export Data</Button>
            <Button size="sm">Optimize System</Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* High-tech energy flow */}
          <div className="lg:col-span-2">
            <HighTechEnergyFlow 
              siteId={currentSite?.id}
              title="Live Energy Flow"
              subtitle="Real-time power distribution across your system"
              variant="detailed"
            />
          </div>
          
          {/* Power gauges */}
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-blue-500" />
                  Power Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Solar gauge */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">Solar Production</div>
                      <div className="text-2xl font-semibold">3.2 kW</div>
                    </div>
                    <div className="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                  
                  {/* Battery gauge */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">Battery</div>
                      <div className="text-2xl font-semibold">1.1 kW</div>
                    </div>
                    <div className="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: '30%' }}></div>
                    </div>
                  </div>
                  
                  {/* Grid gauge */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">Grid Import</div>
                      <div className="text-2xl font-semibold">0.5 kW</div>
                    </div>
                    <div className="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500" style={{ width: '15%' }}></div>
                    </div>
                  </div>
                  
                  {/* Home consumption gauge */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">Consumption</div>
                      <div className="text-2xl font-semibold">2.8 kW</div>
                    </div>
                    <div className="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: '55%' }}></div>
                    </div>
                  </div>
                  
                  <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Self-Consumption</div>
                      <div className="text-lg font-semibold text-green-600">76%</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Energy chart */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Today's Energy Flow</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={energyData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorConsumption" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id="colorGeneration" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id="colorBattery" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="consumption"
                        stroke="#10b981"
                        fillOpacity={1}
                        fill="url(#colorConsumption)"
                        name="Consumption"
                      />
                      <Area
                        type="monotone"
                        dataKey="generation"
                        stroke="#f59e0b"
                        fillOpacity={1}
                        fill="url(#colorGeneration)"
                        name="Generation"
                      />
                      <Area
                        type="monotone"
                        dataKey="battery"
                        stroke="#3b82f6"
                        fillOpacity={1}
                        fill="url(#colorBattery)"
                        name="Battery"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Energy stats */}
          <div>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Energy Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Solar Generation</span>
                    <span className="font-medium">24.8 kWh</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Grid Import</span>
                    <span className="font-medium">8.3 kWh</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Grid Export</span>
                    <span className="font-medium">6.1 kWh</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Home Consumption</span>
                    <span className="font-medium">27.0 kWh</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Battery Charge</span>
                    <span className="font-medium">10.2 kWh</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Battery Discharge</span>
                    <span className="font-medium">4.0 kWh</span>
                  </div>
                  <div className="pt-2 mt-2 border-t">
                    <div className="flex justify-between">
                      <span className="font-medium">Self Consumption Rate</span>
                      <span className="font-bold text-green-600">76%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Main>
    </EnergyFlowProvider>
  );
};

export default Dashboard;
