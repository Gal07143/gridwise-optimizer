
import React, { useState } from 'react';
import { Bell, AlertTriangle, Clock, CheckCircle, Filter, RefreshCw, Search, MoreHorizontal, Eye, Check, X } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock data for alerts
const mockAlerts = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
    severity: 'critical',
    message: 'Battery system disconnected unexpectedly',
    source: 'Battery Controller',
    deviceId: 'batt-001',
    deviceName: 'Main Battery System',
    acknowledged: false,
    resolved: false
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    severity: 'warning',
    message: 'Inverter efficiency below expected threshold',
    source: 'Inverter Monitoring',
    deviceId: 'inv-002',
    deviceName: 'SolarEdge Inverter 1',
    acknowledged: true,
    resolved: false
  },
  {
    id: '3', 
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
    severity: 'info',
    message: 'Scheduled maintenance due for solar panels',
    source: 'Maintenance System',
    deviceId: 'solar-array-1',
    deviceName: 'Rooftop Solar Array',
    acknowledged: false,
    resolved: false
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 5 * 3600000).toISOString(),
    severity: 'warning',
    message: 'Grid power quality fluctuations detected',
    source: 'Grid Connection Monitor',
    deviceId: 'grid-conn-1',
    deviceName: 'Main Grid Connection',
    acknowledged: false,
    resolved: false
  },
  {
    id: '5',
    timestamp: new Date(Date.now() - 8 * 3600000).toISOString(),
    severity: 'critical',
    message: 'Energy storage system temperature exceeding safe limits',
    source: 'Battery Management System',
    deviceId: 'batt-001',
    deviceName: 'Main Battery System',
    acknowledged: true,
    resolved: true
  }
];

const Alerts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredAlerts = mockAlerts.filter(alert => {
    const matchesSearch = 
      alert.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.deviceName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSeverity = selectedSeverity === 'all' || alert.severity === selectedSeverity;
    
    return matchesSearch && matchesSeverity;
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const getActiveAlerts = () => filteredAlerts.filter(alert => !alert.resolved);
  const getResolvedAlerts = () => filteredAlerts.filter(alert => alert.resolved);

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'warning':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Warning</Badge>;
      case 'info':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Info</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const AlertRow = ({ alert }: { alert: any }) => (
    <div className="flex items-center justify-between p-4 border-b last:border-0">
      <div className="flex items-start gap-4">
        <div className="mt-1">
          {getSeverityBadge(alert.severity)}
        </div>
        <div>
          <h3 className="font-medium">{alert.message}</h3>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {new Date(alert.timestamp).toLocaleString()}
            </span>
            <span>{alert.source}</span>
            <span>{alert.deviceName}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center">
        {!alert.resolved && (
          <div className="flex space-x-2">
            {!alert.acknowledged && (
              <Button size="sm" variant="outline" className="hidden sm:flex">
                <Check size={14} className="mr-1" />
                Acknowledge
              </Button>
            )}
            <Button size="sm" variant="outline" className="hidden sm:flex">
              <Eye size={14} className="mr-1" />
              View
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost">
                  <MoreHorizontal size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {!alert.acknowledged && (
                  <DropdownMenuItem>
                    <Check size={14} className="mr-2" />
                    Acknowledge
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>
                  <Eye size={14} className="mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CheckCircle size={14} className="mr-2" />
                  Mark as Resolved
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        {alert.resolved && (
          <Badge variant="outline" className="bg-green-100 text-green-800">Resolved</Badge>
        )}
      </div>
    </div>
  );

  return (
    <AppLayout>
      <div className="flex-1 overflow-y-auto p-6 animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold mb-1">System Alerts</h1>
            <p className="text-muted-foreground">View and manage system alerts and notifications</p>
          </div>
          <Button onClick={handleRefresh} className="gap-2">
            <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
            Refresh
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search alerts..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="info">Info</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList>
            <TabsTrigger value="active" className="relative">
              Active Alerts
              {getActiveAlerts().length > 0 && (
                <span className="ml-1 inline-flex items-center justify-center rounded-full bg-primary/10 px-1.5 text-xs text-primary">
                  {getActiveAlerts().length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="resolved">Resolved Alerts</TabsTrigger>
            <TabsTrigger value="all">All Alerts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Active Alerts</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {getActiveAlerts().length > 0 ? (
                  <div>
                    {getActiveAlerts().map(alert => (
                      <AlertRow key={alert.id} alert={alert} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10">
                    <CheckCircle size={48} className="text-green-500 mb-4" />
                    <h3 className="text-lg font-medium mb-1">No Active Alerts</h3>
                    <p className="text-muted-foreground">
                      All systems are running normally.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="resolved">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Resolved Alerts</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {getResolvedAlerts().length > 0 ? (
                  <div>
                    {getResolvedAlerts().map(alert => (
                      <AlertRow key={alert.id} alert={alert} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10">
                    <AlertTriangle size={48} className="text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-1">No Resolved Alerts</h3>
                    <p className="text-muted-foreground">
                      There are no resolved alerts in your history.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="all">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">All Alerts</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {filteredAlerts.length > 0 ? (
                  <div>
                    {filteredAlerts.map(alert => (
                      <AlertRow key={alert.id} alert={alert} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10">
                    <AlertTriangle size={48} className="text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-1">No Alerts Found</h3>
                    <p className="text-muted-foreground">
                      No alerts match your current filters.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Alerts;
