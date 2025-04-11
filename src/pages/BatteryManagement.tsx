
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Zap, Activity, Calendar, Battery, BatteryCharging, BatteryMedium, DownloadCloud, Info, LineChart, Lightbulb, Settings2, BatteryFull, BatteryLow, Clock } from 'lucide-react';
import { AreaChart, Area, LineChart as RechartsLineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { useToast } from '@/hooks/useToast';
import BatteryControlTab from '@/components/devices/controls/battery/BatteryControlTab';

// Sample data for the battery dashboard
const batteryHistory = [
  { time: '00:00', soc: 55, power: -2.3, temperature: 23 },
  { time: '02:00', soc: 45, power: -2.4, temperature: 22 },
  { time: '04:00', soc: 35, power: -2.2, temperature: 21 },
  { time: '06:00', soc: 25, power: -2.1, temperature: 21 },
  { time: '08:00', soc: 20, power: -0.5, temperature: 22 },
  { time: '10:00', soc: 25, power: 2.8, temperature: 24 },
  { time: '12:00', soc: 43, power: 3.2, temperature: 26 },
  { time: '14:00', soc: 62, power: 3.0, temperature: 27 },
  { time: '16:00', soc: 80, power: 2.9, temperature: 26 },
  { time: '18:00', soc: 90, power: 1.2, temperature: 25 },
  { time: '20:00', soc: 85, power: -1.8, temperature: 24 },
  { time: '22:00', soc: 70, power: -2.5, temperature: 23 },
];

const dailyCycles = [
  { date: '04/05', cycles: 0.8, avgSOC: 58 },
  { date: '04/06', cycles: 0.7, avgSOC: 62 },
  { date: '04/07', cycles: 0.9, avgSOC: 55 },
  { date: '04/08', cycles: 1.2, avgSOC: 48 },
  { date: '04/09', cycles: 0.6, avgSOC: 65 },
  { date: '04/10', cycles: 0.5, avgSOC: 72 },
  { date: '04/11', cycles: 0.9, avgSOC: 60 },
];

const monthlyUsage = [
  { month: 'Jan', energyIn: 240, energyOut: 210 },
  { month: 'Feb', energyIn: 300, energyOut: 285 },
  { month: 'Mar', energyIn: 320, energyOut: 290 },
  { month: 'Apr', energyIn: 380, energyOut: 340 },
  { month: 'May', energyIn: 420, energyOut: 390 },
  { month: 'Jun', energyIn: 450, energyOut: 420 },
  { month: 'Jul', energyIn: 480, energyOut: 450 },
];

const BatteryManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [batteryId, setBatteryId] = useState('battery-01');
  const { toast } = useToast();
  const batteryLevel = 70; // Current battery level in percent

  const handleBatteryAction = (action: string) => {
    toast.toast.success(`Battery ${action} command sent successfully`);
  };
  
  // Determine battery status based on current state
  const getBatteryStatus = () => {
    // Check if battery is charging (positive power)
    const isCharging = batteryHistory[batteryHistory.length - 1].power > 0;
    const currentLevel = batteryLevel;
    
    if (isCharging) {
      return { status: 'Charging', icon: <BatteryCharging className="h-5 w-5 text-green-500" /> };
    } else if (currentLevel > 80) {
      return { status: 'Discharging', icon: <BatteryFull className="h-5 w-5 text-blue-500" /> };
    } else if (currentLevel > 20) {
      return { status: 'Discharging', icon: <BatteryMedium className="h-5 w-5 text-amber-500" /> };
    } else {
      return { status: 'Low Power', icon: <BatteryLow className="h-5 w-5 text-red-500" /> };
    }
  };

  const batteryStatus = getBatteryStatus();

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Battery Management</h1>
            <p className="text-muted-foreground">
              Monitor and control your energy storage system
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Select
              value={batteryId}
              onValueChange={setBatteryId}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Battery" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="battery-01">Main Battery</SelectItem>
                <SelectItem value="battery-02">Secondary Battery</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800">
                  <Battery className="h-12 w-12 text-primary" />
                  <span className="absolute text-lg font-bold">{batteryLevel}%</span>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold">Main Battery</h3>
                  <p className="text-muted-foreground">13.5 kWh Lithium Ion</p>
                </div>
                <div className="flex items-center">
                  {batteryStatus.icon}
                  <span className="ml-2 text-sm">{batteryStatus.status}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Current Power</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold">2.8</span>
                <span className="text-muted-foreground mb-1">kW</span>
              </div>
              <div className="flex items-center mt-2">
                <Zap className="h-4 w-4 mr-1 text-green-500" />
                <span className="text-sm text-green-500">Charging</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Energy Today</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-col">
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold">8.4</span>
                  <span className="text-muted-foreground mb-1">kWh</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="flex items-center">
                    <DownloadCloud className="h-4 w-4 mr-1 text-green-500" />
                    <span className="text-xs">In: 5.7 kWh</span>
                  </div>
                  <div className="flex items-center">
                    <Zap className="h-4 w-4 mr-1 text-blue-500" />
                    <span className="text-xs">Out: 2.7 kWh</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Health Status</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold">98%</span>
              </div>
              <div className="flex items-center mt-2">
                <Activity className="h-4 w-4 mr-1 text-green-500" />
                <span className="text-sm text-green-500">Excellent</span>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">Estimated cycles: 258</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="control">Control</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Battery Status over 24h
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart
                        data={batteryHistory}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorSoC" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis yAxisId="left" domain={[0, 100]} />
                        <YAxis yAxisId="right" orientation="right" domain={[-5, 5]} />
                        <Tooltip />
                        <Legend />
                        <Area
                          yAxisId="left"
                          type="monotone"
                          dataKey="soc"
                          name="State of Charge (%)"
                          stroke="#8884d8"
                          fillOpacity={1}
                          fill="url(#colorSoC)"
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="power"
                          name="Power (kW)"
                          stroke="#ff7300"
                        />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="h-5 w-5 text-primary" />
                    Charge Cycles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={dailyCycles}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Bar 
                          yAxisId="left"
                          dataKey="cycles" 
                          name="Daily Cycles" 
                          fill="#8884d8" 
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="avgSOC"
                          name="Avg. SOC (%)"
                          stroke="#ff7300"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Energy Charged</span>
                      <span className="font-medium">2,450 kWh</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Energy Discharged</span>
                      <span className="font-medium">2,320 kWh</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Efficiency</span>
                      <span className="font-medium">94.6%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Lifetime Cycles</span>
                      <span className="font-medium">258</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Average Daily Cycles</span>
                      <span className="font-medium">0.8</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Temperature</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-col items-center">
                    <div className="text-5xl font-bold mb-2">24°C</div>
                    <div className="text-sm text-muted-foreground">Normal Operating Range</div>
                    
                    <div className="w-full mt-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Min: 18°C</span>
                        <span>Max: 35°C</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                        <div 
                          className="h-2 bg-green-500 rounded-full" 
                          style={{ width: '30%', marginLeft: '20%' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-xs text-center text-muted-foreground">
                    Temperature readings within optimal range
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button 
                      onClick={() => handleBatteryAction('force charge')}
                      className="w-full"
                    >
                      <BatteryCharging className="mr-2 h-4 w-4" />
                      Force Charge
                    </Button>
                    <Button 
                      onClick={() => handleBatteryAction('suspend')}
                      variant="outline"
                      className="w-full"
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      Suspend Charging
                    </Button>
                    <Button 
                      onClick={() => handleBatteryAction('reset')}
                      variant="outline"
                      className="w-full"
                    >
                      <Settings2 className="mr-2 h-4 w-4" />
                      Reset System
                    </Button>
                    <Button 
                      onClick={() => setActiveTab('schedule')}
                      variant="ghost"
                      className="w-full"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      View Schedule
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="control">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <BatteryControlTab deviceId={batteryId} />
              
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Lightbulb className="mr-2 h-5 w-5 text-primary" />
                      Smart Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg border border-amber-200 dark:border-amber-900">
                        <h4 className="flex items-center text-amber-800 dark:text-amber-300 font-medium mb-1">
                          <Info className="h-4 w-4 mr-2" />
                          Charge Optimization
                        </h4>
                        <p className="text-sm text-amber-700 dark:text-amber-400">
                          Based on tomorrow's weather forecast, we recommend charging your battery to 100% tonight.
                          Electricity rates will be lower than solar production value.
                        </p>
                        <Button variant="outline" size="sm" className="mt-2">
                          Apply Recommendation
                        </Button>
                      </div>
                      
                      <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg border border-green-200 dark:border-green-900">
                        <h4 className="flex items-center text-green-800 dark:text-green-300 font-medium mb-1">
                          <Info className="h-4 w-4 mr-2" />
                          Peak Shaving Opportunity
                        </h4>
                        <p className="text-sm text-green-700 dark:text-green-400">
                          Grid electricity prices will peak between 6-8 PM today.
                          Using battery power during this time could save $3.42.
                        </p>
                        <Button variant="outline" size="sm" className="mt-2">
                          Enable Auto-Discharge
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Battery Limits</CardTitle>
                    <CardDescription>Control the operational limits of your battery</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <label className="text-sm font-medium">Minimum State of Charge</label>
                          <span className="text-sm">20%</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={50}
                          defaultValue={20}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none dark:bg-gray-700"
                        />
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-muted-foreground">0%</span>
                          <span className="text-xs text-muted-foreground">50%</span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <label className="text-sm font-medium">Maximum State of Charge</label>
                          <span className="text-sm">90%</span>
                        </div>
                        <input
                          type="range"
                          min={50}
                          max={100}
                          defaultValue={90}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none dark:bg-gray-700"
                        />
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-muted-foreground">50%</span>
                          <span className="text-xs text-muted-foreground">100%</span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <label className="text-sm font-medium">Maximum Charge Rate</label>
                          <span className="text-sm">5.0 kW</span>
                        </div>
                        <input
                          type="range"
                          min={1}
                          max={10}
                          defaultValue={5}
                          step={0.5}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none dark:bg-gray-700"
                        />
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-muted-foreground">1.0 kW</span>
                          <span className="text-xs text-muted-foreground">10.0 kW</span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <label className="text-sm font-medium">Maximum Discharge Rate</label>
                          <span className="text-sm">5.0 kW</span>
                        </div>
                        <input
                          type="range"
                          min={1}
                          max={10}
                          defaultValue={5}
                          step={0.5}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none dark:bg-gray-700"
                        />
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-muted-foreground">1.0 kW</span>
                          <span className="text-xs text-muted-foreground">10.0 kW</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" onClick={() => handleBatteryAction('update limits')}>Save Limits</Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Monthly Energy Flow</CardTitle>
                  <div className="flex items-center gap-2">
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Info className="h-4 w-4" />
                        </Button>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80">
                        <div className="space-y-2">
                          <h4 className="font-medium">About Battery Energy Flow</h4>
                          <p className="text-sm text-muted-foreground">
                            This chart shows the amount of energy flowing in and out of your battery each month.
                            Energy In represents charging, while Energy Out represents discharging.
                          </p>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                    <Select defaultValue="7days">
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7days">Last 7 days</SelectItem>
                        <SelectItem value="30days">Last 30 days</SelectItem>
                        <SelectItem value="90days">Last 90 days</SelectItem>
                        <SelectItem value="year">Last Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={monthlyUsage}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="energyIn" name="Energy In (kWh)" fill="#8884d8" />
                      <Bar dataKey="energyOut" name="Energy Out (kWh)" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-accent/30 p-4 rounded-lg">
                    <h4 className="text-sm font-medium mb-1">Total Energy Input</h4>
                    <p className="text-2xl font-bold">2,590 kWh</p>
                    <p className="text-xs text-muted-foreground">Since installation</p>
                  </div>
                  
                  <div className="bg-accent/30 p-4 rounded-lg">
                    <h4 className="text-sm font-medium mb-1">Total Energy Output</h4>
                    <p className="text-2xl font-bold">2,385 kWh</p>
                    <p className="text-xs text-muted-foreground">Since installation</p>
                  </div>
                  
                  <div className="bg-accent/30 p-4 rounded-lg">
                    <h4 className="text-sm font-medium mb-1">Round-Trip Efficiency</h4>
                    <p className="text-2xl font-bold">92.1%</p>
                    <p className="text-xs text-muted-foreground">Lifetime average</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="health">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Battery Health Analysis</CardTitle>
                    <CardDescription>Long-term battery performance and degradation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={[
                            { month: 'Apr', capacity: 100 },
                            { month: 'May', capacity: 99.8 },
                            { month: 'Jun', capacity: 99.5 },
                            { month: 'Jul', capacity: 99.2 },
                            { month: 'Aug', capacity: 98.9 },
                            { month: 'Sep', capacity: 98.7 },
                            { month: 'Oct', capacity: 98.5 },
                            { month: 'Nov', capacity: 98.3 },
                            { month: 'Dec', capacity: 98.1 },
                            { month: 'Jan', capacity: 97.9 },
                            { month: 'Feb', capacity: 97.7 },
                            { month: 'Mar', capacity: 97.4 },
                            { month: 'Apr', capacity: 97.0 },
                          ]}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis domain={[95, 100]} />
                          <Tooltip />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="capacity" 
                            name="Capacity (%)" 
                            stroke="#8884d8" 
                            activeDot={{ r: 8 }} 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
                        <h4 className="text-green-800 dark:text-green-300 text-sm font-medium mb-1">Health Score</h4>
                        <p className="text-green-900 dark:text-green-200 text-2xl font-bold">98/100</p>
                        <p className="text-green-700 dark:text-green-400 text-xs">Excellent Condition</p>
                      </div>
                      
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                        <h4 className="text-blue-800 dark:text-blue-300 text-sm font-medium mb-1">Degradation Rate</h4>
                        <p className="text-blue-900 dark:text-blue-200 text-2xl font-bold">3.0%</p>
                        <p className="text-blue-700 dark:text-blue-400 text-xs">Per year (estimated)</p>
                      </div>
                      
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-800">
                        <h4 className="text-purple-800 dark:text-purple-300 text-sm font-medium mb-1">Estimated Lifespan</h4>
                        <p className="text-purple-900 dark:text-purple-200 text-2xl font-bold">12+ years</p>
                        <p className="text-purple-700 dark:text-purple-400 text-xs">Until 80% capacity</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Health Factors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Cycle Count</span>
                          <span className="text-sm text-muted-foreground">258 / 6000</span>
                        </div>
                        <Progress value={4.3} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Temperature Management</span>
                          <span className="text-sm text-muted-foreground">Excellent</span>
                        </div>
                        <Progress value={95} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Depth of Discharge</span>
                          <span className="text-sm text-muted-foreground">Good</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Cell Balancing</span>
                          <span className="text-sm text-muted-foreground">Excellent</span>
                        </div>
                        <Progress value={98} className="h-2" />
                      </div>
                      
                      <div className="pt-4 border-t">
                        <h4 className="text-sm font-medium mb-3">Recommendations</h4>
                        <ul className="space-y-2 text-sm">
                          <li className="flex gap-2">
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Good Practice</Badge>
                            <span>Continue current usage pattern</span>
                          </li>
                          <li className="flex gap-2">
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Suggestion</Badge>
                            <span>Avoid frequent 100% charges</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Battery Schedule</CardTitle>
                    <CardDescription>Plan your battery charging and discharging</CardDescription>
                  </div>
                  <Button>Add Schedule</Button>
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
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Time</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-card divide-y divide-gray-200 dark:divide-gray-700">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">Peak Rate Avoidance</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">Discharge</Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">Mon-Fri, 6:00 PM - 9:00 PM</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">Active</Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <Button variant="ghost" size="sm">Edit</Button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">Off-peak Charging</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <Badge variant="outline" className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800">Charge</Badge>
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm">Weekend Backup Reserve</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <Badge variant="outline" className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800">Reserve</Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">Sat-Sun, All day</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <Badge variant="outline" className="bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800">Inactive</Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <Button variant="ghost" size="sm">Edit</Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-accent/30 rounded-lg p-5">
                    <h3 className="font-semibold mb-3 flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-primary" />
                      Weekly Schedule Overview
                    </h3>
                    
                    <div className="h-48 relative overflow-hidden border rounded-lg bg-card">
                      {/* This would ideally be a full calendar implementation */}
                      <div className="text-center p-10 text-muted-foreground">
                        <p>Calendar view would be displayed here</p>
                        <p className="text-sm">Time-based visualization of all battery schedules</p>
                        <Button variant="link" className="mt-2">
                          View Full Calendar
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
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

export default BatteryManagement;
