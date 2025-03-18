
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Get maintenance records for a device
 */
export const getDeviceMaintenanceRecords = async (deviceId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('maintenance_records')
      .select('*')
      .eq('device_id', deviceId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
    
  } catch (error) {
    console.error(`Error fetching maintenance records for device ${deviceId}:`, error);
    toast.error("Failed to fetch maintenance records");
    return [];
  }
};
