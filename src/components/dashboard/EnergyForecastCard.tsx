
import React from 'react';
import { LineChart, CloudRain } from 'lucide-react';
import DashboardCard from './DashboardCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useForecastData } from '@/hooks/useForecastData';
import ForecastMetricsPanel from './forecasts/ForecastMetricsPanel';
import ForecastChart from './forecasts/ForecastChart';
import ForecastFooter from './forecasts/ForecastFooter';
import { Badge } from '@/components/ui/badge';

interface EnergyForecastCardProps {
  className?: string;
  animationDelay?: string;
}

const EnergyForecastCard = ({ className, animationDelay }: EnergyForecastCardProps) => {
  const {
    processedData,
    forecastMetrics,
    isLoading,
    error,
    isUsingLocalData,
    currentWeather,
    lastUpdated
  } = useForecastData();

  // Handle loading and error states
  if (isLoading && processedData.length === 0) {
    return (
      <DashboardCard 
        title="24-Hour Energy Forecast" 
        icon={<LineChart size={18} />}
        className={className}
        style={animationDelay ? { animationDelay } : undefined}
      >
        <div className="space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-60 w-full" />
          <Skeleton className="h-5 w-full" />
        </div>
      </DashboardCard>
    );
  }

  if (error && processedData.length === 0) {
    return (
      <DashboardCard 
        title="24-Hour Energy Forecast" 
        icon={<LineChart size={18} />}
        className={className}
        style={animationDelay ? { animationDelay } : undefined}
      >
        <div className="flex justify-center items-center h-60">
          <p className="text-red-500">Error loading forecast data</p>
        </div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard
      title="24-Hour Energy Forecast"
      icon={<LineChart size={18} />}
      className={className}
      style={animationDelay ? { animationDelay } : undefined}
      action={
        <div className="flex items-center gap-2">
          {currentWeather && (
            <Badge variant="outline" className="flex items-center gap-1">
              <CloudRain size={14} />
              <span>{currentWeather.condition}</span>
              <span>{currentWeather.temperature}°C</span>
            </Badge>
          )}
          {lastUpdated && (
            <span className="text-xs text-muted-foreground">
              Updated: {new Date(lastUpdated).toLocaleTimeString()}
            </span>
          )}
        </div>
      }
    >
      {isUsingLocalData && (
        <div className="mb-2 text-xs rounded bg-blue-50 dark:bg-blue-950 p-2 text-blue-600 dark:text-blue-300">
          Using demo forecast data. No database write permissions.
        </div>
      )}
      
      <ForecastMetricsPanel metrics={forecastMetrics} />
      <ForecastChart data={processedData} />
      <ForecastFooter confidence={forecastMetrics.confidence} />
    </DashboardCard>
  );
};

export default EnergyForecastCard;
