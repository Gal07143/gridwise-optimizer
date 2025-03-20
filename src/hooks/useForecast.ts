
import { useState, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useSiteContext } from '@/contexts/SiteContext';
import { 
  getEnergyForecast, 
  ForecastDataPoint, 
  ForecastMetrics, 
  WeatherCondition 
} from '@/services/forecasts/forecastService';

const REFRESH_INTERVAL = 300000; // 5 minutes

export function useForecast() {
  const { activeSite } = useSiteContext();
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [processedData, setProcessedData] = useState<any[]>([]);
  
  // Fetch energy forecasts using the service
  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['energyForecast', activeSite?.id],
    queryFn: async () => {
      if (!activeSite?.id) {
        throw new Error('No active site selected');
      }
      
      const result = await getEnergyForecast(activeSite.id);
      setLastUpdated(new Date().toISOString());
      return result;
    },
    refetchInterval: REFRESH_INTERVAL,
    refetchOnWindowFocus: false,
    enabled: !!activeSite?.id,
    retry: 1,
    staleTime: 240000, // 4 minutes
  });

  // Process the raw forecast data into the format needed for charts
  useEffect(() => {
    if (!data?.forecastData || data.forecastData.length === 0) return;
    
    // Convert the forecast data into hourly data points for the chart
    const hourlyData = data.forecastData.map(item => {
      const date = new Date(item.time);
      return {
        time: item.time,
        hour: `${date.getHours()}:00`,
        generation: item.generation,
        consumption: item.consumption,
        netEnergy: item.netEnergy,
        weather: item.weather
      };
    });
    
    setProcessedData(hourlyData);
  }, [data]);

  // Function to manually refresh the data
  const refreshData = useCallback(() => {
    refetch();
    toast.success('Forecast data refreshed');
  }, [refetch]);

  return {
    processedData,
    forecastMetrics: data?.metrics || {
      totalGeneration: 0,
      totalConsumption: 0,
      peakGeneration: 0,
      peakConsumption: 0,
      confidence: 85,
      netEnergy: 0
    },
    currentWeather: data?.weather,
    isLoading,
    error,
    refreshData,
    isUsingLocalData: data?.isLocalData || false,
    lastUpdated
  };
}
