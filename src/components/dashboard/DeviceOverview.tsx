
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Activity,
  Power,
  RefreshCw,
  Zap,
  WifiIcon,
  SignalIcon,
  Battery,
  Gauge,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

interface DeviceOverviewProps {
  deviceId: string;
  deviceName: string;
}

export function DeviceOverview({ deviceId, deviceName }: DeviceOverviewProps) {
  const navigate = useNavigate();
  const [lastActivity] = React.useState<Date>(new Date());
  const [connectionStatus] = React.useState<'connected' | 'disconnected' | 'unstable'>('connected');
  const [batteryLevel] = React.useState<number>(78);
  const [usageMeter] = React.useState<number>(3924802);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <Zap className="h-6 w-6 text-blue-500" />
            {deviceName}
          </h1>
          <div className="text-sm text-muted-foreground">Device ID: {deviceId}</div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            Back
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            variant="default" 
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            Actions
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="alarms">Alarms</TabsTrigger>
          <TabsTrigger value="data">Data Explorer</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="relations">Relations</TabsTrigger>
          <TabsTrigger value="attachments">Attachments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-sm font-medium">Status</CardTitle>
                  <div className="flex items-center">
                    <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                    <span className="text-xs font-medium">Live</span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatDistanceToNow(lastActivity, { addSuffix: true })}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="h-16 w-16 rounded-full bg-green-50 flex items-center justify-center">
                    <Power className="h-8 w-8 text-green-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-semibold">
                      {connectionStatus === 'connected' ? 'Connected' : 
                      connectionStatus === 'disconnected' ? 'Disconnected' : 'Unstable'}
                    </div>
                    <div className="text-sm text-muted-foreground">Connection State</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Device Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div>
                    <div className="text-2xl font-semibold">Gateway</div>
                    <div className="text-sm text-muted-foreground">Type</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Last Activity Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-1">
                  <div className="text-2xl font-semibold">
                    {lastActivity ? format(lastActivity, 'HH:mm:ss') : '--'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {lastActivity ? format(lastActivity, 'MMM dd, yyyy') : '--'}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Reboot</CardTitle>
                <div className="text-xs text-muted-foreground">{deviceId}</div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-4">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Power className="h-6 w-6" />
                    Reboot
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">WiFi State</CardTitle>
                <div className="text-xs text-muted-foreground">{deviceId}</div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <WifiIcon className="h-8 w-8 text-blue-500" />
                  <div className="flex items-center">
                    <div className="mr-2">on</div>
                    <div className="w-10 h-5 bg-green-500 rounded-full relative">
                      <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-sm font-medium">Usage Meter</CardTitle>
                  <div className="flex items-center gap-1">
                    <span className="text-xs">This Month</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="flex items-center justify-center">
                  <div className="relative h-40 w-40">
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <div className="text-4xl font-bold">{(usageMeter / 1000000).toFixed(1)}</div>
                      <div className="text-xs text-muted-foreground">million units</div>
                    </div>
                    {/* This would be replaced with a proper gauge component */}
                    <div className="absolute inset-0">
                      <svg viewBox="0 0 100 100" className="rotate-180">
                        <circle 
                          cx="50" cy="50" r="40" 
                          fill="none" 
                          stroke="#e5e7eb" 
                          strokeWidth="10"
                          strokeDasharray="251.2"
                          strokeDashoffset="0"
                          className="transform origin-center"
                        />
                        <circle 
                          cx="50" cy="50" r="40" 
                          fill="none" 
                          stroke="url(#gradient)" 
                          strokeWidth="10"
                          strokeDasharray="251.2"
                          strokeDashoffset="100"
                          className="transform origin-center"
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#10b981" />
                            <stop offset="100%" stopColor="#f97316" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex justify-center items-center">
                      <Gauge className="h-5 w-5 text-blue-500" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Wifi Networks</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center py-8 text-center">
                <div>
                  <div className="mb-2">
                    <svg width="80" height="80" viewBox="0 0 24 24" className="mx-auto text-gray-300">
                      <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1" fill="none" />
                      <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" />
                    </svg>
                  </div>
                  <div className="text-muted-foreground">No Data Available</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-sm font-medium">Connectivity</CardTitle>
                  <div className="text-xs text-muted-foreground">Last Hr</div>
                </div>
              </CardHeader>
              <CardContent className="flex items-center justify-center py-8 text-center">
                <div>
                  <div className="mb-2">
                    <svg width="80" height="80" viewBox="0 0 24 24" className="mx-auto text-gray-300">
                      <path d="M2 20h20v-4H2v4z M4 16h2v2H4v-2z M8 16h2v2H8v-2z M12 16h2v2h-2v-2z M16 16h2v2h-2v-2z" fill="none" stroke="currentColor" />
                      <path d="M2 8h20v4H2V8z M4 10h2v2H4v-2z M8 10h2v2H8v-2z M12 10h2v2h-2v-2z M16 10h2v2h-2v-2z" fill="none" stroke="currentColor" />
                    </svg>
                  </div>
                  <div className="text-muted-foreground">No Data Available</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="details">
          <div className="py-4">
            <Card>
              <CardHeader>
                <CardTitle>Device Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-1">Basic Information</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-muted-foreground">Device ID</div>
                        <div className="text-sm font-medium">{deviceId}</div>
                        <div className="text-sm text-muted-foreground">Name</div>
                        <div className="text-sm font-medium">{deviceName}</div>
                        <div className="text-sm text-muted-foreground">Type</div>
                        <div className="text-sm font-medium">Gateway</div>
                        <div className="text-sm text-muted-foreground">Status</div>
                        <div className="text-sm font-medium flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-green-500"></span>
                          Online
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-1">Technical Details</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-muted-foreground">Firmware Version</div>
                        <div className="text-sm font-medium">v2.4.1</div>
                        <div className="text-sm text-muted-foreground">Hardware Version</div>
                        <div className="text-sm font-medium">RUT956.01.01</div>
                        <div className="text-sm text-muted-foreground">Serial Number</div>
                        <div className="text-sm font-medium">1234567890</div>
                        <div className="text-sm text-muted-foreground">MAC Address</div>
                        <div className="text-sm font-medium">AB:CD:EF:12:34:56</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-1">Location Information</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-muted-foreground">Location</div>
                        <div className="text-sm font-medium">Main Building</div>
                        <div className="text-sm text-muted-foreground">Coordinates</div>
                        <div className="text-sm font-medium">N/A</div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-1">Connection Details</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-sm text-muted-foreground">Connection Type</div>
                        <div className="text-sm font-medium">WiFi</div>
                        <div className="text-sm text-muted-foreground">Signal Strength</div>
                        <div className="text-sm font-medium">
                          <div className="flex items-center gap-1">
                            <SignalIcon className="h-4 w-4 text-green-500" />
                            Excellent
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">Battery</div>
                        <div className="text-sm font-medium flex items-center">
                          <Battery className="h-4 w-4 mr-1 text-green-500" />
                          {batteryLevel}%
                          <Progress value={batteryLevel} className="ml-2 w-16 h-2" indicatorClassName="bg-green-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="messages">
          <div className="py-4">
            <Card>
              <CardHeader>
                <CardTitle>Device Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2 px-3 text-left text-sm font-medium">Time</th>
                        <th className="py-2 px-3 text-left text-sm font-medium">Type</th>
                        <th className="py-2 px-3 text-left text-sm font-medium">Message</th>
                        <th className="py-2 px-3 text-left text-sm font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2 px-3 text-sm">{format(new Date(), 'MMM dd, HH:mm')}</td>
                        <td className="py-2 px-3 text-sm">System</td>
                        <td className="py-2 px-3 text-sm">Device connected to network</td>
                        <td className="py-2 px-3 text-sm">
                          <Badge variant="success">Success</Badge>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2 px-3 text-sm">{format(new Date(Date.now() - 1000 * 60 * 15), 'MMM dd, HH:mm')}</td>
                        <td className="py-2 px-3 text-sm">Update</td>
                        <td className="py-2 px-3 text-sm">Firmware update available</td>
                        <td className="py-2 px-3 text-sm">
                          <Badge variant="info">Info</Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 text-sm">{format(new Date(Date.now() - 1000 * 60 * 60), 'MMM dd, HH:mm')}</td>
                        <td className="py-2 px-3 text-sm">Error</td>
                        <td className="py-2 px-3 text-sm">Connection timeout</td>
                        <td className="py-2 px-3 text-sm">
                          <Badge variant="danger">Error</Badge>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alarms">
          <div className="py-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Alarms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-red-50 border border-red-100 p-4 rounded-md flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-red-800">High Energy Consumption</h3>
                      <p className="text-sm text-red-700 mt-1">
                        Energy consumption is 25% above normal threshold for the past 3 hours.
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="danger">Critical</Badge>
                        <span className="text-xs text-red-700 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          Triggered 3h ago
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-md flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-yellow-800">Battery Level Low</h3>
                      <p className="text-sm text-yellow-700 mt-1">
                        Battery level is below 20%. Connect to power source soon.
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="warning">Warning</Badge>
                        <span className="text-xs text-yellow-700 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          Triggered 1h ago
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="data">
          <div className="py-4">
            <Card>
              <CardHeader>
                <CardTitle>Data Explorer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <Activity className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground">Select a metric and time range to view data</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="timeline">
          <div className="py-4">
            <Card>
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  <div className="space-y-6">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="relative pl-8">
                        <div className="absolute left-0 top-1 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                          <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                        </div>
                        <div className="text-sm font-medium">
                          {format(new Date(Date.now() - 1000 * 60 * 60 * i), 'MMM dd, yyyy - HH:mm')}
                        </div>
                        <div className="mt-1 text-sm text-muted-foreground">
                          {i === 0 ? "Device connected to network" :
                           i === 1 ? "Configuration updated" : "Device registered"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Placeholder for other tabs */}
        {["relations", "attachments"].map(tab => (
          <TabsContent key={tab} value={tab}>
            <div className="py-4">
              <Card>
                <CardHeader>
                  <CardTitle>{tab.charAt(0).toUpperCase() + tab.slice(1)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] flex items-center justify-center">
                    <p className="text-muted-foreground">No {tab} available</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
