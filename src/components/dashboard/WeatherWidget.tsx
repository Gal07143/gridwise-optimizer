
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, Wind, Thermometer } from 'lucide-react';

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  forecast: {
    day: string;
    condition: string;
    highTemp: number;
    lowTemp: number;
  }[];
}

const mockWeatherData: WeatherData = {
  temperature: 28,
  humidity: 62,
  windSpeed: 8.5,
  condition: 'sunny',
  forecast: [
    { day: 'Today', condition: 'sunny', highTemp: 28, lowTemp: 20 },
    { day: 'Tomorrow', condition: 'partly-cloudy', highTemp: 26, lowTemp: 19 },
    { day: 'Tue', condition: 'cloudy', highTemp: 25, lowTemp: 18 },
    { day: 'Wed', condition: 'rainy', highTemp: 22, lowTemp: 17 },
    { day: 'Thu', condition: 'sunny', highTemp: 24, lowTemp: 18 }
  ]
};

const getWeatherIcon = (condition: string, size?: number) => {
  const iconSize = size || 24;
  switch (condition.toLowerCase()) {
    case 'sunny':
      return <Sun size={iconSize} className="text-yellow-500" />;
    case 'partly-cloudy':
      return <Cloud size={iconSize} className="text-gray-400" />;
    case 'cloudy':
      return <Cloud size={iconSize} className="text-gray-500" />;
    case 'rainy':
      return <CloudRain size={iconSize} className="text-blue-400" />;
    case 'snowy':
      return <CloudSnow size={iconSize} className="text-blue-200" />;
    case 'stormy':
      return <CloudLightning size={iconSize} className="text-purple-500" />;
    default:
      return <Sun size={iconSize} className="text-yellow-500" />;
  }
};

const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData>(mockWeatherData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Here you would fetch real weather data
    // For now, we'll use the mock data
    setLoading(true);
    
    // Simulating API call
    setTimeout(() => {
      setWeather(mockWeatherData);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white">
        <CardTitle className="flex items-center justify-between">
          <span>Weather Forecast</span>
          <span className="text-base font-normal">Local Area</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                {getWeatherIcon(weather.condition, 48)}
                <div className="ml-4">
                  <div className="text-3xl font-bold">{weather.temperature}°C</div>
                  <div className="text-muted-foreground capitalize">{weather.condition}</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Wind className="h-4 w-4 mr-2" />
                  <span>Wind: {weather.windSpeed} km/h</span>
                </div>
                <div className="flex items-center">
                  <Thermometer className="h-4 w-4 mr-2" />
                  <span>Humidity: {weather.humidity}%</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-5 gap-1 mt-6">
              {weather.forecast.map((day) => (
                <div key={day.day} className="text-center">
                  <div className="text-sm font-medium">{day.day}</div>
                  <div className="my-2 flex justify-center">
                    {getWeatherIcon(day.condition, 20)}
                  </div>
                  <div className="text-xs">
                    <span className="font-medium">{day.highTemp}°</span>
                    <span className="text-muted-foreground">/{day.lowTemp}°</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;
