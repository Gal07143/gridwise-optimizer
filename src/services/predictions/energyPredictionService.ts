
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface EnergyPrediction {
  date: string;
  generation: number;
  consumption: number;
  temperature?: number;
  cloudCover?: number;
  windSpeed?: number;
  weatherCondition?: string;
  confidence: number; // Required property
}

export interface SystemRecommendation {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  type: 'efficiency' | 'cost' | 'maintenance' | 'performance';
  created_at: string;
  applied?: boolean;
  applied_at?: string;
  applied_by?: string;
}

export interface PredictionResult {
  predictions: EnergyPrediction[];
  recommendations?: SystemRecommendation[];
  model_version?: string;
  error?: string;
}

/**
 * Get energy predictions based on historical data
 */
export const getEnergyPredictions = async ({
  energyData,
  predictionDays = 7,
  includeRecommendations = true
}: {
  energyData: number[];
  predictionDays: number;
  includeRecommendations: boolean;
}): Promise<PredictionResult> => {
  try {
    const { data, error } = await supabase.functions.invoke("energy-predictions", {
      body: {
        data: energyData,
        days: predictionDays,
        includeRecommendations
      },
    });

    if (error) throw error;
    
    return {
      predictions: data?.predictions || [],
      recommendations: data?.recommendations || [],
      model_version: data?.model_version,
    };
  } catch (error) {
    console.error("Error getting energy predictions:", error);
    toast.error("Failed to get energy predictions");
    return {
      predictions: [],
      error: "Failed to generate predictions",
    };
  }
};

/**
 * Apply a system recommendation
 */
export const applyRecommendation = async (
  recommendationId: string,
  notes: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("system_recommendations")
      .update({
        applied: true,
        applied_at: new Date().toISOString(),
        notes: notes
      })
      .eq("id", recommendationId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error applying recommendation:", error);
    toast.error("Failed to apply recommendation");
    return false;
  }
};
