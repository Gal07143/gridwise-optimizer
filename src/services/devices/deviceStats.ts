
import { supabase } from "@/integrations/supabase/client";
import { DeviceStatus, DeviceType } from "@/types/energy";

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
export const getDeviceCount = async (options: {
  siteId?: string;
  status?: DeviceStatus | string;
  type?: DeviceType | string;
  search?: string;
} = {}): Promise<number> => {
  try {
    const { siteId, status, type, search } = options;
    
    let query = supabase
      .from('devices')
      .select('id', { count: 'exact', head: true });
    
    // Apply filters
    if (siteId) {
      query = query.eq('site_id', siteId);
    }
    
    if (status) {
      query = query.eq('status', status);
    }
    
    if (type) {
      query = query.eq('type', type);
    }
    
    if (search) {
      query = query.or(`name.ilike.%${search}%,location.ilike.%${search}%`);
    }
    
    const { count, error } = await query;
    
    if (error) throw error;
    
    return count || 0;
    
  } catch (error) {
    console.error("Error counting devices:", error);
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
