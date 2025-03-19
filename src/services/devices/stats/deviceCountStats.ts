
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
