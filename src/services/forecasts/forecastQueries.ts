
import { supabase } from "@/integrations/supabase/client";
import { EnergyForecast } from "@/types/energy";

/**
 * Get energy forecasts for a site
 */
export const getSiteForecasts = async (siteId: string, hours = 24): Promise<EnergyForecast[]> => {
  try {
    // Query the energy_forecasts table with safe casting
    const { data, error } = await supabase
      .from('energy_forecasts')
      .select('*')
      .eq('site_id', siteId)
      .order('forecast_time', { ascending: true })
      .limit(hours);
    
    if (error) {
      console.error(`Error fetching forecasts for site ${siteId}:`, error);
      return [];
    }
    
    // Cast data to the correct type
    return (data || []) as EnergyForecast[];
    
  } catch (error) {
    console.error(`Error fetching forecasts for site ${siteId}:`, error);
    return [];
  }
};

/**
 * Get aggregated forecast metrics for a site
 */
export const getSiteForecastMetrics = async (siteId: string) => {
  try {
    const forecasts = await getSiteForecasts(siteId);
    
    if (forecasts.length === 0) {
      return {
        totalGeneration: 0,
        totalConsumption: 0,
        netEnergy: 0,
        peakGeneration: 0,
        peakConsumption: 0,
        confidence: 0,
      };
    }
    
    const totalGeneration = forecasts.reduce((sum, item) => sum + item.generation_forecast, 0);
    const totalConsumption = forecasts.reduce((sum, item) => sum + item.consumption_forecast, 0);
    const netEnergy = totalGeneration - totalConsumption;
    const peakGeneration = Math.max(...forecasts.map(item => item.generation_forecast));
    const peakConsumption = Math.max(...forecasts.map(item => item.consumption_forecast));
    const avgConfidence = forecasts.reduce((sum, item) => sum + (item.confidence || 0), 0) / forecasts.length;
    
    return {
      totalGeneration,
      totalConsumption,
      netEnergy,
      peakGeneration,
      peakConsumption,
      confidence: avgConfidence,
    };
  } catch (error) {
    console.error(`Error calculating forecast metrics for site ${siteId}:`, error);
    return null;
  }
};
