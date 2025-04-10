
import React, { useState } from 'react';
import { DashboardLayout, DashboardCard } from '@/components/ui/dashboard/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Search, Plus, MoreHorizontal, Battery, Sun, Plug, Wifi, Gauge, Signal, 
  ServerCog, Check, X, AlertCircle, Cable 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';

// Mock device data
const mockDevices = [
  { 
    id: 'd1', 
    name: 'Battery Storage', 
    type: 'battery', 
    status: 'online', 
    lastSeen: '2025-04-10T09:45:00Z',
    firmwareVersion: '1.2.3',
    connectivity: 'Modbus TCP' 
  },
  { 
    id: 'd2', 
    name: 'Solar Inverter', 
    type: 'solar', 
    status: 'online', 
    lastSeen: '2025-04-10T09:43:00Z',
    firmwareVersion: '2.1.0',
    connectivity: 'Modbus RTU' 
  },
  { 
    id: 'd3', 
    name: 'EV Charger', 
    type: 'evcharger', 
    status: 'offline', 
    lastSeen: '2025-04-09T18:30:00Z',
    firmwareVersion: '3.0.1',
    connectivity: 'OCPP 1.6' 
  },
  { 
    id: 'd4', 
    name: 'Smart Meter', 
    type: 'meter', 
    status: 'warning', 
    lastSeen: '2025-04-10T09:20:00Z',
    firmwareVersion: '1.5.2',
    connectivity: 'Modbus TCP' 
  },
  { 
    id: 'd5', 
    name: 'IoT Gateway', 
    type: 'gateway', 
    status: 'online', 
    lastSeen: '2025-04-10T09:47:00Z',
    firmwareVersion: '2.2.1',
    connectivity: 'MQTT' 
  },
];

const DeviceManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  const filteredDevices = mockDevices.filter(device =>
    device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.connectivity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'battery': return <Battery className="h-5 w-5" />;
      case 'solar': return <Sun className="h-5 w-5" />;
      case 'evcharger': return <Plug className="h-5 w-5" />;
      case 'meter': return <Gauge className="h-5 w-5" />;
      case 'gateway': return <Wifi className="h-5 w-5" />;
      default: return <ServerCog className="h-5 w-5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return <Badge className="bg-green-500">{<Check size={12} className="mr-1" />} Online</Badge>;
      case 'offline':
        return <Badge className="bg-slate-500">{<X size={12} className="mr-1" />} Offline</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-500">{<AlertCircle size={12} className="mr-1" />} Warning</Badge>;
      default:
        return <Badge className="bg-slate-500">Unknown</Badge>;
    }
  };
  
  const formatLastSeen = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes} min ago`;
    } else if (diffMinutes < 1440) { // less than 24 hours
      return `${Math.floor(diffMinutes / 60)} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">Device Management</h1>
          <p className="text-slate-500">Manage and monitor all your energy devices</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search devices..."
              className="pl-9 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Device
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <TabsTrigger value="all" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
            All Devices
          </TabsTrigger>
          <TabsTrigger value="online" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
            Online
          </TabsTrigger>
          <TabsTrigger value="offline" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
            Offline
          </TabsTrigger>
          <TabsTrigger value="warnings" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
            Warnings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="m-0">
          <DashboardCard>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Seen</TableHead>
                  <TableHead>Firmware</TableHead>
                  <TableHead>Connectivity</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDevices.map(device => (
                  <TableRow key={device.id} className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/30"
                    onClick={() => navigate(`/devices/${device.id}`)}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded">
                          {getDeviceIcon(device.type)}
                        </div>
                        <span className="font-medium">{device.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{device.type}</TableCell>
                    <TableCell>{getStatusBadge(device.status)}</TableCell>
                    <TableCell>{formatLastSeen(device.lastSeen)}</TableCell>
                    <TableCell>{device.firmwareVersion}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Signal className="h-4 w-4" />
                        <span>{device.connectivity}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => { 
                            e.stopPropagation(); 
                            navigate(`/devices/${device.id}`);
                          }}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => { 
                            e.stopPropagation(); 
                            navigate(`/devices/${device.id}/edit`);
                          }}>
                            Edit Device
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => { 
                            e.stopPropagation();
                          }}>
                            Restart Device
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-500 focus:text-red-500"
                            onClick={(e) => { 
                              e.stopPropagation();
                            }}>
                            Remove Device
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                
                {filteredDevices.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Cable className="h-8 w-8 text-slate-300 mb-2" />
                        <p className="text-slate-500 font-medium">No devices found</p>
                        <p className="text-slate-400 text-sm">Try adjusting your search or add a new device</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DashboardCard>
        </TabsContent>
        
        <TabsContent value="online">
          <DashboardCard>
            <div className="p-8 text-center">
              <h3 className="text-xl font-semibold">Online Devices</h3>
              <p className="text-slate-500">Only online devices will be shown here</p>
            </div>
          </DashboardCard>
        </TabsContent>
        
        <TabsContent value="offline">
          <DashboardCard>
            <div className="p-8 text-center">
              <h3 className="text-xl font-semibold">Offline Devices</h3>
              <p className="text-slate-500">Only offline devices will be shown here</p>
            </div>
          </DashboardCard>
        </TabsContent>
        
        <TabsContent value="warnings">
          <DashboardCard>
            <div className="p-8 text-center">
              <h3 className="text-xl font-semibold">Devices with Warnings</h3>
              <p className="text-slate-500">Only devices with warnings will be shown here</p>
            </div>
          </DashboardCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeviceManagement;
