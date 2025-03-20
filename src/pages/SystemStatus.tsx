
import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import AppLayout from '@/components/layout/AppLayout';
import { SystemComponent, SystemEvent } from '@/types/system';
import { SystemOverview } from '@/components/system-status/SystemOverview';
import { EventsList } from '@/components/system-status/EventsList';
import { PerformanceMetrics } from '@/components/system-status/PerformanceMetrics';
import { fetchSystemComponents, fetchSystemEvents } from '@/services/systemStatusService';

const SystemStatus: React.FC = () => {
  const [components, setComponents] = useState<SystemComponent[]>([]);
  const [events, setEvents] = useState<SystemEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchSystemStatus();
  }, []);

  const fetchSystemStatus = async () => {
    try {
      setRefreshing(true);
      
      // Fetch components and events in parallel
      const [componentsData, eventsData] = await Promise.all([
        fetchSystemComponents(),
        fetchSystemEvents()
      ]);
      
      setComponents(componentsData);
      setEvents(eventsData);
      
    } catch (error) {
      console.error('Error fetching system status:', error);
      toast.error('Failed to fetch system status');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchSystemStatus();
    toast.success('System status refreshed');
  };

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">System Status</h1>
            <p className="text-muted-foreground">Monitor the health and status of your energy management system</p>
          </div>
          <Button onClick={handleRefresh} className="gap-2">
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">System Overview</TabsTrigger>
            <TabsTrigger value="events">System Events</TabsTrigger>
            <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <SystemOverview components={components} />
          </TabsContent>

          <TabsContent value="events">
            <EventsList events={events} />
          </TabsContent>

          <TabsContent value="performance">
            <PerformanceMetrics />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default SystemStatus;
