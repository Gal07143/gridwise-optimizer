
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertType, AlertSeverity } from "@/types/energy";
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
      // Convert type to match database expectations
      // Only filter by type if it's one of the allowed types in the database
      if (['warning', 'critical', 'info'].includes(options.type)) {
        query = query.eq('type', options.type);
      }
    }
    
    query = query.order('timestamp', { ascending: false });
    
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Transform data to match Alert interface
    const alerts: Alert[] = (data || []).map(item => ({
      id: item.id,
      device_id: item.device_id,
      type: (item.type || 'system') as AlertType,
      title: item.message || item.type, 
      message: item.message,
      severity: (item.type === 'warning' ? 'medium' : 
                item.type === 'critical' ? 'high' : 'low') as AlertSeverity,
      timestamp: item.timestamp,
      acknowledged: item.acknowledged,
      acknowledged_at: item.acknowledged_at,
      acknowledged_by: item.acknowledged_by,
      resolved_at: item.resolved_at,
      source: item.source || 'system',
      resolved: !!item.resolved_at,
      source_id: item.device_id
    }));
    
    return alerts;
    
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
    // Map our AlertType to the database's acceptable types
    let dbType = 'info';
    if (alert.type === 'warning' || alert.type === 'critical') {
      dbType = alert.type;
    } else if (alert.severity === 'critical' || alert.severity === 'high') {
      dbType = 'critical';
    } else if (alert.severity === 'medium') {
      dbType = 'warning';
    }
    
    const { data, error } = await supabase
      .from('alerts')
      .insert({
        device_id: alert.device_id,
        type: dbType,
        message: alert.message,
        timestamp: alert.timestamp,
        acknowledged: false
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Transform to match Alert interface
    const createdAlert: Alert = {
      id: data.id,
      device_id: data.device_id,
      type: alert.type,
      title: alert.title || data.message || data.type,
      message: data.message,
      severity: alert.severity || 'medium',
      timestamp: data.timestamp,
      acknowledged: data.acknowledged,
      acknowledged_at: data.acknowledged_at,
      acknowledged_by: data.acknowledged_by,
      resolved_at: data.resolved_at,
      source: alert.source,
      resolved: false
    };
    
    return createdAlert;
    
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
