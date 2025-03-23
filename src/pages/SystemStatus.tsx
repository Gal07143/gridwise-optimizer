import React, { useState, useEffect } from 'react';
import { SystemOverview } from '@/components/system-status/SystemOverview';
import { PerformanceMetrics } from '@/components/system-status/PerformanceMetrics';
import { StatusCard } from '@/components/system-status/StatusCard';
import { EventsList } from '@/components/system-status/EventsList';
import IntegrationStatus from '@/components/system-status/IntegrationStatus';
import AppLayout from '@/components/layout/AppLayout';
import { Server, HardDrive, Wifi, CloudRain } from 'lucide-react';
import { SystemComponent, SystemEvent } from '@/types/system';
import { fetchSystemEvents, fetchSystemComponents } from '@/services/systemStatusService';

const SystemStatus = () => {
  const [events, setEvents] = useState<SystemEvent[]>([]);
  const [components, setComponents] = useState<SystemComponent[]>([]);

  useEffect(() => {
    fetchSystemEvents().then(setEvents);
    fetchSystemComponents().then(setComponents);
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
