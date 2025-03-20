
import { useState, useEffect } from 'react';
import { useSite } from '@/contexts/SiteContext';
import { getEnergyForecasts, generateEnergyPredictions } from '@/services/energyAIPredictionService';
import { getWeatherForecast } from '@/services/weatherService';
import { useQuery } from '@tanstack/react-query';

export function useForecastData(days = 7) {
  const { currentSite } = useSite();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [processedData, setProcessedData] = useState<any[]>([]);
  const [forecastMetrics, setForecastMetrics] = useState({
    totalGeneration: 0,
    totalConsumption: 0,
    netEnergy: 0,
    peakGeneration: 0,
    peakConsumption: 0,
    confidence: 0.85,
  });
  const [isUsingLocalData, setIsUsingLocalData] = useState(false);

  // Get existing forecasts from the database
  const {
    data: forecasts = [],
    isLoading: forecastsLoading,
    error: forecastsError,
    refetch: refetchForecasts
  } = useQuery({
    queryKey: ['energy-forecasts', currentSite?.id],
    queryFn: () => getEnergyForecasts(currentSite?.id || ''),
    enabled: !!currentSite?.id,
    refetchInterval: 15 * 1000, // Refetch every 15 seconds
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
    refetchInterval: 15 * 1000, // Refetch every 15 seconds
  });

  // Process the forecast data for display
  useEffect(() => {
    if (forecasts.length > 0) {
      // Map the database forecasts to the format needed for the chart
      const chartData = forecasts.map(forecast => ({
        time: new Date(forecast.forecast_time).toISOString(),
        generation: forecast.generation_forecast,
        consumption: forecast.consumption_forecast,
        temperature: forecast.temperature,
        cloudCover: forecast.cloud_cover,
        wind: forecast.wind_speed
      }));
      
      setProcessedData(chartData);
      
      // Calculate metrics
      const totalGeneration = forecasts.reduce((sum, f) => sum + f.generation_forecast, 0);
      const totalConsumption = forecasts.reduce((sum, f) => sum + f.consumption_forecast, 0);
      const peakGeneration = Math.max(...forecasts.map(f => f.generation_forecast));
      const peakConsumption = Math.max(...forecasts.map(f => f.consumption_forecast));
      const avgConfidence = forecasts.reduce((sum, f) => sum + (f.confidence || 0.85), 0) / forecasts.length;
      
      setForecastMetrics({
        totalGeneration,
        totalConsumption,
        netEnergy: totalGeneration - totalConsumption,
        peakGeneration,
        peakConsumption,
        confidence: avgConfidence || 0.85
      });
      
      setIsUsingLocalData(false);
    } else if (!forecastsLoading && !isRefreshing) {
      // Generate sample data if no forecasts available
      const now = new Date();
      const sampleData = Array.from({ length: 24 }).map((_, i) => {
        const time = new Date(now);
        time.setHours(now.getHours() + i);
        
        // Create realistic patterns based on time of day
        const hour = time.getHours();
        const isDaytime = hour >= 6 && hour <= 18;
        
        let generation = 0;
        if (isDaytime) {
          generation = 5 + Math.sin((hour - 6) * Math.PI / 12) * 15; // Peak at noon
        }
        
        // Consumption has morning and evening peaks
        let consumption = 5;
        if (hour >= 6 && hour <= 9) { // Morning peak
          consumption = 10 + (hour - 6) * 2;
        } else if (hour >= 17 && hour <= 21) { // Evening peak
          consumption = 10 + (5 - Math.abs(hour - 19)) * 3;
        }
        
        // Add some randomness
        generation += (Math.random() * 2) - 1;
        consumption += (Math.random() * 2) - 1;
        
        return {
          time: time.toISOString(),
          generation: Math.max(0, generation),
          consumption: Math.max(0, consumption),
          temperature: isDaytime ? 20 + Math.random() * 5 : 15 + Math.random() * 3,
          cloudCover: Math.random(),
          wind: 5 + Math.random() * 10
        };
      });
      
      setProcessedData(sampleData);
      
      // Calculate metrics from sample data
      const totalGeneration = sampleData.reduce((sum, d) => sum + d.generation, 0);
      const totalConsumption = sampleData.reduce((sum, d) => sum + d.consumption, 0);
      const peakGeneration = Math.max(...sampleData.map(d => d.generation));
      const peakConsumption = Math.max(...sampleData.map(d => d.consumption));
      
      setForecastMetrics({
        totalGeneration,
        totalConsumption,
        netEnergy: totalGeneration - totalConsumption,
        peakGeneration,
        peakConsumption,
        confidence: 0.7 // Lower confidence for sample data
      });
      
      setIsUsingLocalData(true);
    }
  }, [forecasts, forecastsLoading, isRefreshing]);

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
    processedData,
    forecastMetrics,
    isLoading: forecastsLoading || weatherLoading,
    isRefreshing,
    error: forecastsError,
    refreshForecasts,
    weatherData,
    isUsingLocalData
  };
}
