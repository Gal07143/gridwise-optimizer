
import { useState, useEffect } from 'react';
import {
  PredictionDataPoint,
  SystemRecommendation,
  generatePredictionData,
  getSystemRecommendations
} from '@/services/predictions/energyPredictionService';

export interface UsePredictionsResult {
  predictions: PredictionDataPoint[];
  isLoading: boolean;
  error: Error | null;
  recommendations: SystemRecommendation[];
  predictionDays: number;
  setPredictionDays: (days: number) => void;
  refreshData: () => void;
}

const usePredictions = (timeframe: 'day' | 'week' | 'month' | 'year' = 'week', customData?: any[]): UsePredictionsResult => {
  const [predictions, setPredictions] = useState<PredictionDataPoint[]>([]);
  const [recommendations, setRecommendations] = useState<SystemRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [predictionDays, setPredictionDays] = useState<number>(7);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      // Generate prediction data based on timeframe
      const data = customData || generatePredictionData(timeframe, predictionDays);
      setPredictions(data);

      // Get recommendations
      const recs = getSystemRecommendations();
      setRecommendations(recs);
      
      setError(null);
    } catch (err) {
      console.error('Error fetching prediction data:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setPredictions([]);
      setRecommendations([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when timeframe or predictionDays changes
  useEffect(() => {
    fetchData();
  }, [timeframe, predictionDays]);

  return {
    predictions,
    isLoading,
    error,
    recommendations,
    predictionDays,
    setPredictionDays,
    refreshData: fetchData
  };
};

export default usePredictions;
