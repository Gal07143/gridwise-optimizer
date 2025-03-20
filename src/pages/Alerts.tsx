
import React, { useState, useEffect } from 'react';
import { AlertTriangle, Bell, CheckCircle, Clock, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import AppLayout from '@/components/layout/AppLayout';
import { AlertItem } from '@/components/microgrid/types';
import { supabase } from '@/integrations/supabase/client';

const mockAlerts: AlertItem[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    title: 'Battery Level Low',
    message: 'Battery storage capacity below 20%',
    severity: 'high',
    acknowledged: false
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    title: 'Solar Efficiency Drop',
    message: 'Solar panel efficiency dropped below threshold',
    severity: 'medium',
    acknowledged: false
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    title: 'System Update',
    message: 'System update available',
    severity: 'low',
    acknowledged: true
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    title: 'Grid Status Change',
    message: 'Grid connection status changed',
    severity: 'medium',
    acknowledged: true
  }
];

const Alerts: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertItem[]>(mockAlerts);
  const [filter, setFilter] = useState<'all' | 'unacknowledged' | 'acknowledged'>('all');
  const [loading, setLoading] = useState(false);

  // Fetch alerts from Supabase when available
  const fetchAlerts = async () => {
    setLoading(true);
    try {
      // In a real implementation, we would fetch alerts from Supabase
      // For now, we'll use our mock data
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In production, uncomment this code to fetch from Supabase
      /*
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .order('timestamp', { ascending: false });
        
      if (error) throw error;
      setAlerts(data || []);
      */
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      toast.error('Failed to load alerts');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleAcknowledge = async (id: string) => {
    try {
      // In a real implementation, we would update the alert in Supabase
      // For now, we'll update our local state
      const updatedAlerts = alerts.map(alert => 
        alert.id === id ? { ...alert, acknowledged: true } : alert
      );
      setAlerts(updatedAlerts);
      
      // In production, uncomment this code to update in Supabase
      /*
      const { error } = await supabase
        .from('alerts')
        .update({ acknowledged: true, acknowledged_at: new Date().toISOString() })
        .eq('id', id);
        
      if (error) throw error;
      */
      
      toast.success('Alert acknowledged');
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      toast.error('Failed to acknowledge alert');
    }
  };

  const handleDeleteAll = async () => {
    try {
      // In a real implementation, we would delete acknowledged alerts in Supabase
      const updatedAlerts = alerts.filter(alert => !alert.acknowledged);
      setAlerts(updatedAlerts);
      
      // In production, uncomment this code to delete in Supabase
      /*
      const { error } = await supabase
        .from('alerts')
        .delete()
        .eq('acknowledged', true);
        
      if (error) throw error;
      */
      
      toast.success('Acknowledged alerts cleared');
    } catch (error) {
      console.error('Error clearing alerts:', error);
      toast.error('Failed to clear alerts');
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    if (filter === 'unacknowledged') return !alert.acknowledged;
    if (filter === 'acknowledged') return alert.acknowledged;
    return true;
  });

  const getSeverityColor = (severity: 'low' | 'medium' | 'high' | 'critical') => {
    switch (severity) {
      case 'critical':
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-amber-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Bell className="h-6 w-6" />
              Alerts & Notifications
            </h1>
            <p className="text-muted-foreground">Monitor and manage system alerts and notifications</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={fetchAlerts} disabled={loading}>
              {loading ? 'Refreshing...' : 'Refresh'}
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteAll}
              disabled={!alerts.some(alert => alert.acknowledged)}
            >
              Clear Acknowledged
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>System Alerts</CardTitle>
                <CardDescription>
                  {filteredAlerts.length} alert{filteredAlerts.length !== 1 ? 's' : ''} {filter !== 'all' ? `(${filter})` : ''}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select 
                  className="border rounded px-2 py-1 bg-background text-sm"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                >
                  <option value="all">All Alerts</option>
                  <option value="unacknowledged">Unacknowledged</option>
                  <option value="acknowledged">Acknowledged</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredAlerts.length === 0 ? (
              <div className="text-center py-12">
                <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No alerts to display</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAlerts.map((alert) => (
                  <div 
                    key={alert.id} 
                    className={`p-4 border rounded-lg flex justify-between items-center ${
                      alert.acknowledged ? 'bg-muted/20' : 'bg-background'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`${getSeverityColor(alert.severity)} h-3 w-3 rounded-full mt-1.5`} />
                      <div>
                        <p className="font-medium">{alert.title}</p>
                        <p>{alert.message}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatDate(alert.timestamp)}</span>
                          {alert.acknowledged && (
                            <Badge variant="outline" className="ml-2 bg-muted">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Acknowledged
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {!alert.acknowledged && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleAcknowledge(alert.id)}
                      >
                        Acknowledge
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Alerts;
