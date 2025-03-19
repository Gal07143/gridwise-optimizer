
import { supabase } from "@/integrations/supabase/client";
import { DeviceStatus, DeviceType, isValidDeviceStatus, isValidDeviceType } from "@/types/energy";

interface DeviceQueryOptions {
  siteId?: string;
  status?: DeviceStatus | string;
  type?: DeviceType | string;
  search?: string;
}

/**
 * Get total device count with optional filters
 */
export const getDeviceCount = async (options: DeviceQueryOptions = {}): Promise<number> => {
  try {
    const { siteId, status, type, search } = options;
    
    let query = supabase
      .from('devices')
      .select('id', { count: 'exact', head: true });
    
    // Apply filters
    if (siteId) {
      query = query.eq('site_id', siteId);
    }
    
    if (status && isValidDeviceStatus(status)) {
      query = query.eq('status', status);
    }
    
    if (type && isValidDeviceType(type)) {
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
