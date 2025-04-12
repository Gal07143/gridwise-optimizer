
import React from 'react';
import { Main } from '@/components/ui/main';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Network, Shield, Link, Database, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface IntegrationProtocol {
  name: string;
  status: 'supported' | 'beta' | 'planned';
  description: string;
  icon: React.ReactNode;
}

const protocols: IntegrationProtocol[] = [
  { 
    name: 'Modbus TCP/RTU', 
    status: 'supported',
    description: 'Connect to devices using Modbus TCP or RTU protocols',
    icon: <Network className="h-12 w-12 text-blue-500" />
  },
  { 
    name: 'OPC UA', 
    status: 'supported',
    description: 'Open Platform Communications Unified Architecture for industrial communication',
    icon: <Database className="h-12 w-12 text-green-500" />
  },
  { 
    name: 'BACnet', 
    status: 'beta',
    description: 'Building Automation and Control network protocol',
    icon: <Shield className="h-12 w-12 text-purple-500" />
  },
  { 
    name: 'KNX', 
    status: 'planned',
    description: 'Standard for home and building control',
    icon: <Link className="h-12 w-12 text-amber-500" />
  }
];

const statusColors = {
  active: 'text-green-500',
  inactive: 'text-red-500',
  warning: 'text-amber-500'
};

const integrationStatus = {
  connected: { label: 'Connected', icon: <CheckCircle className="h-4 w-4 text-green-500" /> },
  disconnected: { label: 'Disconnected', icon: <XCircle className="h-4 w-4 text-red-500" /> },
  warning: { label: 'Connection Issues', icon: <AlertTriangle className="h-4 w-4 text-amber-500" /> }
};

const ScadaIntegration: React.FC = () => {
  return (
    <Main title="SCADA & BMS Integration">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">SCADA & Building Management Systems</h1>
            <p className="text-muted-foreground">
              Connect your Energy Management System to industrial control and building management systems
            </p>
          </div>
          <Button>
            <Link className="h-4 w-4 mr-2" />
            New Connection
          </Button>
        </div>
        
        <Tabs defaultValue="protocols">
          <TabsList className="mb-4">
            <TabsTrigger value="protocols">Integration Protocols</TabsTrigger>
            <TabsTrigger value="connections">Active Connections</TabsTrigger>
            <TabsTrigger value="mapping">Data Point Mapping</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="protocols">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {protocols.map((protocol) => (
                <Card key={protocol.name} className="overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg">{protocol.name}</CardTitle>
                    <Badge 
                      variant={
                        protocol.status === 'supported' 
                          ? 'default' 
                          : protocol.status === 'beta' 
                            ? 'secondary' 
                            : 'outline'
                      }
                      className="capitalize"
                    >
                      {protocol.status}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center mb-4">
                      {protocol.icon}
                    </div>
                    <p className="text-sm text-muted-foreground">{protocol.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      variant={protocol.status === 'planned' ? 'outline' : 'default'}
                      disabled={protocol.status === 'planned'}
                    >
                      {protocol.status === 'planned' ? 'Coming Soon' : 'Configure'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="connections">
            <Card>
              <CardHeader>
                <CardTitle>Active SCADA & BMS Connections</CardTitle>
                <CardDescription>
                  Currently configured connections to your control systems
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  {/* Connection Item */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                          <Network className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <div className="font-medium">Building Management System</div>
                          <div className="text-sm text-muted-foreground">Modbus TCP • 192.168.1.100:502</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="flex items-center mr-4">
                          {integrationStatus.connected.icon}
                          <span className="ml-1 text-sm font-medium text-green-600 dark:text-green-400">
                            {integrationStatus.connected.label}
                          </span>
                        </div>
                        <Button variant="outline" size="sm">
                          Configure
                        </Button>
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Data Points</div>
                        <div className="font-medium">32</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Poll Interval</div>
                        <div className="font-medium">5 seconds</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Last Data</div>
                        <div className="font-medium">2 minutes ago</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Status</div>
                        <div className="font-medium">Active</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Connection Item */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3">
                          <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <div className="font-medium">HVAC Control System</div>
                          <div className="text-sm text-muted-foreground">BACnet IP • 192.168.1.110</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="flex items-center mr-4">
                          {integrationStatus.warning.icon}
                          <span className="ml-1 text-sm font-medium text-amber-600 dark:text-amber-400">
                            {integrationStatus.warning.label}
                          </span>
                        </div>
                        <Button variant="outline" size="sm">
                          Configure
                        </Button>
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Data Points</div>
                        <div className="font-medium">24</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Poll Interval</div>
                        <div className="font-medium">10 seconds</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Last Data</div>
                        <div className="font-medium">15 minutes ago</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Status</div>
                        <div className="font-medium text-amber-500">Intermittent</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="mapping">
            <Card>
              <CardHeader>
                <CardTitle>Data Point Mapping</CardTitle>
                <CardDescription>
                  Map external system data points to your EMS
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center border-b pb-4">
                    <Input 
                      className="max-w-sm mr-4" 
                      placeholder="Search data points..."
                    />
                    <Button variant="outline">Filter</Button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 font-medium">External Name</th>
                          <th className="text-left py-2 font-medium">Address/Path</th>
                          <th className="text-left py-2 font-medium">EMS Variable</th>
                          <th className="text-left py-2 font-medium">Data Type</th>
                          <th className="text-left py-2 font-medium">Units</th>
                          <th className="text-left py-2 font-medium">Status</th>
                          <th className="text-left py-2 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-3">Main Power</td>
                          <td className="py-3">40001</td>
                          <td className="py-3">grid.power</td>
                          <td className="py-3">Float</td>
                          <td className="py-3">kW</td>
                          <td className="py-3">
                            <span className={statusColors.active}>●</span> Active
                          </td>
                          <td className="py-3">
                            <Button variant="ghost" size="sm">Edit</Button>
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3">HVAC Temperature</td>
                          <td className="py-3">BACnet:AV1</td>
                          <td className="py-3">hvac.temp</td>
                          <td className="py-3">Float</td>
                          <td className="py-3">°C</td>
                          <td className="py-3">
                            <span className={statusColors.warning}>●</span> Intermittent
                          </td>
                          <td className="py-3">
                            <Button variant="ghost" size="sm">Edit</Button>
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3">Building Load</td>
                          <td className="py-3">40003</td>
                          <td className="py-3">building.load</td>
                          <td className="py-3">Float</td>
                          <td className="py-3">kW</td>
                          <td className="py-3">
                            <span className={statusColors.active}>●</span> Active
                          </td>
                          <td className="py-3">
                            <Button variant="ghost" size="sm">Edit</Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Integration Settings</CardTitle>
                <CardDescription>
                  Configure global settings for SCADA and BMS integrations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Default Poll Interval</label>
                    <div className="flex mt-1">
                      <Input 
                        type="number" 
                        defaultValue={5} 
                        className="max-w-[150px] mr-2" 
                      />
                      <div className="flex items-center text-sm text-muted-foreground">seconds</div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Connection Timeout</label>
                    <div className="flex mt-1">
                      <Input 
                        type="number" 
                        defaultValue={30} 
                        className="max-w-[150px] mr-2" 
                      />
                      <div className="flex items-center text-sm text-muted-foreground">seconds</div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button>Save Settings</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Main>
  );
};

export default ScadaIntegration;
