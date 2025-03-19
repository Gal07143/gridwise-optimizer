
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  getEnergyPredictions, 
  EnergyPrediction, 
  SystemRecommendation,
  PredictionResult 
} from "@/services/predictions/energyPredictionService";
import { weeklyEnergyData } from "@/components/analytics/data/sampleData";

export const usePredictions = (
  timeframe: string,
  customData?: any[]
) => {
  const [predictionDays, setPredictionDays] = useState(7);
  const [includeRecommendations, setIncludeRecommendations] = useState(true);
  const [lastError, setLastError] = useState<string | null>(null);
  
  // Use either custom data or default sample data based on timeframe
  const getInputData = () => {
    if (customData && customData.length > 0) {
      return customData;
    }
    
    // Default to weekly data if no custom data is provided
    switch (timeframe) {
      case 'day':
        return weeklyEnergyData.slice(0, 24).map(item => item.value);
      case 'month':
        return weeklyEnergyData.slice(0, 30).map(item => item.value);
      case 'year':
        return weeklyEnergyData.slice(0, 52).map(item => item.value);
      case 'week':
      default:
        return weeklyEnergyData.map(item => item.value);
    }
  };

  const {
    data,
    isLoading,
    error,
    refetch,
    isError
  } = useQuery({
    queryKey: ["energy-predictions", timeframe, predictionDays, customData?.length, includeRecommendations],
    queryFn: async () => {
      const inputData = getInputData();
      console.log(`Fetching predictions for ${timeframe} with ${predictionDays} days forecast`);
      
      const result = await getEnergyPredictions({
        energyData: inputData,
        predictionDays,
        includeRecommendations
      });
      
      if (result.error) {
        setLastError(result.error);
      } else {
        setLastError(null);
      }
      
      return result;
    },
    enabled: true,
    // Retry failed predictions up to 2 times before giving up
    retry: 2,
    // Cache prediction results for 5 minutes
    staleTime: 5 * 60 * 1000
  });
  
  // Clear error state if query parameters change
  useEffect(() => {
    setLastError(null);
  }, [timeframe, predictionDays, customData?.length, includeRecommendations]);

  return {
    predictions: data?.predictions || [],
    recommendations: data?.recommendations || [],
    modelVersion: data?.model_version,
    isLoading,
    error: error || lastError,
    isError: isError || !!lastError,
    refetch,
    predictionDays,
    setPredictionDays,
    includeRecommendations,
    setIncludeRecommendations
  };
};

export default usePredictions;
