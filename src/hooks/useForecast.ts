
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  getWeatherForecast, 
  getEnergyForecasts 
} from '@/services/forecasts/forecastService';
import { 
  WeatherForecast, 
  ForecastDataPoint,
  ForecastMetrics,
  WeatherCondition 
} from '@/types/forecast';
import { EnergyForecast } from '@/types/energy';

export const useForecast = (siteId: string) => {
  const [forecastType, setForecastType] = useState<'energy' | 'weather'>('energy');
  
  const {
    data: weatherForecast,
    isLoading: isWeatherLoading,
    error: weatherError,
  } = useQuery({
    queryKey: ['weatherForecast', siteId],
    queryFn: () => getWeatherForecast(siteId),
    enabled: !!siteId && forecastType === 'weather',
  });
  
  const {
    data: energyForecast,
    isLoading: isEnergyLoading,
    error: energyError,
  } = useQuery({
    queryKey: ['energyForecast', siteId],
    queryFn: () => getEnergyForecasts(siteId),
    enabled: !!siteId && forecastType === 'energy',
  });
  
  // Transform forecast data for charts
  const transformedForecast = energyForecast?.map(forecast => ({
    timestamp: new Date(forecast.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    production: forecast.forecasted_production,
    consumption: forecast.forecasted_consumption,
    balance: forecast.forecasted_production - forecast.forecasted_consumption,
  })) || [];
  
  return {
    weatherForecast,
    energyForecast,
    transformedForecast,
    isLoading: isWeatherLoading || isEnergyLoading,
    error: weatherError || energyError,
    forecastType,
    setForecastType,
  };
};
