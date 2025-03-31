
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Main } from '@/components/ui/main';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CloudSun, Droplets, Thermometer, Wind, Calendar, Clock, CloudRain, ArrowUpRight, ArrowDownRight, AlertTriangle, Battery } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import { toast } from 'sonner';

// Sample weather data for demonstration
const forecastData = [
  { day: 'Today', date: '2023-08-22', high: 28, low: 18, condition: 'Sunny', precipitation: 0, windSpeed: 10, humidity: 45, icon: <CloudSun className="h-6 w-6 text-yellow-500" /> },
  { day: 'Tomorrow', date: '2023-08-23', high: 27, low: 17, condition: 'Partly Cloudy', precipitation: 10, windSpeed: 12, humidity: 50, icon: <CloudSun className="h-6 w-6 text-yellow-500" /> },
  { day: 'Wednesday', date: '2023-08-24', high: 25, low: 16, condition: 'Light Rain', precipitation: 40, windSpeed: 15, humidity: 65, icon: <CloudRain className="h-6 w-6 text-blue-500" /> },
  { day: 'Thursday', date: '2023-08-25', high: 23, low: 15, condition: 'Overcast', precipitation: 20, windSpeed: 14, humidity: 60, icon: <CloudSun className="h-6 w-6 text-gray-500" /> },
  { day: 'Friday', date: '2023-08-26', high: 24, low: 16, condition: 'Sunny', precipitation: 0, windSpeed: 8, humidity: 40, icon: <CloudSun className="h-6 w-6 text-yellow-500" /> },
  { day: 'Saturday', date: '2023-08-27', high: 26, low: 17, condition: 'Sunny', precipitation: 0, windSpeed: 7, humidity: 35, icon: <CloudSun className="h-6 w-6 text-yellow-500" /> },
  { day: 'Sunday', date: '2023-08-28', high: 29, low: 19, condition: 'Partly Cloudy', precipitation: 5, windSpeed: 9, humidity: 45, icon: <CloudSun className="h-6 w-6 text-yellow-500" /> },
];

// Hourly forecast data
const hourlyForecast = Array.from({ length: 24 }, (_, i) => {
  const hour = i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`;
  const temp = Math.round(22 + Math.sin((i / 24) * Math.PI * 2) * 6);
  const precipitation = i > 14 && i < 18 ? 30 : 0;
  const windSpeed = 8 + Math.sin((i / 24) * Math.PI) * 5;
  return { hour, temp, precipitation, windSpeed, condition: precipitation > 0 ? 'Light Rain' : 'Clear' };
});

const WeatherForecast = () => {
  const [activeTab, setActiveTab] = useState('forecast');
  const [forecastType, setForecastType] = useState('daily');
  const [location, setLocation] = useState('Main Site');

  const handleRefresh = () => {
    toast.success('Weather forecast refreshed');
  };

  const handleLocationChange = (value: string) => {
    setLocation(value);
    toast.success(`Location changed to ${value}`);
  };

  return (
    <AppLayout>
      <Main title="Weather Forecast" description="Weather conditions and forecast for your energy sites">
        <ErrorBoundary>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <Select value={location} onValueChange={handleLocationChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Main Site">Main Site</SelectItem>
                  <SelectItem value="Solar Farm">Solar Farm</SelectItem>
                  <SelectItem value="Wind Park">Wind Park</SelectItem>
                  <SelectItem value="Residential">Residential</SelectItem>
                </SelectContent>
              </Select>

              <Select value={forecastType} onValueChange={setForecastType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Forecast type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily Forecast</SelectItem>
                  <SelectItem value="hourly">Hourly Forecast</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleRefresh} variant="outline" className="shrink-0">
              Refresh Forecast
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="forecast">Forecast</TabsTrigger>
              <TabsTrigger value="impact">Energy Impact</TabsTrigger>
              <TabsTrigger value="historical">Historical Data</TabsTrigger>
            </TabsList>

            <TabsContent value="forecast" className="space-y-4">
              {forecastType === 'daily' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
                  {forecastData.map((day, index) => (
                    <Card key={index} className="h-full">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex justify-between items-center">
                          <span>{day.day}</span>
                          {day.icon}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">{day.date}</p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="text-2xl font-bold flex items-center justify-between">
                            <div className="flex items-center">
                              <ArrowUpRight className="h-4 w-4 text-red-500 mr-1" />
                              {day.high}°C
                            </div>
                            <div className="flex items-center">
                              <ArrowDownRight className="h-4 w-4 text-blue-500 mr-1" />
                              {day.low}°C
                            </div>
                          </div>
                          <div className="text-sm">{day.condition}</div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center">
                              <CloudRain className="h-4 w-4 mr-1 text-blue-500" />
                              <span>{day.precipitation}%</span>
                            </div>
                            <div className="flex items-center">
                              <Wind className="h-4 w-4 mr-1 text-gray-500" />
                              <span>{day.windSpeed} km/h</span>
                            </div>
                            <div className="flex items-center">
                              <Droplets className="h-4 w-4 mr-1 text-blue-400" />
                              <span>{day.humidity}%</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Hourly Forecast</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <div className="min-w-[800px]">
                        <div className="grid grid-cols-24 gap-2">
                          {hourlyForecast.map((hour, index) => (
                            <div key={index} className="flex flex-col items-center">
                              <div className="text-xs text-muted-foreground">{hour.hour}</div>
                              <div className="h-40 flex flex-col items-center justify-end">
                                <div 
                                  className={`w-8 ${hour.condition.includes('Rain') ? 'bg-blue-400' : 'bg-orange-400'} rounded-t`}
                                  style={{ height: `${(hour.temp - 15) * 8}px` }}
                                >
                                </div>
                              </div>
                              <div className="mt-1 text-sm font-medium">{hour.temp}°C</div>
                              <div className="text-xs text-muted-foreground flex items-center">
                                <CloudRain className="h-3 w-3 mr-1" />
                                {hour.precipitation}%
                              </div>
                              <div className="text-xs text-muted-foreground flex items-center">
                                <Wind className="h-3 w-3 mr-1" />
                                {Math.round(hour.windSpeed)} km/h
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="impact" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Forecasted Production Impact</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b">
                        <div className="flex items-center">
                          <CloudSun className="h-5 w-5 text-yellow-500 mr-2" />
                          <span>Solar Production</span>
                        </div>
                        <div className="font-medium text-green-600">+15% above average</div>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <div className="flex items-center">
                          <Wind className="h-5 w-5 text-blue-500 mr-2" />
                          <span>Wind Production</span>
                        </div>
                        <div className="font-medium text-red-600">-8% below average</div>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-purple-500 mr-2" />
                          <span>Overall Weekly Outlook</span>
                        </div>
                        <div className="font-medium text-green-600">+7% above average</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recommended Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-start p-2 bg-green-50 dark:bg-green-900/20 rounded-md">
                        <CloudSun className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                        <div>
                          <p className="font-medium">Maximize Solar Collection</p>
                          <p className="text-sm text-muted-foreground">Clear skies predicted for next 3 days. Ensure panels are clean and optimally positioned.</p>
                        </div>
                      </li>
                      <li className="flex items-start p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                        <Battery className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                        <div>
                          <p className="font-medium">Charge Storage</p>
                          <p className="text-sm text-muted-foreground">Prioritize battery charging during peak solar hours (10 AM - 3 PM).</p>
                        </div>
                      </li>
                      <li className="flex items-start p-2 bg-amber-50 dark:bg-amber-900/20 rounded-md">
                        <AlertTriangle className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
                        <div>
                          <p className="font-medium">Prepare for Thursday</p>
                          <p className="text-sm text-muted-foreground">Light rain expected. Adjust energy dispatching schedule accordingly.</p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="historical" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Historical Weather Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center text-muted-foreground">
                    <p>Historical weather data charts will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </ErrorBoundary>
      </Main>
    </AppLayout>
  );
};

export default WeatherForecast;
