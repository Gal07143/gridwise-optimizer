
import React, { useState } from 'react';
import { Device } from '@/types/device';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, CheckCircle2, Clock, RefreshCw, WrenchIcon, FileText, CalendarDays, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DeviceMaintenanceTabProps {
  device: Device;
}

const DeviceMaintenanceTab: React.FC<DeviceMaintenanceTabProps> = ({ device }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleDiagnosticCheck = () => {
    setLoading(true);
    // Simulate diagnostic check
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const getNextMaintenanceDate = () => {
    // Mock function to calculate next maintenance date
    const today = new Date();
    const nextMaintenance = new Date(today);
    nextMaintenance.setMonth(today.getMonth() + 3);
    return nextMaintenance.toLocaleDateString();
  };

  const maintenanceHistory = [
    { date: '2025-03-15', type: 'Inspection', notes: 'Regular inspection completed. All systems normal.' },
    { date: '2025-01-10', type: 'Firmware Update', notes: 'Updated firmware to version 2.3.1' },
    { date: '2024-11-22', type: 'Service', notes: 'Replaced cooling fan and cleaned dust' },
  ];

  const diagnosticReports = [
    { date: '2025-04-01', status: 'pass', component: 'Communication Module', value: 'OK' },
    { date: '2025-04-01', status: 'pass', component: 'Temperature Sensor', value: '32.4°C' },
    { date: '2025-04-01', status: 'warning', component: 'Cooling Fan', value: 'Slower than expected' },
    { date: '2025-04-01', status: 'pass', component: 'Firmware Version', value: device.firmware || 'Unknown' },
  ];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Maintenance Overview</TabsTrigger>
          <TabsTrigger value="diagnostic">Diagnostic Tools</TabsTrigger>
          <TabsTrigger value="history">Maintenance History</TabsTrigger>
          <TabsTrigger value="documents">Documentation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg flex items-center gap-3">
                  <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-full">
                    <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Device Status</p>
                    <p className="font-medium">Operational</p>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg flex items-center gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Next Maintenance</p>
                    <p className="font-medium">{getNextMaintenanceDate()}</p>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg flex items-center gap-3">
                  <div className="bg-amber-100 dark:bg-amber-900/20 p-3 rounded-full">
                    <WrenchIcon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Service Interval</p>
                    <p className="font-medium">Every 3 months</p>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg flex items-center gap-3">
                  <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-full">
                    <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Service</p>
                    <p className="font-medium">March 15, 2025</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <CalendarDays className="h-4 w-4" />
                <span>Device installed on {new Date(device.created_at || Date.now()).toLocaleDateString()}</span>
              </div>
              <Button variant="outline" onClick={handleDiagnosticCheck}>Run Diagnostic</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="diagnostic" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Diagnostic Tools</CardTitle>
              <Button variant="outline" size="sm" className="h-8" disabled={loading} onClick={handleDiagnosticCheck}>
                {loading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                Run Diagnostic
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="p-2 text-left font-medium text-muted-foreground">Component</th>
                      <th className="p-2 text-left font-medium text-muted-foreground">Status</th>
                      <th className="p-2 text-left font-medium text-muted-foreground">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {diagnosticReports.map((report, index) => (
                      <tr key={index}>
                        <td className="p-2">{report.component}</td>
                        <td className="p-2">
                          {report.status === 'pass' ? (
                            <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-600/20">
                              <CheckCircle2 className="h-3 w-3 mr-1" /> Pass
                            </Badge>
                          ) : report.status === 'warning' ? (
                            <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-600/20">
                              <AlertTriangle className="h-3 w-3 mr-1" /> Warning
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-600/20">
                              <AlertCircle className="h-3 w-3 mr-1" /> Fail
                            </Badge>
                          )}
                        </td>
                        <td className="p-2">{report.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="p-2 text-left font-medium text-muted-foreground">Date</th>
                      <th className="p-2 text-left font-medium text-muted-foreground">Type</th>
                      <th className="p-2 text-left font-medium text-muted-foreground">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {maintenanceHistory.map((item, index) => (
                      <tr key={index}>
                        <td className="p-2">{new Date(item.date).toLocaleDateString()}</td>
                        <td className="p-2">{item.type}</td>
                        <td className="p-2">{item.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button variant="outline">Download Full History</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Device Documentation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Access technical documentation, user manuals, and service guides for this device.
              </p>
              <div className="space-y-2">
                <div className="p-3 border rounded-lg flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span>User Manual</span>
                  </div>
                  <Button variant="ghost" size="sm">View</Button>
                </div>
                <div className="p-3 border rounded-lg flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span>Technical Specifications</span>
                  </div>
                  <Button variant="ghost" size="sm">View</Button>
                </div>
                <div className="p-3 border rounded-lg flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <span>Service Guide</span>
                  </div>
                  <Button variant="ghost" size="sm">View</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeviceMaintenanceTab;
