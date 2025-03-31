
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Main } from '@/components/ui/main';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Zap, Clock, LineChart, Calendar, DollarSign, BatteryCharging, Gauge, LightbulbIcon, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import ErrorBoundary from '@/components/ui/ErrorBoundary';

const EnergyOptimization = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isOptimizationEnabled, setIsOptimizationEnabled] = useState(true);
  const [optimizationMode, setOptimizationMode] = useState('balanced');
  const [costWeight, setCostWeight] = useState([40]);
  const [environmentWeight, setEnvironmentWeight] = useState([30]);
  const [reliabilityWeight, setReliabilityWeight] = useState([30]);

  const handleRunOptimization = () => {
    toast.success('Optimization cycle started');
    setTimeout(() => {
      toast.success('Optimization complete. New settings applied.');
    }, 2000);
  };

  return (
    <AppLayout>
      <Main title="Energy Optimization" description="AI-powered optimization of your energy system">
        <ErrorBoundary>
          <div className="mb-6 flex flex-col md:flex-row gap-4 items-start">
            <Card className="w-full md:w-3/4">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Intelligent Energy Optimization
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p>The optimization engine continuously analyzes your energy production, consumption, market prices, and weather forecasts to maximize efficiency and minimize costs.</p>
              </CardContent>
            </Card>
            <Card className="w-full md:w-1/4">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Optimization Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Auto-Optimize</span>
                  <Switch 
                    checked={isOptimizationEnabled}
                    onCheckedChange={setIsOptimizationEnabled}
                  />
                </div>
                <div className="mt-4">
                  <Button 
                    onClick={handleRunOptimization}
                    className="w-full"
                  >
                    Run Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="settings">Optimization Settings</TabsTrigger>
              <TabsTrigger value="schedule">Optimized Schedule</TabsTrigger>
              <TabsTrigger value="savings">Savings & Impact</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Current Mode</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <Badge className="text-sm bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300">
                        {optimizationMode === 'cost' && 'Cost Saving'}
                        {optimizationMode === 'eco' && 'Eco-Friendly'}
                        {optimizationMode === 'reliability' && 'High Reliability'}
                        {optimizationMode === 'balanced' && 'Balanced'}
                      </Badge>
                      <Select value={optimizationMode} onValueChange={setOptimizationMode}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Select mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cost">Cost Saving</SelectItem>
                          <SelectItem value="eco">Eco-Friendly</SelectItem>
                          <SelectItem value="reliability">High Reliability</SelectItem>
                          <SelectItem value="balanced">Balanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="mt-4 text-sm text-muted-foreground">
                      {optimizationMode === 'cost' && 'Prioritizes minimizing energy costs above all other factors.'}
                      {optimizationMode === 'eco' && 'Maximizes use of renewable energy sources to reduce carbon footprint.'}
                      {optimizationMode === 'reliability' && 'Ensures the most stable and reliable power supply.'}
                      {optimizationMode === 'balanced' && 'Balances cost savings, environmental impact, and system reliability.'}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Last Optimization</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Timestamp:</span>
                        <span className="font-medium">Today, 14:32</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duration:</span>
                        <span className="font-medium">2.3 seconds</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Changes Made:</span>
                        <span className="font-medium">7 adjustments</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Projected Savings:</span>
                        <span className="font-medium text-green-600">$3.42 / day</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Next Steps</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span>Scheduled optimization at 20:00</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <BatteryCharging className="h-4 w-4 text-green-500" />
                        <span>Battery discharge at peak rates (18:00-21:00)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <LightbulbIcon className="h-4 w-4 text-amber-500" />
                        <span>Load shifting of non-critical devices</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>System Efficiency Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-center">
                      <div className="text-muted-foreground text-sm mb-1">Energy Self-Consumption</div>
                      <div className="text-2xl font-bold">78%</div>
                      <div className="text-xs text-green-500">+5% from last week</div>
                    </div>
                    <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-center">
                      <div className="text-muted-foreground text-sm mb-1">Grid Independence</div>
                      <div className="text-2xl font-bold">62%</div>
                      <div className="text-xs text-green-500">+3% from last week</div>
                    </div>
                    <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-center">
                      <div className="text-muted-foreground text-sm mb-1">Cost Optimization</div>
                      <div className="text-2xl font-bold">85%</div>
                      <div className="text-xs text-green-500">+8% from last week</div>
                    </div>
                    <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-center">
                      <div className="text-muted-foreground text-sm mb-1">Carbon Reduction</div>
                      <div className="text-2xl font-bold">54%</div>
                      <div className="text-xs text-green-500">+2% from last week</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Optimization Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium">
                          Cost Savings Priority
                        </label>
                        <span className="text-sm">{costWeight}%</span>
                      </div>
                      <Slider 
                        value={costWeight} 
                        min={0} 
                        max={100} 
                        step={10}
                        onValueChange={(values) => {
                          setCostWeight(values);
                          const remaining = 100 - values[0];
                          setEnvironmentWeight([Math.floor(remaining/2)]);
                          setReliabilityWeight([Math.ceil(remaining/2)]);
                        }}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Higher value places more emphasis on reducing energy costs
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium">
                          Environmental Impact Priority
                        </label>
                        <span className="text-sm">{environmentWeight}%</span>
                      </div>
                      <Slider 
                        value={environmentWeight} 
                        min={0} 
                        max={100} 
                        step={10}
                        onValueChange={(values) => {
                          setEnvironmentWeight(values);
                          const remaining = 100 - values[0];
                          setCostWeight([Math.floor(remaining/2)]);
                          setReliabilityWeight([Math.ceil(remaining/2)]);
                        }}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Higher value prioritizes renewable energy and carbon reduction
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium">
                          System Reliability Priority
                        </label>
                        <span className="text-sm">{reliabilityWeight}%</span>
                      </div>
                      <Slider 
                        value={reliabilityWeight} 
                        min={0} 
                        max={100} 
                        step={10}
                        onValueChange={(values) => {
                          setReliabilityWeight(values);
                          const remaining = 100 - values[0];
                          setCostWeight([Math.floor(remaining/2)]);
                          setEnvironmentWeight([Math.ceil(remaining/2)]);
                        }}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Higher value ensures more stable and consistent power supply
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg border">
                      <h3 className="text-lg font-medium mb-2">Optimization Frequency</h3>
                      <Select defaultValue="4">
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Every hour</SelectItem>
                          <SelectItem value="2">Every 2 hours</SelectItem>
                          <SelectItem value="4">Every 4 hours</SelectItem>
                          <SelectItem value="6">Every 6 hours</SelectItem>
                          <SelectItem value="12">Every 12 hours</SelectItem>
                          <SelectItem value="24">Once a day</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="p-4 rounded-lg border">
                      <h3 className="text-lg font-medium mb-2">Advanced Options</h3>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Use Weather Forecast</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Consider Tariff Pricing</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Use AI Predictions</span>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button>Save Settings</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Optimized Energy Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <div className="min-w-[800px]">
                      <div className="grid grid-cols-24 gap-0 border-b pb-2 mb-2">
                        {Array.from({ length: 24 }, (_, i) => (
                          <div key={i} className="text-center text-xs text-muted-foreground">{i}:00</div>
                        ))}
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center mb-1">
                            <BatteryCharging className="h-4 w-4 mr-2 text-green-500" />
                            <span className="text-sm font-medium">Battery</span>
                          </div>
                          <div className="grid grid-cols-24 gap-0 h-8">
                            {Array.from({ length: 24 }, (_, i) => (
                              <div 
                                key={i} 
                                className={`${
                                  i >= 9 && i < 16 ? 'bg-green-500' : // Charging
                                  i >= 18 && i < 22 ? 'bg-blue-500' : // Discharging
                                  'bg-gray-200 dark:bg-gray-700' // Idle
                                } border-r border-background`}
                                title={`${
                                  i >= 9 && i < 16 ? 'Charging' : 
                                  i >= 18 && i < 22 ? 'Discharging' : 
                                  'Idle'
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center mb-1">
                            <LightbulbIcon className="h-4 w-4 mr-2 text-amber-500" />
                            <span className="text-sm font-medium">Load Shifting</span>
                          </div>
                          <div className="grid grid-cols-24 gap-0 h-8">
                            {Array.from({ length: 24 }, (_, i) => (
                              <div 
                                key={i} 
                                className={`${
                                  (i >= 11 && i < 14) || (i >= 2 && i < 5) ? 'bg-purple-500' : // Shifted loads
                                  'bg-gray-200 dark:bg-gray-700' // Normal
                                } border-r border-background`}
                                title={`${
                                  (i >= 11 && i < 14) || (i >= 2 && i < 5) ? 'Shifted non-critical loads' : 
                                  'Normal operation'
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center mb-1">
                            <Zap className="h-4 w-4 mr-2 text-blue-500" />
                            <span className="text-sm font-medium">Grid Exchange</span>
                          </div>
                          <div className="grid grid-cols-24 gap-0 h-8">
                            {Array.from({ length: 24 }, (_, i) => (
                              <div 
                                key={i} 
                                className={`${
                                  i >= 0 && i < 5 ? 'bg-blue-500' : // Import
                                  i >= 12 && i < 16 ? 'bg-green-500' : // Export
                                  'bg-gray-200 dark:bg-gray-700' // Neutral
                                } border-r border-background`}
                                title={`${
                                  i >= 0 && i < 5 ? 'Import from grid' : 
                                  i >= 12 && i < 16 ? 'Export to grid' : 
                                  'Neutral'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                          <span>Charging / Export to grid</span>
                          <div className="w-3 h-3 bg-blue-500 rounded-sm ml-4"></div>
                          <span>Discharging / Import from grid</span>
                          <div className="w-3 h-3 bg-purple-500 rounded-sm ml-4"></div>
                          <span>Load shifting</span>
                          <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded-sm ml-4"></div>
                          <span>Idle/Normal operation</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Schedule Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-2">Battery Usage</h3>
                      <ul className="space-y-1 text-sm">
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Charging Period:</span>
                          <span>9:00 - 16:00</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Discharging Period:</span>
                          <span>18:00 - 22:00</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Expected Energy Cycled:</span>
                          <span>8.3 kWh</span>
                        </li>
                      </ul>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-2">Load Management</h3>
                      <ul className="space-y-1 text-sm">
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Peak Avoidance:</span>
                          <span>17:00 - 21:00</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Shifted Loads:</span>
                          <span>HVAC, Water Heating</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Load Reduction:</span>
                          <span>1.7 kW</span>
                        </li>
                      </ul>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h3 className="text-lg font-medium mb-2">Grid Exchange</h3>
                      <ul className="space-y-1 text-sm">
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Import Period:</span>
                          <span>00:00 - 05:00</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Export Period:</span>
                          <span>12:00 - 16:00</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Net Exchange:</span>
                          <span className="text-green-600">+2.4 kWh (export)</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="savings" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      Financial Savings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-center">
                          <div className="text-muted-foreground text-sm mb-1">Today</div>
                          <div className="text-2xl font-bold text-green-600">$3.42</div>
                        </div>
                        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-center">
                          <div className="text-muted-foreground text-sm mb-1">This Month</div>
                          <div className="text-2xl font-bold text-green-600">$87.16</div>
                        </div>
                      </div>
                      <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-center">
                        <div className="text-muted-foreground text-sm mb-1">Projected Annual Savings</div>
                        <div className="text-3xl font-bold text-green-600">$1,246.35</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gauge className="h-5 w-5 text-blue-600" />
                      Environmental Impact
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-center">
                          <div className="text-muted-foreground text-sm mb-1">CO₂ Avoided Today</div>
                          <div className="text-2xl font-bold">4.8 kg</div>
                        </div>
                        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-center">
                          <div className="text-muted-foreground text-sm mb-1">This Month</div>
                          <div className="text-2xl font-bold">126 kg</div>
                        </div>
                      </div>
                      <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-center">
                        <div className="text-muted-foreground text-sm mb-1">Equivalent Trees Planted</div>
                        <div className="text-3xl font-bold">87</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Optimization History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <p>Optimization history charts will be displayed here</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Optimization Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900/40">
                      <h3 className="font-medium flex items-center gap-2">
                        <Gauge className="h-4 w-4 text-blue-600" />
                        Increase Battery Capacity
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">Based on your energy usage patterns, increasing battery storage by 5kWh could improve self-consumption by 23% and provide an additional $342 in annual savings.</p>
                    </div>

                    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-900/40">
                      <h3 className="font-medium flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                        Shift Major Appliances
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">Consider running your dishwasher and washing machine during 10:00-15:00 to utilize excess solar production instead of evening hours.</p>
                    </div>

                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900/40">
                      <h3 className="font-medium flex items-center gap-2">
                        <LightbulbIcon className="h-4 w-4 text-green-600" />
                        Add Smart Plugs
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">Adding smart plugs to your entertainment system and non-critical loads could save an additional $78 annually through automated load shifting.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </ErrorBoundary>
      </Main>
    </AppLayout>
  );
};

export default EnergyOptimization;
