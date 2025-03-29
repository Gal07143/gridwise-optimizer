
import React, { useState } from 'react';
import { Main } from '@/components/ui/main';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';
import { Cloud, Sun, Droplets, Wind, CalendarDays, CloudRain, CloudSun, CloudLightning, CloudSnow } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useSiteContext } from '@/contexts/SiteContext';

// Mock weather data
const dailyForecast = [
  { 
    time: '00:00', 
    temp: 12, 
    condition: 'Clear',
    icon: <Cloud className="h-5 w-5 text-blue-500" />,
    precipitation: 0, 
    humidity: 65, 
    windSpeed: 5, 
    cloudCover: 10, 
    solarIrradiance: 0,
    production: 0
  },
  { 
    time: '03:00', 
    temp: 10, 
    condition: 'Clear',
    icon: <Cloud className="h-5 w-5 text-blue-500" />,
    precipitation: 0, 
    humidity: 70, 
    windSpeed: 4, 
    cloudCover: 10, 
    solarIrradiance: 0,
    production: 0
  },
  { 
    time: '06:00', 
    temp: 11, 
    condition: 'Partly Cloudy',
    icon: <CloudSun className="h-5 w-5 text-amber-500" />,
    precipitation: 0, 
    humidity: 75, 
    windSpeed: 6, 
    cloudCover: 30, 
    solarIrradiance: 50,
    production: 0.5
  },
  { 
    time: '09:00', 
    temp: 15, 
    condition: 'Sunny',
    icon: <Sun className="h-5 w-5 text-amber-500" />,
    precipitation: 0, 
    humidity: 65, 
    windSpeed: 8, 
    cloudCover: 10, 
    solarIrradiance: 400,
    production: 3.2
  },
  { 
    time: '12:00', 
    temp: 18, 
    condition: 'Sunny',
    icon: <Sun className="h-5 w-5 text-amber-500" />,
    precipitation: 0, 
    humidity: 55, 
    windSpeed: 10, 
    cloudCover: 5, 
    solarIrradiance: 850,
    production: 6.8
  },
  { 
    time: '15:00', 
    temp: 19, 
    condition: 'Partly Cloudy',
    icon: <CloudSun className="h-5 w-5 text-amber-500" />,
    precipitation: 0, 
    humidity: 50, 
    windSpeed: 12, 
    cloudCover: 25, 
    solarIrradiance: 600,
    production: 4.8
  },
  { 
    time: '18:00', 
    temp: 17, 
    condition: 'Cloudy',
    icon: <Cloud className="h-5 w-5 text-blue-500" />,
    precipitation: 5, 
    humidity: 60, 
    windSpeed: 10, 
    cloudCover: 60, 
    solarIrradiance: 150,
    production: 1.2
  },
  { 
    time: '21:00', 
    temp: 14, 
    condition: 'Light Rain',
    icon: <CloudRain className="h-5 w-5 text-blue-500" />,
    precipitation: 25, 
    humidity: 75, 
    windSpeed: 8, 
    cloudCover: 90, 
    solarIrradiance: 0,
    production: 0
  },
];

const weeklyForecast = [
  { 
    day: 'Mon', 
    highTemp: 19, 
    lowTemp: 10, 
    condition: 'Sunny',
    icon: <Sun className="h-5 w-5 text-amber-500" />,
    precipitation: 0, 
    solarIrradiance: 650,
    production: 42.5,
    windSpeed: 8 
  },
  { 
    day: 'Tue', 
    highTemp: 20, 
    lowTemp: 12, 
    condition: 'Partly Cloudy',
    icon: <CloudSun className="h-5 w-5 text-amber-500" />,
    precipitation: 10, 
    solarIrradiance: 580,
    production: 38.2,
    windSpeed: 10 
  },
  { 
    day: 'Wed', 
    highTemp: 16, 
    lowTemp: 11, 
    condition: 'Rain',
    icon: <CloudRain className="h-5 w-5 text-blue-500" />,
    precipitation: 70, 
    solarIrradiance: 250,
    production: 16.4,
    windSpeed: 15 
  },
  { 
    day: 'Thu', 
    highTemp: 15, 
    lowTemp: 9, 
    condition: 'Thunderstorms',
    icon: <CloudLightning className="h-5 w-5 text-purple-500" />,
    precipitation: 80, 
    solarIrradiance: 150,
    production: 9.8,
    windSpeed: 20 
  },
  { 
    day: 'Fri', 
    highTemp: 14, 
    lowTemp: 7, 
    condition: 'Light Rain',
    icon: <CloudRain className="h-5 w-5 text-blue-500" />,
    precipitation: 40, 
    solarIrradiance: 350,
    production: 23.1,
    windSpeed: 12 
  },
  { 
    day: 'Sat', 
    highTemp: 16, 
    lowTemp: 8, 
    condition: 'Partly Cloudy',
    icon: <CloudSun className="h-5 w-5 text-amber-500" />,
    precipitation: 20, 
    solarIrradiance: 480,
    production: 31.5,
    windSpeed: 8 
  },
  { 
    day: 'Sun', 
    highTemp: 18, 
    lowTemp: 10, 
    condition: 'Sunny',
    icon: <Sun className="h-5 w-5 text-amber-500" />,
    precipitation: 0, 
    solarIrradiance: 620,
    production: 40.8,
    windSpeed: 5 
  },
];

const WeatherForecast: React.FC = () => {
  const { activeSite } = useSiteContext();
  const [timeframe, setTimeframe] = useState<'today' | 'week'>('today');
  
  return (
    <Main containerSize="default" className="max-w-[1600px] mx-auto pt-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Weather Forecast</h1>
          <p className="text-muted-foreground">
            {activeSite ? `Weather forecast for ${activeSite.name}` : 'Select a site to view weather data'}
          </p>
        </div>
        <Tabs value={timeframe} onValueChange={(value) => setTimeframe(value as 'today' | 'week')}>
          <TabsList>
            <TabsTrigger value="today" className="flex items-center">
              <CalendarDays className="h-4 w-4 mr-2" />
              Today
            </TabsTrigger>
            <TabsTrigger value="week" className="flex items-center">
              <CalendarDays className="h-4 w-4 mr-2" />
              Week
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Sun className="h-5 w-5 mr-2 text-amber-500" />
              Solar Conditions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="text-5xl font-thin mb-4">
                {dailyForecast[4].temp}°C
              </div>
              <div className="flex items-center mb-1">
                {dailyForecast[4].icon}
                <span className="text-sm ml-2">{dailyForecast[4].condition}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                H: {Math.max(...dailyForecast.map(d => d.temp))}° L: {Math.min(...dailyForecast.map(d => d.temp))}°
              </div>
              <div className="w-full mt-4 pt-4 border-t grid grid-cols-2 gap-2 text-center">
                <div>
                  <div className="flex items-center justify-center">
                    <Droplets className="h-4 w-4 text-blue-500 mr-1" />
                    <span className="text-sm">{dailyForecast[4].humidity}%</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Humidity</div>
                </div>
                <div>
                  <div className="flex items-center justify-center">
                    <Wind className="h-4 w-4 text-blue-500 mr-1" />
                    <span className="text-sm">{dailyForecast[4].windSpeed} km/h</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Wind</div>
                </div>
                <div>
                  <div className="flex items-center justify-center">
                    <Cloud className="h-4 w-4 text-blue-500 mr-1" />
                    <span className="text-sm">{dailyForecast[4].cloudCover}%</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Cloud Cover</div>
                </div>
                <div>
                  <div className="flex items-center justify-center">
                    <CloudRain className="h-4 w-4 text-blue-500 mr-1" />
                    <span className="text-sm">{dailyForecast[4].precipitation}%</span>
                  </div>
                  <div className="text-xs text-muted-foreground">Precipitation</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Sun className="h-5 w-5 mr-2 text-amber-500" />
              Solar Irradiance Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeframe === 'today' ? dailyForecast : weeklyForecast}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey={timeframe === 'today' ? 'time' : 'day'} />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="solarIrradiance" name="Solar Irradiance (W/m²)" stroke="#f59e0b" strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="production" name="Estimated Production (kWh)" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Cloud className="h-5 w-5 mr-2 text-blue-500" />
              Cloud Cover & Precipitation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeframe === 'today' ? dailyForecast : weeklyForecast}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey={timeframe === 'today' ? 'time' : 'day'} />
                  <YAxis yAxisId="left" orientation="left" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="cloudCover" name="Cloud Cover (%)" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="left" dataKey="precipitation" name="Precipitation (%)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Wind className="h-5 w-5 mr-2 text-blue-500" />
              Temperature & Wind
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeframe === 'today' ? dailyForecast : weeklyForecast}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey={timeframe === 'today' ? 'time' : 'day'} />
                  <YAxis yAxisId="left" orientation="left" domain={[0, 30]} />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 25]} />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey={timeframe === 'today' ? 'temp' : 'highTemp'} name="Temperature (°C)" stroke="#ef4444" strokeWidth={2} />
                  {timeframe === 'week' && (
                    <Line yAxisId="left" type="monotone" dataKey="lowTemp" name="Min Temp (°C)" stroke="#9ca3af" strokeWidth={2} />
                  )}
                  <Line yAxisId="right" type="monotone" dataKey="windSpeed" name="Wind Speed (km/h)" stroke="#6366f1" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Sun className="h-5 w-5 mr-2 text-amber-500" />
              {timeframe === 'today' ? 'Today\'s Hourly Forecast' : '7-Day Forecast'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
              {(timeframe === 'today' ? dailyForecast : weeklyForecast).map((item, index) => (
                <div key={index} className="flex flex-col items-center p-3 border rounded-lg">
                  <div className="text-sm font-medium mb-1">{timeframe === 'today' ? item.time : item.day}</div>
                  <div className="my-2">
                    {item.icon}
                  </div>
                  <div className="text-sm font-medium">
                    {timeframe === 'today' ? `${item.temp}°C` : `${item.highTemp}°/${item.lowTemp}°`}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{item.condition}</div>
                  <div className="text-xs text-blue-600 mt-2">
                    {timeframe === 'today' 
                      ? `${item.production.toFixed(1)} kWh` 
                      : `${item.production.toFixed(1)} kWh`}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6 flex justify-end">
        <Button variant="outline" className="flex items-center">
          <CalendarDays className="h-4 w-4 mr-2" />
          View Historical Weather
        </Button>
      </div>
    </Main>
  );
};

export default WeatherForecast;
