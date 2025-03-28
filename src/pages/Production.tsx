
import React, { useState } from 'react';
import { Main } from '@/components/ui/main';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSiteContext } from '@/contexts/SiteContext';
import { TimeframeSelector } from '@/components/analytics/TimeframeSelector';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  BarChart,
  Bar,
} from 'recharts';
import { Battery, Sun, Info, Wind } from 'lucide-react';

const Production: React.FC = () => {
  const { activeSite } = useSiteContext();
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month' | 'year'>('week');

  // Sample data - in a real app, this would come from your API
  const productionData = [
    { time: '00:00', solar: 0, battery: 0.2, wind: 0 },
    { time: '04:00', solar: 0, battery: 0, wind: 0.3 },
    { time: '08:00', solar: 1.8, battery: 0, wind: 0.4 },
    { time: '12:00', solar: 3.7, battery: 0, wind: 0.5 },
    { time: '16:00', solar: 2.5, battery: 0, wind: 0.7 },
    { time: '20:00', solar: 0.3, battery: 1.2, wind: 0.3 },
  ];

  const monthlyProduction = [
    { month: 'Jan', production: 450 },
    { month: 'Feb', production: 520 },
    { month: 'Mar', production: 780 },
    { month: 'Apr', production: 920 },
    { month: 'May', production: 1050 },
    { month: 'Jun', production: 1150 },
    { month: 'Jul', production: 1180 },
    { month: 'Aug', production: 1100 },
    { month: 'Sep', production: 950 },
    { month: 'Oct', production: 780 },
    { month: 'Nov', production: 560 },
    { month: 'Dec', production: 480 },
  ];

  const productionMixData = [
    { name: 'Solar', value: 75 },
    { name: 'Battery', value: 15 },
    { name: 'Wind', value: 10 },
  ];

  const COLORS = ['#FDB813', '#3366CC', '#00C49F'];

  const handleTimeframeChange = (value: 'day' | 'week' | 'month' | 'year') => {
    setTimeframe(value);
  };

  return (
    <Main title="Energy Production">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gridx-navy dark:text-white mb-2">Energy Production</h1>
        <p className="text-gridx-gray dark:text-gray-400 text-sm">
          Monitor and optimize your energy generation sources
        </p>
      </div>

      <div className="flex justify-end mb-4">
        <TimeframeSelector timeframe={timeframe} setTimeframe={handleTimeframeChange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/10 border-yellow-100 dark:border-yellow-900/30">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg flex items-center">
                <Sun className="w-5 h-5 mr-2 text-yellow-500" />
                Solar Production
              </CardTitle>
              <span className="text-sm text-yellow-600 dark:text-yellow-400 font-medium bg-yellow-100 dark:bg-yellow-900/30 px-2 py-0.5 rounded-full">
                Primary
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">24.5 kWh</div>
            <p className="text-sm text-yellow-700/70 dark:text-yellow-300/70 mb-4">Today's generation</p>
            <div className="flex items-center text-green-600 dark:text-green-400 text-sm font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="m6 18 6-6-6-6" /><path d="m18 6-6 6 6 6" />
              </svg>
              +15% vs. yesterday
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/10 border-blue-100 dark:border-blue-900/30">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg flex items-center">
                <Battery className="w-5 h-5 mr-2 text-blue-500" />
                Battery Storage
              </CardTitle>
              <span className="text-sm text-blue-600 dark:text-blue-400 font-medium bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                76% Charged
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">5.8 kWh</div>
            <p className="text-sm text-blue-700/70 dark:text-blue-300/70 mb-4">Discharged today</p>
            <div className="w-full bg-blue-100 dark:bg-blue-900/50 rounded-full h-2.5">
              <div className="bg-blue-600 dark:bg-blue-400 h-2.5 rounded-full" style={{ width: '76%' }}></div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-teal-50 to-green-50 dark:from-teal-900/20 dark:to-green-900/10 border-teal-100 dark:border-teal-900/30">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg flex items-center">
                <Wind className="w-5 h-5 mr-2 text-teal-500" />
                Wind Production
              </CardTitle>
              <span className="text-sm text-teal-600 dark:text-teal-400 font-medium bg-teal-100 dark:bg-teal-900/30 px-2 py-0.5 rounded-full">
                Secondary
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-1">3.2 kWh</div>
            <p className="text-sm text-teal-700/70 dark:text-teal-300/70 mb-4">Today's generation</p>
            <div className="flex items-center text-red-500 dark:text-red-400 text-sm font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="m18 6-6 6 6 6" /><path d="m6 6 6 6-6 6" />
              </svg>
              -8% vs. yesterday
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Energy Production Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={productionData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis label={{ value: 'kWh', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="solar"
                  stackId="1"
                  stroke="#FDB813"
                  fill="#FDB813"
                  name="Solar"
                />
                <Area
                  type="monotone"
                  dataKey="battery"
                  stackId="1"
                  stroke="#3366CC"
                  fill="#3366CC"
                  name="Battery"
                />
                <Area
                  type="monotone"
                  dataKey="wind"
                  stackId="1"
                  stroke="#00C49F"
                  fill="#00C49F"
                  name="Wind"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Production Mix</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={productionMixData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {productionMixData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trends" className="w-full space-y-6">
        <TabsList>
          <TabsTrigger value="trends">Production Trends</TabsTrigger>
          <TabsTrigger value="efficiency">Efficiency Analysis</TabsTrigger>
          <TabsTrigger value="forecast">Production Forecast</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Production Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={monthlyProduction}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis label={{ value: 'kWh', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Bar dataKey="production" name="Energy Production" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Production Records</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-800">
                    <div>
                      <p className="font-medium">Peak Production Day</p>
                      <p className="text-sm text-muted-foreground">June 21, 2024</p>
                    </div>
                    <div className="text-xl font-bold text-green-600">42.7 kWh</div>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-800">
                    <div>
                      <p className="font-medium">Highest Solar Hour</p>
                      <p className="text-sm text-muted-foreground">12:00 PM, June 21</p>
                    </div>
                    <div className="text-xl font-bold text-yellow-500">6.2 kWh</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Best Production Month</p>
                      <p className="text-sm text-muted-foreground">July 2024</p>
                    </div>
                    <div className="text-xl font-bold text-blue-600">1,180 kWh</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Annual Production Goal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center mb-4">
                  <div className="text-3xl font-bold text-green-600 mb-2">8,920 kWh</div>
                  <p className="text-sm text-muted-foreground">of 12,000 kWh annual goal</p>
                  <div className="w-full mt-4 bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                    <div className="bg-green-500 h-4 rounded-full" style={{ width: '74%' }}></div>
                  </div>
                  <p className="mt-2 text-sm text-green-600 font-medium">74% of annual goal achieved</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Projected to exceed goal by 5% based on current production trends
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="efficiency">
          <Card>
            <CardHeader>
              <CardTitle>System Efficiency Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground">Track and optimize your energy production system efficiency</p>
              <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                Efficiency analysis charts will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecast">
          <Card>
            <CardHeader>
              <CardTitle>Production Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground">Forecasted energy production based on weather and historical data</p>
              <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                Production forecast charts will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Main>
  );
};

export default Production;
