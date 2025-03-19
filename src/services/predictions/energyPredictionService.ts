
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface EnergyPrediction {
  day: number;
  value: number;
  confidence: number;
}

export interface PredictionInput {
  energyData: number[] | { time: string; value: number }[];
  predictionDays?: number;
}

/**
 * Get energy consumption predictions from the ML model
 */
export const getEnergyPredictions = async (
  input: PredictionInput
): Promise<EnergyPrediction[]> => {
  try {
    const { data, error } = await supabase.functions.invoke("energy-predictions", {
      body: input,
    });

    if (error) {
      console.error("Error fetching predictions:", error);
      toast.error(`Failed to get predictions: ${error.message}`);
      return [];
    }

    return data?.predictions || [];
  } catch (error) {
    console.error("Error in prediction service:", error);
    toast.error("Failed to analyze energy data");
    return [];
  }
};
