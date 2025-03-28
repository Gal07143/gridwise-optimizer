
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSite } from '@/contexts/SiteContext';
import { Cloud, CloudRain, CloudSun, Droplets, RefreshCw, SunDim, Sunrise, Sunset, ThermometerSun, Wind } from 'lucide-react';

// Sample weather data generation
const generateWeatherData = (days: number) => {
  return Array.from({ length: days }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    
    // Generate more realistic temperature curve
    const baseTemp = 15 + Math.sin(i * Math.PI / 6) * 7; // Seasonal variation
    const dayTemp = baseTemp + 5 + Math.random() * 3; // Daily high
    const nightTemp = baseTemp - 3 + Math.random() * 2; // Daily low
    
    // Generate solar radiation based on cloud cover
    const cloudCover = Math.random() * 80;
    const solarRadiation = Math.max(0, 1000 - (cloudCover * 8) + Math.random() * 200);
    
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      timestamp: date.getTime(),
      tempHigh: Math.round(dayTemp * 10) / 10,
      tempLow: Math.round(nightTemp * 10) / 10,
      cloudCover: Math.round(cloudCover),
      precipitation: Math.round(Math.random() * 80) / 10,
      windSpeed: Math.round((2 + Math.random() * 15) * 10) / 10,
      solarRadiation: Math.round(solarRadiation),
      humidity: Math.round(50 + Math.random() * 40),
      uvIndex: Math.round(Math.random() * 10),
    };
  });
};

// Generate hourly data for the current day
const generateHourlyData = () => {
  return Array.from({ length: 24 }).map((_, i) => {
    const hour = i;
    const date = new Date();
    date.setHours(hour, 0, 0, 0);
    
    // Temperature curve throughout the day
    const tempBase = 15;
    const tempAmplitude = 8;
    const temp = tempBase + tempAmplitude * Math.sin((hour - 6) * Math.PI / 12);
    
    // Solar radiation curve (only during daylight)
    let solarRadiation = 0;
    if (hour >= 6 && hour <= 18) {
      solarRadiation = 800 * Math.sin((hour - 6) * Math.PI / 12);
      
      // Add some cloud-based variation
      const cloudEffect = hour >= 12 && hour <= 15 ? 0.6 + Math.random() * 0.2 : 0.9 + Math.random() * 0.1;
      solarRadiation *= cloudEffect;
    }
    
    return {
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      hour: `${hour}:00`,
      temperature: Math.round(temp * 10) / 10,
      solarRadiation: Math.round(solarRadiation),
      cloudCover: hour >= 12 && hour <= 15 ? Math.round(70 + Math.random() * 20) : Math.round(10 + Math.random() * 30),
      precipitation: hour >= 14 && hour <= 16 ? Math.round(Math.random() * 2 * 10) / 10 : 0,
      windSpeed: Math.round((3 + Math.random() * 5) * 10) / 10,
      humidity: Math.round(50 + Math.random() * 20),
    };
  });
};

// Generate solar forecast data
const generateSolarForecast = (days: number) => {
  return Array.from({ length: days }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    
    // Base production with some randomness and weather effects
    const baseProduction = 30 + Math.random() * 10;
    const cloudImpact = Math.random() > 0.7 ? 0.5 + Math.random() * 0.3 : 0.9 + Math.random() * 0.1;
    
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      expected: Math.round(baseProduction * cloudImpact * 10) / 10,
      optimal: Math.round(baseProduction * 10) / 10,
      forecastAccuracy: Math.round(80 + Math.random() * 15),
    };
  });
};

const WeatherForecastPage = () => {
  const [dailyData] = useState(generateWeatherData(7));
  const [hourlyData] = useState(generateHourlyData());
  const [solarForecast] = useState(generateSolarForecast(7));
  const [lastUpdated] = useState(new Date());
  const { currentSite } = useSite();
  
  // Get the current weather conditions (first entry of hourly data)
  const currentWeather = hourlyData[new Date().getHours()] || hourlyData[0];
  
  // Get today's weather from daily data
  const todayWeather = dailyData[0];
  
  // Sunrise and sunset times (fixed for demo)
  const sunrise = "06:32 AM";
  const sunset = "19:48 PM";
  
  // Weather condition based on cloud cover
  const getWeatherIcon = (cloudCover: number, precipitation: number) => {
    if (precipitation > 0.5) return <CloudRain size={24} className="text-blue-500" />;
    if (cloudCover > 70) return <Cloud size={24} className="text-gray-500" />;
    if (cloudCover > 30) return <CloudSun size={24} className="text-amber-500" />;
    return <SunDim size={24} className="text-amber-500" />;
  };
  
  return (
    <AppLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Weather Forecast</h1>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              Updated: {lastUpdated.toLocaleTimeString()}
            </span>
            <Button variant="outline" size="sm">
              <RefreshCw size={16} className="mr-1" />
              Refresh
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
          <Card className="p-4 md:col-span-4">
            <div className="flex flex-col items-center justify-center h-full">
              <h3 className="text-lg font-medium mb-2">Current Conditions</h3>
              
              <div className="flex items-center justify-center mb-4">
                {getWeatherIcon(currentWeather.cloudCover, currentWeather.precipitation)}
                <span className="text-4xl font-bold ml-2">{currentWeather.temperature}°C</span>
              </div>
              
              <div className="text-center">
                <p className="text-lg">
                  {currentWeather.cloudCover > 70 ? "Cloudy" : 
                    currentWeather.cloudCover > 30 ? "Partly Cloudy" : "Sunny"}
                </p>
                {currentWeather.precipitation > 0 && (
                  <Badge variant="secondary" className="mt-1">
                    {currentWeather.precipitation} mm of rain
                  </Badge>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4 w-full mt-6">
                <div className="flex items-center">
                  <ThermometerSun size={16} className="mr-2 text-amber-500" />
                  <div>
                    <p className="text-sm font-medium">High/Low</p>
                    <p className="text-sm">{todayWeather.tempHigh}°/{todayWeather.tempLow}°</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Wind size={16} className="mr-2 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Wind</p>
                    <p className="text-sm">{currentWeather.windSpeed} km/h</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Droplets size={16} className="mr-2 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Humidity</p>
                    <p className="text-sm">{currentWeather.humidity}%</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Cloud size={16} className="mr-2 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Cloud Cover</p>
                    <p className="text-sm">{currentWeather.cloudCover}%</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Sunrise size={16} className="mr-2 text-amber-500" />
                  <div>
                    <p className="text-sm font-medium">Sunrise</p>
                    <p className="text-sm">{sunrise}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Sunset size={16} className="mr-2 text-amber-500" />
                  <div>
                    <p className="text-sm font-medium">Sunset</p>
                    <p className="text-sm">{sunset}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 md:col-span-8">
            <h3 className="text-lg font-medium mb-4">Today's Forecast</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hourlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis yAxisId="left" orientation="left" unit="°C" domain={[0, 30]} />
                  <YAxis yAxisId="right" orientation="right" unit=" W/m²" domain={[0, 1000]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="temperature" 
                    stroke="#ff7300" 
                    name="Temperature" 
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="solarRadiation" 
                    stroke="#ffc658" 
                    name="Solar Radiation" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
        
        <Card className="p-4 mb-6">
          <h3 className="text-lg font-medium mb-4">7-Day Forecast</h3>
          <div className="overflow-x-auto">
            <div className="flex space-x-4 min-w-max">
              {dailyData.map((day, i) => (
                <div key={i} className="flex flex-col items-center p-3 rounded-lg bg-card w-32">
                  <p className="font-medium mb-2">{i === 0 ? "Today" : day.date}</p>
                  {getWeatherIcon(day.cloudCover, day.precipitation)}
                  <div className="flex items-center justify-center mt-2">
                    <span className="text-sm font-medium">{day.tempHigh}°</span>
                    <span className="text-sm text-muted-foreground mx-1">/</span>
                    <span className="text-sm text-muted-foreground">{day.tempLow}°</span>
                  </div>
                  <div className="mt-2 text-xs text-center">
                    {day.precipitation > 0 
                      ? `${day.precipitation}mm` 
                      : day.cloudCover > 70 
                        ? "Cloudy" 
                        : "Clear"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-4">Solar Production Forecast</h3>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={solarForecast} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis unit=" kWh" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="expected" fill="#ffc658" name="Expected Production" />
                  <Bar dataKey="optimal" fill="#8884d8" name="Optimal Conditions" fillOpacity={0.4} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                Forecast based on current weather conditions and historical solar production data.
              </p>
            </div>
          </Card>
          
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-4">Weather Impacts</h3>
            <div className="space-y-4">
              <div className="bg-muted p-3 rounded-md">
                <h4 className="text-sm font-medium mb-1">Solar Production Impact</h4>
                <p className="text-sm">
                  Expected 15% reduction in solar production due to cloud cover in the afternoon. Consider adjusting battery charging schedule.
                </p>
              </div>
              
              <div className="bg-muted p-3 rounded-md">
                <h4 className="text-sm font-medium mb-1">HVAC Efficiency</h4>
                <p className="text-sm">
                  Temperature rise to 28°C around 2 PM may increase HVAC demand. Pre-cooling recommended to optimize energy use.
                </p>
              </div>
              
              <div className="bg-muted p-3 rounded-md">
                <h4 className="text-sm font-medium mb-1">Grid Stability</h4>
                <p className="text-sm">
                  Weather conditions are favorable for grid stability. No specific actions needed for backup systems.
                </p>
              </div>
              
              <Button variant="outline" className="w-full mt-2">View Detailed Weather Analysis</Button>
            </div>
          </Card>
        </div>
        
        <Card className="p-4">
          <Tabs defaultValue="hourly">
            <TabsList className="mb-4">
              <TabsTrigger value="hourly">Hourly Details</TabsTrigger>
              <TabsTrigger value="solar">Solar Radiation</TabsTrigger>
              <TabsTrigger value="wind">Wind & Humidity</TabsTrigger>
            </TabsList>
            
            <TabsContent value="hourly">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={hourlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis yAxisId="left" orientation="left" unit="°C" domain={[0, 30]} />
                    <YAxis yAxisId="right" orientation="right" unit="%" domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="temperature" 
                      stroke="#ff7300" 
                      name="Temperature" 
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="cloudCover" 
                      stroke="#8884d8" 
                      name="Cloud Cover" 
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="humidity" 
                      stroke="#82ca9d" 
                      name="Humidity" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="solar">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={hourlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis unit=" W/m²" domain={[0, 1000]} />
                    <Tooltip />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="solarRadiation" 
                      stroke="#ffc658" 
                      fill="#ffc658" 
                      fillOpacity={0.6}
                      name="Solar Radiation" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">
                  Solar radiation peaks at approximately 12:00-14:00. Cloud cover may reduce radiation by 20-40% during this period.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="wind">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={hourlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis yAxisId="left" orientation="left" unit=" km/h" domain={[0, 20]} />
                    <YAxis yAxisId="right" orientation="right" unit="%" domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="windSpeed" 
                      stroke="#8884d8" 
                      name="Wind Speed" 
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="humidity" 
                      stroke="#82ca9d" 
                      name="Humidity" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </AppLayout>
  );
};

export default WeatherForecastPage;
