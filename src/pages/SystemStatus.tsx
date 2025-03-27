
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import AppLayout from '@/components/layout/AppLayout';
import PageHeader from '@/components/pages/PageHeader';
import ErrorMessage from '@/components/ui/error-message';
import SystemOverview from '@/components/system-status/SystemOverview';
import IntegrationStatus from '@/components/system-status/IntegrationStatus';
import EventsList from '@/components/system-status/EventsList';
import PerformanceMetrics from '@/components/system-status/PerformanceMetrics';
import { Activity, RefreshCw, Cpu, CircuitBoard, Router, DownloadCloud } from 'lucide-react';
import {
  getSystemComponents,
  getIntegrationStatus,
  getSystemEvents,
  getPerformanceMetrics,
  acknowledgeEvent,
} from '@/services/systemStatusService';
import { toast } from 'sonner';

const SystemStatus = () => {
  // Fetch system components
  const componentsQuery = useQuery({
    queryKey: ['systemComponents'],
    queryFn: getSystemComponents,
  });

  // Fetch integrations 
  const integrationsQuery = useQuery({
    queryKey: ['integrationStatus'],
    queryFn: getIntegrationStatus,
  });

  // Fetch system events
  const eventsQuery = useQuery({
    queryKey: ['systemEvents'],
    queryFn: getSystemEvents,
  });

  // Fetch performance metrics
  const metricsQuery = useQuery({
    queryKey: ['performanceMetrics'],
    queryFn: getPerformanceMetrics,
  });

  const handleRefresh = () => {
    componentsQuery.refetch();
    integrationsQuery.refetch();
    eventsQuery.refetch();
    metricsQuery.refetch();
    toast.success('System status refreshed');
  };

  const handleAcknowledgeEvent = async (id: string) => {
    try {
      const result = await acknowledgeEvent(id);
      if (result) {
        // Refresh events after acknowledgment
        eventsQuery.refetch();
      }
      return result;
    } catch (error) {
      console.error('Failed to acknowledge event:', error);
      return false;
    }
  };

  return (
    <AppLayout>
      <div className="container max-w-7xl mx-auto py-6">
        <PageHeader
          title="System Status"
          description="Monitor the health and performance of your energy management system"
          icon={<Activity className="h-6 w-6" />}
          actions={
            <Button onClick={handleRefresh} disabled={componentsQuery.isLoading}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Status
            </Button>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">Healthy</div>
              <p className="text-sm text-muted-foreground">All systems operational</p>
            </CardContent>
          </Card>
          <Card className="col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Active Components</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {componentsQuery.isLoading ? '...' : componentsQuery.data?.length || 0}
              </div>
              <p className="text-sm text-muted-foreground">Components monitored</p>
            </CardContent>
          </Card>
          <Card className="col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Active Integrations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {integrationsQuery.isLoading
                  ? '...'
                  : integrationsQuery.data?.filter(i => i.status === 'online').length || 0}
              </div>
              <p className="text-sm text-muted-foreground">Connected services</p>
            </CardContent>
          </Card>
          <Card className="col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Unacknowledged Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {eventsQuery.isLoading
                  ? '...'
                  : eventsQuery.data?.filter(e => !e.acknowledged).length || 0}
              </div>
              <p className="text-sm text-muted-foreground">Requiring attention</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">
              <Cpu className="h-4 w-4 mr-2" />
              System Overview
            </TabsTrigger>
            <TabsTrigger value="metrics">
              <Activity className="h-4 w-4 mr-2" />
              Performance Metrics
            </TabsTrigger>
            <TabsTrigger value="integrations">
              <Router className="h-4 w-4 mr-2" />
              Integrations
            </TabsTrigger>
            <TabsTrigger value="events">
              <CircuitBoard className="h-4 w-4 mr-2" />
              System Events
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {componentsQuery.error ? (
              <ErrorMessage
                message="Failed to load system components"
                description="There was an error fetching system component data."
                retryAction={() => componentsQuery.refetch()}
              />
            ) : (
              <SystemOverview
                components={componentsQuery.data || []}
                isLoading={componentsQuery.isLoading}
              />
            )}
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6">
            {metricsQuery.error ? (
              <ErrorMessage
                message="Failed to load performance metrics"
                description="There was an error fetching performance metrics data."
                retryAction={() => metricsQuery.refetch()}
              />
            ) : (
              <PerformanceMetrics
                metrics={metricsQuery.data || []}
                isLoading={metricsQuery.isLoading}
              />
            )}
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            {integrationsQuery.error ? (
              <ErrorMessage
                message="Failed to load integration status"
                description="There was an error fetching integration data."
                retryAction={() => integrationsQuery.refetch()}
              />
            ) : (
              <IntegrationStatus
                integrations={integrationsQuery.data || []}
                isLoading={integrationsQuery.isLoading}
              />
            )}
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            {eventsQuery.error ? (
              <ErrorMessage
                message="Failed to load system events"
                description="There was an error fetching system events data."
                retryAction={() => eventsQuery.refetch()}
              />
            ) : (
              <EventsList
                events={eventsQuery.data || []}
                isLoading={eventsQuery.isLoading}
                onAcknowledge={handleAcknowledgeEvent}
              />
            )}
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>System Diagnostics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Run Diagnostics</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Activity className="h-4 w-4 mr-2" />
                    Run System Health Check
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Router className="h-4 w-4 mr-2" />
                    Test Network Connectivity
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <CircuitBoard className="h-4 w-4 mr-2" />
                    Verify Hardware Components
                  </Button>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-4">System Logs</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <DownloadCloud className="h-4 w-4 mr-2" />
                    Download System Logs
                  </Button>
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md">
                    <div className="text-sm mb-2 font-medium">Log Level</div>
                    <select className="w-full p-2 border rounded">
                      <option>Error</option>
                      <option>Warning</option>
                      <option selected>Info</option>
                      <option>Debug</option>
                      <option>Trace</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default SystemStatus;
