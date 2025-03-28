
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSite } from '@/contexts/SiteContext';
import { AlertTriangle, BatteryMedium, ChevronRight, Clock, Droplets, Gauge, Lightbulb, Thermometer, Zap } from 'lucide-react';

// Sample optimization data
const generateTariffData = () => {
  const hours = Array.from({ length: 24 }).map((_, i) => {
    const hour = i;
    
    // Create typical time-of-use rate structure
    let rate = 0.12; // Base rate
    
    // Peak hours (weekday evenings)
    if (hour >= 16 && hour < 21) {
      rate = 0.32;
    } 
    // Partial peak (mornings and early evening)
    else if ((hour >= 7 && hour < 16) || (hour >= 21 && hour < 23)) {
      rate = 0.18;
    }
    // Off-peak (night)
    else {
      rate = 0.08;
    }
    
    // Generate demand values - higher during daytime
    const demand = hour >= 8 && hour <= 22 
      ? 2 + Math.sin((hour - 8) * Math.PI / 14) * 2 + Math.random() * 0.5
      : 0.5 + Math.random() * 0.5;
    
    return {
      hour: `${hour}:00`,
      rate,
      demand: Math.round(demand * 10) / 10,
      carbon: Math.round((0.3 + Math.random() * 0.2) * 100) / 100,
      optimized: false
    };
  });
  
  // Add optimization flag to show reduced demand during peak times
  hours.map(h => {
    const hNum = parseInt(h.hour);
    if (hNum >= 16 && hNum < 21) {
      h.optimized = true;
      h.optimizedDemand = Math.round((h.demand * 0.7) * 10) / 10;
    } else {
      h.optimizedDemand = h.demand;
    }
    return h;
  });
  
  return hours;
};

const goals = [
  { value: 'cost', label: 'Minimize Cost' },
  { value: 'self', label: 'Maximize Self-Consumption' },
  { value: 'carbon', label: 'Reduce Carbon Footprint' },
  { value: 'grid', label: 'Reduce Grid Dependency' },
  { value: 'backup', label: 'Prioritize Backup Capacity' },
];

const devices = [
  { id: 'ev-charger', name: 'EV Charger', type: 'load', status: true, icon: <Zap size={16} /> },
  { id: 'battery', name: 'Home Battery', type: 'battery', status: true, icon: <BatteryMedium size={16} /> },
  { id: 'hvac', name: 'HVAC System', type: 'load', status: true, icon: <Thermometer size={16} /> },
  { id: 'waterheater', name: 'Water Heater', type: 'load', status: true, icon: <Droplets size={16} /> },
  { id: 'lighting', name: 'Smart Lighting', type: 'load', status: false, icon: <Lightbulb size={16} /> },
];

const EnergyOptimizationPage = () => {
  const [optimizationGoal, setOptimizationGoal] = useState('cost');
  const [enableOptimization, setEnableOptimization] = useState(true);
  const [comfortLevel, setComfortLevel] = useState(70);
  const [deviceStates, setDeviceStates] = useState(() => 
    devices.reduce((acc, device) => ({...acc, [device.id]: device.status}), {})
  );
  const [tariffData, setTariffData] = useState(generateTariffData());
  const { currentSite } = useSite();
  
  // Update device state
  const toggleDevice = (deviceId: string) => {
    setDeviceStates(prev => ({
      ...prev,
      [deviceId]: !prev[deviceId]
    }));
  };
  
  // Handle comfort level change
  const handleComfortLevelChange = (values: number[]) => {
    setComfortLevel(values[0]);
  };
  
  // Calculated metrics
  const estimatedSavings = 42.35; // In dollars
  const estimatedCarbonReduction = 256; // In kg CO2
  const peakReduction = 3.2; // In kW
  
  return (
    <AppLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Energy Optimization</h1>
          <div className="flex items-center space-x-2">
            <Switch id="enable-optimization" checked={enableOptimization} onCheckedChange={setEnableOptimization} />
            <Label htmlFor="enable-optimization">Enable Optimization</Label>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
          <Card className="p-4 md:col-span-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Optimization Goal</h3>
              <AlertTriangle size={16} className="text-amber-500" />
            </div>
            
            <div className="space-y-2">
              {goals.map(goal => (
                <Button
                  key={goal.value}
                  variant={optimizationGoal === goal.value ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setOptimizationGoal(goal.value)}
                  disabled={!enableOptimization}
                >
                  {goal.label}
                </Button>
              ))}
            </div>
            
            <div className="mt-6">
              <div className="flex justify-between mb-2">
                <Label htmlFor="comfort">Comfort vs. Efficiency</Label>
                <span>{comfortLevel}%</span>
              </div>
              <Slider 
                id="comfort" 
                min={0} 
                max={100} 
                step={5} 
                value={[comfortLevel]} 
                onValueChange={handleComfortLevelChange}
                disabled={!enableOptimization}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Efficiency</span>
                <span>Comfort</span>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 md:col-span-8">
            <h3 className="text-lg font-medium mb-4">Optimization Impact</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tariffData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis yAxisId="left" orientation="left" unit=" kW" />
                  <YAxis yAxisId="right" orientation="right" unit="$/kWh" domain={[0, 0.4]} />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="demand" name="Original Demand" fill="#8884d8" />
                  <Bar yAxisId="left" dataKey="optimizedDemand" name="Optimized Demand" fill="#82ca9d" />
                  <Line yAxisId="right" type="monotone" dataKey="rate" name="Electricity Rate" stroke="#ff7300" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="p-4 flex flex-col">
            <h3 className="text-lg font-medium mb-4">Estimated Savings</h3>
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-4xl font-bold text-green-500">${estimatedSavings.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Monthly</p>
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <Button variant="outline" size="sm" className="text-xs">View Detailed Breakdown</Button>
            </div>
          </Card>
          
          <Card className="p-4 flex flex-col">
            <h3 className="text-lg font-medium mb-4">Carbon Reduction</h3>
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-4xl font-bold text-green-500">{estimatedCarbonReduction} kg</p>
                <p className="text-sm text-muted-foreground">CO₂ Equivalent</p>
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <Button variant="outline" size="sm" className="text-xs">Environmental Impact</Button>
            </div>
          </Card>
          
          <Card className="p-4 flex flex-col">
            <h3 className="text-lg font-medium mb-4">Peak Reduction</h3>
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-4xl font-bold text-green-500">{peakReduction} kW</p>
                <p className="text-sm text-muted-foreground">Average</p>
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <Button variant="outline" size="sm" className="text-xs">View Demand Profile</Button>
            </div>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-4">Managed Devices</h3>
            <div className="divide-y">
              {devices.map(device => (
                <div key={device.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {device.icon}
                    <span>{device.name}</span>
                  </div>
                  <Switch 
                    id={`device-${device.id}`} 
                    checked={deviceStates[device.id]} 
                    onCheckedChange={() => toggleDevice(device.id)}
                    disabled={!enableOptimization}
                  />
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">Add Device</Button>
            </div>
          </Card>
          
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-4">Optimization Schedule</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BatteryMedium size={16} />
                  <div>
                    <p className="font-medium">Battery Charging</p>
                    <p className="text-sm text-muted-foreground">Scheduled for 2:00 AM - 6:00 AM</p>
                  </div>
                </div>
                <ChevronRight size={16} />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap size={16} />
                  <div>
                    <p className="font-medium">EV Charging</p>
                    <p className="text-sm text-muted-foreground">Scheduled for 12:30 AM - 5:30 AM</p>
                  </div>
                </div>
                <ChevronRight size={16} />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Droplets size={16} />
                  <div>
                    <p className="font-medium">Water Heating</p>
                    <p className="text-sm text-muted-foreground">Scheduled for 4:00 AM - 6:00 AM</p>
                  </div>
                </div>
                <ChevronRight size={16} />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gauge size={16} />
                  <div>
                    <p className="font-medium">Peak Load Shifting</p>
                    <p className="text-sm text-muted-foreground">Scheduled for 5:00 PM - 8:00 PM</p>
                  </div>
                </div>
                <ChevronRight size={16} />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" size="sm">Edit Schedules</Button>
            </div>
          </Card>
        </div>
        
        <Card className="p-4">
          <Tabs defaultValue="tariff">
            <TabsList className="mb-4">
              <TabsTrigger value="tariff">Tariff Optimization</TabsTrigger>
              <TabsTrigger value="solar">Solar Optimization</TabsTrigger>
              <TabsTrigger value="algorithms">Algorithm Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tariff">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium mb-4">Time-of-Use Rate Structure</h4>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={tariffData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" />
                        <YAxis unit="$/kWh" domain={[0, 0.4]} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="rate" stroke="#ff7300" name="Electricity Rate" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-4">Tariff Settings</h4>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="tariff-plan" className="mb-2 block">Tariff Plan</Label>
                      <Select defaultValue="tou" disabled={!enableOptimization}>
                        <SelectTrigger id="tariff-plan">
                          <SelectValue placeholder="Select tariff" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tou">Time-of-Use Plan</SelectItem>
                          <SelectItem value="fixed">Fixed Rate Plan</SelectItem>
                          <SelectItem value="dynamic">Dynamic Pricing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="peak-hours" className="mb-2 block">Peak Hours</Label>
                      <Select defaultValue="evening" disabled={!enableOptimization}>
                        <SelectTrigger id="peak-hours">
                          <SelectValue placeholder="Select peak hours" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="evening">5 PM - 9 PM</SelectItem>
                          <SelectItem value="afternoon">2 PM - 7 PM</SelectItem>
                          <SelectItem value="custom">Custom...</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="pt-2">
                      <Button variant="outline" className="w-full" disabled={!enableOptimization}>
                        Import Utility Rates
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="solar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium mb-4">Solar Production Forecast</h4>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={generateTariffData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" />
                        <YAxis unit=" kW" />
                        <Tooltip />
                        <Legend />
                        <Area type="monotone" dataKey="solar" stroke="#ffc658" fill="#ffc658" name="Solar Production" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-4">Solar Optimization Settings</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="match-solar">Match Consumption to Solar</Label>
                        <p className="text-xs text-muted-foreground">Shift loads to peak solar hours</p>
                      </div>
                      <Switch id="match-solar" checked={true} disabled={!enableOptimization} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="export-limit">Minimize Grid Export</Label>
                        <p className="text-xs text-muted-foreground">Prioritize self-consumption</p>
                      </div>
                      <Switch id="export-limit" checked={false} disabled={!enableOptimization} />
                    </div>
                    
                    <div>
                      <Label htmlFor="solar-target" className="mb-2 block">Solar Self-Consumption Target</Label>
                      <Select defaultValue="maximum" disabled={!enableOptimization}>
                        <SelectTrigger id="solar-target">
                          <SelectValue placeholder="Select target" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="maximum">Maximize (95%+)</SelectItem>
                          <SelectItem value="balanced">Balanced (80-90%)</SelectItem>
                          <SelectItem value="moderate">Moderate (70-80%)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="algorithms">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4 border border-dashed">
                  <h4 className="text-sm font-medium mb-2">AI Learning Settings</h4>
                  <div className="space-y-4 mt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="enable-learning">Enable AI Learning</Label>
                        <p className="text-xs text-muted-foreground">Learn from usage patterns</p>
                      </div>
                      <Switch id="enable-learning" checked={true} disabled={!enableOptimization} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="weather-integration">Weather Integration</Label>
                        <p className="text-xs text-muted-foreground">Adjust based on forecast</p>
                      </div>
                      <Switch id="weather-integration" checked={true} disabled={!enableOptimization} />
                    </div>
                    
                    <div>
                      <Label htmlFor="learning-speed" className="mb-2 block">Learning Speed</Label>
                      <Select defaultValue="balanced" disabled={!enableOptimization}>
                        <SelectTrigger id="learning-speed">
                          <SelectValue placeholder="Select learning speed" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fast">Fast (Adapt Quickly)</SelectItem>
                          <SelectItem value="balanced">Balanced</SelectItem>
                          <SelectItem value="conservative">Conservative</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4 border border-dashed">
                  <h4 className="text-sm font-medium mb-2">Advanced Algorithm Settings</h4>
                  <div className="space-y-4 mt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="predictive-control">Predictive Control</Label>
                        <p className="text-xs text-muted-foreground">Plan ahead for optimal efficiency</p>
                      </div>
                      <Switch id="predictive-control" checked={true} disabled={!enableOptimization} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="demand-response">Demand Response Ready</Label>
                        <p className="text-xs text-muted-foreground">Participate in utility programs</p>
                      </div>
                      <Switch id="demand-response" checked={false} disabled={!enableOptimization} />
                    </div>
                    
                    <div>
                      <Label htmlFor="optimization-horizon" className="mb-2 block">Optimization Horizon</Label>
                      <Select defaultValue="24h" disabled={!enableOptimization}>
                        <SelectTrigger id="optimization-horizon">
                          <SelectValue placeholder="Select horizon" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="12h">12 Hours</SelectItem>
                          <SelectItem value="24h">24 Hours</SelectItem>
                          <SelectItem value="48h">48 Hours</SelectItem>
                          <SelectItem value="7d">7 Days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>
              </div>
              
              <div className="mt-6 flex justify-end space-x-2">
                <Button variant="outline">Reset to Defaults</Button>
                <Button>Save Settings</Button>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </AppLayout>
  );
};

export default EnergyOptimizationPage;
