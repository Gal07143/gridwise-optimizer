
import { supabase } from "@/integrations/supabase/client";
import { EnergyDevice, DeviceStatus, DeviceType } from "@/types/energy";
import { toast } from "sonner";

/**
 * Get all energy devices
 */
export const getAllDevices = async (): Promise<EnergyDevice[]> => {
  try {
    const { data, error } = await supabase
      .from('devices')
      .select('*');
    
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
