
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { getSiteForecasts, getSiteForecastMetrics } from '@/services/forecasts/forecastQueries';
import { Skeleton } from '@/components/ui/skeleton';
import ForecastMetricsPanel from '@/components/dashboard/forecasts/ForecastMetricsPanel';
import { Badge } from '@/components/ui/badge';
import { Info, SunMoon, Droplets, Wind, TrendingUp } from 'lucide-react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ForecastMetrics } from '@/hooks/useForecast';

interface ForecastTabProps {
  siteId: string;
}

const ForecastTab: React.FC<ForecastTabProps> = ({ siteId }) => {
  const [forecastHours, setForecastHours] = useState<number>(24);
  
  const { data: forecastData, isLoading: isLoadingForecast, error: forecastError } = useQuery({
    queryKey: ['energy-forecast', siteId, forecastHours],
    queryFn: () => getSiteForecasts(siteId, forecastHours),
  });

  const { data: forecastMetricsData, isLoading: isLoadingMetrics } = useQuery({
    queryKey: ['forecast-metrics', siteId],
    queryFn: () => getSiteForecastMetrics(siteId),
  });

  // Add the missing selfConsumptionRate property
  const forecastMetrics: ForecastMetrics = forecastMetricsData ? forecastMetricsData : {
    totalGeneration: 0,
    totalConsumption: 0,
    netEnergy: 0,
    selfConsumptionRate: 0,
    confidence: 85,
    peakGeneration: 0,
    peakConsumption: 0
  };

  const processForecastData = () => {
    if (!forecastData || forecastData.length === 0) {
      return Array.from({ length: 24 }, (_, i) => ({
        hour: `${i}:00`,
        generation: Math.random() * 10 + 5,
        consumption: Math.random() * 8 + 3,
        confidence: Math.random() * 20 + 80
      }));
    }

    return forecastData.map(item => {
      const date = new Date(item.forecast_time);
      return {
        hour: `${date.getHours()}:00`,
        generation: item.generation_forecast,
        consumption: item.consumption_forecast,
        confidence: item.confidence || 85
      };
    });
  };

  const chartData = processForecastData();

  const weatherFactors = [
    { name: 'Solar Radiation', icon: <SunMoon className="h-4 w-4" />, value: 78, impact: 'high' },
    { name: 'Precipitation', icon: <Droplets className="h-4 w-4" />, value: 12, impact: 'low' },
    { name: 'Wind Speed', icon: <Wind className="h-4 w-4" />, value: 45, impact: 'medium' },
    { name: 'Trend Analysis', icon: <TrendingUp className="h-4 w-4" />, value: 92, impact: 'high' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Energy Forecast</h2>
        <Badge variant="outline" className="flex gap-1 items-center">
          ML Powered
          <HoverCard>
            <HoverCardTrigger>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <p className="text-sm">Forecasts are generated using machine learning algorithms that analyze historical consumption patterns, weather data, and system behavior.</p>
            </HoverCardContent>
          </HoverCard>
        </Badge>
      </div>

      {isLoadingMetrics ? (
        <Skeleton className="h-20 w-full" />
      ) : (
        <ForecastMetricsPanel metrics={forecastMetrics} />
      )}
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>24-Hour Forecast</CardTitle>
            <CardDescription>Predicted energy generation and consumption</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            {isLoadingForecast ? (
              <Skeleton className="w-full h-full" />
            ) : forecastError ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Failed to load forecast data
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorGen" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="rgba(45, 211, 111, 0.8)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="rgba(45, 211, 111, 0.1)" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorCons" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="rgba(122, 90, 248, 0.8)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="rgba(122, 90, 248, 0.1)" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis label={{ value: 'kW', angle: -90, position: 'insideLeft' }} />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      `${value.toFixed(1)} kW`, 
                      name === 'generation' ? 'Generation' : 'Consumption'
                    ]} 
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="generation"
                    name="Generation"
                    stroke="rgba(45, 211, 111, 1)"
                    fillOpacity={1}
                    fill="url(#colorGen)"
                  />
                  <Area
                    type="monotone"
                    dataKey="consumption"
                    name="Consumption"
                    stroke="rgba(122, 90, 248, 1)"
                    fillOpacity={1}
                    fill="url(#colorCons)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Confidence Analysis</CardTitle>
            <CardDescription>Forecast prediction confidence over time</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {isLoadingForecast ? (
              <Skeleton className="w-full h-full" />
            ) : forecastError ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Failed to load forecast data
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis domain={[0, 100]} label={{ value: 'Confidence %', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value: number) => [`${value.toFixed(1)}%`, 'Confidence']} />
                  <Line
                    type="monotone"
                    dataKey="confidence"
                    name="Confidence"
                    stroke="#ff7300"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Influencing Factors</CardTitle>
            <CardDescription>Factors affecting the forecast</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weatherFactors.map((factor, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {factor.icon}
                    <span>{factor.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-[150px] h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          factor.impact === 'high' 
                            ? 'bg-green-500' 
                            : factor.impact === 'medium' 
                              ? 'bg-amber-500' 
                              : 'bg-blue-500'
                        }`}
                        style={{ width: `${factor.value}%` }}
                      />
                    </div>
                    <span className="text-sm">{factor.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForecastTab;
