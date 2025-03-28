
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import TimeframeSelector from '@/components/analytics/TimeframeSelector';
import { useSite } from '@/contexts/SiteContext';

// Sample data - would be replaced with real device data
const generateSampleData = (days: number) => {
  return Array.from({ length: days }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - days + i + 1);
    
    return {
      date: date.toLocaleDateString(),
      solar: Math.floor(Math.random() * 30) + 10,
      wind: Math.floor(Math.random() * 10),
      battery: Math.floor(Math.random() * 5) - 2,
      total: Math.floor(Math.random() * 35) + 15,
    };
  });
};

const timeframes = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' }
];

const ProductionPage = () => {
  const [timeframe, setTimeframe] = useState('week');
  const { currentSite } = useSite();
  
  // Get data based on selected timeframe
  const getData = () => {
    switch(timeframe) {
      case 'day': return generateSampleData(24);
      case 'week': return generateSampleData(7);
      case 'month': return generateSampleData(30);
      case 'year': return generateSampleData(12);
      default: return generateSampleData(7);
    }
  };
  
  const data = getData();
  
  // Calculate totals for the timeframe
  const solarTotal = data.reduce((sum, entry) => sum + entry.solar, 0);
  const windTotal = data.reduce((sum, entry) => sum + entry.wind, 0);
  const totalProduction = solarTotal + windTotal;
  
  return (
    <AppLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Energy Production</h1>
          <TimeframeSelector 
            timeframes={timeframes} 
            selected={timeframe} 
            onChange={setTimeframe} 
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-2">Total Generation</h3>
            <p className="text-3xl font-bold">{totalProduction} kWh</p>
            <p className="text-sm text-muted-foreground">+8% from last {timeframe}</p>
          </Card>
          
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-2">Solar Production</h3>
            <p className="text-3xl font-bold">{solarTotal} kWh</p>
            <p className="text-sm text-muted-foreground">+12% from last {timeframe}</p>
          </Card>
          
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-2">Peak Generation</h3>
            <p className="text-3xl font-bold">12.4 kW</p>
            <p className="text-sm text-muted-foreground">At 13:45, June 14</p>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-4">Production Over Time</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis unit=" kWh" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="total" stroke="#8884d8" name="Total" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-4">Production Breakdown</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis unit=" kWh" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="solar" fill="#ffc658" name="Solar" stackId="a" />
                  <Bar dataKey="wind" fill="#82ca9d" name="Wind" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
        
        <div className="mt-6">
          <Card className="p-4">
            <Tabs defaultValue="daily">
              <TabsList className="mb-4">
                <TabsTrigger value="hourly">Hourly</TabsTrigger>
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
              </TabsList>
              
              <TabsContent value="hourly">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={generateSampleData(24)} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis unit=" kWh" />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="solar" stroke="#ffc658" name="Solar" />
                      <Line type="monotone" dataKey="wind" stroke="#82ca9d" name="Wind" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              
              <TabsContent value="daily">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={generateSampleData(7)} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis unit=" kWh" />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="solar" stroke="#ffc658" name="Solar" />
                      <Line type="monotone" dataKey="wind" stroke="#82ca9d" name="Wind" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              
              <TabsContent value="monthly">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={generateSampleData(12)} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis unit=" kWh" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="solar" fill="#ffc658" name="Solar" stackId="a" />
                      <Bar dataKey="wind" fill="#82ca9d" name="Wind" stackId="a" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProductionPage;
