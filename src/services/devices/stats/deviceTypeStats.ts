
import { supabase } from "@/integrations/supabase/client";
import { DeviceType, isValidDeviceType } from "@/types/energy";
import { isFilterableDeviceType } from "../deviceCompatibility";

/**
 * Get device type statistics for a site
 */
export const getDeviceTypeStats = async (siteId?: string): Promise<Record<string, number>> => {
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
    
    // Initialize all type counts with basic database types
    const stats: Record<string, number> = {
      solar: 0,
      wind: 0,
      battery: 0,
      grid: 0,
      load: 0,
      ev_charger: 0,
      inverter: 0,
      meter: 0
    };
    
    // Count devices by type
    data?.forEach(device => {
      const type = device.type as string;
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
      ev_charger: 0,
      inverter: 0,
      meter: 0
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
    
    // For non-standard types, we need to handle them differently
    if (!isFilterableDeviceType(type)) {
      // These types aren't in the database directly
      return 0;
    }
    
    const { count, error } = await supabase
      .from('devices')
      .select('*', { count: 'exact', head: true })
      .eq('type', type);
    
    if (error) throw error;
    
    return count || 0;
  } catch (error) {
    console.error(`Error getting devices with type ${type}:`, error);
    return 0;
  }
};
