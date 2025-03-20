
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
  Sun, 
  Cloud, 
  TrendingDown, 
  TrendingUp, 
  Calendar, 
  Battery, 
  Wind,
  BarChart2,
  Droplets
} from 'lucide-react';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface ProductionReportContentProps {
  data: any;
}

const COLORS = ['#FFC107', '#4CAF50', '#2196F3', '#9C27B0', '#F44336'];

const ProductionReportContent: React.FC<ProductionReportContentProps> = ({ data }) => {
  if (!data) return <div>No data available</div>;

  // Default dummy data if specific parts are missing
  const productionData = data.production_data || data.chart_data || [];
  const bySource = data.by_source || {
    'solar': 65,
    'wind': 18,
    'battery': 12,
    'other': 5
  };
  
  const byTimeOfDay = data.by_time_of_day || {
    'morning': 25,
    'afternoon': 50,
    'evening': 20,
    'night': 5
  };

  const totalProduction = data.total_production || 
    Object.values(bySource).reduce((a: number, b: number) => a + b, 0);
  
  const efficiencyData = data.efficiency_data || [
    { month: "Jan", value: 82 },
    { month: "Feb", value: 85 },
    { month: "Mar", value: 88 },
    { month: "Apr", value: 92 },
    { month: "May", value: 94 },
    { month: "Jun", value: 92 }
  ];

  // Format data for pie chart
  const sourcePieData = Object.entries(bySource).map(([name, value]) => ({
    name,
    value,
  }));

  // Format data for time of day chart
  const timeOfDayData = Object.entries(byTimeOfDay).map(([name, value]) => ({
    name,
    value,
  }));

  // Weather impact data
  const weatherData = data.weather_impact || [
    { date: "06/01", sunny: 95, cloudy: 65, rainy: 45 },
    { date: "06/02", sunny: 98, cloudy: 68, rainy: 42 },
    { date: "06/03", sunny: 90, cloudy: 62, rainy: 38 },
    { date: "06/04", sunny: 92, cloudy: 64, rainy: 40 },
    { date: "06/05", sunny: 96, cloudy: 66, rainy: 44 }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">Total Energy Production</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline">
              <div className="text-2xl font-bold">
                {totalProduction.toLocaleString()} kWh
              </div>
              {data.trend_percentage && (
                <Badge 
                  className={`ml-2 ${data.trend_percentage > 0 ? 'bg-green-500' : 'bg-red-500'}`}
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
            <CardTitle className="text-sm font-medium">Peak Production</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.peak_production ? data.peak_production.toLocaleString() : "26.8"} kW
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {data.peak_time ? data.peak_time : "12:30 PM on Jun 15"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium">System Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.system_efficiency ? data.system_efficiency : "92"}%
            </div>
            {data.efficiency_rating && (
              <Badge 
                variant="outline"
                className={`mt-1 ${
                  data.efficiency_rating === 'Excellent' ? 'text-green-500' : 
                  data.efficiency_rating === 'Good' ? 'text-yellow-500' : 
                  'text-red-500'
                }`}
              >
                {data.efficiency_rating} Rating
              </Badge>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Energy Production Over Time</CardTitle>
          <CardDescription>Daily production trends</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer 
            config={{
              production: { theme: { light: "#4CAF50", dark: "#81C784" }, label: "Production" },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={productionData}
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
                  stroke="var(--color-production)" 
                  fill="var(--color-production)" 
                  fillOpacity={0.3}
                  name="Production (kWh)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Production by Energy Source</CardTitle>
            <CardDescription>Breakdown of energy generation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourcePieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {sourcePieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value.toLocaleString()} kWh`, 'Production']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 flex-wrap mt-4">
              <div className="flex items-center">
                <div className="h-3 w-3 bg-[#FFC107] rounded-full mr-1"></div>
                <span className="text-xs flex items-center">
                  <Sun className="h-3 w-3 mr-1" />
                  Solar
                </span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 bg-[#4CAF50] rounded-full mr-1"></div>
                <span className="text-xs flex items-center">
                  <Wind className="h-3 w-3 mr-1" />
                  Wind
                </span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 bg-[#2196F3] rounded-full mr-1"></div>
                <span className="text-xs flex items-center">
                  <Battery className="h-3 w-3 mr-1" />
                  Battery
                </span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 bg-[#9C27B0] rounded-full mr-1"></div>
                <span className="text-xs">Other</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">System Efficiency Trends</CardTitle>
            <CardDescription>Monthly efficiency metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer 
              config={{
                value: { theme: { light: "#FF9800", dark: "#FFB74D" }, label: "Efficiency" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={efficiencyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar 
                    dataKey="value" 
                    name="Efficiency (%)"
                    fill="var(--color-value)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Weather Impact Analysis</CardTitle>
          <CardDescription>How weather conditions affect production</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer 
            config={{
              sunny: { theme: { light: "#FFC107", dark: "#FFD54F" }, label: "Sunny" },
              cloudy: { theme: { light: "#78909C", dark: "#90A4AE" }, label: "Cloudy" },
              rainy: { theme: { light: "#42A5F5", dark: "#64B5F6" }, label: "Rainy" },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={weatherData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar 
                  dataKey="sunny" 
                  name="Sunny Day" 
                  fill="var(--color-sunny)"
                />
                <Bar 
                  dataKey="cloudy" 
                  name="Cloudy Day" 
                  fill="var(--color-cloudy)"
                />
                <Bar 
                  dataKey="rainy" 
                  name="Rainy Day" 
                  fill="var(--color-rainy)"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
          
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-3 border rounded-lg flex items-start space-x-2">
              <div className="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400 p-1 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">
                <Sun className="h-3 w-3" />
              </div>
              <div>
                <p className="text-sm font-medium">Sunny Conditions</p>
                <p className="text-xs text-muted-foreground">Optimal production, 90-100% efficiency</p>
              </div>
            </div>
            
            <div className="p-3 border rounded-lg flex items-start space-x-2">
              <div className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 p-1 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">
                <Cloud className="h-3 w-3" />
              </div>
              <div>
                <p className="text-sm font-medium">Cloudy Conditions</p>
                <p className="text-xs text-muted-foreground">Reduced output, 60-70% efficiency</p>
              </div>
            </div>
            
            <div className="p-3 border rounded-lg flex items-start space-x-2">
              <div className="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 p-1 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">
                <Droplets className="h-3 w-3" />
              </div>
              <div>
                <p className="text-sm font-medium">Rainy Conditions</p>
                <p className="text-xs text-muted-foreground">Minimal output, 40-50% efficiency</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Production by Time of Day</CardTitle>
          <CardDescription>When energy is being generated most</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartContainer 
              config={{
                value: { theme: { light: "#4CAF50", dark: "#81C784" }, label: "Production" },
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
                    name="Production (kWh)"
                    fill="var(--color-value)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Key Insights</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2">
                    <div className="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 p-1 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">
                      <Sun className="h-3 w-3" />
                    </div>
                    <p>Peak production occurs between 10am and 2pm when solar exposure is optimal</p>
                  </li>
                  <li className="flex gap-2">
                    <div className="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 p-1 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">
                      <BarChart2 className="h-3 w-3" />
                    </div>
                    <p>Afternoon production averages 50% of total daily generation</p>
                  </li>
                  <li className="flex gap-2">
                    <div className="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 p-1 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">
                      <Battery className="h-3 w-3" />
                    </div>
                    <p>Night production is primarily from battery discharge and minimal wind</p>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Optimization Opportunities</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-2">
                    <div className="bg-primary/10 text-primary p-1 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">
                      <Sun className="h-3 w-3" />
                    </div>
                    <p>Consider east-west panel orientation to extend morning and evening production</p>
                  </li>
                  <li className="flex gap-2">
                    <div className="bg-primary/10 text-primary p-1 rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">
                      <Battery className="h-3 w-3" />
                    </div>
                    <p>Additional battery capacity could store 15% more daytime excess</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductionReportContent;
