
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getEnergyPredictions, EnergyPrediction } from "@/services/predictions/energyPredictionService";
import { weeklyEnergyData } from "@/components/analytics/data/sampleData";

export const usePredictions = (
  timeframe: string,
  customData?: any[]
) => {
  const [predictionDays, setPredictionDays] = useState(7);
  
  // Use either custom data or default sample data based on timeframe
  const getInputData = () => {
    if (customData && customData.length > 0) {
      return customData;
    }
    
    // Default to weekly data
    return weeklyEnergyData.map(item => item.value);
  };

  const {
    data: predictions,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["energy-predictions", timeframe, predictionDays, customData?.length],
    queryFn: async () => {
      const inputData = getInputData();
      return getEnergyPredictions({
        energyData: inputData,
        predictionDays
      });
    },
    enabled: true,
  });

  return {
    predictions: predictions || [],
    isLoading,
    error,
    refetch,
    predictionDays,
    setPredictionDays
  };
};

export default usePredictions;
