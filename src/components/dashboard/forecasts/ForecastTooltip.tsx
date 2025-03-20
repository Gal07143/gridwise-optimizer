
import React from 'react';
import { ChevronUp, ChevronDown, Zap } from 'lucide-react';

interface TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const ForecastTooltip: React.FC<TooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const generation = payload.find(p => p.name === 'Generation')?.value || 0;
  const consumption = payload.find(p => p.name === 'Consumption')?.value || 0;
  const netEnergy = generation - consumption;
  const isNetPositive = netEnergy >= 0;
  
  // Format the time from the label (assuming label is hour)
  const hour = parseInt(label as string);
  const formattedTime = `${hour}:00`;
  
  // Determine period of day
  const getPeriod = (hour: number) => {
    if (hour >= 5 && hour < 12) return 'Morning';
    if (hour >= 12 && hour < 17) return 'Afternoon';
    if (hour >= 17 && hour < 21) return 'Evening';
    return 'Night';
  };

  const period = getPeriod(hour);
  
  // Weather conditions based on time of day (simplified)
  const getWeatherIcon = (hour: number) => {
    if (hour >= 6 && hour < 18) return '☀️';
    return '🌙';
  };
  
  const weatherIcon = getWeatherIcon(hour);

  return (
    <div className="bg-white dark:bg-gray-800 p-3 border border-gray-100 dark:border-gray-700 rounded-md shadow-md">
      <div className="text-sm font-medium mb-2 flex items-center justify-between">
        <span>{formattedTime}</span>
        <span className="text-gray-500 dark:text-gray-400">{period} {weatherIcon}</span>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-green-500 dark:text-green-400 flex items-center">
            <ChevronUp className="h-4 w-4 mr-1" />
            Generation:
          </span>
          <span className="font-medium">{generation.toFixed(1)} kW</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-purple-500 dark:text-purple-400 flex items-center">
            <ChevronDown className="h-4 w-4 mr-1" />
            Consumption:
          </span>
          <span className="font-medium">{consumption.toFixed(1)} kW</span>
        </div>
        
        <div className="border-t border-gray-100 dark:border-gray-700 pt-2 mt-2">
          <div className="flex items-center justify-between">
            <span className={`flex items-center ${isNetPositive ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
              <Zap className="h-4 w-4 mr-1" />
              Net Energy:
            </span>
            <span className={`font-medium ${isNetPositive ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
              {isNetPositive ? '+' : ''}{netEnergy.toFixed(1)} kW
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForecastTooltip;
