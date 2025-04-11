
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AppLayout from '@/components/layout/AppLayout';
import AlertTable from '@/components/alerts/AlertTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Bell, AlertTriangle, Check, Filter, RefreshCw } from 'lucide-react';
import { Alert, getRecentAlerts, getAlertCounts } from '@/services/alertService';
import { AlertCountSummary } from '@/services/alertService';
import { toast } from 'sonner';

const Alerts = () => {
  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  
  const { 
    data: alerts = [], 
    isLoading: alertsLoading,
    refetch: refetchAlerts
  } = useQuery({
    queryKey: ['alerts'],
    queryFn: () => getRecentAlerts(100),
  });
  
  const {
    data: alertCounts,
    isLoading: countsLoading,
  } = useQuery({
    queryKey: ['alertCounts'],
    queryFn: getAlertCounts,
  });
  
  const handleRefresh = () => {
    refetchAlerts();
    toast.info('Refreshing alerts...');
  };
  
  // Filter alerts based on tab and selected severity
  const filteredAlerts = alerts.filter(alert => {
    if (activeTab === 'active' && alert.resolved) return false;
    if (activeTab === 'resolved' && !alert.resolved) return false;
    if (selectedSeverity && alert.severity !== selectedSeverity) return false;
    return true;
  });
  
  return (
    <AppLayout>
      <div className="container mx-auto p-4 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">System Alerts</h1>
            <p className="text-muted-foreground">Monitor and respond to alerts across your energy system</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleRefresh}
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className={`bg-gradient-to-br ${countsLoading ? 'from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900' : 'from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/20'}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Critical</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold">
                  {countsLoading ? <Skeleton className="h-8 w-16" /> : alertCounts?.critical || 0}
                </div>
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className={`bg-gradient-to-br ${countsLoading ? 'from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900' : 'from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/20'}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">High</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold">
                  {countsLoading ? <Skeleton className="h-8 w-16" /> : alertCounts?.high || 0}
                </div>
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className={`bg-gradient-to-br ${countsLoading ? 'from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900' : 'from-yellow-50 to-yellow-100 dark:from-yellow-950/30 dark:to-yellow-900/20'}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Medium</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold">
                  {countsLoading ? <Skeleton className="h-8 w-16" /> : alertCounts?.medium || 0}
                </div>
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                  <Bell className="h-5 w-5 text-yellow-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className={`bg-gradient-to-br ${countsLoading ? 'from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900' : 'from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20'}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Low/Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold">
                  {countsLoading ? <Skeleton className="h-8 w-16" /> : (alertCounts?.low || 0) + (alertCounts?.info || 0)}
                </div>
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <Bell className="h-5 w-5 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Alert History</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList>
                <TabsTrigger value="all" className="flex gap-2">
                  All <span className="text-xs bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-full">{alerts.length}</span>
                </TabsTrigger>
                <TabsTrigger value="active" className="flex gap-2">
                  Active <span className="text-xs bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-full">{alerts.filter(a => !a.resolved).length}</span>
                </TabsTrigger>
                <TabsTrigger value="resolved" className="flex gap-2">
                  Resolved <span className="text-xs bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-full">{alerts.filter(a => a.resolved).length}</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="p-0">
                <AlertTable />
              </TabsContent>
              
              <TabsContent value="active" className="p-0">
                <AlertTable />
              </TabsContent>
              
              <TabsContent value="resolved" className="p-0">
                <AlertTable />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
      </div>
    </AppLayout>
  );
};

export default Alerts;
