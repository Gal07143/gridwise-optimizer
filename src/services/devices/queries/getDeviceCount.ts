
import { supabase } from "@/integrations/supabase/client";
import { DeviceStatus, DeviceType } from "@/types/energy";
import { toDbDeviceStatus, toDbDeviceType } from "../deviceCompatibility";

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
    
    if (status) {
      // Convert to DB-compatible status before querying
      const dbStatus = toDbDeviceStatus(status as DeviceStatus);
      query = query.eq('status', dbStatus);
    }
    
    if (type) {
      // Convert to DB-compatible type before querying
      const dbType = toDbDeviceType(type as DeviceType);
      query = query.eq('type', dbType);
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
