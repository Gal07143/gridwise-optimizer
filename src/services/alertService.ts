
import { Alert, AlertCountSummary, AlertSeverity } from '@/types/alert';
import { supabase } from '@/lib/supabase';

export const getRecentAlerts = async (): Promise<Alert[]> => {
  try {
    // Try to get real data from supabase
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(10);
    
    if (data && !error) {
      return data as Alert[];
    }
    
    // Fallback to mock data if supabase request fails
    console.warn('Falling back to mock alerts data');
    return [
      {
        id: 'alert-1',
        title: 'Battery Low',
        message: 'Battery state of charge below 10%',
        severity: 'high',
        timestamp: new Date().toISOString(),
        acknowledged: false,
        device_id: 'device-batt-01',
        alert_source: 'battery_monitor',
        source: 'battery_monitor',
        resolved: false
      },
      {
        id: 'alert-2',
        title: 'Grid Connection Lost',
        message: 'Connection to the electricity grid has been lost',
        severity: 'critical',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        acknowledged: false,
        device_id: 'device-grid-01',
        alert_source: 'grid_monitor',
        source: 'grid_monitor',
        resolved: false
      },
      {
        id: 'alert-3',
        title: 'Inverter Warning',
        message: 'Inverter temperature above normal operating range',
        severity: 'medium',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        acknowledged: true,
        device_id: 'device-inv-01',
        alert_source: 'inverter_monitor',
        source: 'inverter_monitor',
        resolved: false
      },
      {
        id: 'alert-4',
        title: 'System Update Available',
        message: 'New firmware update available for the energy system',
        severity: 'low',
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        acknowledged: false,
        alert_source: 'update_manager',
        source: 'update_manager',
        resolved: false
      },
      {
        id: 'alert-5',
        title: 'Peak Demand Detected',
        message: 'High electricity demand detected. Consider reducing consumption',
        severity: 'medium',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        acknowledged: false,
        alert_source: 'demand_monitor',
        source: 'demand_monitor',
        resolved: false
      }
    ];
  } catch (error) {
    console.error('Error fetching alerts', error);
    return [];
  }
};

export const getAlertCountSummary = async (): Promise<AlertCountSummary> => {
  try {
    // Try to get real data from supabase
    const { data, error } = await supabase
      .from('alerts')
      .select('severity')
      .eq('acknowledged', false);
    
    if (data && !error) {
      // Count alerts by severity
      const summary: AlertCountSummary = {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        total: data.length
      };
      
      data.forEach((alert) => {
        const sev = alert.severity.toLowerCase();
        if (sev === 'critical') summary.critical++;
        else if (sev === 'high') summary.high++;
        else if (sev === 'medium') summary.medium++;
        else if (sev === 'low') summary.low++;
      });
      
      return summary;
    }
    
    // Fallback to mock data
    console.warn('Falling back to mock alert summary data');
    return {
      critical: 1,
      high: 2,
      medium: 3,
      low: 4,
      total: 10
    };
  } catch (error) {
    console.error('Error fetching alert summary', error);
    return {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      total: 0
    };
  }
};

export const acknowledgeAlert = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('alerts')
      .update({ 
        acknowledged: true,
        acknowledged_at: new Date().toISOString()
      })
      .eq('id', id);
    
    return !error;
  } catch (error) {
    console.error('Error acknowledging alert', error);
    return false;
  }
};

export const resolveAlert = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('alerts')
      .update({ 
        resolved: true,
        resolved_at: new Date().toISOString()
      })
      .eq('id', id);
    
    return !error;
  } catch (error) {
    console.error('Error resolving alert', error);
    return false;
  }
};

export const getAlertsByDevice = async (deviceId: string): Promise<Alert[]> => {
  try {
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .eq('device_id', deviceId)
      .order('timestamp', { ascending: false });
    
    if (error) throw error;
    return data as Alert[];
  } catch (error) {
    console.error('Error fetching alerts for device', error);
    return [];
  }
};

export const createAlert = async (alert: Omit<Alert, 'id' | 'timestamp'>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('alerts')
      .insert([
        {
          ...alert,
          timestamp: new Date().toISOString()
        }
      ]);
    
    return !error;
  } catch (error) {
    console.error('Error creating alert', error);
    return false;
  }
};
