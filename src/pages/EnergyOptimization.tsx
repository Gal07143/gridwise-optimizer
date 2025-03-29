
import React, { useState } from 'react';
import { Main } from '@/components/ui/main';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Battery, 
  BarChart, 
  PieChart, 
  Clock, 
  LayoutDashboard, 
  Settings, 
  Settings2, 
  ArrowDownUp, 
  ChevronDown,
  ChevronUp,
  Zap, 
  Sun, 
  Bolt
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

// Simulate daily energy usage data
const dailyEnergyData = Array.from({ length: 24 }, (_, i) => {
  const hour = i;
  const solar = hour >= 6 && hour <= 18 ? Math.sin((hour - 6) * Math.PI / 12) * 4 + Math.random() * 0.5 : 0;
  const consumption = 1 + Math.sin(hour * Math.PI / 12) * 0.5 + Math.random() * 0.5 + (hour >= 17 && hour <= 21 ? 2 : 0);
  const grid = Math.max(0, consumption - solar);
  const battery = hour >= 17 && hour <= 21 ? Math.min(2, Math.max(0, consumption - solar)) : 0;
  
  return {
    hour: `${hour}:00`,
    solar: solar.toFixed(1),
    consumption: consumption.toFixed(1),
    grid: grid.toFixed(1),
    battery: battery.toFixed(1),
    optimized: (grid * 0.7).toFixed(1)
  };
});

// Utility function to safely convert a value to a number for formatting
const toNumber = (value: any): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseFloat(value) || 0;
  return 0;
};

// Optimization savings data
const savingsData = [
  { category: 'Peak Shifting', amount: 142.50 },
  { category: 'Solar Self-Consumption', amount: 98.75 },
  { category: 'Time-of-Use Optimization', amount: 63.20 },
  { category: 'Demand Charge Reduction', amount: 85.30 }
];

// Rules data
const optimizationRules = [
  { id: 1, name: 'Peak Shaving', active: true, description: 'Reduce grid consumption during peak pricing periods' },
  { id: 2, name: 'Solar Self-Consumption', active: true, description: 'Prioritize using solar energy directly' },
  { id: 3, name: 'Time-of-Use Optimization', active: true, description: 'Optimize battery charging based on electricity rates' },
  { id: 4, name: 'Battery Reserve', active: true, description: 'Maintain minimum battery capacity for outages' },
  { id: 5, name: 'Weather-Adaptive Strategy', active: false, description: 'Adjust strategy based on weather forecast' }
];

const EnergyOptimization = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [optimizationEnabled, setOptimizationEnabled] = useState(true);
  const [expandedRules, setExpandedRules] = useState<number[]>([]);
  
  const toggleRuleExpansion = (ruleId: number) => {
    if (expandedRules.includes(ruleId)) {
      setExpandedRules(expandedRules.filter(id => id !== ruleId));
    } else {
      setExpandedRules([...expandedRules, ruleId]);
    }
  };
  
  return (
    <Main title="Energy Optimization">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Energy Optimization</h1>
            <p className="text-sm text-muted-foreground mt-1">Intelligently manage energy flow to reduce costs and maximize efficiency</p>
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              id="optimization-toggle"
              checked={optimizationEnabled}
              onCheckedChange={setOptimizationEnabled}
            />
            <label htmlFor="optimization-toggle" className="text-sm font-medium">
              Optimization {optimizationEnabled ? 'Enabled' : 'Disabled'}
            </label>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="rules" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Rules</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">History</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-amber-500" />
                    Daily Energy Flow
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={dailyEnergyData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="hour" />
                        <YAxis label={{ value: 'kW', angle: -90, position: 'insideLeft' }} />
                        <Tooltip 
                          formatter={(value) => [`${toNumber(value).toFixed(1)} kW`, '']}
                          labelFormatter={(label) => `Time: ${label}`}
                        />
                        <Legend />
                        <Area type="monotone" dataKey="solar" stackId="1" stroke="#FFB13B" fill="#FFD699" name="Solar Generation" />
                        <Area type="monotone" dataKey="battery" stackId="2" stroke="#4F46E5" fill="#C7D2FE" name="Battery Discharge" />
                        <Area type="monotone" dataKey="grid" stackId="2" stroke="#6B7280" fill="#D1D5DB" name="Grid Import" />
                        <Line type="monotone" dataKey="consumption" stroke="#EF4444" strokeWidth={2} dot={false} name="Consumption" />
                        <Line type="monotone" dataKey="optimized" stroke="#10B981" strokeWidth={2} dot={false} name="Optimized Grid" strokeDasharray="5 5" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <BarChart className="h-5 w-5 mr-2 text-blue-500" />
                    Monthly Savings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart
                        data={savingsData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="category" />
                        <YAxis 
                          label={{ value: 'USD ($)', angle: -90, position: 'insideLeft' }} 
                          tickFormatter={(value) => `$${value}`} 
                        />
                        <Tooltip formatter={(value) => [`$${toNumber(value).toFixed(2)}`, 'Savings']} />
                        <Legend />
                        <Bar dataKey="amount" fill="#3B82F6" name="Monthly Savings" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-500">$389.75</div>
                      <div className="text-sm text-muted-foreground">Total Monthly Savings</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <Battery className="h-5 w-5 mr-2 text-purple-500" />
                    Battery Optimization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Charge during off-peak</span>
                        <span className="text-sm font-medium text-green-500">Active</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        1:00 AM - 5:00 AM
                      </div>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Discharge during peak</span>
                        <span className="text-sm font-medium text-green-500">Active</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        5:00 PM - 9:00 PM
                      </div>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Reserve capacity</span>
                        <span className="text-sm font-medium">20%</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        For grid outages
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <Sun className="h-5 w-5 mr-2 text-amber-500" />
                    Solar Optimization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Self-consumption</span>
                        <span className="text-sm font-medium">78%</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Of solar energy is used directly
                      </div>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Battery charging</span>
                        <span className="text-sm font-medium">15%</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Of solar energy stored in battery
                      </div>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Grid export</span>
                        <span className="text-sm font-medium">7%</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Of solar energy exported to grid
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <Bolt className="h-5 w-5 mr-2 text-red-500" />
                    Load Optimization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">EV charging shift</span>
                        <span className="text-sm font-medium text-green-500">Active</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Shifted from 6 PM to 1 AM
                      </div>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">HVAC pre-cooling</span>
                        <span className="text-sm font-medium text-green-500">Active</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Scheduled before peak hours
                      </div>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Smart schedules</span>
                        <span className="text-sm font-medium">3 active</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        For appliances and pool pump
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="rules" className="space-y-6 mt-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <Settings2 className="h-5 w-5 mr-2 text-blue-500" />
                  Optimization Rules
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {optimizationRules.map(rule => (
                    <div key={rule.id} className="border rounded-md">
                      <div 
                        className="flex justify-between items-center p-3 cursor-pointer"
                        onClick={() => toggleRuleExpansion(rule.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <Switch checked={rule.active} readOnly />
                          <span className="font-medium">{rule.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded">
                            {rule.active ? 'Active' : 'Disabled'}
                          </span>
                          {expandedRules.includes(rule.id) ? 
                            <ChevronUp className="h-4 w-4" /> : 
                            <ChevronDown className="h-4 w-4" />}
                        </div>
                      </div>
                      {expandedRules.includes(rule.id) && (
                        <div className="p-3 border-t bg-gray-50 dark:bg-gray-900/50">
                          <p className="text-sm text-muted-foreground mb-3">{rule.description}</p>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">Edit Rule</Button>
                            <Button size="sm" variant="outline" className={rule.active ? "text-red-500" : "text-green-500"}>
                              {rule.active ? 'Disable' : 'Enable'}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-end">
                  <Button className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Add Custom Rule
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <ArrowDownUp className="h-5 w-5 mr-2 text-green-500" />
                    Rate Structure
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 border-b">
                      <div>
                        <div className="font-medium">Off-Peak</div>
                        <div className="text-xs text-muted-foreground">12 AM - 2 PM, 9 PM - 12 AM</div>
                      </div>
                      <div className="text-sm font-bold">$0.12/kWh</div>
                    </div>
                    <div className="flex justify-between items-center p-2 border-b">
                      <div>
                        <div className="font-medium">Mid-Peak</div>
                        <div className="text-xs text-muted-foreground">2 PM - 5 PM</div>
                      </div>
                      <div className="text-sm font-bold">$0.18/kWh</div>
                    </div>
                    <div className="flex justify-between items-center p-2">
                      <div>
                        <div className="font-medium">Peak</div>
                        <div className="text-xs text-muted-foreground">5 PM - 9 PM</div>
                      </div>
                      <div className="text-sm font-bold">$0.32/kWh</div>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-right text-muted-foreground">
                    Based on your utility provider's current rates
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <PieChart className="h-5 w-5 mr-2 text-purple-500" />
                    Optimization Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Peak Shifting', value: 40 },
                            { name: 'Solar Self-Consumption', value: 25 },
                            { name: 'Time-of-Use', value: 20 },
                            { name: 'Demand Charges', value: 15 }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          <Area fill="#3B82F6" />
                          <Area fill="#10B981" />
                          <Area fill="#F59E0B" />
                          <Area fill="#8B5CF6" />
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, 'Savings Impact']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-center text-sm text-muted-foreground">
                    Distribution of cost savings from optimization strategies
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="space-y-6 mt-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-amber-500" />
                  Optimization History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={Array.from({ length: 30 }, (_, i) => ({
                        day: `Day ${i + 1}`,
                        standard: 35 + Math.random() * 15,
                        optimized: 25 + Math.random() * 10
                      }))}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="day" />
                      <YAxis label={{ value: 'Cost ($)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip formatter={(value) => [`$${toNumber(value).toFixed(2)}`, '']} />
                      <Legend />
                      <Line type="monotone" dataKey="standard" stroke="#EF4444" strokeWidth={2} name="Standard Cost" dot={false} />
                      <Line type="monotone" dataKey="optimized" stroke="#10B981" strokeWidth={2} name="Optimized Cost" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Event</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Impact</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Savings</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">Today, 6:30 PM</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">Battery discharge during peak</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">Avoided 3.2 kWh from grid</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-500">$1.02</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">Today, 2:15 PM</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">Shifted EV charging</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">Moved 10.5 kWh to off-peak</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-500">$2.10</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">Today, 11:30 AM</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">Solar excess to battery</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">Stored 2.8 kWh</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-500">$0.89</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">Yesterday, 7:45 PM</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">Peak demand reduction</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">Reduced peak by 2.1 kW</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-500">$4.50</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">Yesterday, 2:00 AM</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">Off-peak battery charging</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">Charged 8.5 kWh</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-500">$1.36</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Main>
  );
};

export default EnergyOptimization;
