import { toast } from 'sonner';

export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: 'critical' | 'warning' | 'info' | 'success';
  timestamp: string;
  source: string;
  sourceId?: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  devices?: string[];
  category?: string;
  actionRequired?: boolean;
  notified?: boolean;
  resolved: boolean;
}

const mockAlerts: Alert[] = [
  {
    id: '1',
    title: 'Battery SoC Low',
    message: 'Battery state of charge below 15% threshold',
    severity: 'warning',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    source: 'battery',
    sourceId: 'bat-001',
    acknowledged: false,
    devices: ['bat-001'],
    category: 'energy',
    actionRequired: true,
    notified: true,
    resolved: false
  },
  {
    id: '2',
    title: 'Inverter Offline',
    message: 'Inverter connection lost',
    severity: 'critical',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    source: 'inverter',
    sourceId: 'inv-002',
    acknowledged: true,
    acknowledgedBy: 'operator',
    acknowledgedAt: new Date(Date.now() - 3500000).toISOString(),
    devices: ['inv-002'],
    category: 'connectivity',
    actionRequired: true,
    notified: true,
    resolved: false
  },
  {
    id: '3',
    title: 'System Update Available',
    message: 'New firmware version 2.4.5 available for installation',
    severity: 'info',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    source: 'system',
    acknowledged: false,
    category: 'maintenance',
    actionRequired: false,
    notified: true,
    resolved: false
  },
  {
    id: '4',
    title: 'Energy Export Limit Reached',
    message: 'Grid export limit reached, reducing power output',
    severity: 'warning',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    source: 'controller',
    sourceId: 'ctrl-main',
    acknowledged: true,
    acknowledgedBy: 'admin',
    acknowledgedAt: new Date(Date.now() - 7100000).toISOString(),
    devices: ['ctrl-main', 'inv-001', 'inv-002'],
    category: 'energy',
    actionRequired: false,
    notified: true,
    resolved: false
  },
  {
    id: '5',
    title: 'Communication Device Reconnected',
    message: 'The modem has been reconnected after 10 minutes of downtime',
    severity: 'success',
    timestamp: new Date(Date.now() - 600000).toISOString(),
    source: 'network',
    sourceId: 'modem-01',
    acknowledged: false,
    devices: ['modem-01'],
    category: 'connectivity',
    actionRequired: false,
    notified: false,
    resolved: false
  }
];

// Get all alerts with optional filtering
export const getAlerts = async (filters?: {
  severity?: string;
  acknowledged?: boolean;
  source?: string;
  timeRange?: { start: string; end: string };
  limit?: number;
}): Promise<Alert[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let filteredAlerts = [...mockAlerts];
  
  if (filters) {
    if (filters.severity) {
      filteredAlerts = filteredAlerts.filter(alert => alert.severity === filters.severity);
    }
    
    if (filters.acknowledged !== undefined) {
      filteredAlerts = filteredAlerts.filter(alert => alert.acknowledged === filters.acknowledged);
    }
    
    if (filters.source) {
      filteredAlerts = filteredAlerts.filter(alert => alert.source === filters.source);
    }
    
    if (filters.timeRange) {
      const { start, end } = filters.timeRange;
      filteredAlerts = filteredAlerts.filter(alert => {
        const alertTime = new Date(alert.timestamp).getTime();
        return alertTime >= new Date(start).getTime() && alertTime <= new Date(end).getTime();
      });
    }
    
    if (filters.limit) {
      filteredAlerts = filteredAlerts.slice(0, filters.limit);
    }
  }
  
  return filteredAlerts.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

// Get recent alerts (last 24 hours by default)
export const getRecentAlerts = async (limit = 5): Promise<Alert[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);
  
  return mockAlerts
    .filter(alert => new Date(alert.timestamp) >= oneDayAgo)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
};

// Get alert by ID
export const getAlertById = async (id: string): Promise<Alert | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const alert = mockAlerts.find(a => a.id === id);
  return alert || null;
};

// Acknowledge an alert
export const acknowledgeAlert = async (id: string, userId: string): Promise<Alert | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const alertIndex = mockAlerts.findIndex(a => a.id === id);
  if (alertIndex === -1) {
    toast.error('Alert not found');
    return null;
  }
  
  const updatedAlert = {
    ...mockAlerts[alertIndex],
    acknowledged: true,
    acknowledgedBy: userId,
    acknowledgedAt: new Date().toISOString(),
    resolved: true
  };
  
  // In a real app, we would update the database
  // mockAlerts[alertIndex] = updatedAlert;
  
  toast.success('Alert acknowledged');
  return updatedAlert;
};

// Create a new alert
export const createAlert = async (alert: Omit<Alert, 'id' | 'timestamp'>): Promise<Alert> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const newAlert: Alert = {
    ...alert,
    id: Math.random().toString(36).substring(2, 11),
    timestamp: new Date().toISOString(),
    resolved: false
  };
  
  // In a real app, we would add to the database
  // mockAlerts.unshift(newAlert);
  
  toast.info('New alert created');
  return newAlert;
};

// Get alert statistics
export const getAlertStats = async (): Promise<{
  total: number;
  unacknowledged: number;
  critical: number;
  warning: number;
  byCategory: Record<string, number>;
}> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const critical = mockAlerts.filter(a => a.severity === 'critical').length;
  const warning = mockAlerts.filter(a => a.severity === 'warning').length;
  const unacknowledged = mockAlerts.filter(a => !a.acknowledged).length;
  
  // Group by category
  const byCategory = mockAlerts.reduce((acc, alert) => {
    const category = alert.category || 'other';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return {
    total: mockAlerts.length,
    unacknowledged,
    critical,
    warning,
    byCategory
  };
};

// NEW FUNCTION: Get alert summary for dashboard
export const getAlertSummary = async (): Promise<{
  total: number;
  critical: number;
  warning: number;
  info: number;
  unacknowledged: number;
}> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const critical = mockAlerts.filter(a => a.severity === 'critical').length;
  const warning = mockAlerts.filter(a => a.severity === 'warning').length;
  const info = mockAlerts.filter(a => a.severity === 'info').length;
  const unacknowledged = mockAlerts.filter(a => !a.acknowledged).length;
  
  return {
    total: mockAlerts.length,
    critical,
    warning,
    info,
    unacknowledged
  };
};
