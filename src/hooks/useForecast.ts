
import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useSiteContext } from '@/contexts/SiteContext';
import { 
  getEnergyForecast, 
  ForecastDataPoint, 
  ForecastMetrics, 
  WeatherCondition 
} from '@/services/forecasts/forecastService';

const REFRESH_INTERVAL = 15000; // 15 seconds

export function useForecast() {
  const { activeSite } = useSiteContext();
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  
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
  });

  // Function to manually refresh the data
  const refreshData = useCallback(() => {
    refetch();
    toast.success('Forecast data refreshed');
  }, [refetch]);

  return {
    processedData: data?.forecastData || [],
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
