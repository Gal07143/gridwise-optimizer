
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, BellRing } from 'lucide-react';
import { subscribeToTable } from '@/services/supabaseRealtimeService';
import { supabase } from '@/integrations/supabase/client';

interface Alert {
  id: string;
  message: string;
  severity: string;
  device_id: string;
  timestamp: string;
  acknowledged: boolean;
  source?: string;
}

const CriticalAlertWidget = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .eq('acknowledged', false)
        .in('severity', ['high', 'critical'])
        .order('timestamp', { ascending: false })
        .limit(5);
        
      if (error) throw error;
      
      setAlerts(data || []);
    } catch (error) {
      console.error('Failed to load alerts:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchAlerts();
    
    // Subscribe to realtime updates
    const channel = subscribeToTable('alerts', '*', (payload: any) => {
      const newAlert = payload.new;
      
      if (newAlert && (newAlert.severity === 'high' || newAlert.severity === 'critical')) {
        if (payload.eventType === 'INSERT') {
          setAlerts(prev => [newAlert, ...prev].slice(0, 5));
        } else if (payload.eventType === 'UPDATE') {
          setAlerts(prev => prev.map(alert => 
            alert.id === newAlert.id ? newAlert : alert
          ));
        } else if (payload.eventType === 'DELETE') {
          setAlerts(prev => prev.filter(alert => alert.id !== newAlert.id));
        }
      }
    });
    
    return () => {
      // Unsubscribe when component unmounts
      supabase.removeChannel(channel as any);
    };
  }, []);
  
  const acknowledgeAlert = async (id: string) => {
    try {
      const { error } = await supabase
        .from('alerts')
        .update({ 
          acknowledged: true,
          acknowledged_at: new Date().toISOString(),
          acknowledged_by: (await supabase.auth.getUser()).data?.user?.id
        })
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setAlerts(prev => prev.filter(alert => alert.id !== id));
    } catch (error) {
      console.error('Failed to acknowledge alert:', error);
    }
  };
  
  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'bg-destructive hover:bg-destructive/90';
      case 'high':
        return 'bg-amber-500 hover:bg-amber-600';
      default:
        return 'bg-blue-500 hover:bg-blue-600';
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/50">
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-destructive" />
          Critical Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="flex justify-center items-center h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mb-2" />
            <p className="text-muted-foreground">No critical alerts</p>
          </div>
        ) : (
          <div>
            {alerts.map(alert => (
              <div key={alert.id} className="border-b p-4 last:border-0">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                      {alert.severity}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(alert.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => acknowledgeAlert(alert.id)}
                    className="h-7 px-2"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span className="text-xs">Ack</span>
                  </Button>
                </div>
                <p className="text-sm">{alert.message}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CriticalAlertWidget;
