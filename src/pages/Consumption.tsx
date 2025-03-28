
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useDevices } from '@/hooks/useDevices';
import TimeframeSelector from '@/components/analytics/TimeframeSelector';
import { useSite } from '@/contexts/SiteContext';

// Sample data - would be replaced with real device data
const generateSampleData = (days: number) => {
  return Array.from({ length: days }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - days + i + 1);
    
    return {
      date: date.toLocaleDateString(),
      household: Math.floor(Math.random() * 15) + 10,
      hvac: Math.floor(Math.random() * 8) + 5,
      lighting: Math.floor(Math.random() * 4) + 2,
      appliances: Math.floor(Math.random() * 6) + 4,
    };
  });
};

const timeframes = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' }
];

const ConsumptionPage = () => {
  const [timeframe, setTimeframe] = useState('week');
  const { currentSite } = useSite();
  const { devices } = useDevices();
  
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
  
  return (
    <AppLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Energy Consumption</h1>
          <TimeframeSelector 
            timeframes={timeframes} 
            selected={timeframe} 
            onChange={setTimeframe} 
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-2">Total Consumption</h3>
            <p className="text-3xl font-bold">248 kWh</p>
            <p className="text-sm text-muted-foreground">+12% from last {timeframe}</p>
          </Card>
          
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-2">Peak Usage</h3>
            <p className="text-3xl font-bold">7.2 kW</p>
            <p className="text-sm text-muted-foreground">At 19:30, June 15</p>
          </Card>
          
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-2">Average Daily</h3>
            <p className="text-3xl font-bold">35.4 kWh</p>
            <p className="text-sm text-muted-foreground">-5% from last {timeframe}</p>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-4">Consumption Over Time</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis unit=" kWh" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="household" stroke="#8884d8" name="Total" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-4">Consumption Breakdown</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis unit=" kWh" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="hvac" stroke="#82ca9d" name="HVAC" />
                  <Line type="monotone" dataKey="lighting" stroke="#ffc658" name="Lighting" />
                  <Line type="monotone" dataKey="appliances" stroke="#ff8042" name="Appliances" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
        
        <div className="mt-6">
          <Card className="p-4">
            <Tabs defaultValue="hourly">
              <TabsList className="mb-4">
                <TabsTrigger value="hourly">Hourly</TabsTrigger>
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="devices">By Device</TabsTrigger>
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
                      <Line type="monotone" dataKey="household" stroke="#8884d8" name="Total" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              
              <TabsContent value="daily">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={generateSampleData(30)} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis unit=" kWh" />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="household" stroke="#8884d8" name="Total" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              
              <TabsContent value="devices">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis unit=" kWh" />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="hvac" stroke="#82ca9d" name="HVAC" />
                      <Line type="monotone" dataKey="lighting" stroke="#ffc658" name="Lighting" />
                      <Line type="monotone" dataKey="appliances" stroke="#ff8042" name="Appliances" />
                    </LineChart>
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

export default ConsumptionPage;
