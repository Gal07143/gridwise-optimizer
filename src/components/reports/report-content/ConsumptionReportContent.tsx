
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
  Bar
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingDown, 
  TrendingUp, 
  Clock, 
  Calendar,
  HomeIcon,
  Factory,
  Smartphone
} from 'lucide-react';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface ConsumptionReportContentProps {
  data: any;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const ConsumptionReportContent: React.FC<ConsumptionReportContentProps> = ({ data }) => {
  if (!data) return <div>No data available</div>;

  // Default dummy data if specific parts are missing
  const consumptionData = data.consumption_data || data.chart_data || [];
  const byDeviceType = data.by_device_type || {
    'lighting': 12,
    'climate': 35,
    'appliances': 23,
    'electronics': 18,
    'other': 12
  };
  
  const byTimeOfDay = data.by_time_of_day || {
    'morning': 25,
    'afternoon': 35,
    'evening': 30,
    'night': 10
  };

  const totalConsumption = data.total_consumption || 
    Object.values(byDeviceType).reduce((a: number, b: number) => a + b, 0);
  
  const peak = data.peak || {
    value: 7.8,
    time: '18:30',
    date: '2023-06-15'
  };

  // Format data for pie chart
  const deviceTypePieData = Object.entries(byDeviceType).map(([name, value]) => ({
    name,
    value,
  }));

  // Format data for time of day chart
  const timeOfDayData = Object.entries(byTimeOfDay).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">Total Consumption</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <div className="text-2xl font-bold">
                {totalConsumption.toLocaleString()} kWh
              </div>
              {data.trend_percentage && (
                <Badge 
                  className={`ml-2 ${data.trend_percentage > 0 ? 'bg-red-500' : 'bg-green-500'}`}
                >
                  {data.trend_percentage > 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(data.trend_percentage)}%
                </Badge>
              )}
            </div>
            {data.period && (
              <p className="text-xs text-muted-foreground mt-1">
                <Calendar className="inline h-3 w-3 mr-1" />
                Period: {data.period}
              </p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">Peak Consumption</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {peak.value.toLocaleString()} kW
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              <Clock className="inline h-3 w-3 mr-1" />
              {peak.time} on {peak.date}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">Average Daily Consumption</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.average_daily ? data.average_daily.toLocaleString() : (totalConsumption / 30).toFixed(1)} kWh
            </div>
            {data.efficiency_rating && (
              <Badge 
                variant="outline"
                className={`mt-1 ${
                  data.efficiency_rating === 'Good' ? 'text-green-500' : 
                  data.efficiency_rating === 'Average' ? 'text-yellow-500' : 
                  'text-red-500'
                }`}
              >
                {data.efficiency_rating} Efficiency
              </Badge>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Energy Consumption Over Time</CardTitle>
          <CardDescription>Daily energy consumption trends</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer 
            config={{
              consumption: { theme: { light: "#E57373", dark: "#EF5350" }, label: "Consumption" },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={consumptionData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="var(--color-consumption)" 
                  fill="var(--color-consumption)" 
                  fillOpacity={0.3}
                  name="Consumption (kWh)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Consumption by Device Type</CardTitle>
            <CardDescription>Breakdown of energy usage by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceTypePieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {deviceTypePieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} kWh`, 'Consumption']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 flex-wrap mt-4">
              <div className="flex items-center">
                <div className="h-3 w-3 bg-[#0088FE] rounded-full mr-1"></div>
                <span className="text-xs">Lighting</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 bg-[#00C49F] rounded-full mr-1"></div>
                <span className="text-xs">Climate</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 bg-[#FFBB28] rounded-full mr-1"></div>
                <span className="text-xs">Appliances</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 bg-[#FF8042] rounded-full mr-1"></div>
                <span className="text-xs">Electronics</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 bg-[#8884d8] rounded-full mr-1"></div>
                <span className="text-xs">Other</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Consumption by Time of Day</CardTitle>
            <CardDescription>When energy is being used most</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer 
              config={{
                morning: { theme: { light: "#FFC107", dark: "#FFD54F" }, label: "Morning" },
                afternoon: { theme: { light: "#FF9800", dark: "#FFB74D" }, label: "Afternoon" },
                evening: { theme: { light: "#2196F3", dark: "#64B5F6" }, label: "Evening" },
                night: { theme: { light: "#673AB7", dark: "#9575CD" }, label: "Night" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={timeOfDayData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar 
                    dataKey="value" 
                    name="Usage (kWh)"
                    className="fill-[var(--color-morning)]"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {data.recommendations && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Energy Saving Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {Array.isArray(data.recommendations) ? (
                data.recommendations.map((rec, index) => (
                  <li key={index} className="flex gap-2">
                    <div className="bg-primary/10 text-primary p-1 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">
                      {index % 3 === 0 ? <HomeIcon className="h-3 w-3" /> : 
                       index % 3 === 1 ? <Factory className="h-3 w-3" /> : 
                       <Smartphone className="h-3 w-3" />}
                    </div>
                    <div className="text-sm">{rec}</div>
                  </li>
                ))
              ) : (
                <li className="text-sm">No specific recommendations available.</li>
              )}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ConsumptionReportContent;
