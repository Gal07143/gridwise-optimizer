
import { supabase } from "@/integrations/supabase/client";
import { DeviceType, isValidDeviceType } from "@/types/energy";

/**
 * Get device type statistics for a site
 */
export const getDeviceTypeStats = async (siteId?: string): Promise<Record<DeviceType, number>> => {
  try {
    // Base query
    let query = supabase
      .from('devices')
      .select('type');
    
    // Filter by site if provided
    if (siteId) {
      query = query.eq('site_id', siteId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Initialize all type counts
    const stats: Record<DeviceType, number> = {
      solar: 0,
      wind: 0,
      battery: 0,
      grid: 0,
      load: 0,
      ev_charger: 0
    };
    
    // Count devices by type
    data?.forEach(device => {
      const type = device.type as DeviceType;
      stats[type] = (stats[type] || 0) + 1;
    });
    
    return stats;
    
  } catch (error) {
    console.error("Error fetching device type statistics:", error);
    return {
      solar: 0,
      wind: 0,
      battery: 0,
      grid: 0,
      load: 0,
      ev_charger: 0
    };
  }
};

/**
 * Get devices by type
 */
export const getDevicesByType = async (type: DeviceType): Promise<number> => {
  try {
    // Validate type before querying
    if (!isValidDeviceType(type)) {
      throw new Error(`Invalid device type: ${type}`);
    }
    
    const { count, error } = await supabase
      .from('devices')
      .select('*', { count: 'exact' })
      .eq('type', type);
    
    if (error) throw error;
    
    return count || 0;
  } catch (error) {
    console.error(`Error getting devices with type ${type}:`, error);
    return 0;
  }
};
