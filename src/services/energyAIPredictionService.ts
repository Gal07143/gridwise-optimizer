
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Prediction {
  date: string;
  generation: number;
  consumption: number;
  temperature?: number;
  cloudCover?: number;
  windSpeed?: number;
  weatherCondition?: string;
}

/**
 * Generate energy predictions using AI
 */
export const generateEnergyPredictions = async (
  siteId: string,
  days: number = 7,
  includeWeather: boolean = true
): Promise<Prediction[]> => {
  try {
    const { data, error } = await supabase.functions.invoke("energy-ai-predictions", {
      body: { siteId, days, includeWeather },
    });

    if (error) throw error;
    return data?.predictions || [];
  } catch (error) {
    console.error("Error generating energy predictions:", error);
    toast.error("Failed to generate energy predictions");
    return [];
  }
};

/**
 * Get stored energy forecasts for a site
 */
export const getEnergyForecasts = async (siteId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from("energy_forecasts")
      .select("*")
      .eq("site_id", siteId)
      .order("forecast_time", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching energy forecasts:", error);
    toast.error("Failed to load energy forecasts");
    return [];
  }
};

/**
 * Get AI recommendations for a site
 */
export const getEnergyRecommendations = async (siteId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from("ai_recommendations")
      .select("*")
      .eq("site_id", siteId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching AI recommendations:", error);
    toast.error("Failed to load AI recommendations");
    return [];
  }
};

/**
 * Apply an AI recommendation
 */
export const applyRecommendation = async (recommendationId: string, userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("ai_recommendations")
      .update({
        applied: true,
        applied_at: new Date().toISOString(),
        applied_by: userId,
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
