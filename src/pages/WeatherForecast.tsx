import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { WeatherForecast } from '@/types/energy';
import { fetchWeatherForecast } from '@/services/forecasts/forecastService';
import { useAppStore } from '@/store/appStore';
import { Skeleton } from '@/components/ui/skeleton';
import Clock from '@/components/ui/Clock';
import Sun from '@/components/ui/Sun';

const WeatherForecastPage = () => {
  const [dailyForecast, setDailyForecast] = useState<any[]>([]);
  const [hourlyForecast, setHourlyForecast] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentSite } = useAppStore();
  
  useEffect(() => {
    const loadForecast = async () => {
      if (!currentSite?.id) {
        return;
      }
      
      setLoading(true);
      try {
        const forecastData = await fetchWeatherForecast(currentSite.id);
        
        // Process daily forecast
        const daily = forecastData.reduce((acc: any, item: WeatherForecast) => {
          const day = new Date(item.timestamp).toLocaleDateString(undefined, { weekday: 'short' });
          const existing = acc.find((x: any) => x.day === day);
          
          if (existing) {
            existing.high = Math.max(existing.high, item.temperature);
            existing.low = Math.min(existing.low, item.temperature);
          } else {
            acc.push({ day, high: item.temperature, low: item.temperature });
          }
          return acc;
        }, []);
        
        setDailyForecast(daily);
        
        // Process hourly forecast
        const hourly = forecastData.map((item: WeatherForecast) => ({
          time: new Date(item.timestamp).toLocaleTimeString(undefined, { hour: 'numeric' }),
          irradiance: item.solar_irradiance
        }));
        
        setHourlyForecast(hourly);
      } catch (error) {
        console.error("Error fetching weather forecast:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadForecast();
  }, [currentSite]);
  
  if (!currentSite) {
    return (
      <AppLayout>
        <div className="container mx-auto p-4">
          <p className="text-red-500">No site selected. Please select a site to view weather forecast.</p>
        </div>
      </AppLayout>
    );
  }
  
  return (
    <AppLayout>
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Weather Forecast for {currentSite.name}</h1>
          <div className="flex items-center gap-4">
            <Clock className="text-lg" />
            <Sun className="h-6 w-6" />
          </div>
        </div>
        
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Temperature Forecast (7 Day)</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <Skeleton className="w-full h-full" />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Solar Irradiance Forecast</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <Skeleton className="w-full h-full" />
              </CardContent>
            </Card>
          </div>
        )}
        
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Temperature Forecast (7 Day)</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={dailyForecast}
                    margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis 
                      dataKey="day" 
                      tick={{ fill: '#888' }}
                      axisLine={{ stroke: '#ccc' }}
                    />
                    <YAxis 
                      tick={{ fill: '#888' }}
                      axisLine={{ stroke: '#ccc' }}
                      unit="°C"
                    />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="high"
                      stackId="1"
                      stroke="#ff7300"
                      fill="#ff7300"
                      name="High Temp"
                    />
                    <Area
                      type="monotone"
                      dataKey="low"
                      stackId="1"
                      stroke="#387908"
                      fill="#387908"
                      name="Low Temp"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Solar Irradiance Forecast</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={hourlyForecast}
                    margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis 
                      dataKey="time" 
                      tick={{ fill: '#888' }}
                      axisLine={{ stroke: '#ccc' }}
                    />
                    <YAxis 
                      tick={{ fill: '#888' }}
                      axisLine={{ stroke: '#ccc' }}
                      unit=" W/m²"
                    />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="irradiance"
                      stroke="#8884d8"
                      fill="#8884d8"
                      name="Solar Irradiance"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default WeatherForecastPage;
