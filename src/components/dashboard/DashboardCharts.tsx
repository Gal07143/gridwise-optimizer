
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { DatePickerWithRange } from '@/components/ui/date-picker-range';
import { DateRange } from 'react-day-picker';
import { ExclamationTriangleIcon } from '@/components/icons';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export type TimeRangeOption = '24h' | '7d' | '30d' | '90d' | 'custom';

export interface ChartProps {
  timeRange: TimeRangeOption;
  date: DateRange | undefined;
  onTimeRangeChange: (range: TimeRangeOption) => void;
  onDateChange: (date: DateRange | undefined) => void;
}

const DashboardCharts: React.FC<ChartProps> = ({
  timeRange,
  date,
  onTimeRangeChange,
  onDateChange
}) => {
  const [energyData, setEnergyData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Prepare parameters
        const params: Record<string, string> = { range: timeRange };
        
        // Add custom date range if selected
        if (timeRange === 'custom' && date?.from) {
          params.from = date.from.toISOString();
          if (date.to) {
            params.to = date.to.toISOString();
          }
        }
        
        const response = await axios.get('/api/dashboard/energy-data', { params });
        setEnergyData(response.data);
      } catch (err) {
        console.error('Error fetching energy data:', err);
        setError('Failed to load energy data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [timeRange, date]);
  
  return (
    <Card className="col-span-1 md:col-span-3">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <CardTitle>Energy Consumption & Production</CardTitle>
        <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
          <ToggleGroup type="single" value={timeRange} onValueChange={(value) => value && onTimeRangeChange(value as TimeRangeOption)}>
            <ToggleGroupItem value="24h" aria-label="Toggle 24 hours view">24h</ToggleGroupItem>
            <ToggleGroupItem value="7d" aria-label="Toggle 7 days view">7d</ToggleGroupItem>
            <ToggleGroupItem value="30d" aria-label="Toggle 30 days view">30d</ToggleGroupItem>
            <ToggleGroupItem value="90d" aria-label="Toggle 90 days view">90d</ToggleGroupItem>
            <ToggleGroupItem value="custom" aria-label="Toggle custom range view">Custom</ToggleGroupItem>
          </ToggleGroup>
          
          {timeRange === 'custom' && (
            <DatePickerWithRange date={date} setDate={onDateChange} />
          )}
        </div>
      </CardHeader>
      <CardContent className="h-[300px] pt-4">
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
        
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <ExclamationTriangleIcon className="h-10 w-10 text-amber-500 mb-2" />
            <h3 className="text-lg font-medium">Failed to load data</h3>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        )}
        
        {!isLoading && !error && energyData.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={energyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.25)" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(value) => new Date(value).toLocaleTimeString()} 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis 
                stroke="#9CA3AF"
                fontSize={12}
                tickFormatter={(value) => `${value} kW`}
              />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="consumption" 
                name="Consumption"
                stroke="#F43F5E" 
                strokeWidth={2}
                activeDot={{ r: 8 }} 
              />
              <Line 
                type="monotone" 
                dataKey="production" 
                name="Production"
                stroke="#10B981" 
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="grid" 
                name="Grid"
                stroke="#6366F1" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
        
        {!isLoading && !error && energyData.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <p className="text-muted-foreground">No data available for the selected time range</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardCharts;
