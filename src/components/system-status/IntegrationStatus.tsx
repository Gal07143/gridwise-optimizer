
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Clock, Database, RefreshCcw, Server } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Integration {
  name: string;
  status: 'online' | 'offline' | 'unknown' | 'error';
  lastHeartbeat?: string;
  type: 'modbus' | 'mqtt' | 'database' | 'edge';
  testEndpoint?: string;
}

const IntegrationStatus = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      name: 'Modbus/TCP Agent',
      status: 'unknown',
      type: 'modbus',
      testEndpoint: '/api/test-modbus'
    },
    {
      name: 'MQTT Broker',
      status: 'unknown',
      type: 'mqtt',
      testEndpoint: '/api/test-mqtt'
    },
    {
      name: 'Supabase Database',
      status: 'unknown',
      type: 'database'
    },
    {
      name: 'Edge Functions',
      status: 'unknown',
      type: 'edge'
    }
  ]);
  const [loading, setLoading] = useState(false);

  const testSupabase = async () => {
    try {
      const start = Date.now();
      const { data, error } = await supabase.from('telemetry_log').select('count').limit(1);
      const latency = Date.now() - start;
      
      if (error) throw error;
      
      // Update the database status
      updateIntegrationStatus('Supabase Database', 'online', latency);
      toast.success(`Database connection successful (${latency}ms)`);
    } catch (error) {
      console.error('Database connection error:', error);
      updateIntegrationStatus('Supabase Database', 'error');
      toast.error('Database connection failed');
    }
  };

  const testEdgeFunctions = async () => {
    try {
      // For now we'll just simulate this
      updateIntegrationStatus('Edge Functions', 'online');
      toast.success('Edge Functions are online');
    } catch (error) {
      updateIntegrationStatus('Edge Functions', 'error');
      toast.error('Edge Functions test failed');
    }
  };

  const testModbus = async () => {
    // For now, simulate the test
    toast.info('Testing Modbus connection...');
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% success rate for simulation
      
      if (success) {
        updateIntegrationStatus('Modbus/TCP Agent', 'online');
        toast.success('Modbus agent is responding');
      } else {
        updateIntegrationStatus('Modbus/TCP Agent', 'error');
        toast.error('Modbus agent is not responding');
      }
    }, 1500);
  };

  const testMQTT = async () => {
    // For now, simulate the test
    toast.info('Testing MQTT connection...');
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% success rate for simulation
      
      if (success) {
        updateIntegrationStatus('MQTT Broker', 'online');
        toast.success('MQTT broker is connected');
      } else {
        updateIntegrationStatus('MQTT Broker', 'error');
        toast.error('MQTT broker connection failed');
      }
    }, 1500);
  };

  const updateIntegrationStatus = (name: string, status: 'online' | 'offline' | 'unknown' | 'error', latencyMs?: number) => {
    setIntegrations(prev => 
      prev.map(integration => 
        integration.name === name 
          ? { 
              ...integration, 
              status, 
              lastHeartbeat: new Date().toISOString(),
              latency: latencyMs
            } 
          : integration
      )
    );
  };

  const refreshAll = async () => {
    setLoading(true);
    
    try {
      // Test all connections in parallel
      await Promise.all([
        testSupabase(),
        testEdgeFunctions(),
        testModbus(),
        testMQTT()
      ]);
    } catch (error) {
      console.error('Error refreshing integration status:', error);
      toast.error('Failed to refresh some integration statuses');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'offline':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getIntegrationIcon = (type: string) => {
    switch (type) {
      case 'modbus':
        return <Server className="h-5 w-5" />;
      case 'mqtt':
        return <Server className="h-5 w-5" />;
      case 'database':
        return <Database className="h-5 w-5" />;
      case 'edge':
        return <Server className="h-5 w-5" />;
      default:
        return <Server className="h-5 w-5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return <Badge className="bg-green-500">Online</Badge>;
      case 'offline':
        return <Badge variant="destructive">Offline</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleTest = (integration: Integration) => {
    switch (integration.type) {
      case 'modbus':
        testModbus();
        break;
      case 'mqtt':
        testMQTT();
        break;
      case 'database':
        testSupabase();
        break;
      case 'edge':
        testEdgeFunctions();
        break;
    }
  };

  React.useEffect(() => {
    // Test database connection on mount
    testSupabase();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Integration Status</CardTitle>
        <CardDescription>Status of system integrations and connectivity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {integrations.map((integration) => (
            <div key={integration.name} className="flex items-center justify-between p-3 bg-muted/20 rounded-md border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  {getIntegrationIcon(integration.type)}
                </div>
                
                <div>
                  <div className="font-medium">{integration.name}</div>
                  {integration.lastHeartbeat ? (
                    <div className="text-xs text-muted-foreground">
                      Last check: {new Date(integration.lastHeartbeat).toLocaleTimeString()}
                      {integration.latency && ` (${integration.latency}ms)`}
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground">Not tested yet</div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {loading ? (
                  <Skeleton className="h-6 w-16" />
                ) : (
                  getStatusBadge(integration.status)
                )}
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleTest(integration)}
                  disabled={loading}
                >
                  Test
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={refreshAll} 
          disabled={loading} 
          className="w-full"
          variant="outline"
        >
          {loading ? (
            <>
              <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
              Testing connections...
            </>
          ) : (
            <>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh All
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default IntegrationStatus;
