import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Update the Alert type to include site_id and source
export interface Alert {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical' | 'info' | 'warning';
  message: string;
  timestamp: string;
  source?: string;
  alert_source?: string;
  resolved: boolean;
  site_id?: string;
  device_id?: string;
  recommended_action?: string;
  metadata?: Record<string, any>;
}

export interface AlertCountSummary {
  critical: number;
  high: number;
  medium: number;
  low: number;
  info: number;
  total: number;
}

export const getRecentAlerts = async (limit = 10): Promise<Alert[]> => {
  try {
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    return data as Alert[];
  } catch (error) {
    console.error('Error fetching recent alerts:', error);
    return [];
  }
};

export const getAlertCounts = async (): Promise<AlertCountSummary> => {
  try {
    const { data, error } = await supabase
      .from('alerts')
      .select('severity, resolved')
      .eq('resolved', false);
    
    if (error) throw error;
    
    // Initialize counts
    const counts = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      info: 0,
      total: 0
    };
    
    // Count alerts by severity
    data.forEach((alert: any) => {
      counts.total++;
      switch (alert.severity) {
        case 'critical':
          counts.critical++;
          break;
        case 'high':
          counts.high++;
          break;
        case 'medium':
          counts.medium++;
          break;
        case 'low':
          counts.low++;
          break;
        case 'info':
          counts.info++;
          break;
      }
    });
    
    return counts;
  } catch (error) {
    console.error('Error fetching alert counts:', error);
    return {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      info: 0,
      total: 0
    };
  }
};

export const resolveAlert = async (alertId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('alerts')
      .update({ resolved: true })
      .eq('id', alertId);
    
    if (error) throw error;
    
    toast.success('Alert marked as resolved');
    return true;
  } catch (error) {
    console.error('Error resolving alert:', error);
    toast.error('Failed to resolve alert');
    return false;
  }
};

export const createAlert = async (alert: Omit<Alert, 'id' | 'timestamp'>): Promise<Alert | null> => {
  try {
    const newAlert = {
      ...alert,
      timestamp: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('alerts')
      .insert(newAlert)
      .select()
      .single();
    
    if (error) throw error;
    
    return data as Alert;
  } catch (error) {
    console.error('Error creating alert:', error);
    return null;
  }
};

export const getAlertsBySiteId = async (siteId: string): Promise<Alert[]> => {
  try {
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .eq('site_id', siteId)
      .order('timestamp', { ascending: false });
    
    if (error) throw error;
    
    return data as Alert[];
  } catch (error) {
    console.error(`Error fetching alerts for site ${siteId}:`, error);
    return [];
  }
};

export const getAlertsByDeviceId = async (deviceId: string): Promise<Alert[]> => {
  try {
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .eq('device_id', deviceId)
      .order('timestamp', { ascending: false });
    
    if (error) throw error;
    
    return data as Alert[];
  } catch (error) {
    console.error(`Error fetching alerts for device ${deviceId}:`, error);
    return [];
  }
};

// Fix the type exports
export type { Alert, AlertCountSummary };

// Alias getAlertCounts as getAlertCountSummary for compatibility
export const getAlertCountSummary = getAlertCounts;
