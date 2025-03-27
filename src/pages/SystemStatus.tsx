
import React, { useState, useEffect } from 'react';
import { SystemOverview } from '@/components/system-status/SystemOverview';
import { PerformanceMetrics } from '@/components/system-status/PerformanceMetrics';
import { StatusCard } from '@/components/system-status/StatusCard';
import { EventsList } from '@/components/system-status/EventsList';
import IntegrationStatus from '@/components/system-status/IntegrationStatus';
import AppLayout from '@/components/layout/AppLayout';
import { Server, HardDrive, Wifi, CloudRain } from 'lucide-react';
import { toast } from 'sonner';

// Define types locally to avoid dependency on Supabase
interface SystemComponent {
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

interface SystemEvent {
  id: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: string;
  source: string;
  acknowledged: boolean;
  details?: string;
}

// Mock data service functions to replace actual API calls
const fetchSystemComponents = (): Promise<SystemComponent[]> => {
  return Promise.resolve([
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
  ]);
};

const fetchSystemEvents = (): Promise<SystemEvent[]> => {
  return Promise.resolve([
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
  ]);
};

const SystemStatus = () => {
  const [events, setEvents] = useState<SystemEvent[]>([]);
  const [components, setComponents] = useState<SystemComponent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [eventsData, componentsData] = await Promise.all([
          fetchSystemEvents(),
          fetchSystemComponents()
        ]);
        setEvents(eventsData);
        setComponents(componentsData);
      } catch (error) {
        console.error('Error loading system status data:', error);
        toast.error('Failed to load system status data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
    // Refresh data every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AppLayout>
      <div className="p-6 space-y-6 animate-in">
        <h1 className="text-2xl font-bold tracking-tight">System Status</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatusCard 
            title="Application Server" 
            status="healthy" 
            icon={<Server className="h-5 w-5" />} 
            metric="99.9%" 
            description="Uptime" 
          />
          <StatusCard 
            title="Database" 
            status="healthy" 
            icon={<HardDrive className="h-5 w-5" />} 
            metric="35ms" 
            description="Response time" 
          />
          <StatusCard 
            title="Network" 
            status="healthy" 
            icon={<Wifi className="h-5 w-5" />} 
            metric="1.2Gb/s" 
            description="Bandwidth" 
          />
          <StatusCard 
            title="Weather API" 
            status="degraded" 
            icon={<CloudRain className="h-5 w-5" />} 
            metric="87%" 
            description="Availability" 
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <SystemOverview components={components} />
          <PerformanceMetrics />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <IntegrationStatus />
          <EventsList events={events} />
        </div>
      </div>
    </AppLayout>
  );
};

export default SystemStatus;
