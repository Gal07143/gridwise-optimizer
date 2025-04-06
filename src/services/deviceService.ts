
import { Device } from '@/types/device';
import { getAllDevices as getDevicesFromService } from '@/services/devices/getAllDevices';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Re-export functions
export { getAllDevices } from '@/services/devices/getAllDevices';

// Re-export as getDevices for backwards compatibility
export const getDevices = async (options?: any): Promise<Device[]> => {
  return getDevicesFromService(options);
};

// Add missing functions
export const getDeviceById = async (id: string): Promise<Device | null> => {
  try {
    const { data, error } = await supabase
      .from('devices')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data as Device;
  } catch (error) {
    console.error('Error fetching device by ID:', error);
    toast.error('Failed to fetch device details');
    return null;
  }
};

export const createDevice = async (device: Omit<Device, 'id'>): Promise<Device | null> => {
  try {
    const { data, error } = await supabase
      .from('devices')
      .insert(device)
      .select()
      .single();
      
    if (error) throw error;
    toast.success('Device created successfully');
    return data as Device;
  } catch (error) {
    console.error('Error creating device:', error);
    toast.error('Failed to create device');
    return null;
  }
};

export const updateDevice = async (id: string, device: Partial<Device>): Promise<Device | null> => {
  try {
    const { data, error } = await supabase
      .from('devices')
      .update(device)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    toast.success('Device updated successfully');
    return data as Device;
  } catch (error) {
    console.error('Error updating device:', error);
    toast.error('Failed to update device');
    return null;
  }
};

export const deleteDevice = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('devices')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    toast.success('Device deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting device:', error);
    toast.error('Failed to delete device');
    return false;
  }
};
