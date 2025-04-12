
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Zap, Battery, Sun } from 'lucide-react';
import EnhancedEnergyFlow from '@/components/energy/EnhancedEnergyFlow';
import { cn } from '@/lib/utils';

interface EnergyDashboardWidgetProps {
  siteId?: string;
  className?: string;
  expandable?: boolean;
  showTabs?: boolean;
}

// Sample data
const energyData = [
  { time: '00:00', solar: 0, grid: 2.1, battery: -0.8, load: 1.3 },
  { time: '04:00', solar: 0, grid: 1.8, battery: -0.5, load: 1.3 },
  { time: '08:00', solar: 1.5, grid: 0.5, battery: -0.3, load: 1.7 },
  { time: '12:00', solar: 4.5, grid: -2.1, battery: 0.8, load: 1.6 },
  { time: '16:00', solar: 2.4, grid: -0.5, battery: 0.4, load: 1.5 },
  { time: '20:00', solar: 0.2, grid: 1.3, battery: 0.2, load: 1.7 },
];

const EnergyDashboardWidget: React.FC<EnergyDashboardWidgetProps> = ({
  siteId,
  className,
  expandable = false,
  showTabs = true
}) => {
  return (
    <Card className={cn("shadow-sm", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Zap className="h-5 w-5 text-blue-500" />
          Energy Overview
        </CardTitle>
        <CardDescription>
          Real-time energy distribution and flow for your site
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {showTabs ? (
          <Tabs defaultValue="flow" className="p-0">
            <div className="px-6">
              <TabsList className="w-full mb-4 h-9">
                <TabsTrigger value="flow" className="text-xs">Energy Flow</TabsTrigger>
                <TabsTrigger value="chart" className="text-xs">Energy Chart</TabsTrigger>
                <TabsTrigger value="stats" className="text-xs">Key Stats</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="flow" className="mt-0">
              <div className="h-72">
                <EnhancedEnergyFlow 
                  siteId={siteId} 
                  hideHeader 
                  className="h-full"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="chart" className="mt-0 px-6 pb-6">
              <div className="h-64 mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={energyData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorSolarChart" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#fbbf24" stopOpacity={0.2} />
                      </linearGradient>
                      <linearGradient id="colorBatteryChart" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2} />
                      </linearGradient>
                      <linearGradient id="colorGridChart" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0.2} />
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
                      fill="url(#colorSolarChart)"
                      name="Solar"
                    />
                    <Area
                      type="monotone"
                      dataKey="battery"
                      stackId="2"
                      stroke="#3b82f6"
                      fillOpacity={1}
                      fill="url(#colorBatteryChart)"
                      name="Battery"
                    />
                    <Area
                      type="monotone"
                      dataKey="grid"
                      stackId="3"
                      stroke="#a855f7"
                      fillOpacity={1}
                      fill="url(#colorGridChart)"
                      name="Grid"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                  <span className="text-sm">Solar: 8.6 kWh</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Battery: ±2.4 kWh</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">Grid: 3.1 kWh</span>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="stats" className="mt-0 p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Self-Consumption</span>
                    <Sun className="h-4 w-4 text-amber-500" />
                  </div>
                  <div className="text-lg font-semibold">76%</div>
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 mt-1 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '76%' }}></div>
                  </div>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Battery Level</span>
                    <Battery className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="text-lg font-semibold">63%</div>
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 mt-1 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '63%' }}></div>
                  </div>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Grid Import</span>
                    <Zap className="h-4 w-4 text-purple-500" />
                  </div>
                  <div className="text-lg font-semibold">3.1 kW</div>
                  <div className="text-xs text-green-600">-12% from yesterday</div>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400">CO₂ Saved</span>
                    <svg className="h-4 w-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 12.29V12c0-5.52-4.48-10-10-10S2 6.48 2 12s4.48 10 10 10c.96 0 1.92-.14 2.84-.4"/>
                      <path d="M2 12h20"/>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10"/>
                      <path d="M12 2a15.3 15.3 0 0 0-4 10 15.3 15.3 0 0 0 4 10"/>
                    </svg>
                  </div>
                  <div className="text-lg font-semibold">6.2 kg</div>
                  <div className="text-xs text-green-600">Today</div>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Cost Saving</span>
                    <svg className="h-4 w-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                    </svg>
                  </div>
                  <div className="text-lg font-semibold">€3.87</div>
                  <div className="text-xs text-green-600">Today</div>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Peak Power</span>
                    <svg className="h-4 w-4 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <path d="m16 13-3.5 3.5-2-2L8 17"/>
                    </svg>
                  </div>
                  <div className="text-lg font-semibold">4.8 kW</div>
                  <div className="text-xs text-slate-500">At 12:32</div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="h-72">
            <EnhancedEnergyFlow 
              siteId={siteId} 
              hideHeader 
              className="h-full"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnergyDashboardWidget;
