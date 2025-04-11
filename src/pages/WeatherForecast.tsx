
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Cloud, CloudRain, Sun, Wind, Thermometer, Droplets, Cloudy, CloudSun, CloudLightning, CloudSnow } from 'lucide-react';
import { WeatherForecast as WeatherForecastType } from '@/types/weather';
import Clock from '@/components/ui/Clock';

// Mock data for weather forecast
const mockWeatherData = [
  { time: '00:00', temperature: 15, condition: 'clear', humidity: 65, wind: 8, precipitation: 0, solar: 0 },
  { time: '03:00', temperature: 14, condition: 'clear', humidity: 70, wind: 7, precipitation: 0, solar: 0 },
  { time: '06:00', temperature: 13, condition: 'partly-cloudy', humidity: 75, wind: 5, precipitation: 0, solar: 100 },
  { time: '09:00', temperature: 17, condition: 'partly-cloudy', humidity: 60, wind: 8, precipitation: 0, solar: 400 },
  { time: '12:00', temperature: 21, condition: 'sunny', humidity: 45, wind: 12, precipitation: 0, solar: 800 },
  { time: '15:00', temperature: 23, condition: 'sunny', humidity: 40, wind: 10, precipitation: 0, solar: 600 },
  { time: '18:00', temperature: 19, condition: 'cloudy', humidity: 55, wind: 7, precipitation: 10, solar: 200 },
  { time: '21:00', temperature: 16, condition: 'rain', humidity: 80, wind: 15, precipitation: 30, solar: 0 },
];

// Days for the week forecast
const forecastDays = [
  { day: 'Monday', high: 23, low: 14, condition: 'sunny', precipitation: 0 },
  { day: 'Tuesday', high: 22, low: 13, condition: 'partly-cloudy', precipitation: 0 },
  { day: 'Wednesday', high: 19, low: 12, condition: 'rain', precipitation: 70 },
  { day: 'Thursday', high: 17, low: 11, condition: 'rain', precipitation: 90 },
  { day: 'Friday', high: 18, low: 12, condition: 'cloudy', precipitation: 20 },
  { day: 'Saturday', high: 20, low: 14, condition: 'partly-cloudy', precipitation: 10 },
  { day: 'Sunday', high: 22, low: 15, condition: 'sunny', precipitation: 0 },
];

const getWeatherIcon = (condition: string) => {
  switch (condition) {
    case 'sunny': return <Sun className="h-8 w-8 text-yellow-500" />;
    case 'clear': return <Sun className="h-8 w-8 text-yellow-500" />;
    case 'partly-cloudy': return <CloudSun className="h-8 w-8 text-blue-400" />;
    case 'cloudy': return <Cloud className="h-8 w-8 text-gray-400" />;
    case 'rain': return <CloudRain className="h-8 w-8 text-blue-600" />;
    case 'thunderstorm': return <CloudLightning className="h-8 w-8 text-purple-600" />;
    case 'snow': return <CloudSnow className="h-8 w-8 text-blue-300" />;
    default: return <Cloudy className="h-8 w-8 text-gray-400" />;
  }
};

const WeatherForecast = () => {
  const [location, setLocation] = useState('main-site');
  const [activeTab, setActiveTab] = useState('today');
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <AppLayout>
      <div className="container mx-auto p-4 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">Weather Forecast</h1>
            <p className="text-muted-foreground">Solar generation and weather conditions forecast</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center">
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="main-site">Main Site</SelectItem>
                <SelectItem value="remote-site-1">Remote Site 1</SelectItem>
                <SelectItem value="remote-site-2">Remote Site 2</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-md">
              <Clock showSeconds={false} className="text-sm" />
            </div>
          </div>
        </div>
        
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Today's Weather</CardTitle>
            <CardDescription>Forecast for {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 p-6 border-b">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex items-center gap-4">
                  {getWeatherIcon('sunny')}
                  <div>
                    <div className="text-4xl font-bold">21°C</div>
                    <div className="text-sm text-muted-foreground">Feels like 23°C</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Wind className="h-5 w-5 text-slate-500" />
                    <div>
                      <div className="text-sm font-medium">Wind</div>
                      <div>12 km/h</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets className="h-5 w-5 text-slate-500" />
                    <div>
                      <div className="text-sm font-medium">Humidity</div>
                      <div>45%</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CloudRain className="h-5 w-5 text-slate-500" />
                    <div>
                      <div className="text-sm font-medium">Precipitation</div>
                      <div>0%</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sun className="h-5 w-5 text-slate-500" />
                    <div>
                      <div className="text-sm font-medium">UV Index</div>
                      <div>8 - High</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <Tabs defaultValue="temperature" className="p-6">
              <TabsList>
                <TabsTrigger value="temperature">Temperature</TabsTrigger>
                <TabsTrigger value="solar">Solar Irradiance</TabsTrigger>
                <TabsTrigger value="precipitation">Precipitation</TabsTrigger>
              </TabsList>
              <TabsContent value="temperature" className="pt-4">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockWeatherData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis unit="°C" domain={['dataMin - 2', 'dataMax + 2']} />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="temperature" 
                        stroke="#ff7300" 
                        name="Temperature (°C)"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              <TabsContent value="solar" className="pt-4">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockWeatherData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis unit="W/m²" domain={[0, 'dataMax + 100']} />
                      <Tooltip />
                      <Legend />
                      <defs>
                        <linearGradient id="solarGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FFD700" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#FFD700" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Area 
                        type="monotone" 
                        dataKey="solar" 
                        stroke="#FFD700" 
                        fillOpacity={1}
                        fill="url(#solarGradient)"
                        name="Solar Irradiance (W/m²)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              <TabsContent value="precipitation" className="pt-4">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockWeatherData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis unit="%" domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <defs>
                        <linearGradient id="precipGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4F6BED" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#4F6BED" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Area 
                        type="monotone" 
                        dataKey="precipitation" 
                        stroke="#4F6BED" 
                        fillOpacity={1}
                        fill="url(#precipGradient)"
                        name="Precipitation Probability (%)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
          {forecastDays.map((day, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 text-center border-b">
                <p className="font-medium">{day.day}</p>
              </div>
              <CardContent className="p-4 text-center">
                <div className="flex justify-center mb-2">
                  {getWeatherIcon(day.condition)}
                </div>
                <div className="flex justify-center items-center gap-2 mb-2">
                  <span className="font-bold">{day.high}°</span>
                  <span className="text-muted-foreground">{day.low}°</span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <CloudRain className="h-3 w-3 text-blue-500" />
                  <span className="text-xs">{day.precipitation}%</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
      </div>
    </AppLayout>
  );
};

export default WeatherForecast;
