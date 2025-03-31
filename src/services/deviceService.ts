import { supabase } from '@/integrations/supabase/client';
import { DeviceType, DeviceStatus } from '@/types/energy';
import { toast } from 'sonner';

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  location?: string;
  capacity?: number;
  firmware?: string;
  installation_date?: string;
  created_at?: string;
  updated_at?: string;
  site_id?: string;
}

// Check if a string is a valid UUID
export const isValidUuid = (id: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

export const getDeviceById = async (deviceId: string): Promise<Device> => {
  try {
    // Sample device data for non-UUID IDs (for testing/demo purposes)
    if (!isValidUuid(deviceId)) {
      console.log("Non-UUID device ID detected, providing demo data", deviceId);
      return {
        id: deviceId,
        name: `Device ${deviceId}`,
        type: 'solar',
        status: 'online',
        location: 'Demo Location',
        capacity: 5000,
        firmware: 'v1.0.0',
        installation_date: new Date().toISOString().slice(0, 10),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        site_id: '00000000-0000-0000-0000-000000000000'
      };
    }
    
    // Regular database query for valid UUIDs
    const { data, error } = await supabase
      .from('devices')
      .select('*')
      .eq('id', deviceId)
      .single();
      
    if (error) {
      console.error("Error fetching device:", error);
      throw new Error(`Failed to fetch device: ${error.message}`);
    }
    
    return data as Device;
  } catch (error) {
    console.error("Error in getDeviceById:", error);
    throw error;
  }
};

export const getDevices = async (): Promise<Device[]> => {
  const { data, error } = await supabase
    .from('devices')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error("Error fetching devices:", error);
    throw new Error(`Failed to fetch devices: ${error.message}`);
  }
  
  return data as Device[];
};

export const createDevice = async (deviceData: Partial<Device>): Promise<Device> => {
  const { data, error } = await supabase
    .from('devices')
    .insert([deviceData])
    .select()
    .single();
    
  if (error) {
    console.error("Error creating device:", error);
    throw new Error(`Failed to create device: ${error.message}`);
  }
  
  return data as Device;
};

export const updateDevice = async (deviceId: string, deviceData: Partial<Device>): Promise<Device> => {
  const { data, error } = await supabase
    .from('devices')
    .update(deviceData)
    .eq('id', deviceId)
    .select()
    .single();
    
  if (error) {
    console.error("Error updating device:", error);
    throw new Error(`Failed to update device: ${error.message}`);
  }
  
  return data as Device;
};

export const deleteDevice = async (deviceId: string): Promise<void> => {
  const { error } = await supabase
    .from('devices')
    .delete()
    .eq('id', deviceId);
    
  if (error) {
    console.error("Error deleting device:", error);
    throw new Error(`Failed to delete device: ${error.message}`);
  }
};

export const fetchDeviceById = getDeviceById; // Alias for compatibility
