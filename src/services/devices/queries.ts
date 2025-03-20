
import { supabase } from '@/integrations/supabase/client';
import { EnergyDevice, DeviceType, DeviceStatus } from '@/types/energy';
import { toast } from 'sonner';

// Export functions from individual files
export { getAllDevices } from './getAllDevices';

// Get device by ID
export const getDeviceById = async (deviceId: string): Promise<EnergyDevice | null> => {
  try {
    console.log('Fetching device with ID:', deviceId);
    
    const { data, error } = await supabase
      .from('devices')
      .select('*')
      .eq('id', deviceId)
      .single();
    
    if (error) {
      throw error;
    }
    
    if (!data) {
      console.log('No device found with ID:', deviceId);
      return null;
    }
    
    console.log('Device found:', data);
    
    // Convert to our application's device type
    const device: EnergyDevice = {
      ...data,
      type: data.type as DeviceType,
      status: data.status as DeviceStatus,
      metrics: data.metrics as Record<string, number> | null
    };
    
    return device;
    
  } catch (error: any) {
    console.error('Error fetching device:', error);
    
    // Only show toast error for non-404 errors
    if (error.code !== 'PGRST116') {
      toast.error(`Failed to fetch device: ${error.message || 'Unknown error'}`);
    }
    
    return null;
  }
};
