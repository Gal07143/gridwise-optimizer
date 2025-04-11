
import React, { useState, useEffect } from 'react';
import { Main } from '@/components/ui/main';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppStore } from '@/store/appStore';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Cloud, Droplets, Sun, Wind, CloudRain, CloudSnow, CloudLightning, ThermometerSun } from 'lucide-react';
import { fetchWeatherForecast } from '@/services/weatherService';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Type for weather data
interface WeatherData {
  timestamp: string;
  temperature: number;
  humidity: number;
  wind_speed: number;
  condition: string;
  precipitation: number;
  cloud_cover: number;
  solar_irradiance: number;
}

const WeatherForecast = () => {
  const { currentSite } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('temperature');
  const [range, setRange] = useState('24h');
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  
  useEffect(() => {
    const loadWeatherData = async () => {
      try {
        setLoading(true);
        // In a real app, this would fetch from your backend API with currentSite.id
        const data = await fetchWeatherForecast(currentSite?.id);
        setWeatherData(data);
      } catch (error) {
        console.error('Failed to load weather forecast:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadWeatherData();
  }, [currentSite, range]);
  
  const getWeatherIcon = (condition: string) => {
    switch (condition?.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return <Sun className="h-8 w-8 text-yellow-500" />;
      case 'cloudy':
      case 'partly cloudy':
        return <Cloud className="h-8 w-8 text-gray-500" />;
      case 'rain':
      case 'showers':
        return <CloudRain className="h-8 w-8 text-blue-500" />;
      case 'snow':
        return <CloudSnow className="h-8 w-8 text-blue-200" />;
      case 'thunderstorm':
        return <CloudLightning className="h-8 w-8 text-purple-500" />;
      default:
        return <Sun className="h-8 w-8 text-yellow-500" />;
    }
  };

  const currentWeather = weatherData.length > 0 ? weatherData[0] : null;
  
  return (
    <Main title="Weather Forecast">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Weather Forecast</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Weather conditions and solar generation forecast
          </p>
        </div>
        <Select value={range} onValueChange={setRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">24 Hours</SelectItem>
            <SelectItem value="48h">48 Hours</SelectItem>
            <SelectItem value="7d">7 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center h-80">
          <LoadingSpinner size="lg" text="Loading weather forecast..." />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Current Weather Card */}
          <Card className="md:col-span-4 lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Current Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              {currentWeather ? (
                <div className="flex flex-col items-center p-4">
                  <div className="mb-4">
                    {getWeatherIcon(currentWeather.condition)}
                  </div>
                  <div className="text-3xl font-bold mb-2">
                    {Math.round(currentWeather.temperature)}°C
                  </div>
                  <div className="text-lg capitalize mb-4">
                    {currentWeather.condition}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <div className="flex items-center">
                      <Wind className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{currentWeather.wind_speed} m/s</span>
                    </div>
                    <div className="flex items-center">
                      <Droplets className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{currentWeather.humidity}%</span>
                    </div>
                    <div className="flex items-center">
                      <CloudRain className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{currentWeather.precipitation} mm</span>
                    </div>
                    <div className="flex items-center">
                      <Cloud className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{currentWeather.cloud_cover}%</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center p-6">
                  <p>No current weather data available</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Next 24 Hours Preview */}
          <div className="md:col-span-4 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {weatherData.slice(1, 5).map((item, index) => (
              <Card key={index}>
                <CardContent className="p-4 flex flex-col items-center">
                  <div className="text-sm text-muted-foreground mb-2">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  {getWeatherIcon(item.condition)}
                  <div className="text-lg font-semibold mt-2">
                    {Math.round(item.temperature)}°C
                  </div>
                  <div className="text-xs capitalize mt-1">
                    {item.condition}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      <Card>
        <CardHeader className="pb-2">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="temperature">
                <ThermometerSun className="mr-2 h-4 w-4" />
                Temperature
              </TabsTrigger>
              <TabsTrigger value="precipitation">
                <CloudRain className="mr-2 h-4 w-4" />
                Precipitation
              </TabsTrigger>
              <TabsTrigger value="solar">
                <Sun className="mr-2 h-4 w-4" />
                Solar
              </TabsTrigger>
              <TabsTrigger value="wind">
                <Wind className="mr-2 h-4 w-4" />
                Wind
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="p-4">
          <div className="h-80">
            <TabsContent value="temperature" className="h-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={weatherData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                >
                  <defs>
                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff7c43" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#ff7c43" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={(time) => new Date(time).toLocaleTimeString([], { hour: '2-digit' })}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [`${value}°C`, 'Temperature']}
                    labelFormatter={(time) => new Date(time).toLocaleString()}
                  />
                  <Area
                    type="monotone"
                    dataKey="temperature"
                    stroke="#ff7c43"
                    fillOpacity={1}
                    fill="url(#colorTemp)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="precipitation" className="h-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={weatherData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                >
                  <defs>
                    <linearGradient id="colorPrecip" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={(time) => new Date(time).toLocaleTimeString([], { hour: '2-digit' })}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [`${value} mm`, 'Precipitation']}
                    labelFormatter={(time) => new Date(time).toLocaleString()}
                  />
                  <Area
                    type="monotone"
                    dataKey="precipitation"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorPrecip)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="solar" className="h-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={weatherData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                >
                  <defs>
                    <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={(time) => new Date(time).toLocaleTimeString([], { hour: '2-digit' })}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [`${value} W/m²`, 'Solar Irradiance']}
                    labelFormatter={(time) => new Date(time).toLocaleString()}
                  />
                  <Area
                    type="monotone"
                    dataKey="solar_irradiance"
                    stroke="#f59e0b"
                    fillOpacity={1}
                    fill="url(#colorSolar)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="wind" className="h-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={weatherData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                >
                  <defs>
                    <linearGradient id="colorWind" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={(time) => new Date(time).toLocaleTimeString([], { hour: '2-digit' })}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [`${value} m/s`, 'Wind Speed']}
                    labelFormatter={(time) => new Date(time).toLocaleString()}
                  />
                  <Area
                    type="monotone"
                    dataKey="wind_speed"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#colorWind)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>
          </div>
        </CardContent>
      </Card>
    </Main>
  );
};

export default WeatherForecast;
