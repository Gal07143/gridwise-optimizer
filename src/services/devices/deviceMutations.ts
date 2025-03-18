
import { supabase } from "@/integrations/supabase/client";
import { EnergyDevice, DeviceStatus, DeviceType, isValidDeviceStatus, isValidDeviceType } from "@/types/energy";
import { getOrCreateDummySite } from "../sites/siteService";
import { toast } from "sonner";

/**
 * Validate device type and status
 * @param deviceData Partial device data to validate
 * @throws Error if validation fails
 */
const validateDeviceData = (deviceData: Partial<EnergyDevice>) => {
  if (deviceData.type && !isValidDeviceType(deviceData.type)) {
    throw new Error(`Invalid device type: ${deviceData.type}`);
  }
  
  if (deviceData.status && !isValidDeviceStatus(deviceData.status)) {
    throw new Error(`Invalid device status: ${deviceData.status}`);
  }
};

/**
 * Get the current authenticated user ID or throw error if not authenticated
 */
const getAuthenticatedUserId = async (): Promise<string> => {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id;
  
  if (!userId) {
    throw new Error("Authentication required");
  }
  
  return userId;
};

/**
 * Get a valid site ID, with fallbacks if needed
 */
const getValidSiteId = async (providedSiteId?: string): Promise<string> => {
  // If site ID is provided, use it
  if (providedSiteId) {
    return providedSiteId;
  }
  
  try {
    // Try to get a site with a direct query to avoid RLS issues
    const { data: sites, error } = await supabase
      .from('sites')
      .select('id')
      .limit(1);
    
    if (!error && sites && sites.length > 0) {
      return sites[0].id;
    }
  } catch (siteError) {
    console.error("Error getting site ID via direct query:", siteError);
    // Continue with fallback mechanisms
  }
  
  // Try to get or create a site using the site service
  try {
    const site = await getOrCreateDummySite();
    if (site && site.id) {
      return site.id;
    }
  } catch (siteError) {
    console.error("Error getting site via service:", siteError);
    // Continue with final fallback
  }
  
  // Final fallback - use dummy ID
  return "00000000-0000-0000-0000-000000000000";
};

/**
 * Update a device's properties
 */
export const updateDevice = async (id: string, updates: Partial<EnergyDevice>): Promise<EnergyDevice | null> => {
  try {
    // Remove any fields that shouldn't be updated directly
    const { id: _id, created_at, ...updateData } = updates as any;
    
    // Validate device data
    validateDeviceData(updateData);
    
    console.log("Updating device with data:", updateData);
    
    const { data, error } = await supabase
      .from('devices')
      .update({ ...updateData, last_updated: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating device ${id}:`, error);
      throw error;
    }
    
    if (!data) {
      toast.error("No device data returned from update");
      return null;
    }
    
    // Convert the database response to match our TypeScript interface
    const device: EnergyDevice = {
      ...data,
      type: data.type as DeviceType,
      status: data.status as DeviceStatus,
      metrics: data.metrics as Record<string, number> | null
    };
    
    toast.success("Device updated successfully");
    return device;
    
  } catch (error: any) {
    console.error(`Error updating device ${id}:`, error);
    toast.error(`Failed to update device: ${error.message || 'Unknown error'}`);
    return null;
  }
};

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

/**
 * Delete a device by ID
 */
export const deleteDevice = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('devices')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    toast.success("Device deleted successfully");
    return true;
  } catch (error: any) {
    console.error(`Error deleting device ${id}:`, error);
    toast.error(`Failed to delete device: ${error.message || 'Unknown error'}`);
    return false;
  }
};

/**
 * Batch update multiple devices
 * @param devices Array of device IDs and their updates
 */
export const batchUpdateDevices = async (devices: Array<{ id: string, updates: Partial<EnergyDevice> }>): Promise<number> => {
  let successCount = 0;
  
  // Create a batch transaction
  for (const device of devices) {
    try {
      const result = await updateDevice(device.id, device.updates);
      if (result) successCount++;
    } catch (error) {
      console.error(`Error updating device ${device.id} in batch operation:`, error);
      // Continue with other updates
    }
  }
  
  if (successCount === 0) {
    toast.error("Failed to update any devices");
  } else if (successCount < devices.length) {
    toast.warning(`Updated ${successCount} of ${devices.length} devices`);
  } else {
    toast.success(`All ${successCount} devices updated successfully`);
  }
  
  return successCount;
};
