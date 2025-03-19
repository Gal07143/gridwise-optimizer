
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PostgrestError } from "@supabase/supabase-js";

/**
 * Delete a device by ID
 * @param id The device ID to delete
 * @returns A promise that resolves to a boolean indicating success or failure
 */
export const deleteDevice = async (id: string): Promise<boolean> => {
  if (!id) {
    console.error('Invalid device ID provided to deleteDevice');
    toast.error('Cannot delete device: Invalid ID');
    return false;
  }

  try {
    // First check if the device exists
    const { data: existingDevice, error: fetchError } = await supabase
      .from('devices')
      .select('id, name')
      .eq('id', id)
      .maybeSingle();
      
    if (fetchError) {
      console.error(`Error checking if device ${id} exists:`, fetchError);
      toast.error(`Failed to delete device: ${fetchError.message || 'Device not found'}`);
      return false;
    }
    
    if (!existingDevice) {
      toast.error('Device not found');
      return false;
    }
    
    // Check for related records that might cause foreign key constraints
    const { count: readingsCount, error: readingsError } = await supabase
      .from('energy_readings')
      .select('*', { count: 'exact', head: true })
      .eq('device_id', id);
    
    if (readingsError) {
      console.warn(`Error checking device readings: ${readingsError.message}`);
      // Continue anyway, as this is just a precaution
    }
    
    if (readingsCount && readingsCount > 0) {
      console.log(`Device has ${readingsCount} readings that will be deleted or orphaned`);
      // Consider adding logic to handle related records
    }
    
    // Delete the device
    const { error } = await supabase
      .from('devices')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    toast.success(`Device "${existingDevice.name}" deleted successfully`);
    return true;
  } catch (error) {
    const pgError = error as PostgrestError;
    console.error(`Error deleting device ${id}:`, pgError);
    
    // Check for constraint violations
    if (pgError.code === '23503') { // Foreign key constraint violation
      toast.error('Cannot delete device: It is referenced by other records');
    } else {
      toast.error(`Failed to delete device: ${pgError.message || 'Unknown error'}`);
    }
    
    return false;
  }
};
