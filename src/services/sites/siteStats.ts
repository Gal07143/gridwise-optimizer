
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Get site statistics including device counts and energy metrics
 */
export const getSiteStatistics = async (siteId: string): Promise<{
  deviceCount: number;
  totalEnergyGenerated: number;
  totalEnergyConsumed: number;
}> => {
  try {
    // Fetch device count
    const { count: deviceCount, error: deviceError } = await supabase
      .from('devices')
      .select('id', { count: 'exact', head: true })
      .eq('site_id', siteId);
    
    if (deviceError) throw deviceError;
    
    // In a real application, we would calculate these values from actual readings
    // For now, we're using simulated values
    const totalEnergyGenerated = Math.random() * 1000;
    const totalEnergyConsumed = Math.random() * 800;
    
    return {
      deviceCount: deviceCount || 0,
      totalEnergyGenerated,
      totalEnergyConsumed,
    };
  } catch (error) {
    console.error(`Error fetching site statistics for site ${siteId}:`, error);
    toast.error("Failed to fetch site statistics");
    return { deviceCount: 0, totalEnergyGenerated: 0, totalEnergyConsumed: 0 };
  }
};

/**
 * Get users associated with a site
 */
export const getSiteUsers = async (siteId: string): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('user_site_access')
      .select('user_id', { count: 'exact', head: true })
      .eq('site_id', siteId);
    
    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error(`Error fetching site users for site ${siteId}:`, error);
    return 0;
  }
};
