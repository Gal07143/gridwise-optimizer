
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { InfoIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type TimeRange = 'day' | 'week' | 'month';

interface DynamicTariffChartProps {
  className?: string;
}

// Sample data - would be replaced with API data in a real app
const generateTariffData = (timeRange: TimeRange) => {
  switch (timeRange) {
    case 'day':
      return Array(24).fill(0).map((_, i) => {
        const hour = i;
        const baseRate = 0.15; // Base rate in €/kWh
        let modifier = 0;
        
        // Morning peak (7-9 AM)
        if (hour >= 7 && hour < 9) modifier = 0.08;
        // Evening peak (6-8 PM)
        else if (hour >= 18 && hour < 20) modifier = 0.12;
        // Night discount (0-6 AM)
        else if (hour >= 0 && hour < 6) modifier = -0.05;
        
        // Add some small random variations
        const randomFactor = (Math.random() - 0.5) * 0.03;
        
        return {
          hour: `${hour}:00`,
          price: Math.max(0.05, baseRate + modifier + randomFactor),
          isOptimal: baseRate + modifier + randomFactor < 0.12,
        };
      });
    
    case 'week':
      const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      return weekDays.flatMap((day, dayIndex) => {
        return Array(6).fill(0).map((_, i) => {
          const hour = i * 4; // 0, 4, 8, 12, 16, 20
          const baseRate = 0.15;
          let modifier = 0;
          
          // Weekend discount
          if (dayIndex >= 5) modifier -= 0.03;
          
          // Work day peak hours
          if (dayIndex < 5) {
            if (hour >= 8 && hour < 12) modifier += 0.06;
            else if (hour >= 16 && hour < 20) modifier += 0.08;
          }
          
          const randomFactor = (Math.random() - 0.5) * 0.04;
          
          return {
            time: `${day} ${hour}:00`,
            price: Math.max(0.05, baseRate + modifier + randomFactor),
            isOptimal: baseRate + modifier + randomFactor < 0.13,
          };
        });
      });
      
    case 'month':
      return Array(31).fill(0).map((_, i) => {
        const day = i + 1;
        const baseRate = 0.15;
        let modifier = 0;
        
        // Higher rates in middle of month
        if (day > 10 && day < 20) modifier += 0.03;
        
        // Weekend pattern
        const isWeekend = (day % 7 === 6 || day % 7 === 0);
        if (isWeekend) modifier -= 0.025;
        
        const randomFactor = (Math.random() - 0.5) * 0.05;
        
        return {
          day: `${day}`,
          price: Math.max(0.05, baseRate + modifier + randomFactor),
          isOptimal: baseRate + modifier + randomFactor < 0.14,
        };
      });
  }
};

const DynamicTariffChart: React.FC<DynamicTariffChartProps> = ({ className }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('day');
  const data = generateTariffData(timeRange);
  
  // Calculate average price
  const avgPrice = data.reduce((sum, item) => sum + item.price, 0) / data.length;
  
  // Find min and max prices
  const minPrice = Math.min(...data.map(item => item.price));
  const maxPrice = Math.max(...data.map(item => item.price));
  
  // Count optimal charging windows
  const optimalWindows = data.filter(item => item.isOptimal).length;
  
  return (
    <Card className={cn("shadow-sm", className)}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Dynamic Electricity Pricing</CardTitle>
            <CardDescription>Optimize energy usage based on market prices</CardDescription>
          </div>
          <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
            EPEX Spot Market
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-md text-center">
                <div className="text-xs text-muted-foreground">Avg Price</div>
                <div className="font-medium">{avgPrice.toFixed(3)} €/kWh</div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/10 p-2 rounded-md text-center">
                <div className="text-xs text-red-600 dark:text-red-400">Peak</div>
                <div className="font-medium text-red-600 dark:text-red-400">{maxPrice.toFixed(3)} €/kWh</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/10 p-2 rounded-md text-center">
                <div className="text-xs text-green-600 dark:text-green-400">Lowest</div>
                <div className="font-medium text-green-600 dark:text-green-400">{minPrice.toFixed(3)} €/kWh</div>
              </div>
            </div>
            
            <div>
              <Tabs
                value={timeRange}
                onValueChange={(value) => setTimeRange(value as TimeRange)}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="day">Day</TabsTrigger>
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="month">Month</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey={timeRange === 'day' ? 'hour' : timeRange === 'week' ? 'time' : 'day'} 
                  tick={{ fontSize: 12 }} 
                  interval="preserveStartEnd"
                />
                <YAxis
                  domain={[minPrice * 0.9, maxPrice * 1.1]}
                  tickFormatter={(value) => `${value.toFixed(2)}`}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value: any) => [`${value} €/kWh`, 'Price']} 
                  labelFormatter={(label) => `Time: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, stroke: '#3b82f6', strokeWidth: 1, fill: '#3b82f6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {optimalWindows > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/10 rounded-md">
              <InfoIcon className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
              <p className="text-sm text-green-700 dark:text-green-300">
                {optimalWindows} optimal charging windows detected during this period with prices below average.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DynamicTariffChart;
