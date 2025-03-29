
import React, { useState } from 'react';
import { Main } from '@/components/ui/main';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Zap, LineChart, BarChart2, Clock, Calendar, Trophy, AlertTriangle, Battery, BatteryCharging } from 'lucide-react';
import { ResponsiveContainer, LineChart as ReLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart as ReBarChart, Bar, AreaChart, Area } from 'recharts';
import { useSiteContext } from '@/contexts/SiteContext';

// Mock optimization data
const optimizationHistory = [
  { date: '2023-01-01', unoptimized: 32.5, optimized: 26.8, savings: 5.7 },
  { date: '2023-02-01', unoptimized: 30.2, optimized: 25.5, savings: 4.7 },
  { date: '2023-03-01', unoptimized: 28.8, optimized: 24.2, savings: 4.6 },
  { date: '2023-04-01', unoptimized: 26.5, optimized: 22.1, savings: 4.4 },
  { date: '2023-05-01', unoptimized: 25.2, optimized: 21.5, savings: 3.7 },
  { date: '2023-06-01', unoptimized: 27.8, optimized: 22.8, savings: 5.0 },
  { date: '2023-07-01', unoptimized: 32.5, optimized: 26.5, savings: 6.0 },
  { date: '2023-08-01', unoptimized: 34.2, optimized: 27.8, savings: 6.4 },
  { date: '2023-09-01', unoptimized: 29.5, optimized: 24.2, savings: 5.3 },
  { date: '2023-10-01', unoptimized: 27.8, optimized: 23.1, savings: 4.7 },
  { date: '2023-11-01', unoptimized: 30.5, optimized: 25.2, savings: 5.3 },
  { date: '2023-12-01', unoptimized: 35.2, optimized: 28.5, savings: 6.7 },
];

// Demand shifting data
const demandShiftingData = [
  { hour: '00:00', rate: 0.08, demand: 2.1, carbon: 180, optimized: true, optimizedDemand: 3.5 },
  { hour: '02:00', rate: 0.06, demand: 1.5, carbon: 150, optimized: true, optimizedDemand: 2.8 },
  { hour: '04:00', rate: 0.05, demand: 1.2, carbon: 130, optimized: true, optimizedDemand: 2.5 },
  { hour: '06:00', rate: 0.07, demand: 2.5, carbon: 160, optimized: true, optimizedDemand: 1.8 },
  { hour: '08:00', rate: 0.12, demand: 4.2, carbon: 210, optimized: false, optimizedDemand: 3.1 },
  { hour: '10:00', rate: 0.15, demand: 4.8, carbon: 230, optimized: false, optimizedDemand: 3.6 },
  { hour: '12:00', rate: 0.14, demand: 5.2, carbon: 220, optimized: false, optimizedDemand: 4.1 },
  { hour: '14:00', rate: 0.13, demand: 4.5, carbon: 200, optimized: false, optimizedDemand: 3.8 },
  { hour: '16:00', rate: 0.18, demand: 5.8, carbon: 250, optimized: false, optimizedDemand: 4.2 },
  { hour: '18:00', rate: 0.22, demand: 7.2, carbon: 280, optimized: false, optimizedDemand: 5.4 },
  { hour: '20:00', rate: 0.20, demand: 6.5, carbon: 270, optimized: false, optimizedDemand: 4.8 },
  { hour: '22:00', rate: 0.14, demand: 4.2, carbon: 220, optimized: false, optimizedDemand: 3.7 },
];

const optimizationRecommendations = [
  {
    id: 'rec-1',
    title: 'Shift EV Charging',
    description: 'Delay EV charging from 18:00 to 02:00 to save $4.80 per session',
    savings: 4.80,
    type: 'load-shifting',
    applied: false
  },
  {
    id: 'rec-2',
    title: 'Increase Battery Reserve',
    description: 'Increase battery reserve to 30% during peak hours (16:00-20:00)',
    savings: 3.25,
    type: 'battery',
    applied: true
  },
  {
    id: 'rec-3',
    title: 'Optimize HVAC Schedule',
    description: 'Pre-cool home during off-peak hours to reduce peak load',
    savings: 2.15,
    type: 'load-shifting',
    applied: false
  },
  {
    id: 'rec-4',
    title: 'Export Excess Solar',
    description: 'Export excess solar production during 11:00-14:00 when rates are favorable',
    savings: 1.90,
    type: 'export',
    applied: false
  }
];

const EnergyOptimization: React.FC = () => {
  const { activeSite } = useSiteContext();
  const [activeTab, setActiveTab] = useState('overview');
  const [batteryOptimizationEnabled, setBatteryOptimizationEnabled] = useState(true);
  const [loadShiftingEnabled, setLoadShiftingEnabled] = useState(true);
  const [exportOptimizationEnabled, setExportOptimizationEnabled] = useState(true);
  const [economicPriority, setEconomicPriority] = useState([70]); // 0-100 economic vs environmental
  const [peakShavingThreshold, setPeakShavingThreshold] = useState([80]); // % of capacity
  
  // Calculate total savings
  const totalSavings = optimizationHistory.reduce((sum, record) => sum + record.savings, 0);
  const averageSavings = totalSavings / optimizationHistory.length;
  const totalOpportunities = optimizationRecommendations.length;
  const appliedOpportunities = optimizationRecommendations.filter(rec => rec.applied).length;
  
  return (
    <Main containerSize="default" className="max-w-[1600px] mx-auto pt-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Energy Optimization</h1>
          <p className="text-muted-foreground">
            {activeSite ? `Optimizing energy usage for ${activeSite.name}` : 'Select a site to view optimization options'}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Zap className="h-5 w-5 mr-2 text-green-500" />
              Optimization Savings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalSavings.toFixed(2)}</div>
            <div className="text-sm text-muted-foreground mt-1">Total savings this year</div>
            <div className="text-md font-medium mt-4">${averageSavings.toFixed(2)}/month</div>
            <div className="text-sm text-muted-foreground">Average monthly savings</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-500" />
              Optimization Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="relative w-16 h-16 mr-4">
                <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="10"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="10"
                    strokeDasharray={`${(appliedOpportunities / totalOpportunities) * 283} 283`}
                  />
                </svg>
              </div>
              <div>
                <div className="text-xl font-bold">{appliedOpportunities}/{totalOpportunities}</div>
                <div className="text-sm text-muted-foreground">Optimizations applied</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm font-medium">Next optimization in: <span className="text-blue-600">3 hours</span></div>
              <div className="text-sm text-muted-foreground">Battery charge during off-peak rates</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-amber-500" />
              Optimization Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Cost Reduction</span>
                  <span className="text-sm font-medium">18%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '18%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Self-Consumption</span>
                  <span className="text-sm font-medium">72%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '72%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Carbon Reduction</span>
                  <span className="text-sm font-medium">24%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '24%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 bg-gray-100/50 dark:bg-gray-900/50 backdrop-blur-md p-1 rounded-lg mb-6">
          <TabsTrigger value="overview" className="flex items-center">
            <BarChart2 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="demand-shifting" className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Demand Shifting
          </TabsTrigger>
          <TabsTrigger value="battery" className="flex items-center">
            <Battery className="h-4 w-4 mr-2" />
            Battery Optimization
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6 animate-in fade-in">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <LineChart className="h-5 w-5 mr-2 text-blue-500" />
                Optimization History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ReBarChart data={optimizationHistory}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                    <XAxis dataKey="date" tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString('en-US', { month: 'short' });
                    }} />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => {
                        if (name === 'unoptimized') return [`${value} kWh`, 'Before Optimization'];
                        if (name === 'optimized') return [`${value} kWh`, 'After Optimization'];
                        if (name === 'savings') return [`${value} kWh`, 'Energy Saved'];
                        return [value, name];
                      }}
                      labelFormatter={(label) => {
                        const date = new Date(label);
                        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                      }}
                    />
                    <Legend />
                    <Bar dataKey="unoptimized" name="Before Optimization" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="optimized" name="After Optimization" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="savings" name="Energy Saved" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </ReBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-amber-500" />
                  Recommended Optimizations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                  {optimizationRecommendations.map(rec => (
                    <div 
                      key={rec.id} 
                      className={`p-3 border rounded-lg flex items-start gap-3 ${
                        rec.applied ? 'bg-gray-50 dark:bg-gray-800/50 border-green-200 dark:border-green-900' : 'bg-white dark:bg-gray-800'
                      }`}
                    >
                      <div className="flex-shrink-0 mt-1">
                        {rec.type === 'load-shifting' ? (
                          <Clock className="h-4 w-4 text-blue-500" />
                        ) : rec.type === 'battery' ? (
                          <BatteryCharging className="h-4 w-4 text-green-500" />
                        ) : (
                          <Zap className="h-4 w-4 text-amber-500" />
                        )}
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-sm line-clamp-1">{rec.title}</h4>
                          <span className="text-xs text-green-600 font-medium ml-2">
                            ${rec.savings.toFixed(2)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {rec.description}
                        </p>
                        <div className="mt-2">
                          {rec.applied ? (
                            <span className="text-xs flex items-center text-green-600">
                              <Zap className="h-3 w-3 mr-1" /> Applied
                            </span>
                          ) : (
                            <Button size="sm" variant="outline" className="text-xs h-7 px-2">
                              Apply
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
                  Optimization Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-900/50 rounded-lg">
                    <h4 className="font-medium text-sm flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1 text-amber-500" /> 
                      Peak Demand Alert
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Predicted peak demand between 18:00-20:00 today. Battery discharge scheduled.
                    </p>
                  </div>
                  
                  <div className="p-3 border border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-900/50 rounded-lg">
                    <h4 className="font-medium text-sm flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-blue-500" /> 
                      Off-Peak Charging
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      EV charging schedule adjusted to 01:00-05:00 to utilize lowest rates.
                    </p>
                  </div>
                  
                  <div className="p-3 border border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-900/50 rounded-lg">
                    <h4 className="font-medium text-sm flex items-center">
                      <Zap className="h-4 w-4 mr-1 text-green-500" /> 
                      Grid Export Opportunity
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      High solar production forecasted for tomorrow. Optimized battery storage to maximize grid export.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="demand-shifting" className="space-y-6 animate-in fade-in">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-500" />
                Demand Shifting Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={demandShiftingData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="hour" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" domain={[0, 0.25]} tickFormatter={tick => `$${tick.toFixed(2)}`} />
                    <Tooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-background border p-3 rounded-md shadow-md">
                              <p className="font-medium mb-1">{`Time: ${label}`}</p>
                              <p style={{ color: payload[0].color }}>
                                {`Current Demand: ${payload[0].value} kW`}
                              </p>
                              {payload[0].payload.optimized && (
                                <p style={{ color: "#10b981" }}>
                                  {`Optimized Demand: ${payload[0].payload.optimizedDemand} kW`}
                                </p>
                              )}
                              <p style={{ color: payload[1].color }}>
                                {`Electricity Rate: $${payload[1].value.toFixed(2)}/kWh`}
                              </p>
                              <p style={{ color: payload[2].color }}>
                                {`Carbon Intensity: ${payload[2].value} g/kWh`}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                    <Area yAxisId="left" type="monotone" dataKey="demand" name="Current Demand (kW)" fill="#3b82f6" stroke="#3b82f6" fillOpacity={0.2} />
                    <Area yAxisId="right" type="monotone" dataKey="rate" name="Electricity Rate ($/kWh)" fill="#f59e0b" stroke="#f59e0b" fillOpacity={0.2} />
                    <Area yAxisId="left" type="monotone" dataKey="carbon" name="Carbon Intensity (g/kWh)" fill="#6366f1" stroke="#6366f1" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-purple-500" />
                  Load Shifting Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Enable Load Shifting</label>
                      <Switch 
                        checked={loadShiftingEnabled} 
                        onCheckedChange={setLoadShiftingEnabled} 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3 pt-4 border-t">
                    <h4 className="text-sm font-medium">Flexible Loads</h4>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-muted-foreground">EV Charging</label>
                      <Switch checked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-muted-foreground">HVAC</label>
                      <Switch checked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-muted-foreground">Water Heater</label>
                      <Switch checked={false} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-muted-foreground">Pool Pump</label>
                      <Switch checked={true} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-green-500" />
                  Optimization Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm font-medium">Peak Hours (Avoid Usage)</span>
                    <div className="flex items-center">
                      <div className="h-6 bg-red-500/20 border-l border-r border-red-500/30 flex-grow text-center text-xs py-1 rounded-sm text-red-800 dark:text-red-300">
                        16:00 - 21:00
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm font-medium">Shoulder Hours (Moderate Usage)</span>
                    <div className="flex items-center">
                      <div className="h-6 bg-amber-500/20 border-l border-r border-amber-500/30 flex-grow text-center text-xs py-1 rounded-sm text-amber-800 dark:text-amber-300">
                        06:00 - 16:00, 21:00 - 23:00
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm font-medium">Off-Peak Hours (Encourage Usage)</span>
                    <div className="flex items-center">
                      <div className="h-6 bg-green-500/20 border-l border-r border-green-500/30 flex-grow text-center text-xs py-1 rounded-sm text-green-800 dark:text-green-300">
                        23:00 - 06:00
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 space-y-3">
                  <h4 className="text-sm font-medium">Next Scheduled Shifts</h4>
                  
                  <div className="flex items-start space-x-3 p-2 border rounded-md">
                    <Clock className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">EV Charging</p>
                      <p className="text-xs text-muted-foreground">Shifted from 18:00 to 01:00</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-2 border rounded-md">
                    <Clock className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">HVAC Pre-cooling</p>
                      <p className="text-xs text-muted-foreground">Scheduled for 14:00-15:00 before peak hours</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="battery" className="space-y-6 animate-in fade-in">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Battery className="h-5 w-5 mr-2 text-green-500" />
                Battery Optimization Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ReLineChart data={optimizationHistory}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                    <XAxis dataKey="date" tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString('en-US', { month: 'short' });
                    }} />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(label) => {
                        const date = new Date(label);
                        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="savings" name="Energy Saved (kWh)" stroke="#10b981" strokeWidth={2} />
                  </ReLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <BatteryCharging className="h-5 w-5 mr-2 text-blue-500" />
                  Battery Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Enable Battery Optimization</label>
                      <Switch 
                        checked={batteryOptimizationEnabled} 
                        onCheckedChange={setBatteryOptimizationEnabled} 
                      />
                    </div>
                    
                    <label className="text-sm font-medium">Peak Shaving Threshold ({peakShavingThreshold}%)</label>
                    <Slider
                      disabled={!batteryOptimizationEnabled}
                      value={peakShavingThreshold}
                      min={50}
                      max={100}
                      step={5}
                      onValueChange={setPeakShavingThreshold}
                    />
                  </div>
                  
                  <div className="space-y-3 pt-4 border-t">
                    <h4 className="text-sm font-medium">Grid Export Settings</h4>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Enable Grid Export Optimization</label>
                      <Switch 
                        checked={exportOptimizationEnabled} 
                        onCheckedChange={setExportOptimizationEnabled} 
                      />
                    </div>
                    
                    <p className="text-xs text-muted-foreground">
                      When enabled, the system will optimize battery usage to maximize grid export during high rate periods.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <LineChart className="h-5 w-5 mr-2 text-purple-500" />
                  Optimization Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Battery Cycles Saved</h4>
                    <div className="text-2xl font-bold">42 cycles <span className="text-sm font-normal text-muted-foreground">this year</span></div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Extended battery lifespan by approximately 5.2 months
                    </p>
                  </div>
                  
                  <div className="pt-3 border-t">
                    <h4 className="text-sm font-medium mb-2">Grid Import Reduction</h4>
                    <div className="text-2xl font-bold">32% <span className="text-sm font-normal text-muted-foreground">reduction</span></div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Reduced grid imports during peak hours by optimizing battery discharge
                    </p>
                  </div>
                  
                  <div className="pt-3 border-t">
                    <h4 className="text-sm font-medium mb-2">Self-Consumption Increase</h4>
                    <div className="text-2xl font-bold">18% <span className="text-sm font-normal text-muted-foreground">increase</span></div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Improved utilization of on-site generation through intelligent battery control
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6 animate-in fade-in">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Settings className="h-5 w-5 mr-2 text-gray-500" />
                Optimization Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Optimization Priority</h4>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs">Environmental</span>
                      <span className="text-xs">Economic</span>
                    </div>
                    <Slider 
                      value={economicPriority} 
                      min={0} 
                      max={100} 
                      step={10}
                      onValueChange={setEconomicPriority}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Slide to adjust the balance between cost savings and environmental impact.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3 pt-4 border-t">
                  <h4 className="text-sm font-medium">Notification Preferences</h4>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-muted-foreground">Daily Optimization Summary</label>
                    <Switch checked={true} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-muted-foreground">Optimization Recommendations</label>
                    <Switch checked={true} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-muted-foreground">Price Alerts</label>
                    <Switch checked={true} />
                  </div>
                </div>
                
                <div className="space-y-3 pt-4 border-t">
                  <h4 className="text-sm font-medium">Data Sources</h4>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-muted-foreground">Utility Rate Data</label>
                    <div className="text-xs text-green-600">Connected</div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-muted-foreground">Weather Forecast</label>
                    <div className="text-xs text-green-600">Connected</div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-muted-foreground">Grid Carbon Intensity</label>
                    <div className="text-xs text-green-600">Connected</div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button className="w-full">
                    Save Preferences
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Main>
  );
};

export default EnergyOptimization;
