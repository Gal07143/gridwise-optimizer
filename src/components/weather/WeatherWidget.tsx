
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Cloud, CloudRain, Sun, Wind } from 'lucide-react';

interface WeatherWidgetProps {
  siteId: string;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ siteId }) => {
  // Mock weather data - in a real app this would come from an API
  const weather = {
    condition: 'cloudy',
    temperature: 22,
    humidity: 65,
    windSpeed: 12,
    windDirection: 'NW',
    precipitation: 20,
    forecast: [
      { day: 'Today', high: 22, low: 14, condition: 'cloudy' },
      { day: 'Tomorrow', high: 24, low: 16, condition: 'sunny' },
      { day: 'Wednesday', high: 21, low: 15, condition: 'rainy' }
    ]
  };
  
  // Get weather icon based on condition
  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return <Sun className="h-6 w-6" />;
      case 'rainy': return <CloudRain className="h-6 w-6" />;
      case 'cloudy': 
      default:
        return <Cloud className="h-6 w-6" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Weather Conditions</span>
          {getWeatherIcon(weather.condition)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-3xl font-bold">{weather.temperature}°C</p>
            <p className="text-sm text-muted-foreground capitalize">{weather.condition}</p>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-sm">Humidity</span>
              <span className="text-sm font-medium">{weather.humidity}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm flex items-center">
                <Wind className="h-3 w-3 mr-1" /> Wind
              </span>
              <span className="text-sm font-medium">{weather.windSpeed} km/h {weather.windDirection}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Rain</span>
              <span className="text-sm font-medium">{weather.precipitation}%</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 border-t pt-4">
          <p className="text-sm font-medium mb-2">3-Day Forecast</p>
          <div className="flex justify-between">
            {weather.forecast.map((day) => (
              <div key={day.day} className="text-center">
                <p className="text-xs">{day.day}</p>
                <div className="my-1">{getWeatherIcon(day.condition)}</div>
                <p className="text-xs font-medium">{day.high}° / {day.low}°</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;
