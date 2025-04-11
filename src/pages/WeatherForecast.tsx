
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Cloud, CloudDrizzle, CloudLightning, CloudRain, CloudSnow, Droplets, Gauge, Sun, SunMoon, Thermometer, Wind } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AppLayout from '@/components/layout/AppLayout';

// Sample data - in a real app this would come from an API
const hourlyForecast = [
  { time: '00:00', temp: 18, precipitation: 0, humidity: 65, windSpeed: 8, solarRadiation: 0, icon: 'night' },
  { time: '03:00', temp: 17, precipitation: 0, humidity: 70, windSpeed: 6, solarRadiation: 0, icon: 'night' },
  { time: '06:00', temp: 16, precipitation: 0, humidity: 72, windSpeed: 5, solarRadiation: 10, icon: 'sunrise' },
  { time: '09:00', temp: 19, precipitation: 0, humidity: 68, windSpeed: 7, solarRadiation: 200, icon: 'sunny' },
  { time: '12:00', temp: 24, precipitation: 0, humidity: 55, windSpeed: 10, solarRadiation: 680, icon: 'sunny' },
  { time: '15:00', temp: 26, precipitation: 0, humidity: 50, windSpeed: 12, solarRadiation: 520, icon: 'sunny' },
  { time: '18:00', temp: 22, precipitation: 5, humidity: 60, windSpeed: 8, solarRadiation: 120, icon: 'cloudy' },
  { time: '21:00', temp: 19, precipitation: 20, humidity: 75, windSpeed: 6, solarRadiation: 0, icon: 'rain' },
];

const dailyForecast = [
  { date: 'Mon', tempMax: 26, tempMin: 16, precipitation: 20, humidity: 65, windSpeed: 12, solarRadiation: 450, icon: 'partly-cloudy' },
  { date: 'Tue', tempMax: 28, tempMin: 17, precipitation: 0, humidity: 55, windSpeed: 8, solarRadiation: 620, icon: 'sunny' },
  { date: 'Wed', tempMax: 27, tempMin: 18, precipitation: 0, humidity: 60, windSpeed: 10, solarRadiation: 580, icon: 'sunny' },
  { date: 'Thu', tempMax: 25, tempMin: 16, precipitation: 40, humidity: 75, windSpeed: 15, solarRadiation: 320, icon: 'rain' },
  { date: 'Fri', tempMax: 22, tempMin: 14, precipitation: 70, humidity: 80, windSpeed: 20, solarRadiation: 220, icon: 'thunderstorm' },
  { date: 'Sat', tempMax: 20, tempMin: 12, precipitation: 50, humidity: 75, windSpeed: 14, solarRadiation: 300, icon: 'rain' },
  { date: 'Sun', tempMax: 23, tempMin: 14, precipitation: 10, humidity: 65, windSpeed: 8, solarRadiation: 480, icon: 'partly-cloudy' },
];

interface PowerForecast {
  time: string;
  solarPotential: number;
  productionForecast: number;
}

const powerForecast: PowerForecast[] = hourlyForecast.map(item => ({
  time: item.time,
  solarPotential: item.solarRadiation * 0.15, // Converting radiation to kW potential
  productionForecast: item.solarRadiation * 0.12 * (item.icon === 'cloudy' ? 0.7 : item.icon === 'rain' ? 0.4 : 1), // Adjust forecast based on weather
}));

const WeatherIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'sunny':
      return <Sun className="h-6 w-6 text-yellow-500" />;
    case 'partly-cloudy':
      return <Cloud className="h-6 w-6 text-gray-400" />;
    case 'cloudy':
      return <Cloud className="h-6 w-6 text-gray-500" />;
    case 'rain':
      return <CloudRain className="h-6 w-6 text-blue-400" />;
    case 'thunderstorm':
      return <CloudLightning className="h-6 w-6 text-purple-400" />;
    case 'snow':
      return <CloudSnow className="h-6 w-6 text-blue-200" />;
    case 'night':
      return <SunMoon className="h-6 w-6 text-indigo-700" />;
    case 'sunrise':
      return <SunMoon className="h-6 w-6 text-amber-500" />;
    default:
      return <Cloud className="h-6 w-6 text-gray-400" />;
  }
};

const WeatherForecast: React.FC = () => {
  const [forecastType, setForecastType] = useState('hourly');
  const [forecastView, setForecastView] = useState('weather');

  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Weather Forecast</h1>
          <div className="flex items-center space-x-2">
            <Select defaultValue="current" onValueChange={() => {}}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Current Site</SelectItem>
                <SelectItem value="site1">Site 1</SelectItem>
                <SelectItem value="site2">Site 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="forecast" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-2 h-auto">
            <TabsTrigger value="forecast" className="py-2">Weather Forecast</TabsTrigger>
            <TabsTrigger value="production" className="py-2">Production Impact</TabsTrigger>
          </TabsList>
          
          <TabsContent value="forecast">
            <div className="grid gap-4">
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <button
                    onClick={() => setForecastType('hourly')}
                    className={`px-3 py-1 text-sm rounded-md ${forecastType === 'hourly' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary'}`}
                  >
                    Next 24 Hours
                  </button>
                  <button
                    onClick={() => setForecastType('daily')}
                    className={`px-3 py-1 text-sm rounded-md ${forecastType === 'daily' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary'}`}
                  >
                    7-Day Forecast
                  </button>
                </div>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    {forecastType === 'hourly' ? (
                      <Clock className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                    )}
                    {forecastType === 'hourly' ? 'Hourly Weather Forecast' : '7-Day Weather Forecast'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Temperature</p>
                            <p className="text-2xl font-bold">24°C</p>
                          </div>
                          <Thermometer className="h-8 w-8 text-orange-500" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Humidity</p>
                            <p className="text-2xl font-bold">65%</p>
                          </div>
                          <Droplets className="h-8 w-8 text-blue-500" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Wind Speed</p>
                            <p className="text-2xl font-bold">8 km/h</p>
                          </div>
                          <Wind className="h-8 w-8 text-teal-500" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Solar Radiation</p>
                            <p className="text-2xl font-bold">680 W/m²</p>
                          </div>
                          <Sun className="h-8 w-8 text-yellow-500" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <button
                        className={`px-3 py-1 text-xs rounded-full ${forecastView === 'weather' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-secondary'}`}
                        onClick={() => setForecastView('weather')}
                      >
                        Weather
                      </button>
                      <button
                        className={`px-3 py-1 text-xs rounded-full ${forecastView === 'temperature' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-secondary'}`}
                        onClick={() => setForecastView('temperature')}
                      >
                        Temperature
                      </button>
                      <button
                        className={`px-3 py-1 text-xs rounded-full ${forecastView === 'precipitation' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-secondary'}`}
                        onClick={() => setForecastView('precipitation')}
                      >
                        Precipitation
                      </button>
                      <button
                        className={`px-3 py-1 text-xs rounded-full ${forecastView === 'wind' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-secondary'}`}
                        onClick={() => setForecastView('wind')}
                      >
                        Wind
                      </button>
                      <button
                        className={`px-3 py-1 text-xs rounded-full ${forecastView === 'solar' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-secondary'}`}
                        onClick={() => setForecastView('solar')}
                      >
                        Solar Radiation
                      </button>
                    </div>

                    {forecastView === 'weather' && (
                      <div className="overflow-x-auto">
                        <div className="flex gap-4 min-w-max">
                          {(forecastType === 'hourly' ? hourlyForecast : dailyForecast).map((item, index) => (
                            <div key={index} className="flex flex-col items-center bg-card p-3 rounded-lg min-w-20">
                              <p className="text-sm text-muted-foreground">{forecastType === 'hourly' ? item.time : item.date}</p>
                              <WeatherIcon type={item.icon} />
                              <p className="text-sm font-medium mt-1">
                                {forecastType === 'hourly' 
                                  ? `${item.temp}°C` 
                                  : `${item.tempMax}° / ${item.tempMin}°`}
                              </p>
                              <p className="text-xs text-muted-foreground">{item.precipitation}%</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {forecastView === 'temperature' && (
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart 
                            data={forecastType === 'hourly' ? hourlyForecast : dailyForecast}
                            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey={forecastType === 'hourly' ? 'time' : 'date'} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            {forecastType === 'hourly' ? (
                              <Line type="monotone" dataKey="temp" name="Temperature °C" stroke="#ff7300" />
                            ) : (
                              <>
                                <Line type="monotone" dataKey="tempMax" name="Max Temp °C" stroke="#ff7300" />
                                <Line type="monotone" dataKey="tempMin" name="Min Temp °C" stroke="#8884d8" />
                              </>
                            )}
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                    
                    {forecastView === 'precipitation' && (
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={forecastType === 'hourly' ? hourlyForecast : dailyForecast}
                            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey={forecastType === 'hourly' ? 'time' : 'date'} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="precipitation" name="Precipitation %" fill="#82ca9d" />
                            <Bar dataKey="humidity" name="Humidity %" fill="#8884d8" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                    
                    {forecastView === 'wind' && (
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={forecastType === 'hourly' ? hourlyForecast : dailyForecast}
                            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey={forecastType === 'hourly' ? 'time' : 'date'} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="windSpeed" name="Wind Speed km/h" stroke="#8884d8" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                    
                    {forecastView === 'solar' && (
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={forecastType === 'hourly' ? hourlyForecast : dailyForecast}
                            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey={forecastType === 'hourly' ? 'time' : 'date'} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Area type="monotone" dataKey="solarRadiation" name="Solar Radiation W/m²" stroke="#ffc658" fill="#ffc658" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="production">
            <Card>
              <CardHeader>
                <CardTitle>Solar Production Impact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={powerForecast}
                      margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="solarPotential" name="Solar Potential (kW)" stroke="#ffc658" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="productionForecast" name="Production Forecast (kW)" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                          <Sun className="h-5 w-5 text-amber-500" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Estimated Production</p>
                          <p className="text-lg font-medium">42.5 kWh</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                          <Gauge className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Efficiency Factor</p>
                          <p className="text-lg font-medium">86%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                          <Cloud className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Weather Impact</p>
                          <p className="text-lg font-medium">-14%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default WeatherForecast;
