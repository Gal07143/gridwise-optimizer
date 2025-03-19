
import { supabase } from "@/integrations/supabase/client";
import { DeviceStatus, isValidDeviceStatus } from "@/types/energy";

/**
 * Get device status statistics for a site
 */
export const getDeviceStatusStats = async (siteId?: string): Promise<Record<DeviceStatus, number>> => {
  try {
    // Base query
    let query = supabase
      .from('devices')
      .select('status');
    
    // Filter by site if provided
    if (siteId) {
      query = query.eq('site_id', siteId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Initialize all status counts
    const stats: Record<DeviceStatus, number> = {
      online: 0,
      offline: 0,
      maintenance: 0,
      error: 0
    };
    
    // Count devices by status
    data?.forEach(device => {
      const status = device.status as DeviceStatus;
      stats[status] = (stats[status] || 0) + 1;
    });
    
    return stats;
    
  } catch (error) {
    console.error("Error fetching device status statistics:", error);
    return {
      online: 0,
      offline: 0,
      maintenance: 0,
      error: 0
    };
  }
};

/**
 * Get devices by status
 */
export const getDevicesByStatus = async (status: DeviceStatus): Promise<number> => {
  try {
    // Validate status before querying
    if (!isValidDeviceStatus(status)) {
      throw new Error(`Invalid device status: ${status}`);
    }
    
    const { count, error } = await supabase
      .from('devices')
      .select('*', { count: 'exact' })
      .eq('status', status);
    
    if (error) throw error;
    
    return count || 0;
  } catch (error) {
    console.error(`Error getting devices with status ${status}:`, error);
    return 0;
  }
};
