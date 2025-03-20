
import React from 'react';
import { LineChart, CloudRain, ArrowDownUp, RefreshCw } from 'lucide-react';
import DashboardCard from './DashboardCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useForecast } from '@/hooks/useForecast';
import ForecastMetricsPanel from './forecasts/ForecastMetricsPanel';
import ForecastChart from './forecasts/ForecastChart';
import ForecastFooter from './forecasts/ForecastFooter';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

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
    lastUpdated,
    refreshData
  } = useForecast();

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
        <div className="flex flex-col justify-center items-center h-60 space-y-4">
          <p className="text-red-500">Error loading forecast data</p>
          <Button size="sm" variant="outline" onClick={refreshData}>
            <RefreshCw className="mr-1 h-4 w-4" /> Try Again
          </Button>
        </div>
      </DashboardCard>
    );
  }

  // Format the last updated time
  const formattedTime = lastUpdated 
    ? new Date(lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    : null;

  // Determine net energy status (surplus/deficit)
  const hasEnergySurplus = forecastMetrics.netEnergy > 0;

  return (
    <DashboardCard
      title="24-Hour Energy Forecast"
      icon={<LineChart size={18} />}
      className={className}
      style={animationDelay ? { animationDelay } : undefined}
      actions={
        <div className="flex items-center gap-2">
          {/* Net energy indicator */}
          <HoverCard>
            <HoverCardTrigger asChild>
              <Badge 
                variant={hasEnergySurplus ? "success" : "destructive"} 
                className="flex items-center gap-1 cursor-help"
              >
                <ArrowDownUp size={14} />
                <span>{hasEnergySurplus ? "Surplus" : "Deficit"}</span>
                <span>{Math.abs(forecastMetrics.netEnergy).toFixed(1)} kWh</span>
              </Badge>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 p-2">
              <p className="text-sm">
                {hasEnergySurplus 
                  ? "Your system is predicted to generate more energy than it consumes during this period."
                  : "Your system is predicted to consume more energy than it generates during this period."}
              </p>
            </HoverCardContent>
          </HoverCard>
          
          {/* Weather information */}
          {currentWeather && (
            <Badge variant="outline" className="flex items-center gap-1">
              <CloudRain size={14} />
              <span>{currentWeather.condition}</span>
              <span>{currentWeather.temperature}°C</span>
            </Badge>
          )}
          
          {/* Last updated time */}
          {formattedTime && (
            <span className="text-xs text-muted-foreground hidden md:inline-block">
              Updated: {formattedTime}
            </span>
          )}
          
          {/* Refresh button */}
          <Button variant="ghost" size="icon" onClick={refreshData} className="h-8 w-8">
            <RefreshCw size={14} />
          </Button>
        </div>
      }
    >
      {isUsingLocalData && (
        <div className="mb-2 text-xs rounded bg-blue-50 dark:bg-blue-950 p-2 text-blue-600 dark:text-blue-300">
          Using demo forecast data. Live API data unavailable.
        </div>
      )}
      
      <ForecastMetricsPanel metrics={forecastMetrics} />
      <ForecastChart data={processedData} />
      <ForecastFooter confidence={forecastMetrics.confidence} />
    </DashboardCard>
  );
};

export default EnergyForecastCard;
