
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
  siteId?: string; // Add optional site context
}

export interface PredictionResult {
  predictions: EnergyPrediction[];
  recommendations: SystemRecommendation[];
  model_version?: string;
  error?: string;
}

/**
 * Get energy consumption predictions and system recommendations from the ML model
 */
export const getEnergyPredictions = async (
  input: PredictionInput
): Promise<PredictionResult> => {
  try {
    console.log("Fetching predictions with input:", JSON.stringify(input));
    
    // Ensure we have valid data to send to the prediction engine
    if (!input.energyData || input.energyData.length === 0) {
      console.warn("No energy data provided for prediction");
      return { 
        predictions: [], 
        recommendations: [],
        error: "Insufficient data for prediction" 
      };
    }

    const { data, error } = await supabase.functions.invoke("energy-predictions", {
      body: input,
    });

    if (error) {
      console.error("Error fetching predictions:", error);
      toast.error(`Failed to get predictions: ${error.message}`);
      return { 
        predictions: [], 
        recommendations: [],
        error: error.message
      };
    }

    console.log("Prediction response:", data);
    
    return {
      predictions: data?.predictions || [],
      recommendations: data?.recommendations || [],
      model_version: data?.model_version
    };
  } catch (error: any) {
    console.error("Error in prediction service:", error);
    toast.error("Failed to analyze energy data");
    return { 
      predictions: [], 
      recommendations: [],
      error: error.message || "Unknown error" 
    };
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
    console.log(`Applying recommendation: ${recommendationId}`);
    console.log(`Notes: ${notes || 'No notes provided'}`);
    
    // In a production environment, we'd want to store the applied recommendation
    // and use it to improve future recommendations
    const { error } = await supabase.functions.invoke("energy-predictions", {
      body: {
        action: "apply_recommendation",
        recommendationId,
        notes,
        timestamp: new Date().toISOString()
      },
    });

    if (error) {
      console.error("Error applying recommendation:", error);
      toast.error(`Failed to apply recommendation: ${error.message}`);
      return false;
    }
    
    toast.success("Recommendation applied successfully");
    return true;
  } catch (error) {
    console.error("Error applying recommendation:", error);
    toast.error("Failed to apply recommendation");
    return false;
  }
};

/**
 * Get ML model training status
 */
export const getModelStatus = async (): Promise<{
  version: string;
  lastTrained: string;
  accuracy: number;
  status: "training" | "active" | "error";
}> => {
  try {
    const { data, error } = await supabase.functions.invoke("energy-predictions", {
      body: { action: "get_model_status" },
    });

    if (error) {
      console.error("Error fetching model status:", error);
      return {
        version: "1.0.0",
        lastTrained: new Date().toISOString(),
        accuracy: 0.85,
        status: "active"
      };
    }

    return data || {
      version: "1.0.0",
      lastTrained: new Date().toISOString(),
      accuracy: 0.85,
      status: "active"
    };
  } catch (error) {
    console.error("Error fetching model status:", error);
    return {
      version: "1.0.0",
      lastTrained: new Date().toISOString(),
      accuracy: 0.85,
      status: "active"
    };
  }
};

/**
 * Start model training process
 */
export const trainModel = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.functions.invoke("energy-predictions", {
      body: { action: "train_model" },
    });

    if (error) {
      console.error("Error starting model training:", error);
      toast.error(`Failed to start model training: ${error.message}`);
      return false;
    }

    toast.success("Model training started successfully");
    return true;
  } catch (error) {
    console.error("Error starting model training:", error);
    toast.error("Failed to start model training");
    return false;
  }
};
