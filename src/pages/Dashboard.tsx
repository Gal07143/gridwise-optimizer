
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DateRange } from '@/types/site';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { addDays, format, subDays } from 'date-fns';
import { Battery, Bolt, Cpu, Droplet, Home, Sliders, SunMedium, Thermometer, TrendingUp, Wind, Zap, BarChart2, ArrowUpRight, PlugZap, CircleDollarSign } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';
import RealtimeDispatchAdvice from '@/components/ai/RealtimeDispatchAdvice';
import DashboardCard from '@/components/dashboard/DashboardCard';
import EnergyFlowChart from '@/components/dashboard/EnergyFlowChart';
import { getEnergyConsumptionData, getEnergyProductionData, getEnergyEfficiencyData } from '@/services/energyDataService';
import { useAppStore } from '@/store/appStore';
import { useToast } from '@/components/ui/use-toast';

// Define your Dashboard component here
const Dashboard: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const { currentSite, setDashboardView } = useAppStore();
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [consumptionData, setConsumptionData] = useState<any[]>([]);
  const [productionData, setProductionData] = useState<any[]>([]);
  const [efficiencyData, setEfficiencyData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (currentSite) {
          // Fetch energy data
          const [consumption, production, efficiency] = await Promise.all([
            getEnergyConsumptionData(currentSite.id, dateRange),
            getEnergyProductionData(currentSite.id, dateRange),
            getEnergyEfficiencyData(currentSite.id, dateRange),
          ]);
          
          setConsumptionData(consumption);
          setProductionData(production);
          setEfficiencyData(efficiency);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: 'Failed to load dashboard data',
          description: 'Please try again later',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    setDashboardView('overview');
  }, [currentSite, dateRange, toast, setDashboardView]);

  // Calculate summary metrics
  const totalConsumption = consumptionData.reduce((sum, item) => sum + (item.value || 0), 0).toFixed(1);
  const totalProduction = productionData.reduce((sum, item) => sum + (item.value || 0), 0).toFixed(1);
  const avgEfficiency = efficiencyData.length ? 
    (efficiencyData.reduce((sum, item) => sum + (item.efficiency || 0), 0) / efficiencyData.length).toFixed(1) : 0;
  
  // Card color schemes
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'];

  // Mock data for pie chart
  const energySourceData = [
    { name: 'Solar', value: 45 },
    { name: 'Wind', value: 25 },
    { name: 'Grid', value: 20 },
    { name: 'Battery', value: 10 },
  ];

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Dashboard
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Energy monitoring and control system
              {currentSite && ` - ${currentSite.name}`}
            </p>
          </div>
          <DateRangePicker 
            dateRange={dateRange} 
            onUpdate={setDateRange}
          />
        </div>

        <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
            <TabsTrigger value="overview" className="data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-700">
              <Sliders className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-700">
              <BarChart2 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="devices" className="data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-700">
              <Cpu className="h-4 w-4 mr-2" />
              Devices
            </TabsTrigger>
            <TabsTrigger value="energy" className="data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-700">
              <Zap className="h-4 w-4 mr-2" />
              Energy Flow
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <DashboardCard
                title="Total Energy Consumption"
                icon={<Home />}
                isLoading={isLoading}
                className="animate-in fade-in delay-100"
              >
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{totalConsumption} kWh</div>
                  <div className="flex items-center text-xs text-green-600 dark:text-green-400">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    <span>+2.1% from last period</span>
                  </div>
                  <div className="h-[80px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={consumptionData.slice(-10)}
                        margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="consumptionGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#8884d8"
                          fillOpacity={1}
                          fill="url(#consumptionGradient)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </DashboardCard>
              
              <DashboardCard
                title="Peak Demand"
                icon={<TrendingUp />}
                isLoading={isLoading}
                className="animate-in fade-in delay-200"
              >
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">12.7 kW</div>
                  <div className="flex items-center text-xs text-red-600 dark:text-red-400">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    <span>+0.5% from last period</span>
                  </div>
                  <div className="h-[80px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart 
                        data={[
                          { hour: "00:00", value: 5.2 },
                          { hour: "04:00", value: 3.8 },
                          { hour: "08:00", value: 8.1 },
                          { hour: "12:00", value: 10.5 },
                          { hour: "16:00", value: 12.7 },
                          { hour: "20:00", value: 11.2 }
                        ]}
                      >
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#2563eb" 
                          strokeWidth={2}
                          dot={{ r: 2, fill: "#2563eb" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </DashboardCard>
              
              <DashboardCard
                title="Energy Cost"
                icon={<CircleDollarSign />}
                isLoading={isLoading}
                className="animate-in fade-in delay-300"
              >
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">$123.45</div>
                  <div className="flex items-center text-xs text-red-600 dark:text-red-400">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    <span>+4.2% from last period</span>
                  </div>
                  <div className="h-[80px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { day: "Mon", value: 21.5 },
                          { day: "Tue", value: 18.7 },
                          { day: "Wed", value: 20.1 },
                          { day: "Thu", value: 17.8 },
                          { day: "Fri", value: 23.4 },
                          { day: "Sat", value: 14.2 },
                          { day: "Sun", value: 7.8 }
                        ]}
                      >
                        <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </DashboardCard>
              
              <DashboardCard
                title="System Efficiency"
                icon={<Bolt />}
                isLoading={isLoading}
                className="animate-in fade-in delay-400"
              >
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{avgEfficiency}%</div>
                  <div className="flex items-center text-xs text-green-600 dark:text-green-400">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    <span>+1.8% from last period</span>
                  </div>
                  <div className="h-[80px] flex items-center justify-center">
                    <div className="relative h-20 w-20">
                      <svg viewBox="0 0 100 100" className="h-full w-full rotate-90">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="10"
                          fill="transparent"
                          className="text-slate-200 dark:text-slate-800"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="10"
                          fill="transparent"
                          strokeDasharray={`${+avgEfficiency * 2.51} 251`}
                          className="text-amber-500 dark:text-amber-400"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-sm font-medium">
                        {avgEfficiency}%
                      </div>
                    </div>
                  </div>
                </div>
              </DashboardCard>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Energy flow visualization */}
              <Card className="md:col-span-2 overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Zap className="h-5 w-5 text-indigo-500" />
                    Energy Flow Visualization
                  </CardTitle>
                  <CardDescription>
                    Real-time energy distribution across your system
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-[360px] w-full">
                    <EnergyFlowChart animationDelay="0.5s" />
                  </div>
                </CardContent>
              </Card>

              {/* AI Recommendations */}
              <RealtimeDispatchAdvice />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <DashboardCard
                title="Solar Production"
                icon={<SunMedium className="text-yellow-500" />}
                isLoading={isLoading}
                className="lg:col-span-2 animate-in fade-in delay-100"
              >
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{(totalProduction * 0.6).toFixed(1)} kWh</div>
                    <div className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-2 py-1 rounded-full">
                      60% of production
                    </div>
                  </div>
                  <div className="h-[150px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={productionData.slice(-14).map(item => ({...item, solar: item.value * 0.6}))}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <XAxis dataKey="time" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip />
                        <defs>
                          <linearGradient id="solarGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#facc15" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#facc15" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Area 
                          type="monotone" 
                          dataKey="solar" 
                          stroke="#facc15" 
                          fillOpacity={1} 
                          fill="url(#solarGradient)" 
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </DashboardCard>
              
              <DashboardCard
                title="Wind Production"
                icon={<Wind className="text-blue-500" />}
                isLoading={isLoading}
                className="lg:col-span-2 animate-in fade-in delay-200"
              >
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{(totalProduction * 0.4).toFixed(1)} kWh</div>
                    <div className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full">
                      40% of production
                    </div>
                  </div>
                  <div className="h-[150px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={productionData.slice(-14).map(item => ({...item, wind: item.value * 0.4}))}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <XAxis dataKey="time" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip />
                        <defs>
                          <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Area 
                          type="monotone" 
                          dataKey="wind" 
                          stroke="#3b82f6" 
                          fillOpacity={1} 
                          fill="url(#windGradient)" 
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </DashboardCard>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm animate-in fade-in delay-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Battery className="h-5 w-5 text-purple-500" />
                    Battery Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between mb-2">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">62%</div>
                      <div className="text-sm bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-3 py-1 rounded-full">
                        Charging
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">State of Charge</span>
                        <span className="font-medium">62%</span>
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full">
                        <div className="h-full bg-purple-500 rounded-full" style={{width: '62%'}} />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Charge Rate</div>
                        <div className="text-base font-medium">2.4 kW</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Time to Full</div>
                        <div className="text-base font-medium">3.5 hours</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Temperature</div>
                        <div className="text-base font-medium">28°C</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Health</div>
                        <div className="text-base font-medium text-green-600 dark:text-green-400">98%</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm animate-in fade-in delay-400">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PlugZap className="h-5 w-5 text-emerald-500" />
                    Energy Sources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={energySourceData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {energySourceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Legend />
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <div className="w-full text-xs text-muted-foreground">
                    Energy distribution by source over the past 7 days
                  </div>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
              <CardHeader>
                <CardTitle>Energy Analytics</CardTitle>
                <CardDescription>
                  Detailed analysis of your energy usage patterns
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={consumptionData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorConsumption" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorProduction" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="time" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="value"
                        name="Consumption"
                        stroke="#8884d8"
                        fillOpacity={1}
                        fill="url(#colorConsumption)"
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        name="Production"
                        stroke="#82ca9d"
                        fillOpacity={1}
                        fill="url(#colorProduction)"
                        data={productionData}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="devices" className="space-y-4">
            <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-blue-500" />
                  Connected Devices
                </CardTitle>
                <CardDescription>
                  Status of all devices in your energy management system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <SunMedium className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="font-medium">Solar Inverter</div>
                        <div className="text-sm text-muted-foreground">SolarEdge SE7600H</div>
                      </div>
                      <div className="ml-auto text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded-full">
                        Online
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                      <div className="space-y-0.5">
                        <div className="text-muted-foreground">Power</div>
                        <div className="font-medium">5.2 kW</div>
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-muted-foreground">Daily Yield</div>
                        <div className="font-medium">28.5 kWh</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <Battery className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <div className="font-medium">Battery System</div>
                        <div className="text-sm text-muted-foreground">Tesla Powerwall</div>
                      </div>
                      <div className="ml-auto text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded-full">
                        Charging
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                      <div className="space-y-0.5">
                        <div className="text-muted-foreground">State of Charge</div>
                        <div className="font-medium">62%</div>
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-muted-foreground">Power</div>
                        <div className="font-medium">2.4 kW</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <Home className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <div className="font-medium">Smart Meter</div>
                        <div className="text-sm text-muted-foreground">Landis+Gyr E360</div>
                      </div>
                      <div className="ml-auto text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded-full">
                        Online
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                      <div className="space-y-0.5">
                        <div className="text-muted-foreground">Consumption</div>
                        <div className="font-medium">1.8 kW</div>
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-muted-foreground">Daily Usage</div>
                        <div className="font-medium">15.2 kWh</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                        <Thermometer className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <div className="font-medium">HVAC System</div>
                        <div className="text-sm text-muted-foreground">Carrier Infinity</div>
                      </div>
                      <div className="ml-auto text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-2 py-1 rounded-full">
                        Standby
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                      <div className="space-y-0.5">
                        <div className="text-muted-foreground">Temperature</div>
                        <div className="font-medium">22°C</div>
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-muted-foreground">Power</div>
                        <div className="font-medium">0.0 kW</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                        <PlugZap className="h-5 w-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <div className="font-medium">EV Charger</div>
                        <div className="text-sm text-muted-foreground">Wallbox Pulsar Plus</div>
                      </div>
                      <div className="ml-auto text-xs bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-2 py-1 rounded-full">
                        Idle
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                      <div className="space-y-0.5">
                        <div className="text-muted-foreground">Status</div>
                        <div className="font-medium">Available</div>
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-muted-foreground">Max Power</div>
                        <div className="font-medium">11 kW</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
                        <Droplet className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                      </div>
                      <div>
                        <div className="font-medium">Water Heater</div>
                        <div className="text-sm text-muted-foreground">Rheem ProTerra</div>
                      </div>
                      <div className="ml-auto text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded-full">
                        Online
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                      <div className="space-y-0.5">
                        <div className="text-muted-foreground">Temperature</div>
                        <div className="font-medium">50°C</div>
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-muted-foreground">Power</div>
                        <div className="font-medium">0.8 kW</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="energy" className="space-y-4">
            <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-indigo-500" />
                  Energy Flow
                </CardTitle>
                <CardDescription>
                  Real-time visualization of your energy system
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[520px] w-full">
                  <EnergyFlowChart />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
