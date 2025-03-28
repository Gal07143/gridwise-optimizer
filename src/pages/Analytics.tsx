
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import TimeframeSelector from '@/components/analytics/TimeframeSelector';
import { useSite } from '@/contexts/SiteContext';

// Sample data - would be replaced with real device data
const generateConsumptionData = (days: number) => {
  return Array.from({ length: days }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - days + i + 1);
    
    return {
      date: date.toLocaleDateString(),
      consumption: Math.floor(Math.random() * 20) + 15,
      production: Math.floor(Math.random() * 25) + 5,
      netUsage: Math.floor(Math.random() * 10) + 5,
      gridImport: Math.floor(Math.random() * 15),
      gridExport: Math.floor(Math.random() * 10),
    };
  });
};

const pieData = [
  { name: 'HVAC', value: 42 },
  { name: 'Lighting', value: 18 },
  { name: 'Kitchen', value: 15 },
  { name: 'Hot Water', value: 12 },
  { name: 'Other', value: 13 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const timeframes = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' }
];

const AnalyticsPage = () => {
  const [timeframe, setTimeframe] = useState('week');
  const { currentSite } = useSite();
  
  // Get data based on selected timeframe
  const getData = () => {
    switch(timeframe) {
      case 'day': return generateConsumptionData(24);
      case 'week': return generateConsumptionData(7);
      case 'month': return generateConsumptionData(30);
      case 'year': return generateConsumptionData(12);
      default: return generateConsumptionData(7);
    }
  };
  
  const data = getData();
  
  // Calculate metrics
  const totalConsumption = data.reduce((sum, entry) => sum + entry.consumption, 0);
  const totalProduction = data.reduce((sum, entry) => sum + entry.production, 0);
  const netUsage = totalConsumption - totalProduction;
  const selfConsumptionRate = Math.min(100, Math.round((totalProduction / totalConsumption) * 100));
  
  return (
    <AppLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Energy Analytics</h1>
          <TimeframeSelector 
            timeframes={timeframes} 
            selected={timeframe} 
            onChange={setTimeframe} 
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-2">Self-Consumption</h3>
            <p className="text-3xl font-bold">{selfConsumptionRate}%</p>
            <p className="text-sm text-muted-foreground">+5% from last {timeframe}</p>
          </Card>
          
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-2">Net Usage</h3>
            <p className="text-3xl font-bold">{netUsage} kWh</p>
            <p className="text-sm text-muted-foreground">-12% from last {timeframe}</p>
          </Card>
          
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-2">Grid Import</h3>
            <p className="text-3xl font-bold">{data.reduce((sum, entry) => sum + entry.gridImport, 0)} kWh</p>
            <p className="text-sm text-muted-foreground">-8% from last {timeframe}</p>
          </Card>
          
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-2">Grid Export</h3>
            <p className="text-3xl font-bold">{data.reduce((sum, entry) => sum + entry.gridExport, 0)} kWh</p>
            <p className="text-sm text-muted-foreground">+15% from last {timeframe}</p>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="p-4 lg:col-span-2">
            <h3 className="text-lg font-medium mb-4">Energy Balance</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis unit=" kWh" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="consumption" stroke="#ff8042" name="Consumption" />
                  <Line type="monotone" dataKey="production" stroke="#82ca9d" name="Production" />
                  <Line type="monotone" dataKey="netUsage" stroke="#8884d8" name="Net Usage" strokeDasharray="3 3" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-4">Consumption Breakdown</h3>
            <div className="h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <Card className="p-4">
            <Tabs defaultValue="trends">
              <TabsList className="mb-4">
                <TabsTrigger value="trends">Usage Trends</TabsTrigger>
                <TabsTrigger value="comparison">Year Comparison</TabsTrigger>
                <TabsTrigger value="insights">Insights</TabsTrigger>
              </TabsList>
              
              <TabsContent value="trends">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis unit=" kWh" />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="gridImport" stroke="#0088FE" name="Grid Import" />
                      <Line type="monotone" dataKey="gridExport" stroke="#00C49F" name="Grid Export" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              
              <TabsContent value="comparison">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis unit=" kWh" />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="thisYear" stroke="#8884d8" name="This Year" />
                      <Line type="monotone" dataKey="lastYear" stroke="#82ca9d" name="Last Year" strokeDasharray="3 3" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-center mt-4 text-muted-foreground">
                  <p>Select a longer timeframe to see historical comparison data</p>
                </div>
              </TabsContent>
              
              <TabsContent value="insights">
                <div className="space-y-4 p-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium">Peak Usage Analysis</h4>
                    <p className="text-sm mt-2">Your peak energy usage consistently occurs between 6PM and 8PM. Consider shifting some usage to off-peak hours to reduce grid strain and potentially save on costs.</p>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium">Efficiency Recommendation</h4>
                    <p className="text-sm mt-2">Your HVAC system accounts for 42% of your energy consumption. Consider a smart thermostat to optimize usage and potentially save 15-20% on HVAC energy costs.</p>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium">Self-Consumption Opportunity</h4>
                    <p className="text-sm mt-2">You currently export 35% of your solar production. Adding a 10kWh battery could increase your self-consumption rate to over 85%.</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default AnalyticsPage;
