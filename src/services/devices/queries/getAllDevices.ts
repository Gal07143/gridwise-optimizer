
import { supabase } from "@/integrations/supabase/client";
import { EnergyDevice, DeviceStatus, DeviceType } from "@/types/energy";
import { toast } from "sonner";
import { toDbDeviceStatus, toDbDeviceType } from "../deviceCompatibility";

interface DeviceQueryOptions {
  siteId?: string;
  page?: number;
  pageSize?: number;
  orderBy?: string;
  ascending?: boolean;
  status?: DeviceStatus | string;
  type?: DeviceType | string;
  search?: string;
}

/**
 * Get all energy devices with pagination and filtering
 */
export const getAllDevices = async (options: DeviceQueryOptions = {}): Promise<EnergyDevice[]> => {
  try {
    const {
      siteId,
      page = 0,
      pageSize = 100,
      orderBy = 'name',
      ascending = true,
      status,
      type,
      search
    } = options;
    
    let query = supabase
      .from('devices')
      .select('*')
      .order(orderBy, { ascending });
    
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
    
    // Apply pagination
    if (pageSize > 0) {
      const start = page * pageSize;
      const end = start + pageSize - 1;
      query = query.range(start, end);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Convert the database response to match our TypeScript interface
    const devices: EnergyDevice[] = data?.map(device => ({
      ...device,
      type: device.type as DeviceType,
      status: device.status as DeviceStatus,
      metrics: device.metrics ? (typeof device.metrics === 'string' ? JSON.parse(device.metrics) : device.metrics) as Record<string, any> : null
    })) || [];
    
    return devices;
    
  } catch (error) {
    console.error("Error fetching devices:", error);
    toast.error("Failed to fetch devices");
    return [];
  }
};
