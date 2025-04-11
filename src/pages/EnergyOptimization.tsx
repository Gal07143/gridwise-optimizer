
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, AlertCircle, BarChart3, Battery, BrainCircuit, Check, ChevronsUp, Clock, Coins, Gauge, Info, LineChart as LineChartIcon, Lightbulb, PlayCircle, RefreshCw, Rocket, Settings2, Sparkles, Wallet, Wand2, Zap } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { useToast } from '@/hooks/useToast';
import { OptimizationSettings } from '@/types/optimization';

// Sample optimization settings
const initialSettings: OptimizationSettings = {
  priority: "cost",
  battery_strategy: "time_of_use",
  ev_charging_time: "22:00",
  ev_departure_time: "07:30",
  peak_shaving_enabled: true,
  max_grid_power: 10,
  energy_export_limit: 5,
  min_soc: 20,
  max_soc: 90,
  time_window_start: "00:00",
  time_window_end: "06:00",
  objective: "minimize_cost"
};

// Sample data for visualization
const costComparisonData = [
  { time: '00:00', optimized: 0.12, standard: 0.16 },
  { time: '03:00', optimized: 0.10, standard: 0.14 },
  { time: '06:00', optimized: 0.14, standard: 0.18 },
  { time: '09:00', optimized: 0.18, standard: 0.22 },
  { time: '12:00', optimized: 0.15, standard: 0.19 },
  { time: '15:00', optimized: 0.16, standard: 0.20 },
  { time: '18:00', optimized: 0.20, standard: 0.28 },
  { time: '21:00', optimized: 0.16, standard: 0.24 },
];

const batterySocData = [
  { time: '00:00', soc: 45 },
  { time: '03:00', soc: 35 },
  { time: '06:00', soc: 25 },
  { time: '09:00', soc: 20 },
  { time: '12:00', soc: 40 },
  { time: '15:00', soc: 70 },
  { time: '18:00', soc: 90 },
  { time: '21:00', soc: 70 },
];

const gridPowerData = [
  { time: '00:00', power: 1.2 },
  { time: '03:00', power: 0.8 },
  { time: '06:00', power: 1.5 },
  { time: '09:00', power: -2.3 },
  { time: '12:00', power: -3.8 },
  { time: '15:00', power: -2.1 },
  { time: '18:00', power: 2.2 },
  { time: '21:00', power: 1.9 },
];

const optimizationResults = {
  daily_savings: 2.86,
  monthly_savings: 85.8,
  carbon_reduction: 32.5,
  self_consumption_increase: 15.2,
};

const savingsBreakdownData = [
  { name: 'Battery Shifting', value: 45, color: '#8884d8' },
  { name: 'Peak Shaving', value: 30, color: '#82ca9d' },
  { name: 'Self-Consumption', value: 15, color: '#ffc658' },
  { name: 'EV Charging', value: 10, color: '#ff8042' },
];

const EnergyOptimization: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [settings, setSettings] = useState<OptimizationSettings>(initialSettings);
  const [isOptimizationRunning, setIsOptimizationRunning] = useState(false);
  const { toast } = useToast();
  
  const handleSettingsChange = (key: keyof OptimizationSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const runOptimization = () => {
    setIsOptimizationRunning(true);
    toast.toast.loading('Running optimization algorithm...');
    
    // In a real app, this would call an API endpoint
    setTimeout(() => {
      setIsOptimizationRunning(false);
      toast.toast.dismiss();
      toast.toast.success('Optimization completed successfully!');
    }, 3000);
  };
  
  const applyOptimizationSettings = () => {
    toast.toast.success('Settings applied successfully!');
  };

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Energy Optimization</h1>
            <p className="text-muted-foreground">
              Intelligently optimize your energy usage to reduce costs and increase efficiency
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">Cost Savings: $85.80 / month</Badge>
            <Button onClick={runOptimization} disabled={isOptimizationRunning}>
              {isOptimizationRunning ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Optimizing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Run Optimization
                </>
              )}
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 md:w-auto">
            <TabsTrigger value="overview">Results</TabsTrigger>
            <TabsTrigger value="settings">Configuration</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6 flex flex-col gap-2">
                  <div className="flex justify-between">
                    <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <Wallet className="h-6 w-6 text-green-500" />
                    </div>
                    <Badge variant="outline">Daily</Badge>
                  </div>
                  <div className="pt-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Cost Savings</h3>
                    <div className="flex items-baseline mt-1">
                      <span className="text-3xl font-bold">${optimizationResults.daily_savings}</span>
                      <span className="ml-1 text-sm text-muted-foreground">/ day</span>
                    </div>
                    <div className="flex items-center gap-1 mt-2 text-green-500 text-xs font-medium">
                      <ChevronsUp className="h-4 w-4" />
                      <span>18% reduction from baseline</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 flex flex-col gap-2">
                  <div className="flex justify-between">
                    <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <Activity className="h-6 w-6 text-purple-500" />
                    </div>
                    <Badge variant="outline">Daily</Badge>
                  </div>
                  <div className="pt-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Self-Consumption</h3>
                    <div className="flex items-baseline mt-1">
                      <span className="text-3xl font-bold">{optimizationResults.self_consumption_increase}%</span>
                      <span className="ml-1 text-sm text-muted-foreground">increase</span>
                    </div>
                    <div className="flex items-center gap-1 mt-2 text-green-500 text-xs font-medium">
                      <ChevronsUp className="h-4 w-4" />
                      <span>Better energy utilization</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 flex flex-col gap-2">
                  <div className="flex justify-between">
                    <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Zap className="h-6 w-6 text-blue-500" />
                    </div>
                    <Badge variant="outline">24 Hours</Badge>
                  </div>
                  <div className="pt-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Peak Reduction</h3>
                    <div className="flex items-baseline mt-1">
                      <span className="text-3xl font-bold">42%</span>
                      <span className="ml-1 text-sm text-muted-foreground">lower</span>
                    </div>
                    <div className="flex items-center gap-1 mt-2 text-green-500 text-xs font-medium">
                      <ChevronsUp className="h-4 w-4" />
                      <span>3.2 kW max demand savings</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 flex flex-col gap-2">
                  <div className="flex justify-between">
                    <div className="h-12 w-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                      <Lightbulb className="h-6 w-6 text-amber-500" />
                    </div>
                    <Badge variant="outline">Monthly</Badge>
                  </div>
                  <div className="pt-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Carbon Reduction</h3>
                    <div className="flex items-baseline mt-1">
                      <span className="text-3xl font-bold">{optimizationResults.carbon_reduction}</span>
                      <span className="ml-1 text-sm text-muted-foreground">kg CO₂</span>
                    </div>
                    <div className="flex items-center gap-1 mt-2 text-green-500 text-xs font-medium">
                      <ChevronsUp className="h-4 w-4" />
                      <span>Equivalent to planting 2 trees</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Coins className="h-5 w-5 text-primary" />
                    Cost Comparison
                  </CardTitle>
                  <CardDescription>
                    Optimized vs standard energy usage cost
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={costComparisonData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => [`$${value}`, 'Cost per kWh']}
                        />
                        <Legend />
                        <defs>
                          <linearGradient id="colorOptimized" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1}/>
                          </linearGradient>
                          <linearGradient id="colorStandard" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="standard"
                          name="Standard Cost"
                          stroke="#8884d8"
                          fillOpacity={1}
                          fill="url(#colorStandard)"
                        />
                        <Area
                          type="monotone"
                          dataKey="optimized"
                          name="Optimized Cost"
                          stroke="#82ca9d"
                          fillOpacity={1}
                          fill="url(#colorOptimized)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Battery className="h-5 w-5 text-primary" />
                    Battery State of Charge
                  </CardTitle>
                  <CardDescription>
                    Optimized battery usage throughout the day
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={batterySocData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorSOC" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip
                          formatter={(value) => [`${value}%`, 'State of Charge']}
                        />
                        <Area
                          type="monotone"
                          dataKey="soc"
                          name="Battery SoC"
                          stroke="#8884d8"
                          fillOpacity={1}
                          fill="url(#colorSOC)"
                        />
                        <ReferenceLine y={settings.min_soc} stroke="#ff7300" strokeDasharray="3 3">
                          <Label value="Min SoC" position="insideBottomRight" />
                        </ReferenceLine>
                        <ReferenceLine y={settings.max_soc} stroke="#ff7300" strokeDasharray="3 3">
                          <Label value="Max SoC" position="insideTopRight" />
                        </ReferenceLine>
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BrainCircuit className="h-5 w-5 text-primary" />
                    Optimization Strategy
                  </CardTitle>
                  <CardDescription>
                    How the optimization algorithm is working for you
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium mb-4">Savings Breakdown</h3>
                      <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={savingsBreakdownData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {savingsBreakdownData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Current Strategy</h3>
                        <div className="space-y-3">
                          <div className="flex items-center p-2 bg-secondary rounded-md">
                            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                              <Wallet className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">Cost Optimization</p>
                              <p className="text-xs text-muted-foreground">Primary objective</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center p-2 bg-secondary/50 rounded-md">
                            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                              <Battery className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">Time-of-Use Shifting</p>
                              <p className="text-xs text-muted-foreground">Battery usage strategy</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center p-2 bg-secondary/50 rounded-md">
                            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                              <Gauge className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">Peak Shaving Active</p>
                              <p className="text-xs text-muted-foreground">Max grid power: {settings.max_grid_power} kW</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-2">Recommendations</h3>
                        <div className="p-3 bg-green-50 dark:bg-green-950/20 text-sm rounded-md border border-green-200 dark:border-green-800">
                          <p className="flex items-center text-green-800 dark:text-green-300 font-medium">
                            <Check className="h-4 w-4 mr-1" /> Great optimization results!
                          </p>
                          <p className="text-green-700 dark:text-green-400 text-xs mt-1">
                            Your current settings are working well. Consider increasing your battery's maximum state of charge to 95% for even better results.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Grid Power
                  </CardTitle>
                  <CardDescription>
                    Power flow to and from the grid
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={gridPowerData}
                        margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => [`${Math.abs(value)} kW`, value >= 0 ? 'Import' : 'Export']}
                        />
                        <Legend />
                        <Bar 
                          dataKey="power" 
                          name="Grid Power"
                          fill={(data) => data.power >= 0 ? '#8884d8' : '#82ca9d'} 
                        />
                        <ReferenceLine y={0} stroke="#000" strokeWidth={0.5} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <div className="flex items-center justify-center p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                      <div>
                        <p className="text-xs text-center text-purple-700 dark:text-purple-300">Grid Import</p>
                        <p className="text-center font-semibold text-purple-900 dark:text-purple-100">7.6 kWh</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-center p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
                      <div>
                        <p className="text-xs text-center text-green-700 dark:text-green-300">Grid Export</p>
                        <p className="text-center font-semibold text-green-900 dark:text-green-100">8.2 kWh</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      Monthly Savings Projection
                    </CardTitle>
                    <CardDescription>
                      Estimated savings over the next 12 months
                    </CardDescription>
                  </div>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Info className="h-4 w-4" />
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="font-medium">About Projected Savings</h4>
                        <p className="text-sm text-muted-foreground">
                          These estimates are based on your current energy patterns, 
                          projected weather conditions, and estimated electricity prices. 
                          Actual savings may vary.
                        </p>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { month: 'Jan', savings: 85 },
                        { month: 'Feb', savings: 78 },
                        { month: 'Mar', savings: 90 },
                        { month: 'Apr', savings: 105 },
                        { month: 'May', savings: 120 },
                        { month: 'Jun', savings: 135 },
                        { month: 'Jul', savings: 150 },
                        { month: 'Aug', savings: 140 },
                        { month: 'Sep', savings: 125 },
                        { month: 'Oct', savings: 110 },
                        { month: 'Nov', savings: 95 },
                        { month: 'Dec', savings: 90 },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => [`$${value}`, 'Estimated Savings']}
                      />
                      <Bar dataKey="savings" name="Monthly Savings" fill="#8884d8">
                        {/* Add gradient effect */}
                        <defs>
                          <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0.3}/>
                          </linearGradient>
                        </defs>
                        <rect x="0" y="0" width="100%" height="100%" fill="url(#savingsGradient)" />
                      </Bar>
                      <ReferenceLine y={85.8} label="Current" stroke="#ff7300" strokeWidth={2} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-accent/30 p-3 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">Average Monthly Savings</p>
                    <p className="text-2xl font-bold">$110.25</p>
                  </div>
                  <div className="bg-accent/30 p-3 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">Annual Savings</p>
                    <p className="text-2xl font-bold">$1,323.00</p>
                  </div>
                  <div className="bg-accent/30 p-3 rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">5-Year Savings</p>
                    <p className="text-2xl font-bold">$6,615.00</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings2 className="h-5 w-5 text-primary" />
                  Optimization Settings
                </CardTitle>
                <CardDescription>
                  Configure your energy optimization preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Primary Objective</h3>
                    <p className="text-sm text-muted-foreground">Select your main optimization goal</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                      <Button
                        variant={settings.priority === 'cost' ? 'default' : 'outline'}
                        className="flex flex-col items-center justify-center h-24 space-y-2"
                        onClick={() => handleSettingsChange('priority', 'cost')}
                      >
                        <Coins className="h-6 w-6" />
                        <span>Cost Savings</span>
                      </Button>
                      <Button
                        variant={settings.priority === 'self_consumption' ? 'default' : 'outline'}
                        className="flex flex-col items-center justify-center h-24 space-y-2"
                        onClick={() => handleSettingsChange('priority', 'self_consumption')}
                      >
                        <Activity className="h-6 w-6" />
                        <span>Self-Consumption</span>
                      </Button>
                      <Button
                        variant={settings.priority === 'carbon' ? 'default' : 'outline'}
                        className="flex flex-col items-center justify-center h-24 space-y-2"
                        onClick={() => handleSettingsChange('priority', 'carbon')}
                      >
                        <Lightbulb className="h-6 w-6" />
                        <span>Carbon Reduction</span>
                      </Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Battery Strategy</h3>
                    <p className="text-sm text-muted-foreground">How to utilize your battery storage</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                      <Button
                        variant={settings.battery_strategy === 'charge_from_solar' ? 'default' : 'outline'}
                        className="flex flex-col items-center justify-center h-20 space-y-2 text-center px-3"
                        onClick={() => handleSettingsChange('battery_strategy', 'charge_from_solar')}
                      >
                        <span>Charge from Solar</span>
                        <span className="text-xs">Prioritize solar charging</span>
                      </Button>
                      <Button
                        variant={settings.battery_strategy === 'time_of_use' ? 'default' : 'outline'}
                        className="flex flex-col items-center justify-center h-20 space-y-2 text-center px-3"
                        onClick={() => handleSettingsChange('battery_strategy', 'time_of_use')}
                      >
                        <span>Time-of-Use</span>
                        <span className="text-xs">Optimize for electricity rates</span>
                      </Button>
                      <Button
                        variant={settings.battery_strategy === 'backup_only' ? 'default' : 'outline'}
                        className="flex flex-col items-center justify-center h-20 space-y-2 text-center px-3"
                        onClick={() => handleSettingsChange('battery_strategy', 'backup_only')}
                      >
                        <span>Backup Only</span>
                        <span className="text-xs">Reserve for outages</span>
                      </Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Battery Constraints</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-4">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label htmlFor="min_soc">Minimum State of Charge</Label>
                            <span className="text-sm">{settings.min_soc}%</span>
                          </div>
                          <Slider 
                            id="min_soc"
                            min={0} 
                            max={50} 
                            step={5} 
                            value={[settings.min_soc as number]} 
                            onValueChange={(value) => handleSettingsChange('min_soc', value[0])}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>0%</span>
                            <span>50%</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label htmlFor="max_soc">Maximum State of Charge</Label>
                            <span className="text-sm">{settings.max_soc}%</span>
                          </div>
                          <Slider 
                            id="max_soc"
                            min={50} 
                            max={100} 
                            step={5} 
                            value={[settings.max_soc as number]} 
                            onValueChange={(value) => handleSettingsChange('max_soc', value[0])}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>50%</span>
                            <span>100%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label htmlFor="max_grid_power">Maximum Grid Power</Label>
                            <span className="text-sm">{settings.max_grid_power} kW</span>
                          </div>
                          <Slider 
                            id="max_grid_power"
                            min={1} 
                            max={20} 
                            step={1} 
                            value={[settings.max_grid_power as number]} 
                            onValueChange={(value) => handleSettingsChange('max_grid_power', value[0])}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>1 kW</span>
                            <span>20 kW</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Label htmlFor="energy_export">Energy Export Limit</Label>
                            <span className="text-sm">{settings.energy_export_limit} kW</span>
                          </div>
                          <Slider 
                            id="energy_export"
                            min={0} 
                            max={15} 
                            step={1} 
                            value={[settings.energy_export_limit as number]} 
                            onValueChange={(value) => handleSettingsChange('energy_export_limit', value[0])}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>0 kW</span>
                            <span>15 kW</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Advanced Settings</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="peak_shaving">Enable Peak Shaving</Label>
                            <p className="text-sm text-muted-foreground">Use battery to reduce peak demand</p>
                          </div>
                          <Switch 
                            id="peak_shaving"
                            checked={settings.peak_shaving_enabled}
                            onCheckedChange={(value) => handleSettingsChange('peak_shaving_enabled', value)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="time_window">Time Window</Label>
                            <p className="text-sm text-muted-foreground">Preferred battery charging window</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Select 
                              value={settings.time_window_start}
                              onValueChange={(value) => handleSettingsChange('time_window_start', value)}
                            >
                              <SelectTrigger className="w-24">
                                <SelectValue placeholder="Start" />
                              </SelectTrigger>
                              <SelectContent>
                                {[...Array(24)].map((_, i) => (
                                  <SelectItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                                    {`${i.toString().padStart(2, '0')}:00`}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <span>to</span>
                            <Select 
                              value={settings.time_window_end}
                              onValueChange={(value) => handleSettingsChange('time_window_end', value)}
                            >
                              <SelectTrigger className="w-24">
                                <SelectValue placeholder="End" />
                              </SelectTrigger>
                              <SelectContent>
                                {[...Array(24)].map((_, i) => (
                                  <SelectItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                                    {`${i.toString().padStart(2, '0')}:00`}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="ev_charging">EV Charging Time</Label>
                          <div className="flex items-center gap-2 mt-2">
                            <Select 
                              value={settings.ev_charging_time}
                              onValueChange={(value) => handleSettingsChange('ev_charging_time', value)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select time" />
                              </SelectTrigger>
                              <SelectContent>
                                {[...Array(24)].map((_, i) => (
                                  <SelectItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                                    {`${i.toString().padStart(2, '0')}:00`}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">When to start charging your electric vehicle</p>
                        </div>
                        
                        <div>
                          <Label htmlFor="ev_departure">EV Departure Time</Label>
                          <div className="flex items-center gap-2 mt-2">
                            <Select 
                              value={settings.ev_departure_time}
                              onValueChange={(value) => handleSettingsChange('ev_departure_time', value)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select time" />
                              </SelectTrigger>
                              <SelectContent>
                                {[...Array(24)].map((_, i) => (
                                  <SelectItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                                    {`${i.toString().padStart(2, '0')}:00`}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">When your EV needs to be fully charged</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="mr-2" onClick={applyOptimizationSettings}>Save Settings</Button>
                <Button variant="outline" onClick={() => setSettings(initialSettings)}>Reset to Default</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="h-5 w-5 text-primary" />
                  AI Recommendations
                </CardTitle>
                <CardDescription>
                  Smart suggestions for your specific energy usage patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Rocket className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <h3 className="font-medium text-green-800 dark:text-green-300">Recommended Configuration</h3>
                    </div>
                    <p className="mt-2 text-sm text-green-700 dark:text-green-400">
                      Based on your historical data, we recommend shifting your battery charging window to 01:00 - 05:00
                      to take advantage of lower overnight rates. This could save you an additional $12.45 per month.
                    </p>
                    <div className="mt-3 flex justify-end">
                      <Button size="sm" variant="outline" className="text-green-700 border-green-200 hover:bg-green-100">
                        Apply Recommendation
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <h3 className="font-medium text-blue-800 dark:text-blue-300">Peak Shaving Potential</h3>
                    </div>
                    <p className="mt-2 text-sm text-blue-700 dark:text-blue-400">
                      Your current maximum grid power could be reduced from 10kW to 8kW without affecting comfort. 
                      This would optimize your battery usage during peak times and minimize demand charges.
                    </p>
                    <div className="mt-3 flex justify-end">
                      <Button size="sm" variant="outline" className="text-blue-700 border-blue-200 hover:bg-blue-100">
                        Apply Recommendation
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      <h3 className="font-medium text-amber-800 dark:text-amber-300">Seasonal Adjustment</h3>
                    </div>
                    <p className="mt-2 text-sm text-amber-700 dark:text-amber-400">
                      As summer approaches, we recommend increasing your self-consumption ratio by 
                      adjusting your battery max SoC to 95% to capture more solar energy during peak production hours.
                    </p>
                    <div className="mt-3 flex justify-end">
                      <Button size="sm" variant="outline" className="text-amber-700 border-amber-200 hover:bg-amber-100">
                        Apply Recommendation
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <PlayCircle className="h-5 w-5 text-primary" />
                      Optimization Schedule
                    </CardTitle>
                    <CardDescription>
                      Schedule when optimizations run and apply
                    </CardDescription>
                  </div>
                  <Button size="sm">Add Schedule</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-border">
                      <thead className="bg-muted/50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Schedule</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-card divide-y divide-gray-200 dark:divide-gray-700">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">Weekday Cost Saving</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">Cost Saving</Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">Mon-Fri, All Day</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">Active</Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <Button variant="ghost" size="sm">Edit</Button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">Weekend Self-Consumption</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">Self-Consumption</Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">Sat-Sun, All Day</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">Active</Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <Button variant="ghost" size="sm">Edit</Button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">Overnight Charge</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <Badge variant="outline" className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800">Battery Charge</Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">Daily, 1:00 AM - 5:00 AM</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">Active</Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <Button variant="ghost" size="sm">Edit</Button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">Evening Peak Avoidance</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <Badge variant="outline" className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800">Peak Shaving</Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">Mon-Fri, 6:00 PM - 9:00 PM</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">Active</Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <Button variant="ghost" size="sm">Edit</Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Daily Check</CardTitle>
                        <CardDescription>System health verification</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <div className="space-y-1">
                            <p className="text-sm">Run time: 02:00 AM</p>
                            <p className="text-xs text-muted-foreground">Verifies system is operating correctly</p>
                          </div>
                          <Switch defaultChecked id="daily-check" />
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Weekly Recalibration</CardTitle>
                        <CardDescription>Optimization model update</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <div className="space-y-1">
                            <p className="text-sm">Run time: Sunday, 04:00 AM</p>
                            <p className="text-xs text-muted-foreground">Updates ML model with new data</p>
                          </div>
                          <Switch defaultChecked id="weekly-recal" />
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Monthly Report</CardTitle>
                        <CardDescription>Performance analytics</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <div className="space-y-1">
                            <p className="text-sm">Run time: 1st of month</p>
                            <p className="text-xs text-muted-foreground">Comprehensive performance analysis</p>
                          </div>
                          <Switch defaultChecked id="monthly-report" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="p-4 border rounded-lg bg-accent/20">
                    <h3 className="font-medium mb-2">Automation Status</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex flex-col p-3 bg-card rounded-lg">
                        <span className="text-xs text-muted-foreground">Last Optimization</span>
                        <span className="font-medium">Today, 06:00 AM</span>
                      </div>
                      <div className="flex flex-col p-3 bg-card rounded-lg">
                        <span className="text-xs text-muted-foreground">Next Optimization</span>
                        <span className="font-medium">Today, 06:00 PM</span>
                      </div>
                      <div className="flex flex-col p-3 bg-card rounded-lg">
                        <span className="text-xs text-muted-foreground">Active Rules</span>
                        <span className="font-medium">4 Rules</span>
                      </div>
                      <div className="flex flex-col p-3 bg-card rounded-lg">
                        <span className="text-xs text-muted-foreground">System Status</span>
                        <div className="flex items-center">
                          <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                          <span className="font-medium">Running</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default EnergyOptimization;
