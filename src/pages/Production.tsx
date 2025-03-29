
import React, { useState } from 'react';
import { Main } from '@/components/ui/main';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, PieChart, Pie, Cell, Sector } from 'recharts';
import { Activity, Calendar, Sun, Wind, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSiteContext } from '@/contexts/SiteContext';
import TimeframeSelector from '@/components/analytics/TimeframeSelector';

// Mock data
const dailyProductionData = [
  { time: '00:00', solar: 0, wind: 0.3, hydro: 0.5, total: 0.8 },
  { time: '04:00', solar: 0, wind: 0.2, hydro: 0.5, total: 0.7 },
  { time: '08:00', solar: 1.5, wind: 0.5, hydro: 0.6, total: 2.6 },
  { time: '12:00', solar: 4.2, wind: 0.8, hydro: 0.6, total: 5.6 },
  { time: '16:00', solar: 3.1, wind: 1.2, hydro: 0.5, total: 4.8 },
  { time: '20:00', solar: 0.3, wind: 0.9, hydro: 0.5, total: 1.7 },
];

const monthlyProductionData = [
  { month: 'Jan', value: 220 },
  { month: 'Feb', value: 240 },
  { month: 'Mar', value: 310 },
  { month: 'Apr', value: 380 },
  { month: 'May', value: 490 },
  { month: 'Jun', value: 580 },
  { month: 'Jul', value: 620 },
  { month: 'Aug', value: 550 },
  { month: 'Sep', value: 480 },
  { month: 'Oct', value: 340 },
  { month: 'Nov', value: 250 },
  { month: 'Dec', value: 210 },
];

// Energy source distribution data
const energySourceData = [
  { name: 'Solar', value: 68 },
  { name: 'Wind', value: 22 },
  { name: 'Hydro', value: 10 },
];

const COLORS = ['#f59e0b', '#3b82f6', '#10b981'];

const timeframeOptions = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
];

const Production: React.FC = () => {
  const { activeSite } = useSiteContext();
  const [timeframe, setTimeframe] = useState('day');
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  
    return (
      <g>
        <text x={cx} y={cy} dy={-20} textAnchor="middle" fill="#888" className="text-xs">
          {payload.name}
        </text>
        <text x={cx} y={cy} textAnchor="middle" fill="#333" className="text-xl font-bold">
          {`${value}%`}
        </text>
        <text x={cx} y={cy} dy={25} textAnchor="middle" fill="#888" className="text-xs">
          of total
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };

  return (
    <Main containerSize="default" className="max-w-[1600px] mx-auto pt-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Energy Production</h1>
          <p className="text-muted-foreground">
            {activeSite ? `Monitoring production for ${activeSite.name}` : 'Select a site to view detailed production data'}
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
              <Sun className="h-5 w-5 mr-2 text-amber-500" />
              Today's Production
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">35.2 kWh</div>
            <div className="text-sm text-muted-foreground mt-1">+18% compared to yesterday</div>
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
            <div className="text-3xl font-bold">1,045 kWh</div>
            <div className="text-sm text-muted-foreground mt-1">-3% compared to last month</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Activity className="h-5 w-5 mr-2 text-blue-500" />
              Peak Output
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8.4 kW</div>
            <div className="text-sm text-muted-foreground mt-1">Today at 12:15</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Activity className="h-5 w-5 mr-2 text-purple-500" />
              Production Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyProductionData}>
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
                  <Line type="monotone" dataKey="solar" name="Solar" stroke="#f59e0b" strokeWidth={2} />
                  <Line type="monotone" dataKey="wind" name="Wind" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="hydro" name="Hydro" stroke="#10b981" strokeWidth={2} />
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
              Annual Production
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyProductionData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" name="Production (kWh)" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Wind className="h-5 w-5 mr-2 text-blue-500" />
              Energy Source Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    data={energySourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    dataKey="value"
                    onMouseEnter={onPieEnter}
                  >
                    {energySourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center mt-4">
              {energySourceData.map((entry, index) => (
                <div key={index} className="flex items-center mx-2">
                  <div
                    className="w-3 h-3 rounded-full mr-1"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-xs">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Main>
  );
};

export default Production;
