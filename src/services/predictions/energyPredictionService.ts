
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
  confidence: number;
  // Add these properties for compatibility with PredictionsCard
  day?: string;
  value?: number;
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
  // Add these properties required by RecommendationItem
  priority: 'high' | 'medium' | 'low';
  potentialSavings: string;
  implementationCost: string;
  confidence: number;
}

export interface PredictionResult {
  predictions: EnergyPrediction[];
  recommendations?: SystemRecommendation[];
  model_version?: string;
  error?: string;
}

export interface ModelStatus {
  version: string;
  lastTrained: string;
  accuracy: number;
  status: 'training' | 'active' | 'error';
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
    // Fix the table name from "system_recommendations" to "ai_recommendations"
    const { error } = await supabase
      .from("ai_recommendations")
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

/**
 * Get ML model status
 */
export const getModelStatus = async (): Promise<ModelStatus> => {
  try {
    const { data, error } = await supabase
      .from("ai_models")
      .select("*")
      .order("last_trained", { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;
    
    return {
      version: data?.version || "1.0.0",
      lastTrained: data?.last_trained || new Date().toISOString(),
      accuracy: data?.accuracy || 0.85,
      status: "active"
    };
  } catch (error) {
    console.error("Error getting model status:", error);
    return {
      version: "1.0.0",
      lastTrained: new Date().toISOString(),
      accuracy: 0.85,
      status: "active"
    };
  }
};

/**
 * Start training a new ML model
 */
export const trainModel = async (): Promise<boolean> => {
  try {
    // Trigger model training via Edge Function
    const { error } = await supabase.functions.invoke("train-energy-model", {
      body: { startTraining: true }
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error starting model training:", error);
    toast.error("Failed to start model training");
    return false;
  }
};
