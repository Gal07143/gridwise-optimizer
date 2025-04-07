
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TimeframeSelector from '@/components/analytics/TimeframeSelector';

// Mock data for the charts
const energyData = [
  { time: '00:00', consumption: 12, production: 0 },
  { time: '03:00', consumption: 8, production: 0 },
  { time: '06:00', consumption: 10, production: 5 },
  { time: '09:00', consumption: 18, production: 12 },
  { time: '12:00', consumption: 22, production: 18 },
  { time: '15:00', consumption: 19, production: 15 },
  { time: '18:00', consumption: 25, production: 6 },
  { time: '21:00', consumption: 20, production: 0 },
];

const costData = [
  { time: '00:00', cost: 2.5, savings: 0 },
  { time: '03:00', cost: 1.8, savings: 0 },
  { time: '06:00', cost: 2.2, savings: 1.0 },
  { time: '09:00', cost: 3.8, savings: 2.4 },
  { time: '12:00', cost: 4.7, savings: 3.6 },
  { time: '15:00', cost: 4.0, savings: 3.0 },
  { time: '18:00', cost: 5.2, savings: 1.2 },
  { time: '21:00', cost: 4.2, savings: 0 },
];

const emissionsData = [
  { time: '00:00', emissions: 3.2, avoided: 0 },
  { time: '03:00', emissions: 2.1, avoided: 0 },
  { time: '06:00', emissions: 2.5, avoided: 1.2 },
  { time: '09:00', emissions: 4.1, avoided: 2.8 },
  { time: '12:00', emissions: 5.3, avoided: 4.2 },
  { time: '15:00', emissions: 4.5, avoided: 3.5 },
  { time: '18:00', emissions: 6.0, avoided: 1.4 },
  { time: '21:00', emissions: 4.8, avoided: 0 },
];

const Analytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState('energy');
  const [timeframe, setTimeframe] = useState('day');
  const [site, setSite] = useState('all');
  const [comparisonMode, setComparisonMode] = useState('none');
  
  const timeframeOptions = [
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
    { value: 'year', label: 'Year' }
  ];
  
  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-64">
            <Card className="h-full">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="mb-2 text-sm font-medium">Time Range</h3>
                  <TimeframeSelector 
                    timeframe={timeframe}
                    onChange={setTimeframe}
                    options={timeframeOptions}
                  />
                </div>
                
                <div>
                  <h3 className="mb-2 text-sm font-medium">Site</h3>
                  <Select value={site} onValueChange={setSite}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select site" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="all">All Sites</SelectItem>
                        <SelectItem value="site1">Main Office</SelectItem>
                        <SelectItem value="site2">Warehouse</SelectItem>
                        <SelectItem value="site3">Retail Store</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <h3 className="mb-2 text-sm font-medium">Compare With</h3>
                  <Select value={comparisonMode} onValueChange={setComparisonMode}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select comparison" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="none">No Comparison</SelectItem>
                        <SelectItem value="previous">Previous Period</SelectItem>
                        <SelectItem value="baseline">Baseline</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex-1">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="energy">Energy</TabsTrigger>
                <TabsTrigger value="cost">Cost</TabsTrigger>
                <TabsTrigger value="emissions">Emissions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="energy" className="space-y-4">
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>Energy Consumption & Production</CardTitle>
                    <CardDescription>View your energy usage patterns over time</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={energyData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="consumption" stroke="#8884d8" name="Consumption (kWh)" />
                        <Line type="monotone" dataKey="production" stroke="#82ca9d" name="Production (kWh)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                {/* Additional energy analysis cards here */}
              </TabsContent>
              
              <TabsContent value="cost" className="space-y-4">
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>Energy Costs & Savings</CardTitle>
                    <CardDescription>Monitor your energy expenditure and savings</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={costData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="cost" fill="#ff7c43" name="Cost ($)" />
                        <Bar dataKey="savings" fill="#4daf4a" name="Savings ($)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                {/* Additional cost analysis cards here */}
              </TabsContent>
              
              <TabsContent value="emissions" className="space-y-4">
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle>Carbon Emissions & Avoidance</CardTitle>
                    <CardDescription>Track your environmental impact</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={emissionsData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="emissions" stroke="#d62728" name="Emissions (kg CO₂)" />
                        <Line type="monotone" dataKey="avoided" stroke="#2ca02c" name="Avoided (kg CO₂)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                {/* Additional emissions analysis cards here */}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Analytics;
