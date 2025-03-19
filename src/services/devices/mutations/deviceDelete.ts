
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
