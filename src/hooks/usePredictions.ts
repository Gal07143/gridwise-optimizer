
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  getEnergyPredictions, 
  EnergyPrediction, 
  SystemRecommendation 
} from "@/services/predictions/energyPredictionService";
import { weeklyEnergyData } from "@/components/analytics/data/sampleData";

export const usePredictions = (
  timeframe: string,
  customData?: any[]
) => {
  const [predictionDays, setPredictionDays] = useState(7);
  const [includeRecommendations, setIncludeRecommendations] = useState(true);
  
  // Use either custom data or default sample data based on timeframe
  const getInputData = () => {
    if (customData && customData.length > 0) {
      return customData;
    }
    
    // Default to weekly data
    return weeklyEnergyData.map(item => item.value);
  };

  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["energy-predictions", timeframe, predictionDays, customData?.length, includeRecommendations],
    queryFn: async () => {
      const inputData = getInputData();
      return getEnergyPredictions({
        energyData: inputData,
        predictionDays,
        includeRecommendations
      });
    },
    enabled: true,
  });

  return {
    predictions: data?.predictions || [],
    recommendations: data?.recommendations || [],
    modelVersion: data?.model_version,
    isLoading,
    error,
    refetch,
    predictionDays,
    setPredictionDays,
    includeRecommendations,
    setIncludeRecommendations
  };
};

export default usePredictions;
