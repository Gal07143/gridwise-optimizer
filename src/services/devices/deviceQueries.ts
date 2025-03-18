
import { supabase } from "@/integrations/supabase/client";
import { EnergyDevice, DeviceStatus, DeviceType, isValidDeviceStatus, isValidDeviceType } from "@/types/energy";
import { toast } from "sonner";

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
    
    if (status && isValidDeviceStatus(status)) {
      query = query.eq('status', status);
    }
    
    if (type && isValidDeviceType(type)) {
      query = query.eq('type', type);
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
      metrics: device.metrics as Record<string, number> | null
    })) || [];
    
    return devices;
    
  } catch (error) {
    console.error("Error fetching devices:", error);
    toast.error("Failed to fetch devices");
    return [];
  }
};

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

/**
 * Get a single device by ID
 */
export const getDeviceById = async (id: string): Promise<EnergyDevice | null> => {
  try {
    const { data, error } = await supabase
      .from('devices')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (!data) return null;
    
    // Convert the database response to match our TypeScript interface
    const device: EnergyDevice = {
      ...data,
      type: data.type as DeviceType,
      status: data.status as DeviceStatus,
      metrics: data.metrics as Record<string, number> | null
    };
    
    return device;
    
  } catch (error) {
    console.error(`Error fetching device ${id}:`, error);
    toast.error("Failed to fetch device details");
    return null;
  }
};

/**
 * Get device statistics grouped by type/status
 */
export const getDeviceStatistics = async (siteId?: string): Promise<{
  byType: Record<string, number>;
  byStatus: Record<string, number>;
  total: number;
}> => {
  try {
    // Get devices
    const devices = await getAllDevices({ 
      siteId, 
      pageSize: 1000 // Get a larger batch for stats
    });
    
    const stats = {
      byType: {} as Record<string, number>,
      byStatus: {} as Record<string, number>,
      total: devices.length
    };
    
    // Calculate stats
    devices.forEach(device => {
      // Count by type
      if (!stats.byType[device.type]) {
        stats.byType[device.type] = 0;
      }
      stats.byType[device.type]++;
      
      // Count by status
      if (!stats.byStatus[device.status]) {
        stats.byStatus[device.status] = 0;
      }
      stats.byStatus[device.status]++;
    });
    
    return stats;
    
  } catch (error) {
    console.error("Error fetching device statistics:", error);
    return { byType: {}, byStatus: {}, total: 0 };
  }
};
