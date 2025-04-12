
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { fetchForecasts } from '@/services/forecasts/forecastService';
import { ForecastMetrics, ProcessedForecastData } from '@/types/energy';
import ForecastMetricsPanel from '../forecasts/ForecastMetricsPanel';
import { Skeleton } from '@/components/ui/skeleton';

// Process the forecast data for visualization
const processForecasts = (data: any[]): ProcessedForecastData[] => {
  if (!data || !Array.isArray(data)) return [];
  
  return data.map(item => ({
    timestamp: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    production: item.generation_forecast || 0,
    consumption: item.consumption_forecast || 0,
    balance: (item.generation_forecast || 0) - (item.consumption_forecast || 0)
  }));
};

// Calculate metrics from forecast data
const calculateMetrics = (data: any[]): ForecastMetrics => {
  if (!data || !data.length) {
    return {
      totalGeneration: 0,
      totalConsumption: 0,
      netEnergy: 0,
      peakGeneration: 0,
      peakConsumption: 0,
      selfConsumptionRate: 0,
      confidence: 0
    };
  }

  const totalGeneration = data.reduce((sum, item) => sum + (item.generation_forecast || 0), 0);
  const totalConsumption = data.reduce((sum, item) => sum + (item.consumption_forecast || 0), 0);
  const peakGeneration = Math.max(...data.map(item => item.generation_forecast || 0));
  const peakConsumption = Math.max(...data.map(item => item.consumption_forecast || 0));
  
  // Calculate self-consumption rate (percentage of generated energy directly consumed)
  const selfConsumption = data.reduce((sum, item) => {
    const gen = item.generation_forecast || 0;
    const con = item.consumption_forecast || 0;
    return sum + Math.min(gen, con);
  }, 0);
  
  const selfConsumptionRate = totalGeneration > 0 ? (selfConsumption / totalGeneration) * 100 : 0;

  return {
    totalGeneration,
    totalConsumption,
    netEnergy: totalGeneration - totalConsumption,
    peakGeneration,
    peakConsumption,
    selfConsumptionRate,
    confidence: 85 // Sample confidence level
  };
};

const ForecastTab: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'24h' | '48h' | '7d'>('24h');
  
  const { data: forecastData, isLoading: isForecastLoading } = useQuery({
    queryKey: ['forecasts', timeframe],
    queryFn: () => fetchForecasts(timeframe),
  });
  
  const { data: weatherData, isLoading: isWeatherLoading } = useQuery({
    queryKey: ['weather', timeframe],
    queryFn: () => fetchForecasts(timeframe), // In a real app, this would be a separate API call
  });
  
  const processedData = forecastData ? processForecasts(forecastData) : [];
  const metrics = forecastData ? calculateMetrics(forecastData) : {
    totalGeneration: 0,
    totalConsumption: 0,
    netEnergy: 0,
    peakGeneration: 0,
    peakConsumption: 0,
    selfConsumptionRate: 0
  };
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="energy" className="w-full">
        <TabsList>
          <TabsTrigger value="energy">Energy Forecast</TabsTrigger>
          <TabsTrigger value="weather">Weather Forecast</TabsTrigger>
        </TabsList>
        
        <TabsContent value="energy" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Energy Production & Consumption</h3>
            <div className="flex space-x-2">
              <button 
                className={`px-3 py-1 text-xs ${timeframe === '24h' ? 'bg-primary text-white' : 'bg-secondary'} rounded-md`}
                onClick={() => setTimeframe('24h')}
              >
                24h
              </button>
              <button 
                className={`px-3 py-1 text-xs ${timeframe === '48h' ? 'bg-primary text-white' : 'bg-secondary'} rounded-md`}
                onClick={() => setTimeframe('48h')}
              >
                48h
              </button>
              <button 
                className={`px-3 py-1 text-xs ${timeframe === '7d' ? 'bg-primary text-white' : 'bg-secondary'} rounded-md`}
                onClick={() => setTimeframe('7d')}
              >
                7d
              </button>
            </div>
          </div>
          
          {isForecastLoading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={processedData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="timestamp" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="production" stroke="#8884d8" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="consumption" stroke="#82ca9d" />
                      <Line type="monotone" dataKey="balance" stroke="#ffc658" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
          
          <ForecastMetricsPanel metrics={metrics} isLoading={isForecastLoading} />
        </TabsContent>
        
        <TabsContent value="weather" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weather Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              {isWeatherLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Weather forecast visualization will be displayed here.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ForecastTab;
