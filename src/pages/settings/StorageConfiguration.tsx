
import React from 'react';
import SettingsPageTemplate from '@/components/settings/SettingsPageTemplate';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Database, HardDrive, FileArchive, RefreshCw, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const StorageConfigurationPage = () => {
  return (
    <SettingsPageTemplate 
      title="Storage Configuration" 
      description="Data storage and retention settings"
      headerIcon={<HardDrive size={24} />}
    >
      <div className="space-y-8">
        <Tabs defaultValue="storage">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="storage">Storage Usage</TabsTrigger>
            <TabsTrigger value="retention">Retention Policies</TabsTrigger>
            <TabsTrigger value="database">Database Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="storage" className="space-y-6 pt-4">
            <div>
              <h3 className="text-lg font-medium mb-4">Storage Overview</h3>
              
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>System Storage</CardTitle>
                    <CardDescription>Overall system storage usage</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Used: 245.8 GB</span>
                          <span>Total: 500 GB</span>
                        </div>
                        <Progress value={49.2} className="h-2" />
                        <p className="text-xs text-muted-foreground">49.2% used</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1 border rounded-md p-3">
                          <div className="text-sm font-medium">Database</div>
                          <div className="text-xs text-muted-foreground">128.4 GB</div>
                        </div>
                        
                        <div className="space-y-1 border rounded-md p-3">
                          <div className="text-sm font-medium">Files</div>
                          <div className="text-xs text-muted-foreground">64.2 GB</div>
                        </div>
                        
                        <div className="space-y-1 border rounded-md p-3">
                          <div className="text-sm font-medium">Logs</div>
                          <div className="text-xs text-muted-foreground">42.6 GB</div>
                        </div>
                        
                        <div className="space-y-1 border rounded-md p-3">
                          <div className="text-sm font-medium">Backups</div>
                          <div className="text-xs text-muted-foreground">10.6 GB</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => toast.info('Storage management dialog')}
                    >
                      Manage Storage
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Storage Trending</CardTitle>
                    <CardDescription>Storage growth over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-40 flex items-center justify-center border rounded-md bg-muted/20">
                      <p className="text-sm text-muted-foreground">Storage trend chart would display here</p>
                    </div>
                    
                    <div className="mt-4 text-sm space-y-2">
                      <div className="flex justify-between">
                        <span>Current growth rate:</span>
                        <span className="font-medium">~2.3 GB/week</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Projected full date:</span>
                        <span className="font-medium">March 15, 2024</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => toast.info('Storage analysis dialog')}
                    >
                      View Detailed Analysis
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-medium mb-4">Storage Management</h3>
              
              <div className="space-y-4">
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                  <Button 
                    variant="outline" 
                    className="h-auto flex flex-col items-center justify-center space-y-2 p-4"
                    onClick={() => toast.info('Database optimization dialog')}
                  >
                    <Database className="h-8 w-8" />
                    <div>
                      <div className="font-medium">Optimize Database</div>
                      <div className="text-xs text-muted-foreground">Run database optimization</div>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-auto flex flex-col items-center justify-center space-y-2 p-4"
                    onClick={() => toast.info('Clear log files dialog')}
                  >
                    <FileArchive className="h-8 w-8" />
                    <div>
                      <div className="font-medium">Archive Logs</div>
                      <div className="text-xs text-muted-foreground">Archive old log files</div>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-auto flex flex-col items-center justify-center space-y-2 p-4"
                    onClick={() => toast.info('Clean temporary files dialog')}
                  >
                    <Trash2 className="h-8 w-8" />
                    <div>
                      <div className="font-medium">Clean Temp Files</div>
                      <div className="text-xs text-muted-foreground">Remove temporary files</div>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-auto flex flex-col items-center justify-center space-y-2 p-4"
                    onClick={() => toast.info('Storage analysis dialog')}
                  >
                    <RefreshCw className="h-8 w-8" />
                    <div>
                      <div className="font-medium">Refresh Analysis</div>
                      <div className="text-xs text-muted-foreground">Update storage statistics</div>
                    </div>
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="retention" className="space-y-6 pt-4">
            <div>
              <h3 className="text-lg font-medium mb-4">Data Retention Policies</h3>
              
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Data Type</TableHead>
                      <TableHead>Retention Period</TableHead>
                      <TableHead>Archiving</TableHead>
                      <TableHead>Current Size</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Energy Readings</TableCell>
                      <TableCell>
                        <Select defaultValue="365">
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select period" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="30">30 days</SelectItem>
                            <SelectItem value="90">90 days</SelectItem>
                            <SelectItem value="180">180 days</SelectItem>
                            <SelectItem value="365">1 year</SelectItem>
                            <SelectItem value="730">2 years</SelectItem>
                            <SelectItem value="1825">5 years</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch id="energyReadingsArchive" defaultChecked />
                          <span className="text-sm text-muted-foreground">Archive</span>
                        </div>
                      </TableCell>
                      <TableCell>84.2 GB</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="h-8">Configure</Button>
                      </TableCell>
                    </TableRow>
                    
                    <TableRow>
                      <TableCell className="font-medium">System Logs</TableCell>
                      <TableCell>
                        <Select defaultValue="90">
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select period" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="7">7 days</SelectItem>
                            <SelectItem value="30">30 days</SelectItem>
                            <SelectItem value="90">90 days</SelectItem>
                            <SelectItem value="180">180 days</SelectItem>
                            <SelectItem value="365">1 year</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch id="systemLogsArchive" defaultChecked />
                          <span className="text-sm text-muted-foreground">Archive</span>
                        </div>
                      </TableCell>
                      <TableCell>42.6 GB</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="h-8">Configure</Button>
                      </TableCell>
                    </TableRow>
                    
                    <TableRow>
                      <TableCell className="font-medium">Audit Logs</TableCell>
                      <TableCell>
                        <Select defaultValue="365">
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select period" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="90">90 days</SelectItem>
                            <SelectItem value="180">180 days</SelectItem>
                            <SelectItem value="365">1 year</SelectItem>
                            <SelectItem value="730">2 years</SelectItem>
                            <SelectItem value="1825">5 years</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch id="auditLogsArchive" defaultChecked />
                          <span className="text-sm text-muted-foreground">Archive</span>
                        </div>
                      </TableCell>
                      <TableCell>18.3 GB</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="h-8">Configure</Button>
                      </TableCell>
                    </TableRow>
                    
                    <TableRow>
                      <TableCell className="font-medium">Reports</TableCell>
                      <TableCell>
                        <Select defaultValue="365">
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select period" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="90">90 days</SelectItem>
                            <SelectItem value="180">180 days</SelectItem>
                            <SelectItem value="365">1 year</SelectItem>
                            <SelectItem value="730">2 years</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch id="reportsArchive" defaultChecked />
                          <span className="text-sm text-muted-foreground">Archive</span>
                        </div>
                      </TableCell>
                      <TableCell>6.4 GB</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="h-8">Configure</Button>
                      </TableCell>
                    </TableRow>
                    
                    <TableRow>
                      <TableCell className="font-medium">Weather Data</TableCell>
                      <TableCell>
                        <Select defaultValue="180">
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select period" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="30">30 days</SelectItem>
                            <SelectItem value="90">90 days</SelectItem>
                            <SelectItem value="180">180 days</SelectItem>
                            <SelectItem value="365">1 year</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch id="weatherDataArchive" />
                          <span className="text-sm text-muted-foreground">Archive</span>
                        </div>
                      </TableCell>
                      <TableCell>12.1 GB</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="h-8">Configure</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-medium mb-4">Archiving Settings</h3>
              <div className="space-y-4">
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="archiveLocation">Archive Location</Label>
                    <Select defaultValue="local">
                      <SelectTrigger id="archiveLocation">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="local">Local Storage</SelectItem>
                        <SelectItem value="nas">Network Attached Storage</SelectItem>
                        <SelectItem value="s3">Amazon S3</SelectItem>
                        <SelectItem value="azure">Azure Blob Storage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="archiveFormat">Archive Format</Label>
                    <Select defaultValue="compressed">
                      <SelectTrigger id="archiveFormat">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="raw">Raw (Uncompressed)</SelectItem>
                        <SelectItem value="compressed">Compressed (ZIP)</SelectItem>
                        <SelectItem value="encrypted">Encrypted Archive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoArchiving">Automatic Archiving</Label>
                    <p className="text-sm text-muted-foreground">Automatically archive data before deletion</p>
                  </div>
                  <Switch id="autoArchiving" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="compressionLevel">Data Compression</Label>
                    <p className="text-sm text-muted-foreground">Compress data to save storage space</p>
                  </div>
                  <Switch id="compressionLevel" defaultChecked />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="archiveSchedule">Archive Schedule</Label>
                  <Select defaultValue="weekly">
                    <SelectTrigger id="archiveSchedule">
                      <SelectValue placeholder="Select schedule" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="automatic">Automatic (As needed)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline">Reset to Default</Button>
              <Button onClick={() => toast.success('Retention policies saved')}>Save Changes</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="database" className="space-y-6 pt-4">
            <div>
              <h3 className="text-lg font-medium mb-4">Database Configuration</h3>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Connection Settings</CardTitle>
                    <CardDescription>Database connection configuration</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="dbHost">Host</Label>
                          <Input id="dbHost" defaultValue="localhost" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="dbPort">Port</Label>
                          <Input id="dbPort" defaultValue="5432" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="dbName">Database Name</Label>
                          <Input id="dbName" defaultValue="energy_management" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="dbSchema">Schema</Label>
                          <Input id="dbSchema" defaultValue="public" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Settings</CardTitle>
                    <CardDescription>Database performance configuration</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="connectionPool">Connection Pool Size</Label>
                        <Select defaultValue="10">
                          <SelectTrigger id="connectionPool">
                            <SelectValue placeholder="Select pool size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5 connections</SelectItem>
                            <SelectItem value="10">10 connections</SelectItem>
                            <SelectItem value="20">20 connections</SelectItem>
                            <SelectItem value="50">50 connections</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="queryCache">Query Caching</Label>
                          <p className="text-sm text-muted-foreground">Cache frequent database queries</p>
                        </div>
                        <Switch id="queryCache" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="preparedStatements">Prepared Statements</Label>
                          <p className="text-sm text-muted-foreground">Use prepared statements for queries</p>
                        </div>
                        <Switch id="preparedStatements" defaultChecked />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="timeout">Query Timeout (seconds)</Label>
                        <Select defaultValue="30">
                          <SelectTrigger id="timeout">
                            <SelectValue placeholder="Select timeout" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10">10 seconds</SelectItem>
                            <SelectItem value="30">30 seconds</SelectItem>
                            <SelectItem value="60">1 minute</SelectItem>
                            <SelectItem value="300">5 minutes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Maintenance</CardTitle>
                    <CardDescription>Database maintenance tasks</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="automaticVacuum">Automatic VACUUM</Label>
                          <p className="text-sm text-muted-foreground">Automatically clean up database dead space</p>
                        </div>
                        <Switch id="automaticVacuum" defaultChecked />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="vacuumFrequency">VACUUM Frequency</Label>
                        <Select defaultValue="weekly">
                          <SelectTrigger id="vacuumFrequency">
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="autoIndexing">Automatic Indexing</Label>
                          <p className="text-sm text-muted-foreground">Automatically create and maintain optimal indexes</p>
                        </div>
                        <Switch id="autoIndexing" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="statisticsCollection">Statistics Collection</Label>
                          <p className="text-sm text-muted-foreground">Collect query performance statistics</p>
                        </div>
                        <Switch id="statisticsCollection" defaultChecked />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2">
                    <Button 
                      variant="outline"
                      onClick={() => toast.info('Running database vacuum...')}
                    >
                      Run VACUUM
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => toast.info('Reindexing database...')}
                    >
                      Reindex
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => toast.info('Analyzing database...')}
                    >
                      Analyze
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline">Reset to Default</Button>
              <Button onClick={() => toast.success('Database settings saved')}>Save Changes</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </SettingsPageTemplate>
  );
};

export default StorageConfigurationPage;
