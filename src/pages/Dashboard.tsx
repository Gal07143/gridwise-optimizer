
import React, { useEffect } from 'react';
import { Main } from '@/components/ui/main';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/store/appStore';
import { EnergyFlowProvider } from '@/components/dashboard/energy-flow/EnergyFlowContext';
import HighTechEnergyFlow from '@/components/energy/HighTechEnergyFlow';
import { Button } from '@/components/ui/button';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  Battery, 
  CalendarDays, 
  ChevronsRight, 
  CircleDollarSign, 
  Clock,
  Download,
  Gauge,
  Home, 
  LineChart,
  RefreshCw, 
  Share2, 
  Sun, 
  Zap 
} from 'lucide-react';

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

const priceData = [
  { time: '00:00', price: 0.14 },
  { time: '02:00', price: 0.12 },
  { time: '04:00', price: 0.12 },
  { time: '06:00', price: 0.15 },
  { time: '08:00', price: 0.22 },
  { time: '10:00', price: 0.28 },
  { time: '12:00', price: 0.30 },
  { time: '14:00', price: 0.32 },
  { time: '16:00', price: 0.30 },
  { time: '18:00', price: 0.35 },
  { time: '20:00', price: 0.25 },
  { time: '22:00', price: 0.18 },
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
            <h1 className="text-2xl font-bold">Energy Dashboard</h1>
            <p className="text-slate-600 dark:text-slate-400">
              {currentSite?.name || 'Main Site'} overview and real-time energy monitoring
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <Share2 className="h-4 w-4" /> Share
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <Download className="h-4 w-4" /> Export
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <RefreshCw className="h-4 w-4" /> Refresh
            </Button>
          </div>
        </div>
        
        {/* System Overview Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800/30">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Grid Supply</p>
                <h3 className="text-2xl font-bold">2.2 kW</h3>
                <p className="text-xs text-blue-500 dark:text-blue-400 flex items-center">
                  <ArrowDownToLine className="h-3 w-3 mr-1" /> Importing from grid
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-200 dark:bg-blue-700/30 flex items-center justify-center">
                <Zap className="text-blue-600 dark:text-blue-300" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-800/30">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">PV Production</p>
                <h3 className="text-2xl font-bold">1.2 kW</h3>
                <p className="text-xs text-yellow-500 dark:text-yellow-400 flex items-center">
                  <ArrowUpFromLine className="h-3 w-3 mr-1" /> 67% capacity
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-yellow-200 dark:bg-yellow-700/30 flex items-center justify-center">
                <Sun className="text-yellow-600 dark:text-yellow-300" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800/30">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Battery Level</p>
                <h3 className="text-2xl font-bold">76%</h3>
                <p className="text-xs text-purple-500 dark:text-purple-400 flex items-center">
                  <ArrowUpFromLine className="h-3 w-3 mr-1" /> Charging at 0.6 kW
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-purple-200 dark:bg-purple-700/30 flex items-center justify-center">
                <Battery className="text-purple-600 dark:text-purple-300" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800/30">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">Household</p>
                <h3 className="text-2xl font-bold">2.8 kW</h3>
                <p className="text-xs text-green-500 dark:text-green-400 flex items-center">
                  <ArrowDownToLine className="h-3 w-3 mr-1" /> Current consumption
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-green-200 dark:bg-green-700/30 flex items-center justify-center">
                <Home className="text-green-600 dark:text-green-300" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Middle Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Energy Flow Diagram */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-lg">
                  <div className="flex items-center gap-2">
                    <Gauge className="h-5 w-5 text-blue-500" />
                    Total Energy Management
                  </div>
                </CardTitle>
                <div className="flex items-center gap-2 text-sm">
                  <span className="flex items-center text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    Live view
                  </span>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 rounded-md">
                  <HighTechEnergyFlow 
                    siteId={currentSite?.id}
                    title="Live Energy Flow"
                    subtitle="Real-time power distribution"
                    variant="detailed"
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="flex flex-col items-center p-3 rounded-md bg-blue-50 dark:bg-blue-900/20">
                    <div className="text-blue-600 dark:text-blue-400 text-sm font-medium">Total Energy Today</div>
                    <div className="text-2xl font-bold">28.4 kWh</div>
                  </div>
                  <div className="flex flex-col items-center p-3 rounded-md bg-green-50 dark:bg-green-900/20">
                    <div className="text-green-600 dark:text-green-400 text-sm font-medium">Self-Consumption</div>
                    <div className="text-2xl font-bold">76%</div>
                  </div>
                  <div className="flex flex-col items-center p-3 rounded-md bg-purple-50 dark:bg-purple-900/20">
                    <div className="text-purple-600 dark:text-purple-400 text-sm font-medium">Peak Demand</div>
                    <div className="text-2xl font-bold">5.2 kW</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Price and Balance Area */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CircleDollarSign className="h-5 w-5 text-blue-500" />
                  Dynamic Electricity Price
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">28.65 ¢/kWh</div>
                <div className="text-xs text-muted-foreground">Current Price Period: Dec 6, 18:00-19:00</div>
                
                <div className="h-[150px] mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={priceData}
                      margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                    >
                      <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="price" 
                        stroke="#3b82f6" 
                        fillOpacity={1} 
                        fill="url(#colorPrice)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="flex justify-between mt-2 text-xs">
                  <Button variant="ghost" size="sm" className="text-blue-500 p-0">7 days</Button>
                  <Button variant="ghost" size="sm" className="text-blue-500 p-0">Yesterday</Button>
                  <Button variant="ghost" size="sm" className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 p-0 px-2">Today</Button>
                  <Button variant="ghost" size="sm" className="text-blue-500 p-0">Tomorrow</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-green-500" />
                  System Cost Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">0.15 €/kWh</div>
                <div className="text-xs text-muted-foreground mb-2">Estimated savings compared to standard tariff</div>
                
                <div className="bg-slate-100 dark:bg-slate-800/50 p-3 rounded-md">
                  <p className="text-xs text-slate-600 dark:text-slate-400">Without your home energy management system you would have paid:</p>
                  <p className="text-lg font-semibold mt-1">0.33 €/kWh</p>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mt-4">
                  <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-md text-center">
                    <p className="text-xs text-green-700 dark:text-green-400">Savings</p>
                    <p className="font-bold text-green-700 dark:text-green-400">24.70 €</p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-md text-center">
                    <p className="text-xs text-blue-700 dark:text-blue-400">Feed-in</p>
                    <p className="font-bold text-blue-700 dark:text-blue-400">0.70 €</p>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-md text-center">
                    <p className="text-xs text-red-700 dark:text-red-400">Grid cost</p>
                    <p className="font-bold text-red-700 dark:text-red-400">10.00 €</p>
                  </div>
                </div>
                
                <div className="mt-3 text-center">
                  <p className="text-sm font-medium">Friday, 04.12.2024</p>
                </div>
                
                <div className="flex gap-1 mt-3">
                  <Button variant="outline" size="sm" className="flex-1">Account</Button>
                  <Button variant="outline" size="sm" className="flex-1">Yesterday</Button>
                  <Button variant="outline" size="sm" className="flex-1">Team</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Bottom Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-2 flex items-center justify-between">
                <CardTitle className="text-lg">Today's Energy Flow</CardTitle>
                <Button variant="outline" size="sm" className="gap-1">
                  <CalendarDays className="h-4 w-4" />
                  <span>Select Date</span>
                </Button>
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
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
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
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <Button variant="outline" className="w-full">
                    <span>Daily Balance</span>
                    <ChevronsRight className="ml-auto h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="w-full">
                    <span>Weekly Balance</span>
                    <ChevronsRight className="ml-auto h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-purple-500" />
                  Smart Optimization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">3 times</div>
                <div className="text-sm text-purple-600 dark:text-purple-400">your system was additionally optimized based on electricity prices in the last 8h.</div>
                
                <div className="flex items-center justify-center mt-4">
                  <div className="w-full h-6 bg-gradient-to-r from-green-100 via-yellow-100 to-red-100 dark:from-green-900/30 dark:via-yellow-900/30 dark:to-red-900/30 rounded-full relative">
                    {Array.from({ length: 15 }).map((_, i) => (
                      <div 
                        key={i}
                        className="absolute top-1/2 transform -translate-y-1/2 w-1.5 h-6"
                        style={{ left: `${(i + 1) * 6.5}%`, backgroundColor: i % 3 === 1 ? '#10b981' : 'transparent' }}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="mt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">18:00-18:45</span>
                    <span className="text-sm font-medium">5.2 kWh</span>
                  </div>
                  
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-1 p-2 bg-slate-100 dark:bg-slate-800/50 rounded-md">
                    Your system is already performing optimally based on predicted consumption needs.
                  </div>
                </div>
                
                <div className="mt-4">
                  <Button className="w-full" size="sm">
                    View Optimization Details
                  </Button>
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
