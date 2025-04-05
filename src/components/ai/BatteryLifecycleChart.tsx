// components/ai/BatteryLifecycleChart.tsx
import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import axios from 'axios';
import { Skeleton } from '@/components/ui/skeleton';
import { Battery } from 'lucide-react';

interface HealthData {
  timestamp: string;
  health: number;
  cycles?: number;
  temperature?: number;
}

const BatteryLifecycleChart = () => {
  const [data, setData] = useState<HealthData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get('/api/battery/health');
        setData(res.data.history || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching battery health data:', err);
        setError('Failed to load battery health data');
        
        // Use fallback data
        const fallbackData: HealthData[] = Array.from({ length: 12 }, (_, i) => {
          const month = new Date(2023, i).toLocaleString('default', { month: 'short' });
          return {
            timestamp: month,
            health: 100 - (i * 0.5), // Slight degradation over time
            cycles: i * 30,
            temperature: 25 + Math.random() * 5
          };
        });
        setData(fallbackData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCurrentHealth = () => {
    if (data.length === 0) return 'N/A';
    const latest = data[data.length - 1];
    return `${latest.health.toFixed(1)}%`;
  };

  const formatTooltip = (value: number, name: string) => {
    if (name === 'health') return [`${value.toFixed(1)}%`, 'Health'];
    if (name === 'cycles') return [value.toString(), 'Cycles'];
    if (name === 'temperature') return [`${value.toFixed(1)}°C`, 'Temp'];
    return [value.toString(), name];
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <Battery className="h-5 w-5 mr-2 text-blue-500" />
          Battery Lifecycle
          {!isLoading && !error && (
            <span className="ml-auto text-sm font-normal text-muted-foreground">
              Current Health: <span className="text-blue-500 font-medium">{getCurrentHealth()}</span>
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : error ? (
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">{error}</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data} margin={{ top: 10, right: 30, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis 
                yAxisId="health" 
                domain={[60, 100]} 
                label={{ value: 'Health (%)', angle: -90, position: 'insideLeft' }} 
              />
              {data[0]?.cycles && (
                <YAxis 
                  yAxisId="cycles" 
                  orientation="right"
                  label={{ value: 'Cycles', angle: 90, position: 'insideRight' }} 
                />
              )}
              <Tooltip formatter={formatTooltip} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="health" 
                stroke="#3b82f6" 
                strokeWidth={2} 
                yAxisId="health"
                activeDot={{ r: 8 }} 
              />
              {data[0]?.cycles && (
                <Line 
                  type="monotone" 
                  dataKey="cycles" 
                  stroke="#f97316" 
                  strokeWidth={2} 
                  yAxisId="cycles" 
                  dot={{ r: 3 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default BatteryLifecycleChart;
