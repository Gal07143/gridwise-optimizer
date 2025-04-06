
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sun, Cloud, CloudRain, Wind } from 'lucide-react';

interface WeatherData {
  condition: 'sunny' | 'cloudy' | 'rainy' | 'windy';
  temperature: number;
  wind: number;
  humidity: number;
  forecast: {
    condition: 'sunny' | 'cloudy' | 'rainy' | 'windy';
    temperature: number;
  }[];
}

interface WeatherWidgetProps {
  siteId?: string;
  className?: string;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ siteId, className }) => {
  // Mock weather data - in a real app, this would come from an API
  const weatherData: WeatherData = {
    condition: 'sunny',
    temperature: 72,
    wind: 8,
    humidity: 45,
    forecast: [
      { condition: 'sunny', temperature: 74 },
      { condition: 'sunny', temperature: 76 },
      { condition: 'cloudy', temperature: 72 },
      { condition: 'rainy', temperature: 68 },
      { condition: 'cloudy', temperature: 70 },
    ]
  };

  const getWeatherIcon = (condition: 'sunny' | 'cloudy' | 'rainy' | 'windy') => {
    switch (condition) {
      case 'sunny':
        return <Sun className="h-8 w-8 text-yellow-500" />;
      case 'cloudy':
        return <Cloud className="h-8 w-8 text-gray-400" />;
      case 'rainy':
        return <CloudRain className="h-8 w-8 text-blue-400" />;
      case 'windy':
        return <Wind className="h-8 w-8 text-blue-300" />;
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span>Weather</span>
          <span className="text-sm font-normal text-muted-foreground">Today & Forecast</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            {getWeatherIcon(weatherData.condition)}
            <div>
              <div className="text-3xl font-bold">{weatherData.temperature}°F</div>
              <div className="text-sm text-muted-foreground">
                Wind: {weatherData.wind} mph | Humidity: {weatherData.humidity}%
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            {weatherData.forecast.map((day, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="text-xs text-muted-foreground">{index === 0 ? 'Today' : `+${index}`}</div>
                <div className="my-1">{getWeatherIcon(day.condition)}</div>
                <div className="text-xs">{day.temperature}°</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;
