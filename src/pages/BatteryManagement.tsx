
// Update the comparison operators for better type-safety
import React, { useState } from 'react';
import { Main } from '@/components/ui/main';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Battery, Zap, Clock, AlertCircle, Gauge, Info } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

// Fix the battery energy data by ensuring all numbers
const batteryEnergyData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  level: Math.min(100, Math.max(20, 80 + Math.sin((i / 24) * Math.PI * 2) * 30 + Math.random() * 5)),
  charging: i >= 10 && i <= 15,
  discharging: i >= 17 && i <= 22,
}));

const batteryHealthData = Array.from({ length: 30 }, (_, i) => ({
  day: `Day ${i + 1}`,
  health: Math.min(100, Math.max(70, 100 - (i / 70) * 10 - Math.random() * 2)),
}));

const BatteryManagement = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [autoControl, setAutoControl] = useState(true);
  const [maxChargeRate, setMaxChargeRate] = useState(80);
  const [dischargeThreshold, setDischargeThreshold] = useState(60);

  // Function to safely convert value to number for comparison
  const toNumber = (value: any): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') return parseFloat(value) || 0;
    return 0;
  };

  return (
    <Main title="Battery Management">
      <div className="flex flex-col md:flex-row items-start gap-4 mb-6">
        <div className="w-full md:w-3/4">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold flex items-center">
                <Battery className="mr-2 h-5 w-5" />
                Battery Energy Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="schedule">Schedule</TabsTrigger>
                  <TabsTrigger value="health">Health</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-center">
                      <div className="text-muted-foreground text-sm mb-1">State of Charge</div>
                      <div className="text-2xl font-bold">78%</div>
                      <div className="text-xs text-green-500">Healthy</div>
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-center">
                      <div className="text-muted-foreground text-sm mb-1">Current Power</div>
                      <div className="text-2xl font-bold">2.3 kW</div>
                      <div className="text-xs text-blue-500">Charging</div>
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-center">
                      <div className="text-muted-foreground text-sm mb-1">Total Capacity</div>
                      <div className="text-2xl font-bold">13.5 kWh</div>
                      <div className="text-xs text-muted-foreground">10.5 kWh Available</div>
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-center">
                      <div className="text-muted-foreground text-sm mb-1">Temperature</div>
                      <div className="text-2xl font-bold">28°C</div>
                      <div className="text-xs text-green-500">Normal</div>
                    </div>
                  </div>
                  
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={batteryEnergyData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                        <XAxis dataKey="time" />
                        <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                        <Tooltip 
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              const entry = payload[0].payload;
                              const levelNum = toNumber(entry.level);
                              return (
                                <div className="bg-background border p-2 text-sm rounded-md shadow-md">
                                  <p className="font-medium">{`Time: ${label}`}</p>
                                  <p>{`Level: ${levelNum.toFixed(1)}%`}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {entry.charging ? '🔌 Charging' : entry.discharging ? '⚡ Discharging' : '🔋 Idle'}
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Line type="monotone" dataKey="level" stroke="#3b82f6" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
                
                <TabsContent value="schedule" className="pt-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-2/3">
                      <h3 className="text-lg font-medium mb-3">Battery Schedule</h3>
                      <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                        <div className="flex flex-col gap-4">
                          <div className="flex justify-between border-b pb-2">
                            <span className="font-medium">Peak Shaving</span>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1 text-amber-500" />
                              <span className="text-sm">5:00 PM - 9:00 PM</span>
                            </div>
                          </div>
                          <div className="flex justify-between border-b pb-2">
                            <span className="font-medium">Charge from Solar</span>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1 text-green-500" />
                              <span className="text-sm">10:00 AM - 3:00 PM</span>
                            </div>
                          </div>
                          <div className="flex justify-between pb-2">
                            <span className="font-medium">Grid Charging</span>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1 text-blue-500" />
                              <span className="text-sm">1:00 AM - 5:00 AM</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-full md:w-1/3">
                      <h3 className="text-lg font-medium mb-3">Upcoming Events</h3>
                      <div className="space-y-3">
                        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-100 dark:border-green-900/40">
                          <div className="flex items-center text-green-700 dark:text-green-400 font-medium">
                            <Zap className="h-4 w-4 mr-2" />
                            Start Charging
                          </div>
                          <div className="text-sm mt-1">Today, 1:00 AM</div>
                        </div>
                        <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-900/40">
                          <div className="flex items-center text-red-700 dark:text-red-400 font-medium">
                            <Zap className="h-4 w-4 mr-2" />
                            Start Discharging
                          </div>
                          <div className="text-sm mt-1">Today, 5:00 PM</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="health" className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-center">
                      <div className="text-muted-foreground text-sm mb-1">Battery Health</div>
                      <div className="text-2xl font-bold">92%</div>
                      <div className="text-xs text-green-500">Excellent</div>
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-center">
                      <div className="text-muted-foreground text-sm mb-1">Cycle Count</div>
                      <div className="text-2xl font-bold">254</div>
                      <div className="text-xs text-muted-foreground">Max 10,000</div>
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-center">
                      <div className="text-muted-foreground text-sm mb-1">Estimated Lifespan</div>
                      <div className="text-2xl font-bold">8+ Years</div>
                      <div className="text-xs text-muted-foreground">Based on current usage</div>
                    </div>
                  </div>
                  
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={batteryHealthData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                        <XAxis dataKey="day" />
                        <YAxis domain={[70, 100]} tickFormatter={(value) => `${value}%`} />
                        <Tooltip 
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              const healthNum = toNumber(payload[0].payload.health);
                              let healthStatus = 'Good';
                              let statusColor = 'text-green-500';
                              
                              if (healthNum <= 75) {
                                healthStatus = 'Poor';
                                statusColor = 'text-red-500';
                              } else if (healthNum <= 90) {
                                healthStatus = 'Fair';
                                statusColor = 'text-amber-500';
                              }
                              
                              return (
                                <div className="bg-background border p-2 text-sm rounded-md shadow-md">
                                  <p className="font-medium">{label}</p>
                                  <p>{`Health: ${healthNum.toFixed(1)}%`}</p>
                                  <p className={`text-xs ${statusColor}`}>{healthStatus}</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Line type="monotone" dataKey="health" stroke="#10b981" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
                
                <TabsContent value="settings" className="pt-4">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">Automatic Control</h3>
                        <p className="text-sm text-muted-foreground">Let the system optimize battery usage based on energy pricing and home consumption patterns</p>
                      </div>
                      <Switch 
                        checked={autoControl} 
                        onCheckedChange={setAutoControl} 
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <label className="text-sm font-medium">
                            Maximum Charge Rate
                          </label>
                          <span className="text-sm">{maxChargeRate}%</span>
                        </div>
                        <Slider 
                          value={[maxChargeRate]} 
                          min={10} 
                          max={100} 
                          step={5}
                          onValueChange={(values) => setMaxChargeRate(values[0])}
                          disabled={!autoControl}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Limiting charge rate can extend battery life
                        </p>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <label className="text-sm font-medium">
                            Reserve Capacity (Grid Outage)
                          </label>
                          <span className="text-sm">{dischargeThreshold}%</span>
                        </div>
                        <Slider 
                          value={[dischargeThreshold]} 
                          min={0} 
                          max={100} 
                          step={5}
                          onValueChange={(values) => setDischargeThreshold(values[0])}
                          disabled={!autoControl}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Keep this amount of charge reserved for power outages
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900/30">
                      <div className="flex items-start">
                        <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-900 dark:text-blue-300">Battery Priority Settings</h4>
                          <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                            When automatic control is enabled, the system will prioritize:
                          </p>
                          <ol className="list-decimal ml-5 mt-2 space-y-1 text-sm text-blue-700 dark:text-blue-400">
                            <li>Charging from solar during peak production</li>
                            <li>Discharging during peak electricity rates</li>
                            <li>Maintaining reserve capacity for outages</li>
                          </ol>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button>Save Settings</Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="w-full md:w-1/4 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Battery Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Mode</span>
                  <span className="text-sm bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded">Optimal</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Status</span>
                  <span className="text-sm bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 px-2 py-0.5 rounded">Charging</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Power</span>
                  <span className="text-sm">2.3 kW</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Voltage</span>
                  <span className="text-sm">48V</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Current</span>
                  <span className="text-sm">48A</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Energy Today</span>
                  <span className="text-sm">12.7 kWh</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-100 dark:border-amber-900/30 text-sm">
                  Charging rate limited due to high temperature (28°C)
                  <div className="text-xs text-muted-foreground mt-1">Today, 2:34 PM</div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-900/30 text-sm">
                  Battery health check completed - 92% health (Excellent)
                  <div className="text-xs text-muted-foreground mt-1">Yesterday, 10:15 AM</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Gauge className="h-4 w-4 mr-2" />
                Efficiency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500 mb-1">94%</div>
                <div className="text-sm text-muted-foreground">Round-trip efficiency</div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-3">
                  <div className="h-2 bg-green-500 rounded-full" style={{ width: '94%' }}></div>
                </div>
              </div>
              <div className="text-xs text-center mt-4 text-muted-foreground">
                Excellent performance compared to the industry average of 85-90%
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Main>
  );
};

export default BatteryManagement;
