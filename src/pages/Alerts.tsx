
import React, { useState } from 'react';
import { Main } from '@/components/ui/main';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Bell, Check, Filter, RefreshCw, AlertTriangle, BellOff } from 'lucide-react';
import AlertTable from '@/components/alerts/AlertTable';
import AnomalyFeed from '@/components/alerts/AnomalyFeed';
import { AlertCountSummary, AlertSeverity } from '@/types/alert';
import { getAlertCountSummary } from '@/services/alertService';
import { Checkbox } from '@/components/ui/checkbox';

const Alerts = () => {
  const [activeTab, setActiveTab] = useState<string>('current');
  const [timeRange, setTimeRange] = useState<string>('24h');
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [alertSummary, setAlertSummary] = useState<AlertCountSummary>({
    critical: 2,
    high: 5,
    medium: 8,
    low: 12,
    total: 27
  });
  
  const [selectedSeverities, setSelectedSeverities] = useState<AlertSeverity[]>([]);

  const handleRefresh = () => {
    // In a real app, this would fetch fresh data
    getAlertCountSummary().then(setAlertSummary);
  };
  
  const toggleSeverityFilter = (severity: AlertSeverity) => {
    setSelectedSeverities(prev => 
      prev.includes(severity)
        ? prev.filter(s => s !== severity)
        : [...prev, severity]
    );
  };

  return (
    <Main title="Alerts & Notifications">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Alerts & Notifications</h1>
            <p className="text-muted-foreground">
              Monitor system alerts and notifications
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefresh}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
        
        {filterOpen && (
          <Card className="animate-in fade-in slide-in-from-top-5 duration-300">
            <CardContent className="py-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm font-medium mb-2">Severity</p>
                  <div className="flex flex-wrap gap-2">
                    {(['critical', 'high', 'medium', 'low'] as AlertSeverity[]).map((severity) => (
                      <div key={severity} className="flex items-center">
                        <Checkbox
                          id={`severity-${severity}`}
                          checked={selectedSeverities.includes(severity)}
                          onCheckedChange={() => toggleSeverityFilter(severity)}
                        />
                        <label
                          htmlFor={`severity-${severity}`}
                          className="ml-2 text-sm capitalize"
                        >
                          {severity}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-2">Time Range</p>
                  <Select defaultValue={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1h">Last hour</SelectItem>
                      <SelectItem value="24h">Last 24 hours</SelectItem>
                      <SelectItem value="7d">Last 7 days</SelectItem>
                      <SelectItem value="30d">Last 30 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-2">Status</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <span className="h-2 w-2 bg-red-500 rounded-full" />
                      Active
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-green-500" />
                      Resolved
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-end">
                  <Button variant="outline" size="sm" className="ml-auto">
                    Reset Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="bg-card">
            <CardContent className="p-4 flex flex-col items-center">
              <div className="mt-2 flex justify-center">
                <AlertTriangle className="h-8 w-8 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold mt-2">{alertSummary.total}</h3>
              <p className="text-sm text-muted-foreground">Total Alerts</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card">
            <CardContent className="p-4 flex flex-col items-center">
              <div className="mt-2 flex justify-center">
                <Badge variant="destructive" className="h-8 w-8 flex items-center justify-center rounded-full p-2">
                  {alertSummary.critical}
                </Badge>
              </div>
              <h3 className="text-xl font-bold mt-2 text-red-600">{alertSummary.critical}</h3>
              <p className="text-sm text-muted-foreground">Critical</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card">
            <CardContent className="p-4 flex flex-col items-center">
              <div className="mt-2 flex justify-center">
                <Badge variant="default" className="h-8 w-8 flex items-center justify-center rounded-full p-2 bg-amber-500">
                  {alertSummary.high}
                </Badge>
              </div>
              <h3 className="text-xl font-bold mt-2 text-amber-600">{alertSummary.high}</h3>
              <p className="text-sm text-muted-foreground">High</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card">
            <CardContent className="p-4 flex flex-col items-center">
              <div className="mt-2 flex justify-center">
                <Badge variant="outline" className="h-8 w-8 flex items-center justify-center rounded-full p-2 border-yellow-400 text-yellow-600">
                  {alertSummary.medium}
                </Badge>
              </div>
              <h3 className="text-xl font-bold mt-2 text-yellow-600">{alertSummary.medium}</h3>
              <p className="text-sm text-muted-foreground">Medium</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card">
            <CardContent className="p-4 flex flex-col items-center">
              <div className="mt-2 flex justify-center">
                <Badge variant="outline" className="h-8 w-8 flex items-center justify-center rounded-full p-2 border-blue-400 text-blue-600">
                  {alertSummary.low}
                </Badge>
              </div>
              <h3 className="text-xl font-bold mt-2 text-blue-600">{alertSummary.low}</h3>
              <p className="text-sm text-muted-foreground">Low</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Main content */}
        <Card>
          <CardHeader className="pb-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
                <TabsTrigger value="current">
                  <Bell className="mr-2 h-4 w-4" />
                  Current Alerts
                </TabsTrigger>
                <TabsTrigger value="anomalies">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Anomalies
                </TabsTrigger>
                <TabsTrigger value="settings">
                  <BellOff className="mr-2 h-4 w-4" />
                  Notification Settings
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          
          <CardContent>
            <TabsContent value="current" className="mt-4">
              <AlertTable />
            </TabsContent>
            
            <TabsContent value="anomalies" className="mt-4">
              <AnomalyFeed />
            </TabsContent>
            
            <TabsContent value="settings" className="mt-4">
              <div className="grid gap-6">
                <div>
                  <h3 className="font-medium mb-2 text-lg">Alert Channels</h3>
                  <p className="text-muted-foreground text-sm mb-4">Configure how you receive alert notifications</p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive alerts via email</p>
                      </div>
                      <div>
                        <Checkbox defaultChecked id="email-alerts" />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <p className="font-medium">SMS Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive alerts via SMS</p>
                      </div>
                      <div>
                        <Checkbox id="sms-alerts" />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive alerts via push notifications</p>
                      </div>
                      <div>
                        <Checkbox defaultChecked id="push-alerts" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2 text-lg">Alert Preferences</h3>
                  <p className="text-muted-foreground text-sm mb-4">Configure which alerts you want to receive</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium mb-2">Severity Levels</p>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Checkbox defaultChecked id="critical-severity" />
                          <label htmlFor="critical-severity" className="ml-2 text-sm">Critical</label>
                        </div>
                        <div className="flex items-center">
                          <Checkbox defaultChecked id="high-severity" />
                          <label htmlFor="high-severity" className="ml-2 text-sm">High</label>
                        </div>
                        <div className="flex items-center">
                          <Checkbox defaultChecked id="medium-severity" />
                          <label htmlFor="medium-severity" className="ml-2 text-sm">Medium</label>
                        </div>
                        <div className="flex items-center">
                          <Checkbox id="low-severity" />
                          <label htmlFor="low-severity" className="ml-2 text-sm">Low</label>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <p className="font-medium mb-2">Alert Types</p>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Checkbox defaultChecked id="system-alerts" />
                          <label htmlFor="system-alerts" className="ml-2 text-sm">System Alerts</label>
                        </div>
                        <div className="flex items-center">
                          <Checkbox defaultChecked id="device-alerts" />
                          <label htmlFor="device-alerts" className="ml-2 text-sm">Device Alerts</label>
                        </div>
                        <div className="flex items-center">
                          <Checkbox defaultChecked id="energy-alerts" />
                          <label htmlFor="energy-alerts" className="ml-2 text-sm">Energy Alerts</label>
                        </div>
                        <div className="flex items-center">
                          <Checkbox id="maintenance-alerts" />
                          <label htmlFor="maintenance-alerts" className="ml-2 text-sm">Maintenance Updates</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button>Save Preferences</Button>
                </div>
              </div>
            </TabsContent>
          </CardContent>
        </Card>
      </div>
    </Main>
  );
};

export default Alerts;
