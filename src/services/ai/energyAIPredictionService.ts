
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AIPredictionRequest {
  siteId?: string;
  days?: number;
  storeInDatabase?: boolean;
}

export interface AIPredictionResponse {
  consumptionPredictions: ConsumptionPrediction[];
  productionPredictions: ProductionPrediction[];
  costPredictions: CostPrediction[];
  recommendations: AIRecommendation[];
  metadata: {
    days: number;
    generated: string;
    model_version: string;
  };
}

export interface ConsumptionPrediction {
  date: string;
  consumption: number;
  confidence: number;
}

export interface ProductionPrediction {
  date: string;
  production: number;
  solarProduction: number;
  windProduction: number;
  confidence: number;
  weather: {
    sunnyConditions: number;
    windyConditions: number;
  };
}

export interface CostPrediction {
  date: string;
  importCost: number;
  exportRevenue: number;
  netCost: number;
  savings: number;
  selfConsumptionRate: string;
}

export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  type: 'optimization' | 'system' | 'behavioral' | 'maintenance';
  priority: 'low' | 'medium' | 'high';
  potentialSavings: string;
  confidence: number;
}

/**
 * Get AI predictions for energy consumption, production, and costs
 */
export const getAIPredictions = async (
  params: AIPredictionRequest = {}
): Promise<AIPredictionResponse> => {
  try {
    console.log("Fetching AI predictions with params:", params);
    
    // Default values
    const requestParams = {
      siteId: params.siteId || null,
      days: params.days || 7,
      storeInDatabase: params.storeInDatabase !== false
    };
    
    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke("energy-ai-predictions", {
      body: requestParams,
    });
    
    if (error) {
      console.error("Error fetching AI predictions:", error);
      toast.error(`Failed to get AI predictions: ${error.message}`);
      throw error;
    }
    
    console.log("AI predictions received:", data);
    
    return data;
  } catch (error) {
    console.error("Error in AI prediction service:", error);
    toast.error("Failed to get AI energy predictions");
    
    // Return empty data structure in case of error
    return {
      consumptionPredictions: [],
      productionPredictions: [],
      costPredictions: [],
      recommendations: [],
      metadata: {
        days: 0,
        generated: new Date().toISOString(),
        model_version: "error"
      }
    };
  }
};

/**
 * Apply an AI recommendation
 */
export const applyRecommendation = async (
  recommendationId: string,
  siteId?: string,
  notes?: string
): Promise<boolean> => {
  try {
    console.log(`Applying recommendation: ${recommendationId} for site: ${siteId || 'all'}`);
    
    // Here we would typically update system settings or schedule actions
    // For now, we just simulate success
    
    toast.success("Recommendation applied successfully");
    return true;
  } catch (error) {
    console.error("Error applying recommendation:", error);
    toast.error("Failed to apply recommendation");
    return false;
  }
};

/**
 * Get a detailed analysis of a specific recommendation
 */
export const getRecommendationDetails = async (
  recommendationId: string
): Promise<any> => {
  try {
    console.log(`Getting details for recommendation: ${recommendationId}`);
    
    // For now, just return some static details
    return {
      id: recommendationId,
      title: "Detailed Analysis",
      description: "Extended analysis of the recommendation",
      analysis: [
        "This recommendation is based on your historical energy usage patterns.",
        "Implementation should take approximately 2-3 hours.",
        "The payback period is estimated at 4-6 months."
      ],
      impacts: {
        cost: "Medium positive impact",
        reliability: "Low positive impact",
        sustainability: "High positive impact"
      }
    };
  } catch (error) {
    console.error("Error getting recommendation details:", error);
    toast.error("Failed to get recommendation details");
    throw error;
  }
};
