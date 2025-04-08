
import React, { useState, useEffect } from 'react';
import { Main } from '@/components/ui/main';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Battery, Zap, Wind, Home, Sun, Maximize2, RefreshCw, Info, SunMedium, PlugZap, Activity, AreaChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAppStore } from '@/store/appStore';
import EnergyFlowChart from '@/components/dashboard/EnergyFlowChart';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { DateRange } from '@/types/site';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { getDeviceEnergyData, getSystemAlerts } from '@/services/energyDataService';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, AreaChart, Area } from 'recharts';
import { addDays, format, subDays } from 'date-fns';

const EnergyFlow: React.FC = () => {
  const { currentSite, setDashboardView } = useAppStore();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('realtime');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [deviceData, setDeviceData] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (currentSite) {
          const [deviceDataResult, alertsResult] = await Promise.all([
            getDeviceEnergyData('solar-01', dateRange),
            getSystemAlerts(currentSite.id, 3),
          ]);
          
          setDeviceData(deviceDataResult);
          setAlerts(alertsResult);
        }
      } catch (error) {
        console.error('Error fetching energy flow data:', error);
        toast({
          title: 'Failed to load energy flow data',
          description: 'Please try again later',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    setDashboardView('energy');
  }, [currentSite, dateRange, toast, setDashboardView]);

  // Handle fullscreen mode
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // Effect to handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <Main title="Energy Flow" className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Zap className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              Energy Flow
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Visualize and analyze the energy flow through your system in real-time
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DateRangePicker 
              dateRange={dateRange} 
              onUpdate={setDateRange}
            />
            <Button variant="outline" size="icon" onClick={toggleFullscreen}>
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="realtime" className="w-full space-y-6" onValueChange={setActiveTab}>
        <TabsList className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
          <TabsTrigger value="realtime" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
            <Activity className="h-4 w-4 mr-2" />
            Realtime Flow
          </TabsTrigger>
          <TabsTrigger value="historical" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
            <AreaChart className="h-4 w-4 mr-2" />
            Historical Data
          </TabsTrigger>
          <TabsTrigger value="optimization" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
            <Zap className="h-4 w-4 mr-2" />
            Optimization
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="realtime" className="space-y-4 mt-4">
          {isLoading ? (
            <Card className="border border-slate-200 dark:border-slate-700 shadow-sm">
              <CardContent className="py-10">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <Skeleton className="h-[400px] w-full" />
                  <div className="text-center text-slate-500 dark:text-slate-400">
                    Loading energy flow data...
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : currentSite ? (
            <>
              <div className="grid grid-cols-1 gap-6">
                <Card className="border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                  <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700/50 pb-2">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Zap className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      Real-time Energy Flow
                    </CardTitle>
                    <CardDescription>
                      Current energy distribution through your system
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="h-[560px] w-full">
                      <EnergyFlowChart />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {alerts.map((alert) => (
                  <Alert key={alert.id} 
                    className={
                      alert.severity === 'error' ? 'border-red-500/50 bg-red-500/10' : 
                      alert.severity === 'warning' ? 'border-amber-500/50 bg-amber-500/10' : 
                      'border-blue-500/50 bg-blue-500/10'
                    }
                  >
                    <div className={
                      alert.severity === 'error' ? 'text-red-500' : 
                      alert.severity === 'warning' ? 'text-amber-500' : 
                      'text-blue-500'
                    }>
                      {alert.severity === 'error' ? <Info className="h-4 w-4" /> : 
                       alert.severity === 'warning' ? <Info className="h-4 w-4" /> : 
                       <Info className="h-4 w-4" />}
                    </div>
                    <div>
                      <AlertTitle>{alert.title}</AlertTitle>
                      <AlertDescription>{alert.message}</AlertDescription>
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(alert.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </Alert>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border border-slate-200 dark:border-slate-700 shadow-sm col-span-1">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <SunMedium className="h-5 w-5 text-yellow-500" />
                      Solar Generation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">5.5 kW</div>
                      <div className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-2 py-1 rounded-full">
                        Active
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Generation Capacity</span>
                        <span className="font-medium">7.5 kW</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Efficiency</span>
                        <span className="font-medium">92%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Daily Production</span>
                        <span className="font-medium">28.5 kWh</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-slate-200 dark:border-slate-700 shadow-sm col-span-1">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Battery className="h-5 w-5 text-purple-500" />
                      Battery Storage
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">62%</div>
                      <div className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-2 py-1 rounded-full">
                        Charging
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">State of Charge</span>
                          <span className="font-medium">62%</span>
                        </div>
                        <Progress value={62} className="h-2" />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Power</span>
                        <span className="font-medium">+2.4 kW</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Estimated Time to Full</span>
                        <span className="font-medium">3.5 hours</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-slate-200 dark:border-slate-700 shadow-sm col-span-1">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Home className="h-5 w-5 text-green-500" />
                      Home Consumption
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">4.2 kW</div>
                      <div className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded-full">
                        Active
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">From Solar</span>
                        <span className="font-medium">3.6 kW (86%)</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">From Grid</span>
                        <span className="font-medium">0.6 kW (14%)</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Daily Consumption</span>
                        <span className="font-medium">32.7 kWh</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
              <CardContent className="py-6">
                <p className="text-muted-foreground text-center">No active site selected.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="historical" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AreaChart className="h-5 w-5 text-blue-500" />
                  Historical Energy Flow
                </CardTitle>
                <CardDescription>
                  Energy generation and consumption over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  {isLoading ? (
                    <Skeleton className="h-full w-full" />
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={deviceData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                        <XAxis 
                          dataKey="timestamp" 
                          tickFormatter={(timestamp) => {
                            const date = new Date(timestamp);
                            return format(date, 'MM/dd HH:mm');
                          }}
                          stroke="#888888" 
                          fontSize={12} 
                          tickMargin={8}
                        />
                        <YAxis stroke="#888888" fontSize={12} tickMargin={8} />
                        <Tooltip 
                          formatter={(value: number) => [`${value} kW`, 'Power']}
                          labelFormatter={(timestamp) => {
                            const date = new Date(timestamp);
                            return format(date, 'PPpp');
                          }}
                        />
                        <Legend />
                        <Area 
                          type="monotone" 
                          dataKey="power" 
                          name="Power (kW)" 
                          stroke="#3b82f6" 
                          fillOpacity={1} 
                          fill="url(#colorPower)" 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="energy" 
                          name="Energy (kWh)" 
                          stroke="#10b981" 
                          fillOpacity={1} 
                          fill="url(#colorEnergy)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
              <CardHeader>
                <CardTitle>Energy Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-sm">Self-Consumption Ratio</h4>
                        <span className="font-bold text-green-600 dark:text-green-400">86%</span>
                      </div>
                      <Progress value={86} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        Percentage of generated energy used directly on-site
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-sm">Grid Independence</h4>
                        <span className="font-bold text-blue-600 dark:text-blue-400">72%</span>
                      </div>
                      <Progress value={72} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        Percentage of energy needs met without the grid
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-sm">System Efficiency</h4>
                        <span className="font-bold text-purple-600 dark:text-purple-400">94%</span>
                      </div>
                      <Progress value={94} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        Overall energy conversion efficiency
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="optimization" className="mt-4">
          <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-indigo-500" />
                    Energy Flow Optimization
                  </CardTitle>
                  <CardDescription>
                    AI-powered recommendations to optimize your energy system
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-lg border border-indigo-100 dark:border-indigo-500/20">
                  <h3 className="text-lg font-medium text-indigo-700 dark:text-indigo-400 mb-2">
                    System Recommendations
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex gap-3">
                      <div className="mt-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-1 rounded-full h-6 w-6 flex items-center justify-center">
                        <Battery className="h-3.5 w-3.5" />
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">Battery Charging Strategy</div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Prioritize battery charging during mid-day solar peak (10:00-14:00) to maximize self-consumption.
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="mt-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-1 rounded-full h-6 w-6 flex items-center justify-center">
                        <Home className="h-3.5 w-3.5" />
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">Load Shifting Opportunity</div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Shift HVAC operation to 9:00-15:00 to align with solar production. Estimated savings: 2.3 kWh/day.
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <div className="mt-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 p-1 rounded-full h-6 w-6 flex items-center justify-center">
                        <PlugZap className="h-3.5 w-3.5" />
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">EV Charging Recommendation</div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Schedule EV charging between 10:30-14:30 to utilize excess solar production and reduce grid dependence.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Sun className="h-4 w-4 text-yellow-500" />
                      Solar Utilization
                    </h4>
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">86%</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      +12% from system average
                    </p>
                  </div>
                  
                  <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Battery className="h-4 w-4 text-purple-500" />
                      Battery Efficiency
                    </h4>
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">92%</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Round-trip efficiency
                    </p>
                  </div>
                  
                  <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-blue-500" />
                      Peak Shaving
                    </h4>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">3.6 kW</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Reduced from grid
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Main>
  );
};

export default EnergyFlow;
