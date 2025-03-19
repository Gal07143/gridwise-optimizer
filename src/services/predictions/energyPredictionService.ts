
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface EnergyPrediction {
  day: number;
  value: number;
  confidence: number;
}

export interface SystemRecommendation {
  id: string;
  type: "behavioral" | "system" | "maintenance" | "optimization";
  priority: "low" | "medium" | "high";
  title: string;
  description: string;
  potentialSavings: string;
  implementationCost: string;
  confidence: number;
}

export interface PredictionInput {
  energyData: number[] | { time: string; value: number }[];
  predictionDays?: number;
  includeRecommendations?: boolean;
}

export interface PredictionResult {
  predictions: EnergyPrediction[];
  recommendations: SystemRecommendation[];
  model_version?: string;
}

/**
 * Get energy consumption predictions and system recommendations from the ML model
 */
export const getEnergyPredictions = async (
  input: PredictionInput
): Promise<PredictionResult> => {
  try {
    const { data, error } = await supabase.functions.invoke("energy-predictions", {
      body: input,
    });

    if (error) {
      console.error("Error fetching predictions:", error);
      toast.error(`Failed to get predictions: ${error.message}`);
      return { predictions: [], recommendations: [] };
    }

    return {
      predictions: data?.predictions || [],
      recommendations: data?.recommendations || [],
      model_version: data?.model_version
    };
  } catch (error) {
    console.error("Error in prediction service:", error);
    toast.error("Failed to analyze energy data");
    return { predictions: [], recommendations: [] };
  }
};

/**
 * Apply a system recommendation and track its implementation
 */
export const applyRecommendation = async (
  recommendationId: string,
  notes?: string
): Promise<boolean> => {
  try {
    // In a production system, you would save this to the database
    // For now, we'll just simulate success
    console.log(`Applying recommendation: ${recommendationId}`);
    console.log(`Notes: ${notes || 'No notes provided'}`);
    
    toast.success("Recommendation applied successfully");
    return true;
  } catch (error) {
    console.error("Error applying recommendation:", error);
    toast.error("Failed to apply recommendation");
    return false;
  }
};
