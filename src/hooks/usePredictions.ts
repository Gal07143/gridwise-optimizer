
import { useState, useEffect } from 'react';
import { 
  PredictionDataPoint, 
  SystemRecommendation, 
  generatePredictionData, 
  getSystemRecommendations 
} from '@/services/predictions/energyPredictionService';

interface UsePredictionsResult {
  predictions: PredictionDataPoint[];
  recommendations: SystemRecommendation[];
  isLoading: boolean;
  error: Error | null;
  predictionDays: number;
  setPredictionDays: (days: number) => void;
  refetch: () => void;
}

const usePredictions = (timeframe: string = 'week', customData?: any[]): UsePredictionsResult => {
  const [predictions, setPredictions] = useState<PredictionDataPoint[]>([]);
  const [recommendations, setRecommendations] = useState<SystemRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [predictionDays, setPredictionDays] = useState<number>(7);
  
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Generate prediction data
      const predictionData = generatePredictionData(predictionDays);
      setPredictions(predictionData);
      
      // Fetch recommendations
      const recommendationsData = await getSystemRecommendations();
      setRecommendations(recommendationsData);
    } catch (err) {
      console.error('Error fetching prediction data:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [timeframe, predictionDays]);
  
  // If customData is provided, generate a different set of predictions
  useEffect(() => {
    if (customData && customData.length > 0) {
      try {
        // Use custom data to influence predictions
        const customPredictions = generatePredictionData(predictionDays);
        setPredictions(customPredictions);
      } catch (err) {
        console.error('Error generating custom predictions:', err);
      }
    }
  }, [customData, predictionDays]);
  
  return {
    predictions,
    recommendations,
    isLoading,
    error,
    predictionDays,
    setPredictionDays,
    refetch: fetchData
  };
};

export default usePredictions;
