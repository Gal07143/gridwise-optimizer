
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Line,
  LineChart,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { getEnergyConsumptionStats, EnergyConsumptionPeriod, getTotalEnergyConsumption } from '@/services/devices/stats/energyConsumptionStats';
import { Skeleton } from '@/components/ui/skeleton';
import { ChartContainer } from '@/components/ui/chart';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import MetricsCard from '@/components/dashboard/MetricsCard';
import { 
  Activity, 
  Calendar, 
  Clock, 
  Download, 
  Lightbulb, 
  BarChart3, 
  TrendingDown, 
  TrendingUp,
  Zap,
  Home,
  MonitorSmartphone,
  Thermometer 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ConsumptionTabProps {
  siteId: string;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8e9196'];

const ConsumptionTab: React.FC<ConsumptionTabProps> = ({ siteId }) => {
  const [period, setPeriod] = useState<EnergyConsumptionPeriod>('day');
  const [comparisonEnabled, setComparisonEnabled] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState('overview');
  
  // Fetch energy consumption data
  const { data: consumptionData, isLoading, error } = useQuery({
    queryKey: ['energy-consumption', siteId, period],
    queryFn: () => getEnergyConsumptionStats(siteId, period),
  });

  // Fetch total consumption
  const { data: totalConsumption } = useQuery({
    queryKey: ['total-energy-consumption', siteId, period],
    queryFn: () => getTotalEnergyConsumption(siteId, period),
  });

  // Process data for the charts
  const processChartData = () => {
    if (!consumptionData || consumptionData.length === 0) return [];

    // Group data by hour for daily view or by day for other periods
    const groupedData = consumptionData.reduce((acc, item) => {
      const date = new Date(item.timestamp);
      let key;
      
      if (period === 'day') {
        key = date.getHours() + ':00';
      } else if (period === 'week') {
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        key = dayNames[date.getDay()];
      } else {
        key = date.getDate() + '/' + (date.getMonth() + 1);
      }
      
      if (!acc[key]) {
        acc[key] = { time: key, energy: 0 };
        
        // Add comparison data (previous period) when enabled
        if (comparisonEnabled) {
          acc[key].previousEnergy = 0;
        }
      }
      
      acc[key].energy += item.energy;
      
      // Simulate previous period data for comparison
      if (comparisonEnabled) {
        // Generate comparison data with a random deviation
        const randomFactor = 0.7 + Math.random() * 0.6; // 70-130% of current value
        acc[key].previousEnergy = (item.energy * randomFactor);
      }
      
      return acc;
    }, {} as Record<string, { time: string; energy: number; previousEnergy?: number }>);
    
    return Object.values(groupedData);
  };
  
  const chartData = processChartData();
  
  // Process hourly breakdown data for bar chart
  const getHourlyBreakdown = () => {
    if (!consumptionData || consumptionData.length === 0) return [];
    
    const hourlyData = Array.from({ length: 24 }, (_, i) => ({ 
      hour: `${i}:00`, 
      consumption: 0
    }));
    
    consumptionData.forEach(item => {
      const date = new Date(item.timestamp);
      const hour = date.getHours();
      hourlyData[hour].consumption += item.energy;
    });
    
    return hourlyData;
  };
  
  const hourlyBreakdown = getHourlyBreakdown();

  // Generate device type breakdown data
  const getDeviceTypeBreakdown = () => {
    // In a real app, this would come from actual data
    return [
      { name: 'HVAC', value: 35 },
      { name: 'Lighting', value: 25 },
      { name: 'Electronics', value: 20 },
      { name: 'Appliances', value: 15 },
      { name: 'Other', value: 5 }
    ];
  };

  const deviceTypeData = getDeviceTypeBreakdown();
  
  // Generate peak usage times
  const getPeakUsageTimes = () => {
    if (!hourlyBreakdown.length) return [];
    
    // Sort hours by consumption to find peak times
    return [...hourlyBreakdown]
      .sort((a, b) => b.consumption - a.consumption)
      .slice(0, 3)
      .map(item => ({ time: item.hour, value: item.consumption }));
  };
  
  const peakTimes = getPeakUsageTimes();

  // Helper function to format consumption values
  const formatConsumption = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(2)} MWh`;
    }
    return `${value.toFixed(2)} kWh`;
  };

  // Calculate change percentage from previous period
  const calculateChange = () => {
    // In a real app, this would come from comparing current period with previous
    // For demo purposes, we'll return a random value
    return Math.round((Math.random() * 30) - 15); // -15% to +15%
  };

  const changePercentage = calculateChange();
  const changeType = changePercentage > 0 ? 'increase' : changePercentage < 0 ? 'decrease' : 'neutral';

  // Function to download consumption data as CSV
  const downloadConsumptionData = () => {
    if (!chartData.length) {
      toast.error("No data available to download");
      return;
    }

    // Create CSV content
    const headers = comparisonEnabled 
      ? ["Time", "Energy (kWh)", "Previous Period (kWh)"]
      : ["Time", "Energy (kWh)"];
      
    const csvContent = [
      headers.join(','),
      ...chartData.map(item => {
        if (comparisonEnabled) {
          return `${item.time},${item.energy.toFixed(2)},${(item.previousEnergy || 0).toFixed(2)}`;
        }
        return `${item.time},${item.energy.toFixed(2)}`;
      })
    ].join('\n');

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `energy-consumption-${period}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Download started");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Activity className="h-6 w-6 mr-2 text-primary" />
            Energy Consumption
          </h2>
          <p className="text-muted-foreground">Monitor and analyze your energy usage patterns</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={period} onValueChange={(value) => setPeriod(value as EnergyConsumptionPeriod)}>
            <SelectTrigger className="w-[140px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex items-center gap-2">
            <Switch 
              id="compare" 
              checked={comparisonEnabled}
              onCheckedChange={setComparisonEnabled}
            />
            <Label htmlFor="compare">Compare with previous period</Label>
          </div>
          
          <Button variant="outline" size="icon" onClick={downloadConsumptionData} title="Download data">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Summary metrics cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricsCard
          title="Total Consumption"
          value={formatConsumption(totalConsumption || 0)}
          icon={<Zap className="h-5 w-5" />}
          changeValue={Math.abs(changePercentage)}
          changeType={changeType}
          animationDelay="100ms"
          description={`${period === 'day' ? 'Today' : period === 'week' ? 'This week' : 'This month'}`}
        />
        
        <MetricsCard
          title="Peak Demand"
          value={peakTimes.length ? peakTimes[0].value.toFixed(2) : "0"}
          unit="kW"
          icon={<Activity className="h-5 w-5" />}
          description={peakTimes.length ? `at ${peakTimes[0].time}` : "No data"}
          animationDelay="200ms"
        />
        
        <MetricsCard
          title="Average Hourly"
          value={(totalConsumption || 0) / (period === 'day' ? 24 : period === 'week' ? 168 : 720)}
          unit="kWh"
          icon={<Clock className="h-5 w-5" />}
          animationDelay="300ms"
        />
        
        <MetricsCard
          title="Main Consumer"
          value="HVAC"
          icon={<Thermometer className="h-5 w-5" />}
          description="35% of total usage"
          animationDelay="400ms"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-slate-200 dark:border-slate-700/50 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Consumption Trend</CardTitle>
              <Badge variant="outline" className="font-normal">
                {period === 'day' ? 'Hourly' : period === 'week' ? 'Daily' : 'Monthly'}
              </Badge>
            </div>
            <CardDescription>
              Energy usage over time
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] pt-0">
            {isLoading ? (
              <Skeleton className="w-full h-full" />
            ) : error ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Failed to load consumption data
              </div>
            ) : chartData.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No consumption data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorConsumption" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9b87f5" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#9b87f5" stopOpacity={0}/>
                    </linearGradient>
                    {comparisonEnabled && (
                      <linearGradient id="colorComparison" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                      </linearGradient>
                    )}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="time" />
                  <YAxis label={{ value: 'kWh', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value: number) => [`${value.toFixed(2)} kWh`, 'Consumption']} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="energy"
                    name="Current"
                    stroke="#9b87f5"
                    fillOpacity={1}
                    fill="url(#colorConsumption)"
                  />
                  {comparisonEnabled && (
                    <Area
                      type="monotone"
                      dataKey="previousEnergy"
                      name="Previous"
                      stroke="#82ca9d"
                      fillOpacity={1}
                      fill="url(#colorComparison)"
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-700/50 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Device Type Breakdown</CardTitle>
              <Badge variant="outline" className="font-normal">
                {period === 'day' ? 'Today' : period === 'week' ? 'This week' : 'This month'}
              </Badge>
            </div>
            <CardDescription>
              Energy consumption by device category
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] pt-0">
            {isLoading ? (
              <Skeleton className="w-full h-full" />
            ) : (
              <div className="flex h-full">
                <ResponsiveContainer width="50%" height="100%">
                  <PieChart>
                    <Pie
                      data={deviceTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {deviceTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`${value}%`, 'Consumption']} />
                  </PieChart>
                </ResponsiveContainer>
                
                <div className="flex flex-col justify-center w-1/2 pr-4">
                  {deviceTypeData.map((item, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <div 
                        className="w-3 h-3 mr-2 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <div className="flex justify-between w-full">
                        <span className="text-sm">{item.name}</span>
                        <span className="text-sm font-medium">{item.value}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card className="border border-slate-200 dark:border-slate-700/50 shadow-sm">
        <CardHeader className="border-b border-slate-100 dark:border-slate-800">
          <CardTitle>Detailed Analysis</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeDetailTab} onValueChange={setActiveDetailTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 rounded-none bg-slate-50 dark:bg-slate-900/50">
              <TabsTrigger value="overview">
                <BarChart3 className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="hourly">
                <Clock className="h-4 w-4 mr-2" />
                Hourly
              </TabsTrigger>
              <TabsTrigger value="recommendations">
                <Lightbulb className="h-4 w-4 mr-2" />
                Recommendations
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-4">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Peak Usage Time</div>
                  <div className="text-2xl font-semibold">
                    {peakTimes.length ? peakTimes[0].time : "N/A"}
                  </div>
                  <div className="flex items-center mt-1 text-sm">
                    <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {peakTimes.length ? `${peakTimes[0].value.toFixed(2)} kWh` : "No data"}
                    </span>
                  </div>
                </div>
                
                <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-4">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Highest Consumer</div>
                  <div className="text-2xl font-semibold">HVAC System</div>
                  <div className="flex items-center mt-1 text-sm">
                    <Thermometer className="h-3 w-3 mr-1 text-muted-foreground" />
                    <span className="text-muted-foreground">35% of total usage</span>
                  </div>
                </div>
                
                <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-4">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Energy Efficiency</div>
                  <div className="text-2xl font-semibold">Good</div>
                  <div className="flex items-center mt-1 text-sm">
                    <TrendingDown className="h-3 w-3 mr-1 text-green-500" />
                    <span className="text-green-500">8% better than average</span>
                  </div>
                </div>
              </div>
              
              <div className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-sm font-medium">
                  Usage by Building Area
                </div>
                <div className="p-4">
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart
                      data={[
                        { name: 'Main Floor', value: 42 },
                        { name: 'Second Floor', value: 28 },
                        { name: 'Basement', value: 15 },
                        { name: 'Exterior', value: 10 },
                        { name: 'Common Areas', value: 5 }
                      ]}
                      margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="name" />
                      <YAxis label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip formatter={(value: number) => [`${value}%`, 'Consumption']} />
                      <Bar dataKey="value" fill="#9b87f5" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="hourly" className="p-4">
              <div className="mb-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Hourly Energy Consumption</h3>
                <p className="text-sm text-muted-foreground">
                  Breakdown of energy usage by hour of the day, showing when your facility consumes the most power.
                </p>
              </div>
              
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={hourlyBreakdown} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="hour" />
                  <YAxis label={{ value: 'kWh', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value: number) => [`${value.toFixed(2)} kWh`, 'Consumption']} />
                  <Bar dataKey="consumption" fill="#9b87f5" />
                </BarChart>
              </ResponsiveContainer>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-4">
                  <h4 className="text-sm font-medium mb-2">Morning (6AM-12PM)</h4>
                  <div className="text-2xl font-semibold mb-1">32.4 kWh</div>
                  <div className="text-xs text-muted-foreground">26% of daily consumption</div>
                </div>
                
                <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-4">
                  <h4 className="text-sm font-medium mb-2">Afternoon (12PM-6PM)</h4>
                  <div className="text-2xl font-semibold mb-1">48.7 kWh</div>
                  <div className="text-xs text-muted-foreground">39% of daily consumption</div>
                </div>
                
                <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-4">
                  <h4 className="text-sm font-medium mb-2">Evening (6PM-12AM)</h4>
                  <div className="text-2xl font-semibold mb-1">43.2 kWh</div>
                  <div className="text-xs text-muted-foreground">35% of daily consumption</div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="recommendations" className="p-4">
              <div className="mb-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Energy Saving Recommendations</h3>
                <p className="text-sm text-muted-foreground">
                  Personalized recommendations based on your energy consumption patterns.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-950 dark:bg-amber-950/30">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-amber-100 dark:bg-amber-900/50 p-2 rounded-full mr-3">
                      <Thermometer className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Optimize HVAC Schedule</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Your HVAC system accounts for 35% of energy usage. Adjusting temperature by 2°F during off-hours could save up to 10% on HVAC costs.
                      </p>
                      <div className="flex items-center text-xs text-amber-600 dark:text-amber-400">
                        <TrendingDown className="h-3 w-3 mr-1" />
                        <span>Potential savings: 120 kWh/month</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-950 dark:bg-blue-950/30">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full mr-3">
                      <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Upgrade to LED Lighting</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Lighting accounts for 25% of your energy consumption. Switching to LED lighting could reduce this portion by up to 75%.
                      </p>
                      <div className="flex items-center text-xs text-blue-600 dark:text-blue-400">
                        <TrendingDown className="h-3 w-3 mr-1" />
                        <span>Potential savings: 85 kWh/month</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg border border-green-200 bg-green-50 dark:border-green-950 dark:bg-green-950/30">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-green-100 dark:bg-green-900/50 p-2 rounded-full mr-3">
                      <MonitorSmartphone className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Reduce Standby Power</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Electronics in standby mode consume approximately 5% of your total energy. Using smart power strips could eliminate this waste.
                      </p>
                      <div className="flex items-center text-xs text-green-600 dark:text-green-400">
                        <TrendingDown className="h-3 w-3 mr-1" />
                        <span>Potential savings: 22 kWh/month</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsumptionTab;
