
import { useState, useEffect } from 'react';
import { useSiteContext } from '@/contexts/SiteContext';
import { 
  PredictionDataPoint, 
  SystemRecommendation, 
  generatePredictionData, 
  getSystemRecommendations 
} from '@/services/predictions/energyPredictionService';

export interface UsePredictionsResult {
  predictions: PredictionDataPoint[];
  recommendations: SystemRecommendation[];
  isLoading: boolean;
  error: Error | null;
  predictionDays: number;
  setPredictionDays: (days: number) => void;
  refetch: () => void;
}

export function usePredictions(
  timeframe: 'day' | 'week' | 'month' | 'year' = 'day',
  dataType: string = 'energy_consumption'
): UsePredictionsResult {
  const { activeSite } = useSiteContext();
  const [predictions, setPredictions] = useState<PredictionDataPoint[]>([]);
  const [recommendations, setRecommendations] = useState<SystemRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [predictionDays, setPredictionDays] = useState(7);

  const fetchData = async () => {
    if (!activeSite) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch prediction data
      const predData = await generatePredictionData(timeframe, dataType);
      setPredictions(predData);
      
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
    predictions,
    recommendations,
    isLoading,
    error,
    predictionDays,
    setPredictionDays,
    refetch: fetchData
  };
}

export default usePredictions;
