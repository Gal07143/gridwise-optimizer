
import { supabase } from '@/integrations/supabase/client';
import { DeviceType, DeviceStatus } from '@/types/energy';

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

export const getDeviceById = async (deviceId: string): Promise<Device> => {
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
