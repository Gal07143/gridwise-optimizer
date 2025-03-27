
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { PlusCircle, Download, Upload, Wifi, Router, Signal, Search, RefreshCw, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

// Define type for communication devices
interface CommunicationDevice {
  id: string;
  name: string;
  type: 'modem' | 'gateway' | 'router' | 'access_point' | 'repeater';
  model: string;
  manufacturer: string;
  ip_address?: string;
  mac_address?: string;
  protocol: string;
  status: 'online' | 'offline' | 'error' | 'maintenance';
  firmware_version?: string;
  last_seen?: string;
  connection_type?: string;
  bandwidth?: string;
  location?: string;
}

// Mock data for communication devices
const mockCommunicationDevices: CommunicationDevice[] = [
  {
    id: '1',
    name: 'Main Gateway',
    type: 'gateway',
    model: 'EG8245H',
    manufacturer: 'Huawei',
    ip_address: '192.168.1.1',
    mac_address: '00:1A:2B:3C:4D:5E',
    protocol: 'Ethernet/LTE',
    status: 'online',
    firmware_version: 'v2.5.3',
    last_seen: new Date().toISOString(),
    connection_type: 'Fiber',
    bandwidth: '1Gbps',
    location: 'Main Control Room'
  },
  {
    id: '2',
    name: 'Field Modem 1',
    type: 'modem',
    model: 'TL-MR6400',
    manufacturer: 'TP-Link',
    ip_address: '192.168.1.25',
    mac_address: 'A1:B2:C3:D4:E5:F6',
    protocol: '4G LTE',
    status: 'online',
    firmware_version: 'v1.2.0',
    last_seen: new Date(Date.now() - 15 * 60000).toISOString(),
    connection_type: 'Cellular',
    bandwidth: '150Mbps',
    location: 'Solar Array A'
  },
  {
    id: '3',
    name: 'Substation Router',
    type: 'router',
    model: 'RB2011UiAS-RM',
    manufacturer: 'MikroTik',
    ip_address: '192.168.2.1',
    mac_address: 'FF:EE:DD:CC:BB:AA',
    protocol: 'Ethernet',
    status: 'online',
    firmware_version: 'v6.48.4',
    last_seen: new Date(Date.now() - 5 * 60000).toISOString(),
    connection_type: 'Ethernet',
    bandwidth: '1Gbps',
    location: 'Substation B'
  },
  {
    id: '4',
    name: 'Battery Storage WiFi',
    type: 'access_point',
    model: 'UAP-AC-PRO',
    manufacturer: 'Ubiquiti',
    ip_address: '192.168.3.10',
    mac_address: '11:22:33:44:55:66',
    protocol: 'WiFi',
    status: 'error',
    firmware_version: 'v4.3.28',
    last_seen: new Date(Date.now() - 2 * 3600000).toISOString(),
    connection_type: 'WiFi',
    bandwidth: '1300Mbps',
    location: 'Battery Storage'
  },
  {
    id: '5',
    name: 'Remote Inverter Modem',
    type: 'modem',
    model: 'AirLink RV55',
    manufacturer: 'Sierra Wireless',
    ip_address: '192.168.4.5',
    mac_address: 'AA:BB:CC:DD:EE:FF',
    protocol: 'LTE-Advanced',
    status: 'offline',
    firmware_version: 'v4.14.0',
    last_seen: new Date(Date.now() - 48 * 3600000).toISOString(),
    connection_type: 'Cellular',
    bandwidth: '300Mbps',
    location: 'Remote Inverter Station'
  }
];

const CommunicationDevices = () => {
  const [devices, setDevices] = useState<CommunicationDevice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setDevices(mockCommunicationDevices);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const filterDevices = (devices: CommunicationDevice[]) => {
    return devices.filter(device => {
      const matchesSearch = 
        device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        device.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        device.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (device.ip_address && device.ip_address.includes(searchQuery));
      
      if (activeTab === 'all') return matchesSearch;
      return device.type === activeTab && matchesSearch;
    });
  };

  const handleRefresh = () => {
    setIsLoading(true);
    toast.info('Refreshing device list...');
    
    // Simulate network request
    setTimeout(() => {
      setDevices(mockCommunicationDevices);
      setIsLoading(false);
      toast.success('Device list refreshed successfully');
    }, 1500);
  };

  const getDeviceTypeIcon = (type: string) => {
    switch (type) {
      case 'modem': return <Signal className="h-4 w-4 text-blue-500" />;
      case 'gateway': return <Router className="h-4 w-4 text-purple-500" />;
      case 'router': return <Router className="h-4 w-4 text-green-500" />;
      case 'access_point': return <Wifi className="h-4 w-4 text-cyan-500" />;
      case 'repeater': return <Signal className="h-4 w-4 text-orange-500" />;
      default: return <Wifi className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online': 
        return <Badge className="bg-green-500">Online</Badge>;
      case 'offline': 
        return <Badge variant="secondary" className="bg-slate-400">Offline</Badge>;
      case 'error': 
        return <Badge variant="destructive">Error</Badge>;
      case 'maintenance': 
        return <Badge variant="outline" className="border-blue-500 text-blue-500">Maintenance</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const filteredDevices = filterDevices(devices);

  return (
    <AppLayout>
      <div className="p-6 space-y-6 animate-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold mb-1">Communication Devices</h1>
            <p className="text-muted-foreground">
              Manage modems, routers, and network equipment for remote sites
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button asChild>
              <Link to="/integrations/communication/add">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Device
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name, IP, or model..." 
              className="pl-10 bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="modem">Modems</TabsTrigger>
              <TabsTrigger value="router">Routers</TabsTrigger>
              <TabsTrigger value="gateway">Gateways</TabsTrigger>
              <TabsTrigger value="access_point">Access Points</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <Card>
          <CardHeader className="pb-0">
            <CardTitle>Communication Devices</CardTitle>
            <CardDescription>
              {isLoading ? 'Loading devices...' : `${filteredDevices.length} devices found`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-4 border rounded-md">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))}
              </div>
            ) : filteredDevices.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Manufacturer</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Connection</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Seen</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDevices.map((device) => (
                    <TableRow key={device.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {getDeviceTypeIcon(device.type)}
                          <span>{device.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">{device.type.replace('_', ' ')}</TableCell>
                      <TableCell>{device.manufacturer} {device.model}</TableCell>
                      <TableCell>{device.ip_address || 'N/A'}</TableCell>
                      <TableCell>{device.connection_type || 'Unknown'}</TableCell>
                      <TableCell>{getStatusBadge(device.status)}</TableCell>
                      <TableCell>
                        {device.last_seen 
                          ? new Date(device.last_seen).toLocaleString() 
                          : 'Never'
                        }
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/integrations/communication/${device.id}`}>View</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-10 border rounded-md">
                <p className="text-muted-foreground">No communication devices found matching your criteria.</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveTab('all');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-6">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export List
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Import Devices
              </Button>
            </div>
            <Button size="sm" variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
};

export default CommunicationDevices;
