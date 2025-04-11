
import { Alert, AlertSeverity, AlertFilters } from '@/types/alert';

// Sample data for alerts
const sampleAlerts: Alert[] = [
  {
    id: '1',
    title: 'Battery Low',
    message: 'Battery storage system at 15% - consider charging',
    severity: 'medium',
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    acknowledged: false,
    device_id: 'batt-01',
    site_id: 'site-1',
    alert_source: 'battery-monitor'
  },
  {
    id: '2',
    title: 'Grid Connection Lost',
    message: 'Grid connection interrupted, switching to island mode',
    severity: 'critical',
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    acknowledged: true,
    device_id: 'grid-01',
    site_id: 'site-1',
    alert_source: 'grid-monitor'
  },
  {
    id: '3',
    title: 'Solar Production Drop',
    message: 'Solar production dropped by 40% in the last hour',
    severity: 'low',
    timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
    acknowledged: false,
    device_id: 'solar-01',
    site_id: 'site-1',
    resolved: true,
    alert_source: 'performance-monitor'
  },
  {
    id: '4',
    title: 'EV Charging Complete',
    message: 'Vehicle charging completed at 100%',
    severity: 'info',
    timestamp: new Date(Date.now() - 180 * 60000).toISOString(),
    acknowledged: true,
    device_id: 'ev-01',
    site_id: 'site-1',
    resolved: true,
    alert_source: 'ev-charger'
  },
  {
    id: '5',
    title: 'Firmware Update Available',
    message: 'New firmware available for inverter device',
    severity: 'warning',
    timestamp: new Date(Date.now() - 24 * 60 * 60000).toISOString(),
    acknowledged: false,
    device_id: 'inv-01',
    site_id: 'site-1',
    alert_source: 'system-updates'
  }
];

// Get all alerts
export const getAlerts = async (filters?: AlertFilters): Promise<Alert[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  let filteredAlerts = [...sampleAlerts];
  
  // Apply filters if provided
  if (filters) {
    if (filters.severity) {
      filteredAlerts = filteredAlerts.filter(alert => 
        filters.severity?.includes(alert.severity)
      );
    }
    
    if (filters.acknowledged !== undefined) {
      filteredAlerts = filteredAlerts.filter(alert => 
        alert.acknowledged === filters.acknowledged
      );
    }
    
    if (filters.siteId) {
      filteredAlerts = filteredAlerts.filter(alert => 
        alert.site_id === filters.siteId
      );
    }
    
    if (filters.deviceId) {
      filteredAlerts = filteredAlerts.filter(alert => 
        alert.device_id === filters.deviceId
      );
    }
    
    // Time range filtering
    if (filters.timeRange) {
      const now = new Date();
      let startDate: Date;
      
      switch (filters.timeRange) {
        case 'today':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'week':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        case 'custom':
          startDate = filters.startDate ? new Date(filters.startDate) : new Date(0);
          break;
        default:
          startDate = new Date(0);
      }
      
      const endDate = filters.endDate ? new Date(filters.endDate) : new Date();
      
      filteredAlerts = filteredAlerts.filter(alert => {
        const alertDate = new Date(alert.timestamp);
        return alertDate >= startDate && alertDate <= endDate;
      });
    }
  }
  
  // Sort by timestamp (newest first)
  return filteredAlerts.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

// Get recent alerts (last 24 hours)
export const getRecentAlerts = async (): Promise<Alert[]> => {
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);
  
  const allAlerts = await getAlerts();
  return allAlerts.filter(alert => 
    new Date(alert.timestamp) > oneDayAgo
  );
};

// Mark alert as acknowledged
export const acknowledgeAlert = async (alertId: string): Promise<Alert> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const alert = sampleAlerts.find(a => a.id === alertId);
  if (!alert) {
    throw new Error(`Alert with ID ${alertId} not found`);
  }
  
  alert.acknowledged = true;
  return alert;
};

// Get alert counts by severity
export const getAlertCounts = async (): Promise<Record<AlertSeverity, number>> => {
  const alerts = await getAlerts();
  
  return alerts.reduce((counts, alert) => {
    counts[alert.severity] = (counts[alert.severity] || 0) + 1;
    return counts;
  }, {} as Record<AlertSeverity, number>);
};

export { Alert, AlertSeverity };
