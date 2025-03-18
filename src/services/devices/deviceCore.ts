
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

/**
 * Update a device's properties
 */
export const updateDevice = async (id: string, updates: Partial<EnergyDevice>): Promise<EnergyDevice | null> => {
  try {
    // Remove any fields that shouldn't be updated directly
    const { id: _id, created_at, ...updateData } = updates as any;
    
    const { data, error } = await supabase
      .from('devices')
      .update({ ...updateData, last_updated: new Date().toISOString() })
      .eq('id', id)
      .select()
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
    
    toast.success("Device updated successfully");
    return device;
    
  } catch (error) {
    console.error(`Error updating device ${id}:`, error);
    toast.error("Failed to update device");
    return null;
  }
};

/**
 * Create a new device
 */
export const createDevice = async (deviceData: Omit<EnergyDevice, 'id' | 'created_at' | 'last_updated'>): Promise<EnergyDevice | null> => {
  try {
    // Add the user id to track who created the device
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    
    if (!userId) {
      throw new Error("No authenticated user found");
    }
    
    // Get default site if not specified
    let siteId = deviceData.site_id;
    if (!siteId) {
      console.log("No site ID provided, attempting to get default site");
      try {
        const { data: siteData } = await supabase.rpc('get_default_site_id');
        siteId = siteData;
        console.log("Got default site ID:", siteId);
      } catch (siteError) {
        console.error("Error getting default site:", siteError);
      }
    }

    if (!siteId) {
      console.log("No site found, creating a new one");
      const siteResponse = await import('../sites/siteService').then(module => module.createDummySite());
      if (siteResponse) {
        siteId = siteResponse.id;
        console.log("Created new site with ID:", siteId);
      } else {
        console.error("Failed to create site");
        throw new Error("Could not create or find a site");
      }
    }

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
    
    if (!data) return null;
    
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
    
    return true;
  } catch (error) {
    console.error(`Error deleting device ${id}:`, error);
    toast.error("Failed to delete device");
    return false;
  }
};
