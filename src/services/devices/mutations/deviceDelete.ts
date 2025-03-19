
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
      .select('id')
      .eq('id', id)
      .single();
      
    if (fetchError) {
      console.error(`Error checking if device ${id} exists:`, fetchError);
      toast.error(`Failed to delete device: ${fetchError.message || 'Device not found'}`);
      return false;
    }
    
    if (!existingDevice) {
      toast.error('Device not found');
      return false;
    }
    
    // Delete the device
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
