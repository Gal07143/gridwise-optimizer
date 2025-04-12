
import { Alert, AlertCountSummary } from '@/types/alert';

export type { Alert, AlertCountSummary };

// Get recent alerts with optional count parameter
export const getRecentAlerts = async (count: number = 20): Promise<Alert[]> => {
  // In a real app this would fetch from an API
  return [
    {
      id: '1',
      severity: 'critical',
      message: 'Battery temperature exceeds safe thresholds',
      device_id: 'device-001',
      site_id: 'site-001',
      timestamp: new Date().toISOString(),
      resolved: false,
      alert_source: 'Battery System',
    },
    {
      id: '2',
      severity: 'high',
      message: 'Grid connection lost',
      device_id: 'device-002',
      site_id: 'site-001',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      resolved: false,
      alert_source: 'Grid Connection',
    },
    {
      id: '3',
      severity: 'medium',
      message: 'Inverter efficiency below expected range',
      device_id: 'device-003',
      site_id: 'site-001',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      resolved: true,
      resolved_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
      resolved_by: 'admin',
      alert_source: 'Inverter',
    },
    // Add more sample alerts as needed
    {
      id: '4',
      severity: 'low',
      message: 'Scheduled maintenance due in 2 weeks',
      site_id: 'site-001',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      resolved: false,
      alert_source: 'System',
    },
    {
      id: '5',
      severity: 'info',
      message: 'Software update available',
      site_id: 'site-001',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
      resolved: false,
      alert_source: 'System',
    }
  ].slice(0, count);
};

export const getAlertCounts = async (): Promise<AlertCountSummary> => {
  // This would normally fetch from an API
  return {
    critical: 2,
    high: 3,
    medium: 5,
    low: 8,
    info: 12,
    warning: 4,
    total: 34
  };
};
