
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Get weather forecast for a site
 */
export const getWeatherForecast = async (
  siteId: string,
  days: number = 7
): Promise<any[]> => {
  try {
    const { data, error } = await supabase.functions.invoke("weather-api", {
      body: { siteId, days },
    });

    if (error) throw error;
    return data?.forecast || [];
  } catch (error) {
    console.error("Error fetching weather forecast:", error);
    toast.error("Failed to get weather forecast");
    return [];
  }
};

/**
 * Get stored weather data for a site
 */
export const getStoredWeatherData = async (
  siteId: string,
  isForecast: boolean = false
): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from("weather_data")
      .select("*")
      .eq("site_id", siteId)
      .eq("forecast", isForecast)
      .order("timestamp", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching weather data:", error);
    toast.error("Failed to load weather data");
    return [];
  }
};
