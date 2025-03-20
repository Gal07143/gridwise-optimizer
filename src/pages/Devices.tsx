
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { ArrowUpDown, Battery, Plus, MoreHorizontal, Search, Settings, Zap, Wind, Radio, RefreshCw, LogOut, Eye, Edit, Trash2, Tag, FilterX, Package, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

// Mock data for devices
const mockDevices = [
  {
    id: '1',
    name: 'Main Battery Storage',
    type: 'battery',
    status: 'online',
    capacity: 15,
    location: 'Building A',
    lastUpdated: new Date(Date.now() - 15 * 60000).toISOString(),
    metrics: {
      stateOfCharge: 78,
      temp: 28.5,
      voltage: 48.2,
      currentPower: 3.2
    }
  },
  {
    id: '2',
    name: 'Inverter System 1',
    type: 'inverter',
    status: 'online',
    capacity: 10,
    location: 'Roof',
    lastUpdated: new Date(Date.now() - 5 * 60000).toISOString(),
    metrics: {
      efficiency: 96.8,
      temp: 32.1,
      voltage: 240,
      currentPower: 6.5
    }
  },
  {
    id: '3',
    name: 'South Solar Array',
    type: 'solar',
    status: 'online',
    capacity: 12,
    location: 'Roof South',
    lastUpdated: new Date(Date.now() - 2 * 60000).toISOString(),
    metrics: {
      generation: 9.8,
      temp: 42.5,
      voltage: 48,
      currentPower: 9.8
    }
  },
  {
    id: '4',
    name: 'North Wind Turbine',
    type: 'wind',
    status: 'maintenance',
    capacity: 5,
    location: 'North Field',
    lastUpdated: new Date(Date.now() - 1 * 3600000).toISOString(),
    metrics: {
      generation: 0,
      temp: 26.2,
      voltage: 48,
      currentPower: 0
    }
  },
  {
    id: '5',
    name: 'EV Charging Station 1',
    type: 'ev-charger',
    status: 'idle',
    capacity: 11,
    location: 'Parking Lot A',
    lastUpdated: new Date(Date.now() - 25 * 60000).toISOString(),
    metrics: {
      usage: 0,
      temp: 25.6,
      voltage: 240,
      currentPower: 0
    }
  },
  {
    id: '6',
    name: 'Smart Meter - Main Building',
    type: 'meter',
    status: 'online',
    capacity: 0,
    location: 'Utility Room',
    lastUpdated: new Date(Date.now() - 1 * 60000).toISOString(),
    metrics: {
      reading: 1254.8,
      voltage: 240,
      current: 12.5
    }
  },
  {
    id: '7',
    name: 'Rooftop Weather Station',
    type: 'sensor',
    status: 'online',
    capacity: 0,
    location: 'Main Roof',
    lastUpdated: new Date(Date.now() - 4 * 60000).toISOString(),
    metrics: {
      temperature: 32.1,
      humidity: 45,
      windSpeed: 12.3
    }
  },
  {
    id: '8',
    name: 'Secondary Battery System',
    type: 'battery',
    status: 'offline',
    capacity: 10,
    location: 'Building B',
    lastUpdated: new Date(Date.now() - 2 * 3600000).toISOString(),
    metrics: {
      stateOfCharge: 12,
      temp: 22.5,
      voltage: 0,
      currentPower: 0
    }
  }
];

const Devices = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deviceToDelete, setDeviceToDelete] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Filter devices based on search query, type and status
  const filteredDevices = mockDevices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         device.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || device.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || device.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Sort devices by status (online first)
  const sortedDevices = [...filteredDevices].sort((a, b) => {
    if (a.status === 'online' && b.status !== 'online') return -1;
    if (a.status !== 'online' && b.status === 'online') return 1;
    return 0;
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleDeleteDevice = () => {
    if (deviceToDelete) {
      // In a real app, this would send a delete request to the API
      console.log(`Deleting device with ID: ${deviceToDelete}`);
      toast.success('Device deleted successfully');
      setShowDeleteDialog(false);
      setDeviceToDelete(null);
    }
  };

  const confirmDelete = (deviceId: string) => {
    setDeviceToDelete(deviceId);
    setShowDeleteDialog(true);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedStatus('all');
  };

  const getDeviceTypeIcon = (type: string) => {
    switch (type) {
      case 'battery':
        return <Battery className="h-4 w-4" />;
      case 'inverter':
        return <Zap className="h-4 w-4" />;
      case 'solar':
        return <Zap className="h-4 w-4" />;
      case 'wind':
        return <Wind className="h-4 w-4" />;
      case 'ev-charger':
        return <Zap className="h-4 w-4" />;
      case 'meter':
        return <Activity className="h-4 w-4" />;
      case 'sensor':
        return <Radio className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Online</Badge>;
      case 'offline':
        return <Badge variant="secondary">Offline</Badge>;
      case 'maintenance':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Maintenance</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'idle':
        return <Badge variant="outline">Idle</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <AppLayout>
      <div className="flex-1 overflow-y-auto p-6 animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold mb-1">Devices</h1>
            <p className="text-muted-foreground">View and manage all connected devices</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh} className="gap-1">
              <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button asChild>
              <Link to="/add-device" className="gap-1">
                <Plus size={16} />
                <span className="hidden sm:inline">Add Device</span>
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search devices..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="battery">Battery</SelectItem>
                <SelectItem value="inverter">Inverter</SelectItem>
                <SelectItem value="solar">Solar</SelectItem>
                <SelectItem value="wind">Wind</SelectItem>
                <SelectItem value="ev-charger">EV Charger</SelectItem>
                <SelectItem value="meter">Meter</SelectItem>
                <SelectItem value="sensor">Sensor</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="idle">Idle</SelectItem>
              </SelectContent>
            </Select>
            
            {(searchQuery || selectedType !== 'all' || selectedStatus !== 'all') && (
              <Button variant="ghost" onClick={clearFilters} size="icon" title="Clear filters">
                <FilterX size={16} />
              </Button>
            )}
          </div>
        </div>
        
        {sortedDevices.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <div className="rounded-full bg-primary/10 p-3 mb-4">
                <Filter size={24} className="text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-1">No devices found</h3>
              <p className="text-muted-foreground mb-4">
                No devices match your current filters.
              </p>
              <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {sortedDevices.map((device) => (
              <Card key={device.id} className="overflow-hidden">
                <div className={`h-1 ${
                  device.status === 'online' ? 'bg-green-500' : 
                  device.status === 'offline' ? 'bg-slate-500' : 
                  device.status === 'maintenance' ? 'bg-blue-500' : 
                  device.status === 'error' ? 'bg-red-500' : 
                  'bg-slate-400'
                }`} />
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="flex items-center text-xs text-muted-foreground">
                          {getDeviceTypeIcon(device.type)}
                          <span className="ml-1 capitalize">{device.type.replace('-', ' ')}</span>
                        </span>
                        {getStatusBadge(device.status)}
                      </div>
                      <CardTitle className="mt-1.5 text-lg">{device.name}</CardTitle>
                      <CardDescription>{device.location}</CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate(`/edit-device/${device.id}`)}>
                          <Eye size={14} className="mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/edit-device/${device.id}`)}>
                          <Edit size={14} className="mr-2" />
                          Edit Device
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/edit-device/${device.id}`)}>
                          <Settings size={14} className="mr-2" />
                          Configure
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => confirmDelete(device.id)}>
                          <Trash2 size={14} className="mr-2" />
                          Delete Device
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">
                    {device.capacity > 0 && (
                      <div className="flex justify-between py-0.5">
                        <span className="text-muted-foreground">Capacity:</span>
                        <span className="font-medium">{device.capacity} kW</span>
                      </div>
                    )}
                    
                    {device.metrics && Object.entries(device.metrics).map(([key, value]) => {
                      let formattedKey = key.replace(/([A-Z])/g, ' $1').trim();
                      formattedKey = formattedKey.charAt(0).toUpperCase() + formattedKey.slice(1);
                      
                      let formattedValue = value;
                      let unit = '';
                      
                      // Add units based on the metric type
                      if (key === 'stateOfCharge') {
                        unit = '%';
                      } else if (key === 'temp' || key === 'temperature') {
                        unit = '°C';
                      } else if (key === 'voltage') {
                        unit = 'V';
                      } else if (key === 'currentPower' || key === 'generation') {
                        unit = 'kW';
                      } else if (key === 'efficiency') {
                        unit = '%';
                      } else if (key === 'humidity') {
                        unit = '%';
                      } else if (key === 'windSpeed') {
                        unit = 'm/s';
                      } else if (key === 'reading') {
                        unit = 'kWh';
                      } else if (key === 'current') {
                        unit = 'A';
                      }
                      
                      return (
                        <div key={key} className="flex justify-between py-0.5">
                          <span className="text-muted-foreground">{formattedKey}:</span>
                          <span className="font-medium">{formattedValue}{unit}</span>
                        </div>
                      );
                    })}
                    
                    <div className="flex justify-between py-0.5 mt-1">
                      <span className="text-muted-foreground">Last Updated:</span>
                      <span className="text-xs">{new Date(device.lastUpdated).toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link to={`/edit-device/${device.id}`}>
                        <Eye size={14} className="mr-1" />
                        View
                      </Link>
                    </Button>
                    <Button size="sm" className="w-full" asChild>
                      <Link to={`/edit-device/${device.id}`}>
                        <Settings size={14} className="mr-1" />
                        Configure
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Device Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this device? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteDevice}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Devices;
