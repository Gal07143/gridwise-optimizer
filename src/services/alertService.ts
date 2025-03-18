
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertType } from "@/types/energy";
import { toast } from "sonner";

/**
 * Get all alerts, with optional filtering
 */
export const getAlerts = async (options?: {
  deviceId?: string;
  acknowledged?: boolean;
  type?: AlertType;
  limit?: number;
}): Promise<Alert[]> => {
  try {
    let query = supabase
      .from('alerts')
      .select('*');
    
    if (options?.deviceId) {
      query = query.eq('device_id', options.deviceId);
    }
    
    if (options?.acknowledged !== undefined) {
      query = query.eq('acknowledged', options.acknowledged);
    }
    
    if (options?.type) {
      query = query.eq('type', options.type);
    }
    
    query = query.order('timestamp', { ascending: false });
    
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
    
  } catch (error) {
    console.error("Error fetching alerts:", error);
    toast.error("Failed to fetch alerts");
    return [];
  }
};

/**
 * Acknowledge an alert
 */
export const acknowledgeAlert = async (alertId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('alerts')
      .update({
        acknowledged: true,
        acknowledged_at: new Date().toISOString(),
        acknowledged_by: (await supabase.auth.getUser()).data.user?.id
      })
      .eq('id', alertId);
    
    if (error) throw error;
    
    toast.success("Alert acknowledged");
    return true;
    
  } catch (error) {
    console.error(`Error acknowledging alert ${alertId}:`, error);
    toast.error("Failed to acknowledge alert");
    return false;
  }
};

/**
 * Create a new alert
 */
export const createAlert = async (alert: Omit<Alert, 'id' | 'acknowledged' | 'acknowledged_by' | 'acknowledged_at' | 'resolved_at'>): Promise<Alert | null> => {
  try {
    const { data, error } = await supabase
      .from('alerts')
      .insert([{
        ...alert,
        acknowledged: false
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
    
  } catch (error) {
    console.error("Error creating alert:", error);
    return null;
  }
};

/**
 * Resolve an alert
 */
export const resolveAlert = async (alertId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('alerts')
      .update({
        resolved_at: new Date().toISOString()
      })
      .eq('id', alertId);
    
    if (error) throw error;
    
    toast.success("Alert resolved");
    return true;
    
  } catch (error) {
    console.error(`Error resolving alert ${alertId}:`, error);
    toast.error("Failed to resolve alert");
    return false;
  }
};
