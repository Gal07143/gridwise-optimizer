
import { supabase } from "@/integrations/supabase/client";
import { EnergyReading } from "@/types/energy";
import { toast } from "sonner";

/**
 * Get the latest readings for a device
 */
export const getDeviceReadings = async (deviceId: string, limit = 24): Promise<EnergyReading[]> => {
  try {
    const { data, error } = await supabase
      .from('energy_readings')
      .select('*')
      .eq('device_id', deviceId)
      .order('timestamp', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
    
  } catch (error) {
    console.error(`Error fetching readings for device ${deviceId}:`, error);
    toast.error("Failed to fetch device readings");
    return [];
  }
};

/**
 * Add a reading for a device
 */
export const addDeviceReading = async (reading: Omit<EnergyReading, 'id' | 'created_at'>): Promise<EnergyReading | null> => {
  try {
    const { data, error } = await supabase
      .from('energy_readings')
      .insert([reading])
      .select()
      .single();
    
    if (error) throw error;
    return data;
    
  } catch (error) {
    console.error("Error adding device reading:", error);
    return null;
  }
};
