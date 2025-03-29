
import React, { useState } from 'react';
import { Main } from '@/components/ui/main';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { ArrowUpRight, ZapOff, Zap, Battery, BatteryMedium, Power, Settings, Activity, Calendar, FileText } from 'lucide-react';
import { useSiteContext } from '@/contexts/SiteContext';
import LoadingScreen from '@/components/LoadingScreen';

// Sample data for charts
const optimizationData = [
  { name: 'Mon', original: 400, optimized: 240, savings: 160 },
  { name: 'Tue', original: 380, optimized: 218, savings: 162 },
  { name: 'Wed', original: 450, optimized: 280, savings: 170 },
  { name: 'Thu', original: 470, optimized: 300, savings: 170 },
  { name: 'Fri', original: 540, optimized: 350, savings: 190 },
  { name: 'Sat', original: 580, optimized: 390, savings: 190 },
  { name: 'Sun', original: 600, optimized: 420, savings: 180 },
];

const storageUtilizationData = [
  { name: 'Jan', value: 58 },
  { name: 'Feb', value: 62 },
  { name: 'Mar', value: 70 },
  { name: 'Apr', value: 74 },
  { name: 'May', value: 78 },
  { name: 'Jun', value: 84 },
  { name: 'Jul', value: 89 },
  { name: 'Aug', value: 88 },
  { name: 'Sep', value: 85 },
  { name: 'Oct', value: 77 },
  { name: 'Nov', value: 68 },
  { name: 'Dec', value: 60 },
];

const energySourcesData = [
  { name: 'Solar', value: 45 },
  { name: 'Grid', value: 30 },
  { name: 'Storage', value: 15 },
  { name: 'Backup', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const EnergyOptimization: React.FC = () => {
  const { activeSite, loading } = useSiteContext();
  const [optimizationEnabled, setOptimizationEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState('optimization');
  const [scheduleType, setScheduleType] = useState('auto');

  if (loading) {
    return <LoadingScreen />;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical':
        return 'text-red-500';
      case 'warning':
        return 'text-yellow-500';
      case 'good':
        return 'text-green-500';
      default:
        return 'text-blue-500';
    }
  };

  return (
    <Main>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Energy Optimization</h1>
        <p className="text-muted-foreground">
          Intelligent energy management and optimization for your site.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <Card className="sm:w-56">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-muted-foreground text-sm">Optimization</div>
                  <div className="font-semibold mt-1">{optimizationEnabled ? 'Enabled' : 'Disabled'}</div>
                </div>
                <Switch 
                  checked={optimizationEnabled} 
                  onCheckedChange={setOptimizationEnabled}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="sm:w-56">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-muted-foreground text-sm">Current Savings</div>
                  <div className="font-semibold mt-1">$247.80 <span className="text-green-500 text-xs">+12.4%</span></div>
                </div>
                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <ArrowUpRight className="h-5 w-5 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="sm:w-56">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-muted-foreground text-sm">Storage Utilization</div>
                  <div className="font-semibold mt-1">76.4% <span className="text-amber-500 text-xs">+3.2%</span></div>
                </div>
                <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                  <Battery className="h-5 w-5 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-2 self-start">
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 bg-gray-100/50 dark:bg-gray-900/50 backdrop-blur-md p-1 rounded-lg">
          <TabsTrigger value="optimization" className="flex items-center">
            <Activity className="h-4 w-4 mr-2" />
            Optimization
          </TabsTrigger>
          <TabsTrigger value="schedules" className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Schedules
          </TabsTrigger>
          <TabsTrigger value="storage" className="flex items-center">
            <Battery className="h-4 w-4 mr-2" />
            Storage
          </TabsTrigger>
          <TabsTrigger value="sources" className="flex items-center">
            <Power className="h-4 w-4 mr-2" />
            Sources
          </TabsTrigger>
        </TabsList>

        <TabsContent value="optimization" className="space-y-6 animate-in fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Energy Consumption Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={optimizationData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorOriginal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorOptimized" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#ffc658" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="original" stroke="#8884d8" fillOpacity={1} fill="url(#colorOriginal)" name="Original Consumption" />
                    <Area type="monotone" dataKey="optimized" stroke="#82ca9d" fillOpacity={1} fill="url(#colorOptimized)" name="Optimized Consumption" />
                    <Area type="monotone" dataKey="savings" stroke="#ffc658" fillOpacity={1} fill="url(#colorSavings)" name="Energy Savings" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Peak Shaving</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex justify-between mb-3">
                  <div className="text-sm text-muted-foreground">Status</div>
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm font-medium">Active</span>
                  </div>
                </div>
                <div className="flex justify-between mb-3">
                  <div className="text-sm text-muted-foreground">Peak Reduction</div>
                  <div className="text-sm font-medium">24.8%</div>
                </div>
                <div className="flex justify-between">
                  <div className="text-sm text-muted-foreground">Monthly Savings</div>
                  <div className="text-sm font-medium text-green-500">$127.50</div>
                </div>
                <div className="mt-4">
                  <Switch checked={true} disabled={true} />
                  <span className="ml-2 text-sm text-muted-foreground">Automatic threshold adjustment</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Load Shifting</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex justify-between mb-3">
                  <div className="text-sm text-muted-foreground">Status</div>
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm font-medium">Active</span>
                  </div>
                </div>
                <div className="flex justify-between mb-3">
                  <div className="text-sm text-muted-foreground">Shifted Load</div>
                  <div className="text-sm font-medium">18.6%</div>
                </div>
                <div className="flex justify-between">
                  <div className="text-sm text-muted-foreground">Monthly Savings</div>
                  <div className="text-sm font-medium text-green-500">$92.30</div>
                </div>
                <div className="mt-4">
                  <Switch checked={true} disabled={true} />
                  <span className="ml-2 text-sm text-muted-foreground">Optimize for time-of-use rates</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Self-Consumption</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex justify-between mb-3">
                  <div className="text-sm text-muted-foreground">Status</div>
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm font-medium">Active</span>
                  </div>
                </div>
                <div className="flex justify-between mb-3">
                  <div className="text-sm text-muted-foreground">Self-Consumption Rate</div>
                  <div className="text-sm font-medium">78.2%</div>
                </div>
                <div className="flex justify-between">
                  <div className="text-sm text-muted-foreground">Grid Import Reduction</div>
                  <div className="text-sm font-medium text-green-500">34.6%</div>
                </div>
                <div className="mt-4">
                  <Switch checked={true} disabled={true} />
                  <span className="ml-2 text-sm text-muted-foreground">Prioritize self-consumption</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="schedules" className="space-y-6 animate-in fade-in">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Optimization Schedules</CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className={scheduleType === 'auto' ? 'bg-primary text-primary-foreground' : ''} onClick={() => setScheduleType('auto')}>Auto</Button>
                  <Button variant="outline" size="sm" className={scheduleType === 'custom' ? 'bg-primary text-primary-foreground' : ''} onClick={() => setScheduleType('custom')}>Custom</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <div className="flex items-center">
                    <BatteryMedium className="h-5 w-5 text-green-500 mr-3" />
                    <div>
                      <div className="font-medium">Battery Charging</div>
                      <div className="text-sm text-muted-foreground">Off-peak hours (22:00 - 06:00)</div>
                    </div>
                  </div>
                  <Switch checked={true} onCheckedChange={() => {}} />
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <div className="flex items-center">
                    <Zap className="h-5 w-5 text-blue-500 mr-3" />
                    <div>
                      <div className="font-medium">Peak Demand Management</div>
                      <div className="text-sm text-muted-foreground">Peak hours (17:00 - 21:00)</div>
                    </div>
                  </div>
                  <Switch checked={true} onCheckedChange={() => {}} />
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <div className="flex items-center">
                    <ZapOff className="h-5 w-5 text-purple-500 mr-3" />
                    <div>
                      <div className="font-medium">Non-Essential Load Shedding</div>
                      <div className="text-sm text-muted-foreground">Critical peak events</div>
                    </div>
                  </div>
                  <Switch checked={true} onCheckedChange={() => {}} />
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <div className="flex items-center">
                    <Power className="h-5 w-5 text-amber-500 mr-3" />
                    <div>
                      <div className="font-medium">Renewable Energy Priority</div>
                      <div className="text-sm text-muted-foreground">Daylight hours (08:00 - 16:00)</div>
                    </div>
                  </div>
                  <Switch checked={true} onCheckedChange={() => {}} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="storage" className="space-y-6 animate-in fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Storage Utilization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={storageUtilizationData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => [`${value}%`, 'Utilization']} />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" name="Utilization %" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Battery Management Settings</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Minimum SOC</div>
                      <div className="font-medium">20%</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Maximum SOC</div>
                      <div className="font-medium">95%</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Charge Rate</div>
                      <div className="font-medium">2.5 kW</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Discharge Rate</div>
                      <div className="font-medium">3.0 kW</div>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Prioritize longevity</span>
                      <Switch checked={true} onCheckedChange={() => {}} />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Enabling this will optimize charging cycles to extend battery lifespan.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Storage Performance</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">Current State of Charge</div>
                    <div className="font-medium">78%</div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-sm text-muted-foreground">Health Status</div>
                    <div className="font-medium text-green-500">Excellent</div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">Cycle Count</div>
                    <div className="font-medium">247</div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">Estimated Capacity</div>
                    <div className="font-medium">97.3%</div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">Last Full Charge</div>
                    <div className="font-medium">Yesterday, 06:42</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sources" className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Energy Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={energySourcesData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {energySourcesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Source Prioritization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <div className="flex items-center">
                      <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                        <span className="text-blue-500 text-xs font-bold">1</span>
                      </div>
                      <div>
                        <div className="font-medium">Solar Energy</div>
                        <div className="text-sm text-muted-foreground">Local generation priority</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <div className="flex items-center">
                      <div className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
                        <span className="text-green-500 text-xs font-bold">2</span>
                      </div>
                      <div>
                        <div className="font-medium">Storage Battery</div>
                        <div className="text-sm text-muted-foreground">When solar is unavailable</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <div className="flex items-center">
                      <div className="h-6 w-6 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mr-3">
                        <span className="text-amber-500 text-xs font-bold">3</span>
                      </div>
                      <div>
                        <div className="font-medium">Grid (Off-Peak)</div>
                        <div className="text-sm text-muted-foreground">For battery charging</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <div className="flex items-center">
                      <div className="h-6 w-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-3">
                        <span className="text-red-500 text-xs font-bold">4</span>
                      </div>
                      <div>
                        <div className="font-medium">Grid (Peak)</div>
                        <div className="text-sm text-muted-foreground">Last resort</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </Main>
  );
};

export default EnergyOptimization;
