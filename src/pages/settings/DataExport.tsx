
import React from 'react';
import SettingsPageTemplate from '@/components/settings/SettingsPageTemplate';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { DatePicker } from '@/components/ui/date-picker';
import { toast } from 'sonner';
import { FileDown, Calendar, Download, FileSpreadsheet, FileText, BarChart4, Database } from 'lucide-react';

// Mock data
const exportHistory = [
  { 
    id: 1, 
    filename: 'energy_readings_2023_08_15.csv', 
    size: '24.5 MB',
    type: 'Energy Readings',
    format: 'CSV',
    date: '2023-08-15',
    status: 'completed'
  },
  { 
    id: 2, 
    filename: 'device_performance_q2_2023.xlsx', 
    size: '8.2 MB',
    type: 'Device Performance',
    format: 'Excel',
    date: '2023-07-05',
    status: 'completed'
  },
  { 
    id: 3, 
    filename: 'system_logs_july_2023.zip', 
    size: '156.8 MB',
    type: 'System Logs',
    format: 'ZIP',
    date: '2023-08-01',
    status: 'completed'
  },
  { 
    id: 4, 
    filename: 'user_activity_report_q2.pdf', 
    size: '3.4 MB',
    type: 'User Activity',
    format: 'PDF',
    date: '2023-07-10',
    status: 'completed'
  },
  { 
    id: 5, 
    filename: 'full_system_backup.zip', 
    size: '2.3 GB',
    type: 'System Backup',
    format: 'ZIP',
    date: '2023-08-20',
    status: 'in_progress'
  }
];

const DataExportPage = () => {
  return (
    <SettingsPageTemplate 
      title="Data Export" 
      description="Export system data in various formats"
      headerIcon={<FileDown size={24} />}
    >
      <div className="space-y-8">
        <Tabs defaultValue="export">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="export">Export Data</TabsTrigger>
            <TabsTrigger value="history">Export History</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled Exports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="export" className="space-y-6 pt-4">
            <div>
              <h3 className="text-lg font-medium mb-4">Export System Data</h3>
              
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart4 className="h-5 w-5" />
                      <span>Energy Readings</span>
                    </CardTitle>
                    <CardDescription>
                      Export energy production and consumption data
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Date Range</Label>
                        <div className="flex items-center gap-2">
                          <Select defaultValue="last30">
                            <SelectTrigger>
                              <SelectValue placeholder="Select range" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="last7">Last 7 days</SelectItem>
                              <SelectItem value="last30">Last 30 days</SelectItem>
                              <SelectItem value="last90">Last 90 days</SelectItem>
                              <SelectItem value="custom">Custom range</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Data Format</Label>
                        <Select defaultValue="csv">
                          <SelectTrigger>
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="csv">CSV</SelectItem>
                            <SelectItem value="json">JSON</SelectItem>
                            <SelectItem value="excel">Excel</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="aggregateData">Aggregate Data</Label>
                          <p className="text-xs text-muted-foreground">Group by hour instead of raw readings</p>
                        </div>
                        <Switch id="aggregateData" defaultChecked />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full flex items-center gap-1"
                      onClick={() => toast.success('Energy readings export started')}
                    >
                      <Download size={16} />
                      <span>Export Data</span>
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileSpreadsheet className="h-5 w-5" />
                      <span>Device Data</span>
                    </CardTitle>
                    <CardDescription>
                      Export device configuration and status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Device Type</Label>
                        <Select defaultValue="all">
                          <SelectTrigger>
                            <SelectValue placeholder="Select device type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Devices</SelectItem>
                            <SelectItem value="solar">Solar</SelectItem>
                            <SelectItem value="battery">Battery</SelectItem>
                            <SelectItem value="wind">Wind</SelectItem>
                            <SelectItem value="ev_charger">EV Chargers</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Data Format</Label>
                        <Select defaultValue="excel">
                          <SelectTrigger>
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="csv">CSV</SelectItem>
                            <SelectItem value="json">JSON</SelectItem>
                            <SelectItem value="excel">Excel</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="includeMetrics">Include Metrics</Label>
                          <p className="text-xs text-muted-foreground">Include current device metrics</p>
                        </div>
                        <Switch id="includeMetrics" defaultChecked />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full flex items-center gap-1"
                      onClick={() => toast.success('Device data export started')}
                    >
                      <Download size={16} />
                      <span>Export Data</span>
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      <span>Full System Export</span>
                    </CardTitle>
                    <CardDescription>
                      Export complete system database
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Data Selection</Label>
                        <Select defaultValue="all">
                          <SelectTrigger>
                            <SelectValue placeholder="Select data" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Data</SelectItem>
                            <SelectItem value="core">Core Data Only</SelectItem>
                            <SelectItem value="custom">Custom Selection</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Export Format</Label>
                        <Select defaultValue="zip">
                          <SelectTrigger>
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="zip">ZIP Archive</SelectItem>
                            <SelectItem value="sql">SQL Dump</SelectItem>
                            <SelectItem value="json">JSON Files</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="includeConfig">Include Configuration</Label>
                          <p className="text-xs text-muted-foreground">Include system settings</p>
                        </div>
                        <Switch id="includeConfig" defaultChecked />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full flex items-center gap-1"
                      onClick={() => toast.success('Full system export started')}
                    >
                      <Download size={16} />
                      <span>Export Data</span>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="space-y-6 pt-4">
            <div>
              <h3 className="text-lg font-medium mb-4">Export History</h3>
              
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Filename</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {exportHistory.map(export_ => (
                      <TableRow key={export_.id}>
                        <TableCell className="font-medium">{export_.filename}</TableCell>
                        <TableCell>{export_.type}</TableCell>
                        <TableCell>{export_.format}</TableCell>
                        <TableCell>{export_.size}</TableCell>
                        <TableCell>{export_.date}</TableCell>
                        <TableCell>
                          {export_.status === 'completed' ? (
                            <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                              Completed
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                              In Progress
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            disabled={export_.status !== 'completed'}
                            onClick={() => toast.success('File download started')}
                          >
                            <Download size={16} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button 
                  variant="outline"
                  className="flex items-center gap-1"
                  onClick={() => toast.info('Clear export history')}
                >
                  Clear History
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="scheduled" className="space-y-6 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Scheduled Exports</h3>
              
              <Button 
                className="flex items-center gap-1"
                onClick={() => toast.info('Schedule new export dialog')}
              >
                <Calendar size={16} />
                <span>Schedule Export</span>
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Weekly Energy Report</CardTitle>
                <CardDescription>Exports energy production and consumption data weekly</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="weeklyEnergyExport">Status</Label>
                    <Switch id="weeklyEnergyExport" defaultChecked />
                  </div>
                  
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span>Schedule:</span>
                      <span className="font-medium">Every Monday at 02:00 AM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Format:</span>
                      <span className="font-medium">Excel (.xlsx)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Data:</span>
                      <span className="font-medium">Energy readings from past 7 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Recipients:</span>
                      <span className="font-medium">admin@example.com, operations@example.com</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Run:</span>
                      <span className="font-medium">August 21, 2023</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button 
                  variant="outline"
                  onClick={() => toast.info('Edit scheduled export')}
                >
                  Edit
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => toast.success('Weekly export triggered manually')}
                >
                  Run Now
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Monthly Performance Report</CardTitle>
                <CardDescription>Comprehensive monthly performance report</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="monthlyPerformanceExport">Status</Label>
                    <Switch id="monthlyPerformanceExport" defaultChecked />
                  </div>
                  
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span>Schedule:</span>
                      <span className="font-medium">1st of each month at 03:00 AM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Format:</span>
                      <span className="font-medium">PDF Report</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Data:</span>
                      <span className="font-medium">Full system performance data for previous month</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Recipients:</span>
                      <span className="font-medium">management@example.com</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Run:</span>
                      <span className="font-medium">August 1, 2023</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button 
                  variant="outline"
                  onClick={() => toast.info('Edit scheduled export')}
                >
                  Edit
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => toast.success('Monthly export triggered manually')}
                >
                  Run Now
                </Button>
              </CardFooter>
            </Card>
            
            <div className="flex justify-end">
              <Button onClick={() => toast.success('Scheduled export settings saved')}>
                Save Changes
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </SettingsPageTemplate>
  );
};

export default DataExportPage;
