
import { supabase } from "@/lib/supabase";

export interface Alert {
  id: string;
  type: string;
  message: string;
  device_id: string;
  timestamp: string;
  acknowledged: boolean;
  acknowledged_at?: string;
  acknowledged_by?: string;
  severity: string;
  source?: string;
  resolved_at?: string;
}

export interface AlertSummary {
  total: number;
  critical: number;
  warning: number;
  info: number;
  unacknowledged: number;
}

// Fetch all alerts
export async function getAlerts(
  limit: number = 20,
  filters?: {
    severity?: string;
    acknowledged?: boolean;
    deviceId?: string;
    startDate?: string;
    endDate?: string;
  }
): Promise<Alert[]> {
  try {
    let query = supabase
      .from('alerts')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);

    // Apply filters if provided
    if (filters) {
      if (filters.severity) {
        query = query.eq('severity', filters.severity);
      }
      if (filters.acknowledged !== undefined) {
        query = query.eq('acknowledged', filters.acknowledged);
      }
      if (filters.deviceId) {
        query = query.eq('device_id', filters.deviceId);
      }
      if (filters.startDate) {
        query = query.gte('timestamp', filters.startDate);
      }
      if (filters.endDate) {
        query = query.lte('timestamp', filters.endDate);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching alerts:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAlerts:', error);
    throw error;
  }
}

// Get a summary of alerts (counts by severity)
export async function getAlertSummary(): Promise<AlertSummary> {
  try {
    const { data: alerts, error } = await supabase
      .from('alerts')
      .select('*');

    if (error) {
      console.error('Error fetching alert summary:', error);
      throw error;
    }

    const summary: AlertSummary = {
      total: alerts?.length || 0,
      critical: alerts?.filter(a => a.severity === 'critical')?.length || 0,
      warning: alerts?.filter(a => a.severity === 'warning')?.length || 0,
      info: alerts?.filter(a => a.severity === 'info')?.length || 0,
      unacknowledged: alerts?.filter(a => !a.acknowledged)?.length || 0
    };

    return summary;
  } catch (error) {
    console.error('Error in getAlertSummary:', error);
    throw error;
  }
}

// Create a new alert
export async function createAlert(alert: Omit<Alert, 'id' | 'timestamp'>): Promise<Alert> {
  try {
    const { data, error } = await supabase
      .from('alerts')
      .insert([{
        ...alert,
        timestamp: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating alert:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in createAlert:', error);
    throw error;
  }
}

// Acknowledge an alert
export async function acknowledgeAlert(alertId: string, userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('alerts')
      .update({
        acknowledged: true,
        acknowledged_at: new Date().toISOString(),
        acknowledged_by: userId
      })
      .eq('id', alertId);

    if (error) {
      console.error('Error acknowledging alert:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error in acknowledgeAlert:', error);
    throw error;
  }
}

// Mark an alert as resolved
export async function resolveAlert(alertId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('alerts')
      .update({
        resolved_at: new Date().toISOString()
      })
      .eq('id', alertId);

    if (error) {
      console.error('Error resolving alert:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error in resolveAlert:', error);
    throw error;
  }
}

// Get alerts for a specific device
export async function getDeviceAlerts(deviceId: string, limit: number = 10): Promise<Alert[]> {
  try {
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .eq('device_id', deviceId)
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching device alerts:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getDeviceAlerts:', error);
    throw error;
  }
}

// Get recent alerts
export async function getRecentAlerts(limit: number = 5): Promise<Alert[]> {
  // This is a sample function that returns mock data for now
  // In a real application, you would call getAlerts with appropriate filters
  const mockAlerts: Alert[] = [
    {
      id: "1",
      type: "device_status",
      message: "Battery inverter went offline",
      device_id: "device-1",
      timestamp: new Date().toISOString(),
      acknowledged: false,
      severity: "critical",
      source: "automatic"
    },
    {
      id: "2",
      type: "threshold",
      message: "Power consumption exceeded threshold",
      device_id: "device-2",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      acknowledged: true,
      acknowledged_at: new Date(Date.now() - 1800000).toISOString(),
      acknowledged_by: "user-1",
      severity: "warning",
      source: "threshold"
    },
    {
      id: "3",
      type: "system",
      message: "System update available",
      device_id: "system",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      acknowledged: true,
      acknowledged_at: new Date(Date.now() - 43200000).toISOString(),
      acknowledged_by: "user-1",
      severity: "info",
      source: "system",
      resolved_at: new Date(Date.now() - 21600000).toISOString()
    }
  ];
  
  return mockAlerts.slice(0, limit);
}
