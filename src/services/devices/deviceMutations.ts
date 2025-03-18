
import { supabase } from "@/integrations/supabase/client";
import { EnergyDevice, DeviceStatus, DeviceType } from "@/types/energy";
import { createDummySite } from "../sites/siteService";
import { toast } from "sonner";

/**
 * Update a device's properties
 */
export const updateDevice = async (id: string, updates: Partial<EnergyDevice>): Promise<EnergyDevice | null> => {
  try {
    // Remove any fields that shouldn't be updated directly
    const { id: _id, created_at, ...updateData } = updates as any;
    
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
    // Add the user id to track who created the device
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    
    if (!userId) {
      toast.error("Authentication required to create device");
      throw new Error("No authenticated user found");
    }
    
    // Get default site if not specified
    let siteId = deviceData.site_id;
    if (!siteId) {
      console.log("No site ID provided, attempting to get default site");
      try {
        const { data: siteData, error } = await supabase.rpc('get_default_site_id');
        
        if (error) {
          console.error("Error getting default site ID:", error);
          // Continue with fallback default
        } else if (siteData) {
          siteId = siteData;
          console.log("Got default site ID:", siteId);
        }
      } catch (siteError) {
        console.error("Error getting default site:", siteError);
        // Continue with fallback default
      }
    }

    // If still no site ID, use fallback or create new one
    if (!siteId) {
      console.log("No site found, using fallback or creating a new one");
      // First try creating a site only if we need to
      try {
        const siteResponse = await createDummySite();
        if (siteResponse) {
          siteId = siteResponse.id;
          console.log("Created new site with ID:", siteId);
        }
      } catch (createError) {
        console.error("Failed to create site:", createError);
      }
      
      // Final fallback - use a dummy ID if nothing else worked
      if (!siteId) {
        console.log("Using fallback site ID");
        siteId = "00000000-0000-0000-0000-000000000000";
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
