
import { useState, useEffect } from 'react';
import { useSiteContext } from '@/contexts/SiteContext';
import { 
  PredictionDataPoint, 
  SystemRecommendation, 
  generatePredictionData, 
  getSystemRecommendations 
} from '@/services/predictions/energyPredictionService';

export interface UsePredictionsResult {
  predictionData: PredictionDataPoint[];
  recommendations: SystemRecommendation[];
  isLoading: boolean;
  error: Error | null;
  refreshData: () => void;
}

export function usePredictions(
  timeframe: 'day' | 'week' | 'month' | 'year' = 'day',
  dataType: 'energy_consumption' | 'energy_production' | 'cost_analysis' | 'device_performance' | 'efficiency_analysis' = 'energy_consumption'
): UsePredictionsResult {
  const { activeSite } = useSiteContext();
  const [predictionData, setPredictionData] = useState<PredictionDataPoint[]>([]);
  const [recommendations, setRecommendations] = useState<SystemRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    if (!activeSite) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch prediction data
      const predData = await generatePredictionData(timeframe, dataType);
      setPredictionData(predData);
      
      // Fetch recommendations
      const recData = await getSystemRecommendations();
      setRecommendations(recData);
      
    } catch (err) {
      console.error('Error fetching prediction data:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch prediction data'));
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [activeSite?.id, timeframe, dataType]);

  return {
    predictionData,
    recommendations,
    isLoading,
    error,
    refreshData: fetchData
  };
}

export default usePredictions;
