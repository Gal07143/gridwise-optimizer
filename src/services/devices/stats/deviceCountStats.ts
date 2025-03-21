
import { supabase } from "@/integrations/supabase/client";
import { DeviceStatus, DeviceType } from "@/types/energy";
import { toDbDeviceStatus, toDbDeviceType } from "../deviceCompatibility";

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
      // Convert to DB-compatible status before querying
      const dbStatus = toDbDeviceStatus(options.status);
      query = query.eq('status', dbStatus);
    }
    
    if (options?.type) {
      // Convert to DB-compatible type before querying
      const dbType = toDbDeviceType(options.type);
      query = query.eq('type', dbType);
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
