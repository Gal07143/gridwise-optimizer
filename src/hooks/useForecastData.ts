
import { useState, useEffect } from 'react';
import { useSite } from '@/contexts/SiteContext';
import { getEnergyForecasts, generateEnergyPredictions } from '@/services/energyAIPredictionService';
import { getWeatherForecast } from '@/services/weatherService';
import { useQuery } from '@tanstack/react-query';

export function useForecastData(days = 7) {
  const { currentSite } = useSite();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Get existing forecasts from the database
  const {
    data: forecasts = [],
    isLoading: forecastsLoading,
    refetch: refetchForecasts
  } = useQuery({
    queryKey: ['energy-forecasts', currentSite?.id],
    queryFn: () => getEnergyForecasts(currentSite?.id || ''),
    enabled: !!currentSite?.id,
    refetchInterval: 15 * 60 * 1000, // Refetch every 15 minutes
  });

  // Check if we need to generate new forecasts
  const shouldGenerateNewForecasts = () => {
    if (forecasts.length === 0) return true;
    
    // Check if the latest forecast is older than 24 hours
    const latestForecast = forecasts[0];
    if (!latestForecast) return true;
    
    const forecastTime = new Date(latestForecast.timestamp);
    const now = new Date();
    const hoursDiff = (now.getTime() - forecastTime.getTime()) / (1000 * 60 * 60);
    
    return hoursDiff >= 24;
  };

  // Regenerate forecasts if needed
  useEffect(() => {
    const generateIfNeeded = async () => {
      if (currentSite?.id && shouldGenerateNewForecasts() && !isRefreshing) {
        setIsRefreshing(true);
        try {
          await generateEnergyPredictions(currentSite.id, days);
          await refetchForecasts();
        } catch (error) {
          console.error("Error generating forecasts:", error);
        } finally {
          setIsRefreshing(false);
        }
      }
    };
    
    generateIfNeeded();
  }, [currentSite, forecasts, days, refetchForecasts]);

  // Get weather data
  const {
    data: weatherData = [],
    isLoading: weatherLoading
  } = useQuery({
    queryKey: ['weather-forecast', currentSite?.id],
    queryFn: () => getWeatherForecast(currentSite?.id || '', days),
    enabled: !!currentSite?.id,
    refetchInterval: 60 * 60 * 1000, // Refetch every 60 minutes
  });

  // Refresh forecasts manually
  const refreshForecasts = async () => {
    if (!currentSite?.id || isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      // Get fresh weather forecast first
      await getWeatherForecast(currentSite.id, days);
      
      // Then generate new energy predictions
      await generateEnergyPredictions(currentSite.id, days);
      
      // Refetch the data
      await refetchForecasts();
    } catch (error) {
      console.error("Error refreshing forecasts:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return {
    forecasts,
    isLoading: forecastsLoading || weatherLoading,
    isRefreshing,
    refreshForecasts,
    weatherData
  };
}
