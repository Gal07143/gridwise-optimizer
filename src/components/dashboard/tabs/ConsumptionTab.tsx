
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
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
  YAxis
} from 'recharts';
import { getEnergyConsumptionStats, EnergyConsumptionPeriod } from '@/services/devices/stats/energyConsumptionStats';
import { Skeleton } from '@/components/ui/skeleton';
import { ChartContainer } from '@/components/ui/chart';

interface ConsumptionTabProps {
  siteId: string;
}

const ConsumptionTab: React.FC<ConsumptionTabProps> = ({ siteId }) => {
  const [period, setPeriod] = useState<EnergyConsumptionPeriod>('day');
  
  // Fetch energy consumption data
  const { data: consumptionData, isLoading, error } = useQuery({
    queryKey: ['energy-consumption', siteId, period],
    queryFn: () => getEnergyConsumptionStats(siteId, period),
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
      }
      
      acc[key].energy += item.energy;
      return acc;
    }, {} as Record<string, { time: string; energy: number }>);
    
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Energy Consumption</h2>
        <Select value={period} onValueChange={(value) => setPeriod(value as EnergyConsumptionPeriod)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Consumption Trend</CardTitle>
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
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis label={{ value: 'kWh', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value: number) => [`${value.toFixed(2)} kWh`, 'Consumption']} />
                  <Area
                    type="monotone"
                    dataKey="energy"
                    stroke="#8884d8"
                    fillOpacity={1}
                    fill="url(#colorConsumption)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hourly Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] pt-0">
            {isLoading ? (
              <Skeleton className="w-full h-full" />
            ) : error ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Failed to load consumption data
              </div>
            ) : hourlyBreakdown.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No consumption data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyBreakdown} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis label={{ value: 'kWh', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value: number) => [`${value.toFixed(2)} kWh`, 'Consumption']} />
                  <Bar dataKey="consumption" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Energy Usage By Device Type</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          {isLoading ? (
            <Skeleton className="w-full h-full" />
          ) : (
            <ChartContainer
              config={{
                building: { 
                  label: "Building", 
                  color: "#8884d8" 
                },
                lighting: { 
                  label: "Lighting", 
                  color: "#82ca9d" 
                },
                hvac: { 
                  label: "HVAC", 
                  color: "#ffc658" 
                },
                equipment: { 
                  label: "Equipment", 
                  color: "#ff8042" 
                }
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'Building', building: 20, lighting: 5, hvac: 15, equipment: 8 },
                    { name: 'Device Type', building: 25, lighting: 8, hvac: 12, equipment: 10 }
                  ]}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" label={{ value: 'kWh', position: 'insideBottom', offset: -5 }} />
                  <YAxis type="category" dataKey="name" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="building" stackId="a" fill="#8884d8" />
                  <Bar dataKey="lighting" stackId="a" fill="#82ca9d" />
                  <Bar dataKey="hvac" stackId="a" fill="#ffc658" />
                  <Bar dataKey="equipment" stackId="a" fill="#ff8042" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsumptionTab;
