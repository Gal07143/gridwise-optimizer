
import { toast } from 'sonner';

// Define types
export interface SystemComponent {
  id: string;
  name: string;
  status: 'healthy' | 'degraded' | 'critical' | 'maintenance' | 'unknown';
  lastUpdated: string;
  details?: string;
  type: string;
  metrics?: {
    [key: string]: number | string;
  };
}

export interface SystemEvent {
  id: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: string;
  source: string;
  acknowledged: boolean;
  details?: string;
}

// Mock data
const systemComponents: SystemComponent[] = [
  {
    id: '1',
    name: 'Main Application Server',
    status: 'healthy',
    lastUpdated: new Date().toISOString(),
    type: 'server',
    metrics: { uptime: 99.9, responseTime: 120 }
  },
  {
    id: '2',
    name: 'Primary Database',
    status: 'healthy',
    lastUpdated: new Date().toISOString(),
    type: 'database',
    metrics: { queries: 2340, latency: 35 }
  },
  {
    id: '3',
    name: 'Edge API Gateway',
    status: 'degraded',
    lastUpdated: new Date().toISOString(),
    type: 'api',
    metrics: { requests: 15420, errors: 23 }
  },
  {
    id: '4',
    name: 'Authentication Service',
    status: 'healthy',
    lastUpdated: new Date().toISOString(),
    type: 'service',
    metrics: { sessions: 342, failures: 0 }
  },
  {
    id: '5',
    name: 'Backup System',
    status: 'maintenance',
    lastUpdated: new Date().toISOString(),
    type: 'storage',
    metrics: { lastBackup: '2023-10-12T04:30:00Z' }
  },
  {
    id: '6',
    name: 'Notification Service',
    status: 'healthy',
    lastUpdated: new Date().toISOString(),
    type: 'service',
    metrics: { delivered: 1245, pending: 12 }
  }
];

const systemEvents: SystemEvent[] = [
  {
    id: '1',
    message: 'System update completed successfully',
    severity: 'info',
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    source: 'System',
    acknowledged: true
  },
  {
    id: '2',
    message: 'Database backup scheduled for 2:00 AM',
    severity: 'info',
    timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
    source: 'Maintenance',
    acknowledged: true
  },
  {
    id: '3',
    message: 'API rate limit exceeded for weather service',
    severity: 'warning',
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    source: 'API Gateway',
    acknowledged: false
  },
  {
    id: '4',
    message: 'Edge function deployment failed',
    severity: 'critical',
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
    source: 'Deployment',
    acknowledged: false
  },
  {
    id: '5',
    message: 'Server CPU usage above 80%',
    severity: 'warning',
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    source: 'Monitoring',
    acknowledged: false
  }
];

// Service functions
export const fetchSystemComponents = async (): Promise<SystemComponent[]> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return [...systemComponents];
  } catch (error) {
    console.error('Error fetching system components:', error);
    toast.error('Failed to fetch system components');
    return [];
  }
};

export const fetchSystemEvents = async (): Promise<SystemEvent[]> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    return [...systemEvents];
  } catch (error) {
    console.error('Error fetching system events:', error);
    toast.error('Failed to fetch system events');
    return [];
  }
};

export const acknowledgeEvent = async (eventId: string): Promise<boolean> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real app, this would update the database
    const eventIndex = systemEvents.findIndex(event => event.id === eventId);
    if (eventIndex >= 0) {
      systemEvents[eventIndex].acknowledged = true;
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error acknowledging event:', error);
    toast.error('Failed to acknowledge event');
    return false;
  }
};
