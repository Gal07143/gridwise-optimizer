
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { 
  Edit, 
  Trash, 
  Plus, 
  Download, 
  Filter, 
  Search, 
  Settings, 
  MoreHorizontal,
  Power,
  Zap,
  ClipboardList
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { getDevices, deleteDevice } from '@/services/deviceService';

const ManageDevices = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [deviceTypeFilter, setDeviceTypeFilter] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState('all');
  
  const { data: devices = [], isLoading, error, refetch } = useQuery({
    queryKey: ['devices'],
    queryFn: getDevices,
    meta: {
      onError: (error: Error) => {
        console.error('Error fetching devices:', error);
        toast.error('Failed to load devices');
      }
    }
  });
  
  // Filter devices based on search query, type filter, and view mode
  const filteredDevices = devices.filter(device => {
    // Apply device type filter
    if (deviceTypeFilter && device.type !== deviceTypeFilter) {
      return false;
    }
    
    // Apply view mode filter
    if (viewMode === 'online' && device.status !== 'online') {
      return false;
    }
    if (viewMode === 'offline' && device.status !== 'offline') {
      return false;
    }
    if (viewMode === 'warning' && !['warning', 'error'].includes(device.status)) {
      return false;
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        device.name.toLowerCase().includes(query) ||
        device.type.toLowerCase().includes(query) ||
        (device.location && device.location.toLowerCase().includes(query))
      );
    }
    
    return true;
  });
  
  const handleDelete = async (deviceId: string) => {
    if (confirm('Are you sure you want to delete this device? This action cannot be undone.')) {
      try {
        await deleteDevice(deviceId);
        toast.success('Device deleted successfully');
        refetch();
      } catch (error) {
        console.error('Error deleting device:', error);
        toast.error('Failed to delete device');
      }
    }
  };
  
  const handleExportDevices = () => {
    // In a real application, this would generate a CSV file
    toast.success('Exporting devices data...');
    setTimeout(() => {
      toast.info('Devices exported successfully');
    }, 1500);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return <Badge className="bg-green-500">Online</Badge>;
      case 'offline':
        return <Badge variant="outline" className="text-gray-500">Offline</Badge>;
      case 'warning':
        return <Badge className="bg-amber-500">Warning</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };
  
  const getDeviceTypeBadge = (type: string) => {
    const typeMap: Record<string, { color: string, icon: React.ReactNode }> = {
      'battery': { color: 'bg-blue-100 text-blue-800', icon: <Zap className="h-3 w-3 mr-1" /> },
      'solar': { color: 'bg-yellow-100 text-yellow-800', icon: <Zap className="h-3 w-3 mr-1" /> },
      'inverter': { color: 'bg-indigo-100 text-indigo-800', icon: <Power className="h-3 w-3 mr-1" /> },
      'meter': { color: 'bg-green-100 text-green-800', icon: <ClipboardList className="h-3 w-3 mr-1" /> },
      'ev_charger': { color: 'bg-purple-100 text-purple-800', icon: <Zap className="h-3 w-3 mr-1" /> },
    };
    
    const deviceType = typeMap[type] || { color: 'bg-gray-100 text-gray-800', icon: <Settings className="h-3 w-3 mr-1" /> };
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${deviceType.color}`}>
        {deviceType.icon}
        {type.replace('_', ' ')}
      </span>
    );
  };
  
  return (
    <AppLayout>
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Manage Devices</h1>
            <p className="text-muted-foreground">Edit, configure and monitor devices</p>
          </div>
          <div className="mt-4 md:mt-0 space-x-2">
            <Button variant="outline" onClick={handleExportDevices}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => navigate('/devices/add')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Device
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name, type, or location..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                {deviceTypeFilter ? `Type: ${deviceTypeFilter.replace('_', ' ')}` : 'Filter by Type'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setDeviceTypeFilter(null)}>
                All Types
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setDeviceTypeFilter('battery')}>
                Battery
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDeviceTypeFilter('solar')}>
                Solar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDeviceTypeFilter('inverter')}>
                Inverter
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDeviceTypeFilter('meter')}>
                Meter
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDeviceTypeFilter('ev_charger')}>
                EV Charger
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Tabs value={viewMode} onValueChange={setViewMode} className="w-full md:w-auto">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="online">Online</TabsTrigger>
              <TabsTrigger value="offline">Offline</TabsTrigger>
              <TabsTrigger value="warning">Issues</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Device Management</CardTitle>
            <CardDescription>
              {filteredDevices.length} {filteredDevices.length === 1 ? 'device' : 'devices'} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-500 mb-4">Failed to load devices</p>
                <Button 
                  variant="outline" 
                  onClick={() => refetch()}
                >
                  Retry
                </Button>
              </div>
            ) : filteredDevices.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Firmware</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDevices.map((device) => (
                      <TableRow key={device.id}>
                        <TableCell className="font-medium">{device.name}</TableCell>
                        <TableCell>{getDeviceTypeBadge(device.type)}</TableCell>
                        <TableCell>{getStatusBadge(device.status)}</TableCell>
                        <TableCell>{device.location || 'N/A'}</TableCell>
                        <TableCell>{device.capacity} {device.type === 'battery' ? 'kWh' : 'kW'}</TableCell>
                        <TableCell>{device.firmware || 'N/A'}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => navigate(`/devices/${device.id}`)}>
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => navigate(`/devices/${device.id}/edit`)}>
                                Edit Device
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => navigate(`/devices/${device.id}/configure`)}>
                                Configure
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-500 focus:text-red-500" 
                                onClick={() => handleDelete(device.id)}
                              >
                                Delete Device
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-lg font-medium mb-2">No devices found</p>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || deviceTypeFilter || viewMode !== 'all'
                    ? "No devices match your current filters"
                    : "You haven't added any devices yet"}
                </p>
                {(searchQuery || deviceTypeFilter || viewMode !== 'all') ? (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchQuery('');
                      setDeviceTypeFilter(null);
                      setViewMode('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                ) : (
                  <Button 
                    onClick={() => navigate('/devices/add')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Device
                  </Button>
                )}
              </div>
            )}
          </CardContent>
          {filteredDevices.length > 0 && (
            <CardFooter className="flex justify-between border-t pt-6">
              <span className="text-sm text-muted-foreground">
                Showing {filteredDevices.length} of {devices.length} devices
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setSearchQuery('');
                  setDeviceTypeFilter(null);
                  setViewMode('all');
                }}
                disabled={!searchQuery && !deviceTypeFilter && viewMode === 'all'}
              >
                Reset Filters
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </AppLayout>
  );
};

export default ManageDevices;
