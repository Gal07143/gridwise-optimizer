
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRange } from '@/components/ui/date-range-picker';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { CalendarIcon, ChevronDown, Download, Lightbulb } from 'lucide-react';

const weeklyData = [
  { day: 'Monday', consumption: 124, peak: 18, offPeak: 106 },
  { day: 'Tuesday', consumption: 137, peak: 22, offPeak: 115 },
  { day: 'Wednesday', consumption: 142, peak: 25, offPeak: 117 },
  { day: 'Thursday', consumption: 132, peak: 21, offPeak: 111 },
  { day: 'Friday', consumption: 128, peak: 19, offPeak: 109 },
  { day: 'Saturday', consumption: 98, peak: 10, offPeak: 88 },
  { day: 'Sunday', consumption: 87, peak: 8, offPeak: 79 }
];

const monthlyData = [
  { month: 'Jan', consumption: 3245, peak: 850, offPeak: 2395 },
  { month: 'Feb', consumption: 2918, peak: 760, offPeak: 2158 },
  { month: 'Mar', consumption: 3127, peak: 820, offPeak: 2307 },
  { month: 'Apr', consumption: 2865, peak: 750, offPeak: 2115 },
  { month: 'May', consumption: 3021, peak: 790, offPeak: 2231 },
  { month: 'Jun', consumption: 3542, peak: 920, offPeak: 2622 },
  { month: 'Jul', consumption: 3851, peak: 1010, offPeak: 2841 },
  { month: 'Aug', consumption: 3712, peak: 970, offPeak: 2742 },
  { month: 'Sep', consumption: 3287, peak: 860, offPeak: 2427 },
  { month: 'Oct', consumption: 3165, peak: 830, offPeak: 2335 },
  { month: 'Nov', consumption: 3427, peak: 895, offPeak: 2532 },
  { month: 'Dec', consumption: 3782, peak: 990, offPeak: 2792 }
];

const hourlyData = [
  { hour: '00:00', consumption: 42 },
  { hour: '01:00', consumption: 38 },
  { hour: '02:00', consumption: 35 },
  { hour: '03:00', consumption: 32 },
  { hour: '04:00', consumption: 35 },
  { hour: '05:00', consumption: 48 },
  { hour: '06:00', consumption: 65 },
  { hour: '07:00', consumption: 87 },
  { hour: '08:00', consumption: 125 },
  { hour: '09:00', consumption: 145 },
  { hour: '10:00', consumption: 152 },
  { hour: '11:00', consumption: 148 },
  { hour: '12:00', consumption: 142 },
  { hour: '13:00', consumption: 138 },
  { hour: '14:00', consumption: 135 },
  { hour: '15:00', consumption: 132 },
  { hour: '16:00', consumption: 138 },
  { hour: '17:00', consumption: 148 },
  { hour: '18:00', consumption: 158 },
  { hour: '19:00', consumption: 152 },
  { hour: '20:00', consumption: 145 },
  { hour: '21:00', consumption: 132 },
  { hour: '22:00', consumption: 112 },
  { hour: '23:00', consumption: 78 }
];

const categoryData = [
  { name: 'HVAC', value: 42 },
  { name: 'Lighting', value: 18 },
  { name: 'Equipment', value: 15 },
  { name: 'Computing', value: 12 },
  { name: 'Other', value: 13 }
];

const ConsumptionPage = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [date, setDate] = useState<DateRange>({
    from: new Date(2023, 3, 1),
    to: new Date(2023, 3, 7)
  });
  const [category, setCategory] = useState('all');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-gridx-blue">
            Energy Consumption
          </h1>
          <p className="text-muted-foreground">Monitor and analyze energy consumption patterns</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="hvac">HVAC</SelectItem>
              <SelectItem value="lighting">Lighting</SelectItem>
              <SelectItem value="equipment">Equipment</SelectItem>
              <SelectItem value="computing">Computing</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex border rounded-md">
            <Button variant="ghost" className="px-3 flex items-center gap-1">
              <CalendarIcon className="h-4 w-4" />
              <span className="text-sm">
                {date.from ? date.from.toLocaleDateString() : 'Select'} - 
                {date.to ? date.to.toLocaleDateString() : 'date'}
              </span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="backdrop-blur-sm bg-card/90 col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Consumption</CardTitle>
            <CardDescription>Current period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <div className="text-3xl font-bold">3,824 kWh</div>
              <div className="ml-2 text-sm text-green-500">+2.4%</div>
            </div>
            <div className="text-sm text-muted-foreground mt-1">vs. previous period</div>
          </CardContent>
        </Card>
        
        <Card className="backdrop-blur-sm bg-card/90 col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Peak Demand</CardTitle>
            <CardDescription>Highest recorded</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <div className="text-3xl font-bold">152 kW</div>
              <div className="ml-2 text-sm text-red-500">+5.1%</div>
            </div>
            <div className="text-sm text-muted-foreground mt-1">occurred at 10:00 AM</div>
          </CardContent>
        </Card>
        
        <Card className="backdrop-blur-sm bg-card/90 col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Average Daily</CardTitle>
            <CardDescription>Consumption</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <div className="text-3xl font-bold">124.8 kWh</div>
              <div className="ml-2 text-sm text-green-500">-1.8%</div>
            </div>
            <div className="text-sm text-muted-foreground mt-1">compared to baseline</div>
          </CardContent>
        </Card>
        
        <Card className="backdrop-blur-sm bg-card/90 col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Carbon Footprint</CardTitle>
            <CardDescription>Estimated</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <div className="text-3xl font-bold">1.83 tons</div>
              <div className="ml-2 text-sm text-green-500">-3.2%</div>
            </div>
            <div className="text-sm text-muted-foreground mt-1">CO₂ equivalent</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="consumption" className="space-y-4">
        <TabsList>
          <TabsTrigger value="consumption">Consumption</TabsTrigger>
          <TabsTrigger value="peak-hours">Peak Hours</TabsTrigger>
          <TabsTrigger value="hourly">Hourly Breakdown</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        
        <TabsContent value="consumption" className="space-y-4">
          <Card className="backdrop-blur-sm bg-card/90">
            <CardHeader>
              <CardTitle>Energy Consumption Over Time</CardTitle>
              <div className="flex space-x-2">
                <Button 
                  variant={timeRange === 'week' ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => setTimeRange('week')}
                >
                  Weekly
                </Button>
                <Button 
                  variant={timeRange === 'month' ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => setTimeRange('month')}
                >
                  Monthly
                </Button>
                <Button 
                  variant={timeRange === 'year' ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => setTimeRange('year')}
                >
                  Yearly
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={timeRange === 'week' ? weeklyData : monthlyData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis 
                      dataKey={timeRange === 'week' ? "day" : "month"} 
                      tick={{ fontSize: 12 }} 
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 15, 15, 0.8)',
                        borderColor: 'rgba(82, 82, 82, 0.2)',
                        borderRadius: '6px',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="peak" name="Peak Hours" fill="#f97316" />
                    <Bar dataKey="offPeak" name="Off-Peak" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="peak-hours" className="space-y-4">
          <Card className="backdrop-blur-sm bg-card/90">
            <CardHeader>
              <CardTitle>Peak vs. Off-Peak Consumption</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={timeRange === 'week' ? weeklyData : monthlyData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis 
                      dataKey={timeRange === 'week' ? "day" : "month"} 
                      tick={{ fontSize: 12 }} 
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 15, 15, 0.8)',
                        borderColor: 'rgba(82, 82, 82, 0.2)',
                        borderRadius: '6px',
                      }}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="peak" 
                      name="Peak Hours" 
                      stackId="1"
                      stroke="#f97316" 
                      fill="#f97316" 
                      fillOpacity={0.6}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="offPeak" 
                      name="Off-Peak" 
                      stackId="1"
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="hourly" className="space-y-4">
          <Card className="backdrop-blur-sm bg-card/90">
            <CardHeader>
              <CardTitle>24-Hour Consumption Pattern</CardTitle>
              <CardDescription>Daily average for selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={hourlyData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis 
                      dataKey="hour" 
                      tick={{ fontSize: 12 }}
                      interval={2}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 15, 15, 0.8)',
                        borderColor: 'rgba(82, 82, 82, 0.2)',
                        borderRadius: '6px',
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="consumption" 
                      name="kWh" 
                      stroke="#10b981" 
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="backdrop-blur-sm bg-card/90">
              <CardHeader>
                <CardTitle>Consumption by Category</CardTitle>
                <CardDescription>Percentage distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[360px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      layout="vertical" 
                      data={categoryData}
                      margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} horizontalCoordinatesGenerator={() => []} />
                      <XAxis type="number" tick={{ fontSize: 12 }} />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        tick={{ fontSize: 12 }} 
                        width={80}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(15, 15, 15, 0.8)',
                          borderColor: 'rgba(82, 82, 82, 0.2)',
                          borderRadius: '6px',
                        }}
                        formatter={(value) => [`${value}%`, 'Percentage']}
                      />
                      <Legend />
                      <Bar dataKey="value" name="Percentage" fill="#8884d8" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="backdrop-blur-sm bg-card/90">
              <CardHeader>
                <CardTitle>Energy Saving Opportunities</CardTitle>
                <CardDescription>AI-generated recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
                    <Lightbulb className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm">HVAC Optimization</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Adjusting HVAC schedules could reduce consumption by 8.2%. 
                        Peak usage occurs between 8-11 AM.
                      </p>
                      <div className="mt-2">
                        <Button size="sm" variant="outline" className="h-7 text-xs">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
                    <Lightbulb className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm">Lighting Schedule</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Implementing daylight harvesting could save up to 12% on 
                        lighting energy during peak sunlight hours.
                      </p>
                      <div className="mt-2">
                        <Button size="sm" variant="outline" className="h-7 text-xs">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
                    <Lightbulb className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm">Equipment Standby</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Reducing standby consumption could save 5.4% overall.
                        Significant idle time detected on computing equipment.
                      </p>
                      <div className="mt-2">
                        <Button size="sm" variant="outline" className="h-7 text-xs">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      <Card className="backdrop-blur-sm bg-card/90">
        <CardHeader>
          <CardTitle>Consumption Trends</CardTitle>
          <CardDescription>Analysis and insights</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center p-4 bg-primary/5 rounded-lg border border-primary/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              <div className="space-y-1">
                <div className="text-sm font-medium">Weekly Trend</div>
                <div className="text-2xl font-semibold">↓ 3.2%</div>
                <div className="text-xs text-muted-foreground">Compared to last week</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium">Monthly Trend</div>
                <div className="text-2xl font-semibold">↑ 1.8%</div>
                <div className="text-xs text-muted-foreground">Compared to last month</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium">Annual Trend</div>
                <div className="text-2xl font-semibold">↓ 5.7%</div>
                <div className="text-xs text-muted-foreground">Compared to last year</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsumptionPage;
