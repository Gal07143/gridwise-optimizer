
import { supabase } from "@/integrations/supabase/client";
import { EnergyForecast } from "@/types/energy";
import { toast } from "sonner";

/**
 * Insert energy forecasts for a site
 * Note: Only users with proper permissions can insert forecasts
 */
export const insertEnergyForecasts = async (forecasts: Omit<EnergyForecast, 'id' | 'created_at' | 'timestamp'>[]): Promise<{ success: boolean; localMode: boolean }> => {
  try {
    // Add timestamp field to each forecast
    const forecastsWithTimestamp = forecasts.map(forecast => ({
      ...forecast,
      timestamp: new Date().toISOString()
    }));
    
    const { error } = await supabase
      .from('energy_forecasts')
      .insert(forecastsWithTimestamp);
    
    if (error) {
      // If there's a row-level security policy error, we'll handle it gracefully
      if (error.code === '42501' || error.message.includes('row-level security')) {
        console.warn('Permission denied: Unable to insert energy forecasts due to security policy');
        toast.info("Using local forecast data (demo mode)");
        return { success: true, localMode: true }; // Return true with localMode flag
      }
      throw error;
    }
    
    return { success: true, localMode: false };
  } catch (error) {
    console.error('Error inserting energy forecasts:', error);
    toast.error("Failed to insert energy forecasts");
    return { success: false, localMode: true };
  }
};
