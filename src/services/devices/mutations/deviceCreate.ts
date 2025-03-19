
import { supabase } from "@/integrations/supabase/client";
import { EnergyDevice, DeviceStatus, DeviceType } from "@/types/energy";
import { validateDeviceData } from "./deviceValidation";
import { getValidSiteId, getAuthenticatedUserId } from "./siteUtils";
import { toast } from "sonner";

/**
 * Create a new device
 */
export const createDevice = async (deviceData: Omit<EnergyDevice, 'id' | 'created_at' | 'last_updated'>): Promise<EnergyDevice | null> => {
  try {
    // Validate device data
    validateDeviceData(deviceData);
    
    // Get the authenticated user ID
    const userId = await getAuthenticatedUserId();
    
    // Get a valid site ID
    const siteId = await getValidSiteId(deviceData.site_id);
    
    // Make sure we have a timestamp for creation
    const timestamp = new Date().toISOString();
    
    // Prepare the data with defaults for required fields
    const preparedData = {
      ...deviceData,
      created_by: userId,
      last_updated: timestamp,
      site_id: siteId,
      status: deviceData.status || 'online',
      metrics: deviceData.metrics || null
    };
    
    console.log("Creating device with data:", preparedData);
    
    const { data, error } = await supabase
      .from('devices')
      .insert([preparedData])
      .select()
      .single();
    
    if (error) {
      console.error("Error creating device:", error);
      throw error;
    }
    
    if (!data) {
      toast.error("No device data returned");
      return null;
    }
    
    // Convert the database response to match our TypeScript interface
    const device: EnergyDevice = {
      ...data,
      type: data.type as DeviceType,
      status: data.status as DeviceStatus,
      metrics: data.metrics as Record<string, number> | null
    };
    
    toast.success("Device created successfully");
    return device;
    
  } catch (error: any) {
    console.error("Error creating device:", error);
    toast.error(`Failed to create device: ${error.message || 'Unknown error'}`);
    return null;
  }
};
