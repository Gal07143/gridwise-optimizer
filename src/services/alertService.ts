
import { toast } from 'sonner';

export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  timestamp: string;
  source: string;
  deviceId?: string;
  acknowledged: boolean;
  resolved?: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
}

// Mock data for alerts
const mockAlerts: Alert[] = [
  {
    id: '1',
    title: 'Battery Low Charge',
    message: 'Home battery system charge is below 15%',
    severity: 'warning',
    timestamp: new Date(Date.now() - 25 * 60000).toISOString(), // 25 minutes ago
    source: 'Battery Management System',
    deviceId: 'batt-01',
    acknowledged: false,
  },
  {
    id: '2',
    title: 'Grid Connection Lost',
    message: 'Connection to utility grid has been lost',
    severity: 'critical',
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(), // 45 minutes ago
    source: 'Grid Connection Monitor',
    deviceId: 'grid-01',
    acknowledged: true,
    acknowledgedAt: new Date(Date.now() - 40 * 60000).toISOString(),
    acknowledgedBy: 'admin',
  },
  {
    id: '3',
    title: 'Inverter Firmware Update',
    message: 'New firmware is available for your inverter',
    severity: 'info',
    timestamp: new Date(Date.now() - 2 * 60 * 60000).toISOString(), // 2 hours ago
    source: 'System Updates',
    deviceId: 'inv-01',
    acknowledged: false,
  },
  {
    id: '4',
    title: 'Solar Panel Efficiency Degraded',
    message: 'Panel 3 is producing 15% less power than expected',
    severity: 'warning',
    timestamp: new Date(Date.now() - 5 * 60 * 60000).toISOString(), // 5 hours ago
    source: 'Performance Monitor',
    deviceId: 'solar-03',
    acknowledged: true,
    acknowledgedAt: new Date(Date.now() - 4.5 * 60 * 60000).toISOString(),
    acknowledgedBy: 'admin',
  },
  {
    id: '5',
    title: 'High Energy Consumption',
    message: 'Unusual energy consumption detected in the last hour',
    severity: 'warning',
    timestamp: new Date(Date.now() - 70 * 60000).toISOString(), // 70 minutes ago
    source: 'Energy Monitor',
    acknowledged: false,
  },
  {
    id: '6',
    title: 'Weather Alert',
    message: 'Severe weather expected in your area within 24 hours',
    severity: 'info',
    timestamp: new Date(Date.now() - 3 * 60 * 60000).toISOString(), // 3 hours ago
    source: 'Weather Service',
    acknowledged: true,
    acknowledgedAt: new Date(Date.now() - 2.8 * 60 * 60000).toISOString(),
    acknowledgedBy: 'admin',
  },
];

// Get all alerts
export const getAlerts = async (): Promise<Alert[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return [...mockAlerts];
};

// Get alert summary (count by type)
export const getAlertSummary = async () => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const total = mockAlerts.length;
  const critical = mockAlerts.filter(a => a.severity === 'critical').length;
  const warning = mockAlerts.filter(a => a.severity === 'warning').length;
  const info = mockAlerts.filter(a => a.severity === 'info').length;
  const unacknowledged = mockAlerts.filter(a => !a.acknowledged).length;
  
  return {
    total,
    critical,
    warning,
    info,
    unacknowledged
  };
};

// Acknowledge an alert
export const acknowledgeAlert = async (alertId: string): Promise<boolean> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // In a real implementation, this would update the database
  // Here we just return success
  toast.success('Alert acknowledged successfully');
  return true;
};

// Resolve an alert
export const resolveAlert = async (alertId: string): Promise<boolean> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // In a real implementation, this would update the database
  // Here we just return success
  toast.success('Alert resolved successfully');
  return true;
};

// Create a new alert
export const createAlert = async (alert: Partial<Alert>): Promise<Alert> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Create a new alert with generated ID and timestamp
  const newAlert: Alert = {
    id: Math.random().toString(36).substring(2, 11),
    title: alert.title || 'Untitled Alert',
    message: alert.message || 'No message provided',
    severity: alert.severity || 'info',
    timestamp: new Date().toISOString(),
    source: alert.source || 'System',
    deviceId: alert.deviceId,
    acknowledged: false,
  };
  
  // In a real implementation, this would add to the database
  // Here we just return the new alert
  return newAlert;
};

// Subscribe to alerts (returns a cleanup function)
export const subscribeToAlerts = (callback: (alerts: Alert[]) => void): () => void => {
  // In a real implementation, this would set up a websocket or polling
  // Here we just simulate with a timer
  
  let active = true;
  
  const poll = () => {
    if (!active) return;
    
    // Get current alerts
    getAlerts().then(alerts => {
      callback(alerts);
      
      // Simulate a new alert randomly (1% chance per poll)
      if (Math.random() < 0.01) {
        const severities: Array<'critical' | 'warning' | 'info'> = ['critical', 'warning', 'info'];
        const newAlert: Alert = {
          id: Math.random().toString(36).substring(2, 11),
          title: 'New System Alert',
          message: 'This is a simulated alert for testing',
          severity: severities[Math.floor(Math.random() * severities.length)],
          timestamp: new Date().toISOString(),
          source: 'Alert Simulator',
          acknowledged: false,
        };
        
        // Add to our mock data and notify
        mockAlerts.unshift(newAlert);
        callback([...mockAlerts]);
        
        // Show a toast
        toast.warning('New alert received', {
          description: newAlert.message,
        });
      }
      
      setTimeout(poll, 10000); // Poll every 10 seconds
    });
  };
  
  // Start polling
  poll();
  
  // Return cleanup function
  return () => {
    active = false;
  };
};
