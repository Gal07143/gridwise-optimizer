
import React, { useState } from 'react';
import { Main } from '@/components/ui/main';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';
import { Activity, Home, Calendar, Lightbulb, BarChart2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSiteContext } from '@/contexts/SiteContext';
import TimeframeSelector from '@/components/analytics/TimeframeSelector';

// Mock data
const dailyConsumptionData = [
  { time: '00:00', home: 1.2, office: 0.5, ev: 0, hvac: 0.8, total: 2.5 },
  { time: '04:00', home: 0.8, office: 0.2, ev: 0, hvac: 0.5, total: 1.5 },
  { time: '08:00', home: 1.5, office: 2.2, ev: 1.2, hvac: 1.8, total: 6.7 },
  { time: '12:00', home: 2.2, office: 3.1, ev: 0.5, hvac: 2.5, total: 8.3 },
  { time: '16:00', home: 3.1, office: 2.8, ev: 2.5, hvac: 2.2, total: 10.6 },
  { time: '20:00', home: 3.8, office: 1.2, ev: 3.2, hvac: 1.8, total: 10.0 },
];

const monthlyConsumptionData = [
  { month: 'Jan', value: 320 },
  { month: 'Feb', value: 280 },
  { month: 'Mar', value: 310 },
  { month: 'Apr', value: 340 },
  { month: 'May', value: 420 },
  { month: 'Jun', value: 480 },
  { month: 'Jul', value: 520 },
  { month: 'Aug', value: 510 },
  { month: 'Sep', value: 430 },
  { month: 'Oct', value: 380 },
  { month: 'Nov', value: 350 },
  { month: 'Dec', value: 340 },
];

const timeframeOptions = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
];

const Consumption: React.FC = () => {
  const { activeSite } = useSiteContext();
  const [timeframe, setTimeframe] = useState('day');

  return (
    <Main containerSize="default" className="max-w-[1600px] mx-auto pt-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Energy Consumption</h1>
          <p className="text-muted-foreground">
            {activeSite ? `Monitoring consumption for ${activeSite.name}` : 'Select a site to view detailed consumption data'}
          </p>
        </div>
        <TimeframeSelector
          timeframe={timeframe}
          onChange={setTimeframe}
          options={timeframeOptions}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Zap className="h-5 w-5 mr-2 text-blue-500" />
              Today's Consumption
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">28.4 kWh</div>
            <div className="text-sm text-muted-foreground mt-1">+12% compared to yesterday</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-green-500" />
              This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">842 kWh</div>
            <div className="text-sm text-muted-foreground mt-1">-8% compared to last month</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Lightbulb className="h-5 w-5 mr-2 text-amber-500" />
              Peak Demand
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12.6 kW</div>
            <div className="text-sm text-muted-foreground mt-1">Today at 18:45</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Activity className="h-5 w-5 mr-2 text-purple-500" />
              Consumption Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyConsumptionData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-background border p-3 rounded-md shadow-md">
                            <p className="font-medium">{`Time: ${label}`}</p>
                            {payload.map((entry, index) => (
                              entry.name !== 'total' && (
                                <p key={index} style={{ color: entry.color }}>
                                  {`${entry.name}: ${entry.value} kWh`}
                                </p>
                              )
                            ))}
                            <p className="font-medium mt-2 border-t pt-1">
                              {`Total: ${payload.find(p => p.name === 'total')?.value} kWh`}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="home" name="Home" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="office" name="Office" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="ev" name="EV Charging" stroke="#6366f1" strokeWidth={2} />
                  <Line type="monotone" dataKey="hvac" name="HVAC" stroke="#f59e0b" strokeWidth={2} />
                  <Line type="monotone" dataKey="total" name="Total" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <BarChart2 className="h-5 w-5 mr-2 text-green-500" />
              Annual Consumption
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyConsumptionData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" name="Consumption (kWh)" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Home className="h-5 w-5 mr-2 text-blue-500" />
              Consumption by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col border rounded-lg p-3">
                <span className="text-sm text-muted-foreground">Lighting</span>
                <span className="text-xl font-medium mt-1">210 kWh</span>
                <span className="text-xs text-muted-foreground">24% of total</span>
                <div className="w-full h-2 bg-gray-100 rounded-full mt-2">
                  <div className="h-2 bg-blue-500 rounded-full" style={{ width: '24%' }}></div>
                </div>
              </div>
              <div className="flex flex-col border rounded-lg p-3">
                <span className="text-sm text-muted-foreground">HVAC</span>
                <span className="text-xl font-medium mt-1">310 kWh</span>
                <span className="text-xs text-muted-foreground">36% of total</span>
                <div className="w-full h-2 bg-gray-100 rounded-full mt-2">
                  <div className="h-2 bg-green-500 rounded-full" style={{ width: '36%' }}></div>
                </div>
              </div>
              <div className="flex flex-col border rounded-lg p-3">
                <span className="text-sm text-muted-foreground">Appliances</span>
                <span className="text-xl font-medium mt-1">125 kWh</span>
                <span className="text-xs text-muted-foreground">14% of total</span>
                <div className="w-full h-2 bg-gray-100 rounded-full mt-2">
                  <div className="h-2 bg-yellow-500 rounded-full" style={{ width: '14%' }}></div>
                </div>
              </div>
              <div className="flex flex-col border rounded-lg p-3">
                <span className="text-sm text-muted-foreground">EV Charging</span>
                <span className="text-xl font-medium mt-1">220 kWh</span>
                <span className="text-xs text-muted-foreground">26% of total</span>
                <div className="w-full h-2 bg-gray-100 rounded-full mt-2">
                  <div className="h-2 bg-purple-500 rounded-full" style={{ width: '26%' }}></div>
                </div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline" size="sm">View Detailed Breakdown</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Main>
  );
};

export default Consumption;
