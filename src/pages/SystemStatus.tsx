
import React, { useState, useEffect } from 'react';
import { SystemOverview } from '@/components/system-status/SystemOverview';
import { PerformanceMetrics } from '@/components/system-status/PerformanceMetrics';
import { StatusCard } from '@/components/system-status/StatusCard';
import { EventsList } from '@/components/system-status/EventsList';
import IntegrationStatus from '@/components/system-status/IntegrationStatus';
import AppLayout from '@/components/layout/AppLayout';
import { 
  Activity, AlertTriangle, CheckCircle, 
  CloudOff, CloudRain, HardDrive, Server, Wifi 
} from 'lucide-react';
import { SystemEvent } from '@/types/system';

const SystemStatus = () => {
  const [events, setEvents] = useState<SystemEvent[]>([]);
  
  // Sample system events - in a real app, these would come from an API or database
  useEffect(() => {
    const sampleEvents: SystemEvent[] = [
      {
        id: '1',
        component_name: 'Database',
        component_id: 'db-main',
        message: 'Database backup completed successfully',
        severity: 'info',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 min ago
      },
      {
        id: '2',
        component_name: 'MQTT Broker',
        component_id: 'mqtt-1',
        message: 'Connection established to broker',
        severity: 'info',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 min ago
      },
      {
        id: '3',
        component_name: 'Application Server',
        component_id: 'app-1',
        message: 'High CPU usage detected (85%)',
        severity: 'warning',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
      },
      {
        id: '4',
        component_name: 'Modbus Agent',
        component_id: 'modbus-1',
        message: 'Connection timeout to device BMS-001',
        severity: 'error',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 min ago
      },
      {
        id: '5',
        component_name: 'Weather API',
        component_id: 'weather-api',
        message: 'Weather data refresh completed',
        severity: 'info',
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
      },
    ];
    
    setEvents(sampleEvents);
  }, []);

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
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
          <SystemOverview />
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
