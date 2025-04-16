
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, 
  AreaChart,
  ChartContainer
} from '@/components/ui/chart';
import { 
  Zap, 
  Battery, 
  Sun, 
  ArrowDown, 
  ArrowUp, 
  TrendingUp, 
  BarChart2, 
  Calendar, 
  Download
} from 'lucide-react';
import EnergyCategoryList from '@/components/energy-categories/EnergyCategoryList';
import MLInsights from '@/components/MLInsights';
import { AIAgentDecisions } from '@/components/AIAgentDecisions';
import EmissionsCalculator from '@/components/carbon-emissions/EmissionsCalculator';

// Sample data for charts
const consumptionData = [
  { time: '00:00', value: 2.3 },
  { time: '02:00', value: 1.8 },
  { time: '04:00', value: 1.5 },
  { time: '06:00', value: 1.9 },
  { time: '08:00', value: 3.2 },
  { time: '10:00', value: 3.8 },
  { time: '12:00', value: 4.2 },
  { time: '14:00', value: 4.5 },
  { time: '16:00', value: 4.1 },
  { time: '18:00', value: 5.2 },
  { time: '20:00', value: 4.8 },
  { time: '22:00', value: 3.1 },
];

const generationData = [
  { time: '06:00', value: 0.2 },
  { time: '07:00', value: 0.8 },
  { time: '08:00', value: 1.5 },
  { time: '09:00', value: 2.3 },
  { time: '10:00', value: 3.1 },
  { time: '11:00', value: 3.8 },
  { time: '12:00', value: 4.2 },
  { time: '13:00', value: 4.5 },
  { time: '14:00', value: 4.3 },
  { time: '15:00', value: 3.8 },
  { time: '16:00', value: 2.9 },
  { time: '17:00', value: 1.7 },
  { time: '18:00', value: 0.5 },
  { time: '19:00', value: 0.1 },
];

const monthlyData = Array(30).fill(0).map((_, i) => ({
  date: `${i+1}`,
  consumption: 30 + Math.random() * 30,
  generation: 15 + Math.random() * 25,
  grid: 20 + Math.random() * 20,
}));

const EnergyDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('day');

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Energy Management Dashboard</h1>
          <p className="text-muted-foreground">Monitor and optimize your energy usage</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Date Range
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">Current Demand</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center">
              <Zap className="h-5 w-5 text-blue-500 mr-2" />
              <div className="text-2xl font-bold">3.8 kW</div>
              <Badge variant="outline" className="ml-auto flex items-center gap-1">
                <ArrowDown className="h-3 w-3 text-green-500" />
                5.2%
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Compared to yesterday</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">Solar Generation</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center">
              <Sun className="h-5 w-5 text-yellow-500 mr-2" />
              <div className="text-2xl font-bold">2.5 kW</div>
              <Badge variant="outline" className="ml-auto flex items-center gap-1">
                <ArrowUp className="h-3 w-3 text-green-500" />
                12.4%
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">69% of current consumption</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">Battery Status</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center">
              <Battery className="h-5 w-5 text-green-500 mr-2" />
              <div className="text-2xl font-bold">78%</div>
              <Badge variant="outline" className="ml-auto flex items-center gap-1">
                <ArrowUp className="h-3 w-3 text-green-500" />
                0.5 kW
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Charging - 5.2 hours to full</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">Self-Consumption</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-purple-500 mr-2" />
              <div className="text-2xl font-bold">82%</div>
              <Badge variant="outline" className="ml-auto flex items-center gap-1">
                <ArrowUp className="h-3 w-3 text-green-500" />
                3.1%
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">7-day average: 77%</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Energy Overview</CardTitle>
              <CardDescription>Your energy production and consumption</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={timeRange} onValueChange={setTimeRange}>
                <TabsList className="mb-4">
                  <TabsTrigger value="day">Day</TabsTrigger>
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="month">Month</TabsTrigger>
                  <TabsTrigger value="year">Year</TabsTrigger>
                </TabsList>
                
                <TabsContent value="day" className="space-y-4">
                  <ChartContainer>
                    <LineChart
                      data={consumptionData}
                      xKey="time"
                      yKey="value"
                      lineColor="hsl(var(--primary))"
                    />
                  </ChartContainer>
                  
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center">
                      <div className="h-3 w-3 bg-primary rounded-full mr-2"></div>
                      <span>Consumption</span>
                    </div>
                    <div className="font-medium">Total: 42.5 kWh</div>
                  </div>
                </TabsContent>
                
                <TabsContent value="month" className="space-y-4">
                  <ChartContainer>
                    <AreaChart
                      data={monthlyData}
                      xKey="date"
                      yKey="consumption"
                      areaColor="hsl(var(--primary))"
                      gradientId="consumptionGradient"
                    >
                      <AreaChart
                        data={monthlyData}
                        xKey="date"
                        yKey="generation"
                        areaColor="hsl(var(--success))"
                        gradientId="generationGradient"
                      />
                    </AreaChart>
                  </ChartContainer>
                  
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center">
                        <div className="h-3 w-3 bg-primary rounded-full mr-2"></div>
                        <span>Consumption</span>
                      </div>
                      <div className="flex items-center">
                        <div className="h-3 w-3 bg-success rounded-full mr-2"></div>
                        <span>Generation</span>
                      </div>
                    </div>
                    <div className="font-medium">Month-to-date: 458.2 kWh</div>
                  </div>
                </TabsContent>
                
                {(timeRange === 'week' || timeRange === 'year') && (
                  <div className="flex items-center justify-center h-72 bg-muted/20 rounded-md">
                    <p className="text-muted-foreground">Select another time period to view data</p>
                  </div>
                )}
              </Tabs>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Solar Production</CardTitle>
                <CardDescription>Daily solar energy generation</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer className="h-[200px]">
                  <AreaChart
                    data={generationData}
                    xKey="time"
                    yKey="value"
                    areaColor="#f59e0b"
                    gradientId="solarGradient"
                  />
                </ChartContainer>
                <div className="mt-2 flex justify-between items-center">
                  <div className="text-sm">Peak: 4.5 kW at 13:00</div>
                  <div className="text-sm font-medium">Total: 26.8 kWh</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Energy Distribution</CardTitle>
                <CardDescription>How your energy is being used</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <div className="space-y-2">
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-md">
                        <div className="text-sm text-muted-foreground">Household</div>
                        <div className="text-xl font-bold">24.5 kWh</div>
                        <div className="text-xs">58% of total</div>
                      </div>
                      <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-md">
                        <div className="text-sm text-muted-foreground">EV Charging</div>
                        <div className="text-xl font-bold">8.2 kWh</div>
                        <div className="text-xs">19% of total</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-md">
                        <div className="text-sm text-muted-foreground">HVAC</div>
                        <div className="text-xl font-bold">6.8 kWh</div>
                        <div className="text-xs">16% of total</div>
                      </div>
                      <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-md">
                        <div className="text-sm text-muted-foreground">Other</div>
                        <div className="text-xl font-bold">3.0 kWh</div>
                        <div className="text-xs">7% of total</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>ML Insights</CardTitle>
              <CardDescription>Machine learning-powered energy insights</CardDescription>
            </CardHeader>
            <CardContent>
              <MLInsights />
            </CardContent>
          </Card>
          
          <AIAgentDecisions />
          
          <Card>
            <CardHeader>
              <CardTitle>Carbon Emissions</CardTitle>
              <CardDescription>Environmental impact of your energy usage</CardDescription>
            </CardHeader>
            <CardContent>
              <EmissionsCalculator />
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <EnergyCategoryList 
            onSelectCategory={(category) => console.log('Selected category:', category)}
          />
        </div>
      </div>
    </div>
  );
};

export default EnergyDashboard;
