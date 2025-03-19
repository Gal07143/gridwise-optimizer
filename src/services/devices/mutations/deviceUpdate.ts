
import { supabase } from "@/integrations/supabase/client";
import { EnergyDevice, DeviceStatus, DeviceType } from "@/types/energy";
import { validateDeviceData } from "./deviceValidation";
import { toast } from "sonner";

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
