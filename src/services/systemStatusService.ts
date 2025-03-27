
// This file contains types and mock data for system status features

export interface SystemComponent {
  id: string;
  name: string;
  type: string;
  status: 'healthy' | 'degraded' | 'critical' | 'maintenance' | 'unknown';
  lastUpdated: string;
  metrics?: Record<string, string | number>;
  description?: string;
}

export interface Integration {
  id: string;
  name: string;
  type: string;
  status: 'online' | 'offline' | 'degraded';
  lastSync: string;
  latency?: number;
  errorCount?: number;
  successRate?: number;
}

export interface SystemEvent {
  id: string;
  timestamp: string;
  source: string;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  acknowledged: boolean;
  details?: Record<string, any>;
}

export interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  threshold?: number;
  change?: number;
  status: 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  history?: { timestamp: string; value: number }[];
}

// Mock data for system components
export const mockSystemComponents: SystemComponent[] = [
  {
    id: '1',
    name: 'Battery Management System',
    type: 'controller',
    status: 'healthy',
    lastUpdated: new Date().toISOString(),
    metrics: {
      cpuUsage: '24%',
      memoryUsage: '512MB',
      uptime: '12d 5h',
      temperature: '42°C'
    }
  },
  {
    id: '2',
    name: 'Inverter Controller',
    type: 'controller',
    status: 'healthy',
    lastUpdated: new Date().toISOString(),
    metrics: {
      cpuUsage: '18%',
      memoryUsage: '384MB',
      uptime: '10d 12h',
      temperature: '38°C'
    }
  },
  {
    id: '3',
    name: 'Grid Connection Monitor',
    type: 'monitor',
    status: 'degraded',
    lastUpdated: new Date().toISOString(),
    metrics: {
      responseTime: '120ms',
      packetLoss: '2.5%',
      frequency: '59.97Hz',
      voltage: '240.2V'
    }
  },
  {
    id: '4',
    name: 'Data Processing Service',
    type: 'service',
    status: 'healthy',
    lastUpdated: new Date().toISOString(),
    metrics: {
      processedItems: '1,243',
      queueLength: '0',
      processingTime: '45ms',
      errorRate: '0.02%'
    }
  },
  {
    id: '5',
    name: 'Weather Data Service',
    type: 'service',
    status: 'healthy',
    lastUpdated: new Date().toISOString(),
    metrics: {
      lastUpdate: '5m ago',
      accuracy: '92%',
      forecastLength: '7 days',
      dataPoints: '3,450'
    }
  },
  {
    id: '6',
    name: 'Database Cluster',
    type: 'infrastructure',
    status: 'healthy',
    lastUpdated: new Date().toISOString(),
    metrics: {
      connections: '24',
      storage: '62.4GB',
      readLatency: '4ms',
      writeLatency: '8ms'
    }
  },
];

// Mock data for integrations
export const mockIntegrations: Integration[] = [
  {
    id: '1',
    name: 'Utility Grid API',
    type: 'api',
    status: 'online',
    lastSync: new Date().toISOString(),
    latency: 142,
    errorCount: 0,
    successRate: 100
  },
  {
    id: '2',
    name: 'Weather Service',
    type: 'api',
    status: 'online',
    lastSync: new Date().toISOString(),
    latency: 256,
    errorCount: 2,
    successRate: 99.5
  },
  {
    id: '3',
    name: 'Solar Panel Manufacturer',
    type: 'modbus',
    status: 'online',
    lastSync: new Date().toISOString(),
    latency: 52,
    errorCount: 0,
    successRate: 100
  },
  {
    id: '4',
    name: 'Battery Management System',
    type: 'modbus',
    status: 'online',
    lastSync: new Date().toISOString(),
    latency: 38,
    errorCount: 0,
    successRate: 100
  },
  {
    id: '5',
    name: 'EV Charger Network',
    type: 'mqtt',
    status: 'degraded',
    lastSync: new Date().toISOString(),
    latency: 312,
    errorCount: 14,
    successRate: 96.2
  },
  {
    id: '6',
    name: 'Smart Meter Data',
    type: 'api',
    status: 'offline',
    lastSync: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    latency: 0,
    errorCount: 45,
    successRate: 0
  },
];

// Mock data for system events
export const mockSystemEvents: SystemEvent[] = [
  {
    id: '1',
    timestamp: new Date().toISOString(),
    source: 'Battery Management System',
    severity: 'info',
    message: 'System self-test completed successfully',
    acknowledged: true,
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
    source: 'Inverter Controller',
    severity: 'warning',
    message: 'Inverter efficiency below optimal threshold (92%)',
    acknowledged: false,
    details: {
      efficiency: 92,
      threshold: 95,
      duration: '45m'
    }
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    source: 'Grid Connection Monitor',
    severity: 'warning',
    message: 'Voltage fluctuation detected (±5.2V)',
    acknowledged: false,
    details: {
      voltage: 240.2,
      fluctuation: 5.2,
      duration: '15m'
    }
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 14400000).toISOString(), // 4 hours ago
    source: 'Weather Data Service',
    severity: 'info',
    message: 'Weather forecast updated - Clear skies expected for next 3 days',
    acknowledged: true,
  },
  {
    id: '5',
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    source: 'Smart Meter Data',
    severity: 'critical',
    message: 'Connection to utility API failed - Authentication error',
    acknowledged: true,
    details: {
      attempts: 3,
      error: 'Authentication failed',
      nextRetry: '2h'
    }
  },
  {
    id: '6',
    timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    source: 'Database Cluster',
    severity: 'warning',
    message: 'Storage usage approaching threshold (85% used)',
    acknowledged: true,
    details: {
      usage: '85%',
      freeSpace: '15.6GB',
      projectedFullDate: '15 days'
    }
  },
];

// Mock data for performance metrics
export const mockPerformanceMetrics: PerformanceMetric[] = [
  {
    id: '1',
    name: 'System Uptime',
    value: 99.97,
    unit: '%',
    threshold: 99.9,
    change: 0.01,
    status: 'good',
    trend: 'stable',
    history: [
      { timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), value: 99.95 },
      { timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), value: 99.96 },
      { timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), value: 99.92 },
      { timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), value: 99.94 },
      { timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), value: 99.96 },
      { timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), value: 99.97 },
      { timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), value: 99.97 },
    ]
  },
  {
    id: '2',
    name: 'Response Time',
    value: 124,
    unit: 'ms',
    threshold: 200,
    change: -5,
    status: 'good',
    trend: 'down',
    history: [
      { timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), value: 145 },
      { timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), value: 140 },
      { timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), value: 138 },
      { timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), value: 135 },
      { timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), value: 130 },
      { timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), value: 129 },
      { timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), value: 124 },
    ]
  },
  {
    id: '3',
    name: 'Error Rate',
    value: 0.42,
    unit: '%',
    threshold: 1,
    change: 0.12,
    status: 'good',
    trend: 'up',
    history: [
      { timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), value: 0.2 },
      { timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), value: 0.25 },
      { timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), value: 0.28 },
      { timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), value: 0.3 },
      { timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), value: 0.32 },
      { timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), value: 0.35 },
      { timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), value: 0.42 },
    ]
  },
  {
    id: '4',
    name: 'CPU Usage',
    value: 38.5,
    unit: '%',
    threshold: 80,
    change: -2.1,
    status: 'good',
    trend: 'down',
    history: [
      { timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), value: 45.2 },
      { timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), value: 43.8 },
      { timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), value: 42.5 },
      { timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), value: 41.2 },
      { timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), value: 40.5 },
      { timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), value: 40.6 },
      { timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), value: 38.5 },
    ]
  },
  {
    id: '5',
    name: 'Memory Usage',
    value: 65.3,
    unit: '%',
    threshold: 85,
    change: 3.2,
    status: 'good',
    trend: 'up',
    history: [
      { timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), value: 58.2 },
      { timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), value: 59.5 },
      { timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), value: 60.8 },
      { timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), value: 62.1 },
      { timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), value: 63.5 },
      { timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), value: 64.2 },
      { timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), value: 65.3 },
    ]
  },
  {
    id: '6',
    name: 'Disk I/O',
    value: 12.8,
    unit: 'MB/s',
    threshold: 50,
    change: 1.5,
    status: 'good',
    trend: 'up',
    history: [
      { timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), value: 9.5 },
      { timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), value: 10.2 },
      { timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), value: 10.5 },
      { timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), value: 11.0 },
      { timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), value: 11.5 },
      { timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), value: 12.2 },
      { timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), value: 12.8 },
    ]
  },
];

// Service functions to fetch data
export const getSystemComponents = async (): Promise<SystemComponent[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockSystemComponents;
};

export const getIntegrationStatus = async (): Promise<Integration[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockIntegrations;
};

export const getSystemEvents = async (): Promise<SystemEvent[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockSystemEvents;
};

export const getPerformanceMetrics = async (): Promise<PerformanceMetric[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockPerformanceMetrics;
};

export const acknowledgeEvent = async (eventId: string): Promise<boolean> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return true;
};
