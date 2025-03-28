
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
  BarChart,
  Bar,
} from 'recharts';

const Consumption: React.FC = () => {
  const { activeSite } = useSiteContext();
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month' | 'year'>('week');

  // Sample data - in a real app, this would come from your API
  const consumptionData = [
    { time: '00:00', consumption: 2.1, grid: 1.8, solar: 0, battery: 0.3 },
    { time: '04:00', consumption: 1.8, grid: 1.8, solar: 0, battery: 0 },
    { time: '08:00', consumption: 3.5, grid: 1.2, solar: 2.3, battery: 0 },
    { time: '12:00', consumption: 4.2, grid: 0, solar: 3.8, battery: 0.4 },
    { time: '16:00', consumption: 5.1, grid: 1.0, solar: 3.1, battery: 1.0 },
    { time: '20:00', consumption: 3.8, grid: 2.5, solar: 0, battery: 1.3 },
  ];

  const deviceConsumptionData = [
    { name: 'HVAC', value: 35 },
    { name: 'Lighting', value: 20 },
    { name: 'Appliances', value: 15 },
    { name: 'EV Charging', value: 20 },
    { name: 'Other', value: 10 },
  ];

  const peakUsageData = [
    { day: 'Mon', morning: 3.2, midday: 2.8, evening: 4.5 },
    { day: 'Tue', morning: 3.5, midday: 3.1, evening: 4.2 },
    { day: 'Wed', morning: 3.1, midday: 2.9, evening: 4.8 },
    { day: 'Thu', morning: 3.3, midday: 3.0, evening: 4.1 },
    { day: 'Fri', morning: 3.4, midday: 3.2, evening: 5.2 },
    { day: 'Sat', morning: 2.8, midday: 2.5, evening: 3.5 },
    { day: 'Sun', morning: 2.6, midday: 2.2, evening: 3.2 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD'];

  const handleTimeframeChange = (value: 'day' | 'week' | 'month' | 'year') => {
    setTimeframe(value);
  };

  return (
    <Main title="Energy Consumption">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gridx-navy dark:text-white mb-2">Energy Consumption</h1>
        <p className="text-gridx-gray dark:text-gray-400 text-sm">
          Analyze and optimize your energy consumption patterns
        </p>
      </div>

      <div className="flex justify-end mb-4">
        <TimeframeSelector timeframe={timeframe} setTimeframe={handleTimeframeChange} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Energy Consumption Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={consumptionData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis label={{ value: 'kWh', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="consumption"
                  stackId="1"
                  stroke="#8884d8"
                  fill="#8884d8"
                />
                <Area
                  type="monotone"
                  dataKey="grid"
                  stackId="2"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                />
                <Area
                  type="monotone"
                  dataKey="solar"
                  stackId="2"
                  stroke="#ffc658"
                  fill="#ffc658"
                />
                <Area
                  type="monotone"
                  dataKey="battery"
                  stackId="2"
                  stroke="#ff8042"
                  fill="#ff8042"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Consumption by Device</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deviceConsumptionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {deviceConsumptionData.map((entry, index) => (
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

      <Tabs defaultValue="insights" className="w-full space-y-6">
        <TabsList>
          <TabsTrigger value="insights">Consumption Insights</TabsTrigger>
          <TabsTrigger value="patterns">Usage Patterns</TabsTrigger>
          <TabsTrigger value="compare">Historical Compare</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Daily Average</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">12.4 kWh</div>
                <p className="text-muted-foreground text-sm">
                  5% below your monthly average
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Peak Consumption</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-500">5.2 kW</div>
                <p className="text-muted-foreground text-sm">
                  Today at 6:30 PM
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Cost Estimate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">$42.15</div>
                <p className="text-muted-foreground text-sm">
                  For the current billing period
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recommended Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mr-3 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-300">
                      <path d="M12 22V8" /><path d="m2 12 10-4 10 4" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">Shift HVAC usage</h4>
                    <p className="text-sm text-muted-foreground">Running your HVAC during solar production hours can save approximately 25% in energy costs.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full mr-3 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-300">
                      <path d="M12 22V8" /><path d="m2 12 10-4 10 4" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">EV charging optimization</h4>
                    <p className="text-sm text-muted-foreground">Scheduling EV charging between 10am-2pm would utilize 95% solar energy rather than grid power.</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns">
          <Card>
            <CardHeader>
              <CardTitle>Peak Usage Times</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={peakUsageData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="morning" name="Morning (6-10am)" fill="#8884d8" />
                  <Bar dataKey="midday" name="Midday (11am-3pm)" fill="#82ca9d" />
                  <Bar dataKey="evening" name="Evening (4-8pm)" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compare">
          <Card>
            <CardHeader>
              <CardTitle>Historical Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground">Compare your current consumption with previous periods</p>
              <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                Historical comparison charts will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Main>
  );
};

export default Consumption;
