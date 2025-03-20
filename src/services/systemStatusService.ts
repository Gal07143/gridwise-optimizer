
import { SystemComponent, SystemEvent } from '@/types/system';

// Mock data for system components
export const fetchSystemComponents = async (): Promise<SystemComponent[]> => {
  // In a real app, this would be a real API call
  const mockComponents: SystemComponent[] = [
    {
      id: '1',
      component_name: 'Battery Management Controller',
      status: 'operational',
      details: 'All battery management systems functioning normally',
      latency: 12,
      last_restart: '2023-09-01',
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      component_name: 'Primary Database',
      status: 'operational',
      details: 'Database connections stable, no performance issues detected',
      latency: 5,
      last_restart: '2023-08-15',
      updated_at: new Date().toISOString()
    },
    {
      id: '3',
      component_name: 'Grid Communication Service',
      status: 'degraded',
      details: 'Intermittent connection delays, monitoring in progress',
      latency: 45,
      last_restart: '2023-09-10',
      updated_at: new Date().toISOString()
    },
    {
      id: '4',
      component_name: 'Authentication Service',
      status: 'operational',
      details: 'All authentication systems functioning normally',
      latency: 8,
      last_restart: '2023-08-20',
      updated_at: new Date().toISOString()
    },
    {
      id: '5',
      component_name: 'Logging System',
      status: 'operational',
      details: 'Log processing and storage operating at normal capacity',
      latency: 6,
      last_restart: '2023-08-25',
      updated_at: new Date().toISOString()
    },
    {
      id: '6',
      component_name: 'API Gateway',
      status: 'operational',
      details: 'API routing and rate limiting functioning as expected',
      latency: 10,
      last_restart: '2023-09-05',
      updated_at: new Date().toISOString()
    },
    {
      id: '7',
      component_name: 'Reporting Engine',
      status: 'maintenance',
      details: 'Scheduled maintenance in progress, estimated completion in 2 hours',
      latency: 120,
      last_restart: '2023-09-15',
      updated_at: new Date().toISOString()
    },
    {
      id: '8',
      component_name: 'Weather Integration Service',
      status: 'down',
      details: 'Connection to weather data provider failed, investigating issue',
      latency: 200,
      last_restart: '2023-09-02',
      updated_at: new Date().toISOString()
    },
    {
      id: '9',
      component_name: 'Notification Service',
      status: 'operational',
      details: 'Email, SMS, and push notifications functioning normally',
      latency: 15,
      last_restart: '2023-08-30',
      updated_at: new Date().toISOString()
    }
  ];

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockComponents;
};

// Mock data for system events
export const fetchSystemEvents = async (): Promise<SystemEvent[]> => {
  // In a real app, this would be a real API call
  const mockEvents: SystemEvent[] = [
    {
      id: '1',
      timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
      severity: 'error',
      message: 'Connection to weather data provider lost',
      component_id: '8',
      component_name: 'Weather Integration Service',
      acknowledged: false
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
      severity: 'warning',
      message: 'Grid communication latency exceeding threshold',
      component_id: '3',
      component_name: 'Grid Communication Service',
      acknowledged: true
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 90 * 60000).toISOString(),
      severity: 'info',
      message: 'Scheduled maintenance started for Reporting Engine',
      component_id: '7',
      component_name: 'Reporting Engine',
      acknowledged: true
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
      severity: 'info',
      message: 'System backup completed successfully',
      component_id: null,
      component_name: 'System',
      acknowledged: true
    },
    {
      id: '5',
      timestamp: new Date(Date.now() - 180 * 60000).toISOString(),
      severity: 'warning',
      message: 'Battery #3 state of charge dropping abnormally fast',
      component_id: '1',
      component_name: 'Battery Management Controller',
      acknowledged: false
    }
  ];

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockEvents;
};
