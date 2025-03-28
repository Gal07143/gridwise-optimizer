
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useDevices } from '@/hooks/useDevices';
import { useSite } from '@/contexts/SiteContext';
import { Battery, BatteryFull, BatteryLow, BatteryMedium, BatteryWarning, Clock, Info, Lightning, Power, Zap } from 'lucide-react';

// Sample battery data
const generateBatteryData = (hours: number) => {
  return Array.from({ length: hours }).map((_, i) => {
    const hour = i;
    const date = new Date();
    date.setHours(date.getHours() - hours + i);
    
    // Simulate typical battery behavior with higher SOC in afternoon, lower at night
    let soc = 50 + Math.sin((hour - 6) * Math.PI / 12) * 30;
    soc = Math.max(20, Math.min(95, soc + (Math.random() * 10 - 5)));
    
    // Power values - positive for charging, negative for discharging
    const powerValue = hour >= 8 && hour <= 16 
      ? Math.random() * 3 + 1  // Charging during day
      : -Math.random() * 2 - 0.5; // Discharging at night
    
    return {
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: date.toLocaleDateString(),
      timestamp: date.getTime(),
      soc: Math.round(soc),
      power: Math.round(powerValue * 10) / 10,
      temperature: Math.round((20 + Math.random() * 15) * 10) / 10,
      voltage: Math.round((48 + Math.random() * 4) * 10) / 10,
    };
  });
};

const modes = [
  { value: 'auto', label: 'Automatic (AI Optimized)' },
  { value: 'economic', label: 'Economic (Grid Price Optimization)' },
  { value: 'backup', label: 'Backup Reserve (Keep Charged)' },
  { value: 'peak', label: 'Peak Shaving' },
  { value: 'manual', label: 'Manual Control' },
];

const batteryCapacity = 10; // kWh
const currentSOC = 76; // %

const BatteryManagementPage = () => {
  const [selectedMode, setSelectedMode] = useState('auto');
  const [reserveLevel, setReserveLevel] = useState(20);
  const [preferGridCharging, setPreferGridCharging] = useState(false);
  const [data, setData] = useState(generateBatteryData(24));
  const { devices } = useDevices();
  const { currentSite } = useSite();
  
  // Find battery devices
  const batteryDevices = devices?.filter(d => d.type === 'battery') || [];
  
  // Get the real-time battery power flow (charging/discharging)
  const currentPower = data[data.length - 1]?.power || 0;
  const isCharging = currentPower > 0;
  
  // Calculate energy stored (kWh)
  const energyStored = (batteryCapacity * currentSOC) / 100;
  
  // Calculate estimated remaining time
  const estimatedTime = isCharging
    ? Math.round(((batteryCapacity - energyStored) / Math.abs(currentPower)) * 60)
    : Math.round((energyStored / Math.abs(currentPower)) * 60);
  
  // Hours and minutes for the estimated time
  const hours = Math.floor(estimatedTime / 60);
  const minutes = estimatedTime % 60;
  
  // Handle mode change
  const handleModeChange = (mode: string) => {
    setSelectedMode(mode);
    // In a real app, this would send a command to the battery system
    console.log(`Changed battery mode to: ${mode}`);
  };
  
  // Handle reserve level change
  const handleReserveChange = (value: number[]) => {
    setReserveLevel(value[0]);
    // In a real app, this would update battery settings
    console.log(`Changed battery reserve level to: ${value[0]}%`);
  };
  
  return (
    <AppLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Battery Management</h1>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Last updated: Just now</span>
            <Button variant="outline" size="sm">Refresh</Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
          <Card className="p-4 md:col-span-4">
            <div className="flex flex-col items-center justify-center h-full">
              <h3 className="text-lg font-medium mb-4">Battery Status</h3>
              
              <div className="relative w-40 h-40 mb-6">
                <div className="absolute inset-0 flex items-center justify-center">
                  <BatteryMedium size={100} className={isCharging ? 'text-green-500' : 'text-blue-500'} />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold">{currentSOC}%</span>
                </div>
              </div>
              
              <div className="text-center mb-2">
                <p className="text-lg font-semibold">
                  {isCharging ? 'Charging' : 'Discharging'}
                  <span className="ml-2 text-lg font-bold">
                    {Math.abs(currentPower)} kW
                  </span>
                </p>
                <p className="text-sm text-muted-foreground flex items-center justify-center mt-1">
                  <Clock size={16} className="mr-1" />
                  {isCharging ? 'Full in' : 'Empty in'} ~{hours}h {minutes}m
                </p>
              </div>
              
              <div className="w-full mt-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>0 kWh</span>
                  <span>{batteryCapacity} kWh</span>
                </div>
                <Progress value={currentSOC} className="h-2" />
                <p className="text-sm text-center mt-2">
                  {energyStored.toFixed(1)} kWh of {batteryCapacity} kWh
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 md:col-span-8">
            <h3 className="text-lg font-medium mb-4">Battery Activity</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis yAxisId="left" orientation="left" unit=" kW" domain={[-5, 5]} />
                  <YAxis yAxisId="right" orientation="right" unit="%" domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Area 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="power" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.3} 
                    name="Power (kW)" 
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="soc" 
                    stroke="#82ca9d" 
                    name="State of Charge (%)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Operating Mode</h3>
              <Info size={16} className="text-muted-foreground" />
            </div>
            
            <div className="space-y-2">
              {modes.map(mode => (
                <Button
                  key={mode.value}
                  variant={selectedMode === mode.value ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => handleModeChange(mode.value)}
                >
                  {mode.value === 'auto' && <Zap size={16} className="mr-2" />}
                  {mode.value === 'economic' && <Lightning size={16} className="mr-2" />}
                  {mode.value === 'backup' && <BatteryFull size={16} className="mr-2" />}
                  {mode.value === 'peak' && <Power size={16} className="mr-2" />}
                  {mode.value === 'manual' && <Battery size={16} className="mr-2" />}
                  {mode.label}
                </Button>
              ))}
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Battery Settings</h3>
              <Info size={16} className="text-muted-foreground" />
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <Label htmlFor="reserve">Backup Reserve</Label>
                  <span>{reserveLevel}%</span>
                </div>
                <Slider 
                  id="reserve" 
                  min={10} 
                  max={100} 
                  step={5} 
                  value={[reserveLevel]} 
                  onValueChange={handleReserveChange} 
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Minimum battery level to maintain for backup power
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="grid-charging">Grid Charging</Label>
                  <p className="text-xs text-muted-foreground">Allow charging from grid</p>
                </div>
                <Switch 
                  id="grid-charging" 
                  checked={preferGridCharging} 
                  onCheckedChange={setPreferGridCharging} 
                />
              </div>
              
              <div className="pt-2">
                <Button variant="outline" className="w-full">Advanced Settings</Button>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Battery Health</h3>
              <Info size={16} className="text-muted-foreground" />
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Battery Health</span>
                  <span className="text-sm font-medium">96%</span>
                </div>
                <Progress value={96} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Temperature</span>
                  <span className="text-sm font-medium">24.5°C</span>
                </div>
                <Progress value={24.5} max={60} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Cycles</span>
                  <span className="text-sm font-medium">352</span>
                </div>
                <Progress value={35.2} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  Expected cycles: ~6000
                </p>
              </div>
              
              <div className="pt-2">
                <div className="bg-muted p-3 rounded-md">
                  <h4 className="text-sm font-medium mb-1">System Recommendation</h4>
                  <p className="text-xs">
                    Your battery is healthy. Consider increasing the DoD (Depth of Discharge) to 90% to maximize utilization.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        <Card className="p-4">
          <Tabs defaultValue="statistics">
            <TabsList className="mb-4">
              <TabsTrigger value="statistics">Performance Statistics</TabsTrigger>
              <TabsTrigger value="history">Historical Data</TabsTrigger>
              <TabsTrigger value="schedule">Charge Schedule</TabsTrigger>
            </TabsList>
            
            <TabsContent value="statistics">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-sm font-medium mb-2">Energy Metrics (Last 30 Days)</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Energy Charged</span>
                      <span className="text-sm font-medium">145.6 kWh</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Energy Discharged</span>
                      <span className="text-sm font-medium">132.3 kWh</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Round Trip Efficiency</span>
                      <span className="text-sm font-medium">91%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Average Daily Cycles</span>
                      <span className="text-sm font-medium">0.7</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Power Statistics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Max Charge Rate</span>
                      <span className="text-sm font-medium">3.5 kW</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Max Discharge Rate</span>
                      <span className="text-sm font-medium">4.2 kW</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Avg. Charge Rate</span>
                      <span className="text-sm font-medium">2.1 kW</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Avg. Discharge Rate</span>
                      <span className="text-sm font-medium">1.8 kW</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">System Impact</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Grid Imports Saved</span>
                      <span className="text-sm font-medium">85.4 kWh</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Self-Consumption Increase</span>
                      <span className="text-sm font-medium">+32%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Peak Demand Reduction</span>
                      <span className="text-sm font-medium">3.2 kW</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Estimated Cost Savings</span>
                      <span className="text-sm font-medium">$42.65</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="history">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={generateBatteryData(168)} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis unit="%" domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="soc" stroke="#8884d8" name="State of Charge (%)" />
                    <Line type="monotone" dataKey="temperature" stroke="#ff7300" name="Temperature (°C)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm">Export Data</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="schedule">
              <div className="bg-muted p-4 rounded-md mb-4">
                <p className="text-sm">
                  Configure when your battery charges and discharges based on time-of-use rates, solar production, or grid carbon intensity.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4 border border-dashed">
                  <h4 className="text-sm font-medium mb-2">Weekday Schedule</h4>
                  <div className="text-center p-6">
                    <p className="text-muted-foreground">
                      No custom schedule set. Using automatic optimization.
                    </p>
                    <Button variant="outline" size="sm" className="mt-4">
                      Create Schedule
                    </Button>
                  </div>
                </Card>
                
                <Card className="p-4 border border-dashed">
                  <h4 className="text-sm font-medium mb-2">Weekend Schedule</h4>
                  <div className="text-center p-6">
                    <p className="text-muted-foreground">
                      No custom schedule set. Using automatic optimization.
                    </p>
                    <Button variant="outline" size="sm" className="mt-4">
                      Create Schedule
                    </Button>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </AppLayout>
  );
};

export default BatteryManagementPage;
