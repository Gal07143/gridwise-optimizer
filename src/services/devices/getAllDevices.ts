
import { supabase } from '@/integrations/supabase/client';
import { EnergyDevice, DeviceType, DeviceStatus } from '@/types/energy';
import { toast } from 'sonner';
import { toDbDeviceType, toDbDeviceStatus } from './deviceCompatibility';

interface DeviceQueryOptions {
  type?: DeviceType;
  status?: DeviceStatus;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export const getAllDevices = async (options?: DeviceQueryOptions): Promise<EnergyDevice[]> => {
  try {
    console.log('Fetching all devices with options:', options);
    
    let query = supabase.from('devices').select('*');
    
    // Apply filters with proper type conversion
    if (options?.type) {
      const dbType = toDbDeviceType(options.type);
      query = query.eq('type', dbType);
    }
    
    if (options?.status) {
      const dbStatus = toDbDeviceStatus(options.status);
      query = query.eq('status', dbStatus);
    }
    
    if (options?.search) {
      query = query.or(`name.ilike.%${options.search}%,location.ilike.%${options.search}%`);
    }
    
    // Apply sorting
    if (options?.sort) {
      query = query.order(options.sort, { ascending: options.order === 'asc' });
    } else {
      query = query.order('name', { ascending: true });
    }
    
    // Apply pagination
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log('No devices found');
      return [];
    }
    
    console.log(`Found ${data.length} devices`);
    
    // Convert to our application's device type
    const devices: EnergyDevice[] = data.map(item => ({
      ...item,
      type: item.type as DeviceType,
      status: item.status as DeviceStatus,
      metrics: item.metrics ? (typeof item.metrics === 'string' ? JSON.parse(item.metrics) : item.metrics) as Record<string, number>
    }));
    
    return devices;
    
  } catch (error: any) {
    console.error('Error fetching devices:', error);
    toast.error(`Failed to fetch devices: ${error.message || 'Unknown error'}`);
    return [];
  }
};
