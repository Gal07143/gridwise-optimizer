
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, AlertTriangle, XCircle, Clock, Info, Server, Database, Cpu, Radio, Shield, FileText, Activity, RefreshCw, Cloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

type ComponentStatus = 'operational' | 'degraded' | 'down' | 'maintenance';

interface SystemComponent {
  id: string;
  component_name: string;
  status: ComponentStatus;
  details: string;
  latency: number;
  last_restart: string;
  updated_at: string;
}

interface SystemEvent {
  id: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'error';
  message: string;
  component_id: string | null;
  component_name?: string;
  acknowledged: boolean;
}

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
      
      // Fetch system components
      const { data: componentsData, error: componentsError } = await supabase
        .from('system_status')
        .select('*')
        .order('component_name');
      
      if (componentsError) throw componentsError;
      
      // Fetch system events
      const { data: eventsData, error: eventsError } = await supabase
        .from('system_events')
        .select('*, system_status(component_name)')
        .order('timestamp', { ascending: false })
        .limit(50);
      
      if (eventsError) throw eventsError;
      
      // Format the events data
      const formattedEvents = eventsData.map(event => ({
        ...event,
        component_name: event.system_status?.component_name || null
      }));
      
      setComponents(componentsData || []);
      setEvents(formattedEvents || []);
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

  const getStatusBadge = (status: ComponentStatus) => {
    switch (status) {
      case 'operational':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Operational</Badge>;
      case 'degraded':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Degraded</Badge>;
      case 'down':
        return <Badge variant="destructive">Down</Badge>;
      case 'maintenance':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Maintenance</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getComponentIcon = (name: string) => {
    if (name.includes('Controller')) return <Cpu className="h-5 w-5" />;
    if (name.includes('Database')) return <Database className="h-5 w-5" />;
    if (name.includes('Communication')) return <Radio className="h-5 w-5" />;
    if (name.includes('Authentication')) return <Shield className="h-5 w-5" />;
    if (name.includes('Logging')) return <FileText className="h-5 w-5" />;
    if (name.includes('API')) return <Server className="h-5 w-5" />;
    if (name.includes('Reporting')) return <FileText className="h-5 w-5" />;
    if (name.includes('Weather')) return <Cloud className="h-5 w-5" />;
    return <Activity className="h-5 w-5" />;
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

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">System Components</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {components.map((component) => (
                    <Card key={component.id} className="overflow-hidden">
                      <div className={`h-1 ${
                        component.status === 'operational' ? 'bg-green-500' : 
                        component.status === 'degraded' ? 'bg-amber-500' : 
                        component.status === 'down' ? 'bg-red-500' : 'bg-blue-500'
                      }`} />
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="bg-primary/10 p-2 rounded-full">
                              {getComponentIcon(component.component_name)}
                            </div>
                            <div>
                              <h3 className="font-medium">{component.component_name}</h3>
                              <p className="text-xs text-muted-foreground">
                                Last updated: {new Date(component.updated_at).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          {getStatusBadge(component.status)}
                        </div>
                        
                        <div className="mt-3 text-sm">
                          {component.details}
                        </div>
                        
                        <div className="mt-2 text-xs text-muted-foreground flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Activity size={12} />
                            Latency: {component.latency}ms
                          </span>
                          <span className="flex items-center gap-1">
                            <RefreshCw size={12} />
                            Last restart: {new Date(component.last_restart).toLocaleDateString()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Recent System Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {events.map((event) => (
                    <div key={event.id} className="flex p-3 border rounded-md bg-card">
                      <div className="mr-3">
                        {getSeverityIcon(event.severity)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="font-medium">{event.message}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(event.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Component: {event.component_name || 'System'}
                        </div>
                      </div>
                    </div>
                  ))}

                  {events.length === 0 && (
                    <div className="text-center py-6 text-muted-foreground">
                      No system events recorded
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance">
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">System Load</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground">System load chart will appear here</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Response Times</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground">Response time metrics will appear here</p>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Resource Utilization</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground">Resource utilization metrics will appear here</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default SystemStatus;
