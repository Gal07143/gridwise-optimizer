
import { supabase } from "@/integrations/supabase/client";
import { EnergyDevice, DeviceStatus, DeviceType } from "@/types/energy";
import { toast } from "sonner";

/**
 * Get a single device by ID
 */
export const getDeviceById = async (id: string): Promise<EnergyDevice | null> => {
  if (!id) {
    console.error("Invalid device ID provided");
    return null;
  }

  try {
    console.log(`Fetching device with ID: ${id}`);
    
    const { data, error } = await supabase
      .from('devices')
      .select('*')
      .eq('id', id)
      .maybeSingle(); // Using maybeSingle instead of single to handle case when no record is found
    
    if (error) {
      console.error(`Supabase error fetching device ${id}:`, error);
      throw error;
    }
    
    if (!data) {
      console.log(`No device found with ID: ${id}`);
      return null;
    }
    
    console.log(`Device data retrieved:`, data);
    
    // Convert the database response to match our TypeScript interface
    const device: EnergyDevice = {
      ...data,
      type: data.type as DeviceType,
      status: data.status as DeviceStatus,
      metrics: data.metrics as Record<string, number> | null
    };
    
    return device;
    
  } catch (error: any) {
    console.error(`Error fetching device ${id}:`, error);
    toast.error(`Failed to fetch device details: ${error?.message || 'Unknown error'}`);
    return null;
  }
};
