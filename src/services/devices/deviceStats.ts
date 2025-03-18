import { supabase } from "@/integrations/supabase/client";
import { DeviceStatus, DeviceType, isValidDeviceStatus, isValidDeviceType } from "@/types/energy";

/**
 * Get count of devices by site
 */
export const getDeviceCountBySite = async (siteId: string): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('devices')
      .select('*', { count: 'exact', head: true })
      .eq('site_id', siteId);
    
    if (error) throw error;
    return count || 0;
    
  } catch (error) {
    console.error(`Error counting devices for site ${siteId}:`, error);
    return 0;
  }
};

/**
 * Get device count with optional filters
 */
export const getDeviceCount = async (options?: {
  siteId?: string;
  status?: DeviceStatus;
  type?: DeviceType;
  search?: string;
}): Promise<number> => {
  try {
    let query = supabase
      .from('devices')
      .select('id', { count: 'exact' });
    
    if (options?.siteId) {
      query = query.eq('site_id', options.siteId);
    }
    
    if (options?.status) {
      query = query.eq('status', options.status);
    }
    
    if (options?.type) {
      query = query.eq('type', options.type);
    }
    
    if (options?.search) {
      query = query.or(`name.ilike.%${options.search}%,location.ilike.%${options.search}%`);
    }
    
    const { count, error } = await query;
    
    if (error) throw error;
    
    return count || 0;
  } catch (error) {
    console.error('Error counting devices:', error);
    return 0;
  }
};

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
