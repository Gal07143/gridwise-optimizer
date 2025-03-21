
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  Battery,
  BatteryCharging,
  ChevronRight,
  ExternalLink,
  Eye,
  Filter,
  Info,
  Lightbulb,
  Plus,
  Search,
  Settings,
  Trash,
  Wind,
  Zap,
  Download
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

// Mock device data
const mockDevices = [
  { 
    id: 'dev1', 
    name: 'Battery Storage 1', 
    type: 'battery', 
    status: 'online',
    location: 'Building A',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 5)
  },
  { 
    id: 'dev2', 
    name: 'Solar Inverter 2', 
    type: 'inverter',
    status: 'online',
    location: 'Roof East',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 15)
  },
  { 
    id: 'dev3', 
    name: 'EV Charger Station', 
    type: 'ev-charger',
    status: 'offline',
    location: 'Parking Lot',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60)
  },
  { 
    id: 'dev4', 
    name: 'Smart Meter Main', 
    type: 'meter',
    status: 'warning',
    location: 'Utility Room',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 30)
  },
];

const getDeviceIcon = (type: string) => {
  switch (type) {
    case 'battery':
      return <Battery className="h-5 w-5 text-blue-500" />;
    case 'inverter':
      return <Zap className="h-5 w-5 text-green-500" />;
    case 'ev-charger':
      return <BatteryCharging className="h-5 w-5 text-purple-500" />;
    case 'meter':
      return <Activity className="h-5 w-5 text-orange-500" />;
    case 'light':
      return <Lightbulb className="h-5 w-5 text-yellow-500" />;
    case 'wind':
      return <Wind className="h-5 w-5 text-teal-500" />;
    default:
      return <Settings className="h-5 w-5 text-gray-500" />;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'online':
      return <Badge className="bg-green-500">Online</Badge>;
    case 'offline':
      return <Badge variant="outline" className="text-gray-500 border-gray-300">Offline</Badge>;
    case 'warning':
      return <Badge className="bg-amber-500">Warning</Badge>;
    case 'error':
      return <Badge variant="destructive">Error</Badge>;
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
};

const Devices = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDevices = mockDevices.filter(device => {
    if (activeTab !== 'all' && device.status !== activeTab) {
      return false;
    }
    
    if (searchQuery) {
      return device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             device.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
             device.location.toLowerCase().includes(searchQuery.toLowerCase());
    }
    
    return true;
  });

  const handleDeleteDevice = (id: string) => {
    toast.error("Delete functionality is not implemented yet");
  };

  const handleDownloadSpecs = (deviceName: string) => {
    // In a real app, this would initiate a file download
    toast.success(`Downloading specifications for ${deviceName}...`);
    // Simulate download completion
    setTimeout(() => {
      toast.info(`${deviceName} specifications downloaded successfully`);
    }, 1500);
  };

  const handleDownloadManual = (deviceName: string) => {
    // In a real app, this would initiate a file download
    toast.success(`Downloading user manual for ${deviceName}...`);
    // Simulate download completion
    setTimeout(() => {
      toast.info(`${deviceName} user manual downloaded successfully`);
    }, 1500);
  };

  const handleExportData = (deviceName: string) => {
    // In a real app, this would initiate a file download
    toast.success(`Exporting data for ${deviceName}...`);
    // Simulate download completion
    setTimeout(() => {
      toast.info(`${deviceName} data exported successfully as CSV`);
    }, 1500);
  };

  return (
    <AppLayout>
      <div className="p-6 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold mb-1">Devices</h1>
            <p className="text-muted-foreground">Manage your energy devices and equipment</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
            <Button asChild variant="outline">
              <Link to="/devices/scan">
                <Search className="mr-2 h-4 w-4" />
                Scan Network
              </Link>
            </Button>
            <Button asChild>
              <Link to="/add-device">
                <Plus className="mr-2 h-4 w-4" />
                Add Device
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search devices by name, type or location..." 
              className="pl-10 bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="online">Online</TabsTrigger>
              <TabsTrigger value="offline">Offline</TabsTrigger>
              <TabsTrigger value="warning">Warning</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {filteredDevices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDevices.map(device => (
              <Card key={device.id} className="hover:shadow-md transition-all">
                <CardHeader className="pb-2 flex flex-row items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">
                      {getDeviceIcon(device.type)}
                    </div>
                    <div>
                      <CardTitle className="text-base">{device.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {device.location}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(device.status)}
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-3">
                    <span className="text-xs text-muted-foreground">
                      Last updated: {device.lastUpdated.toLocaleTimeString()}
                    </span>
                    
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/devices/${device.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      </Button>
                      
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/devices/${device.id}/edit`}>
                          <Settings className="h-4 w-4 mr-1" />
                          Manage
                        </Link>
                      </Button>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleDownloadSpecs(device.name)}>
                            Download Specifications
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownloadManual(device.name)}>
                            Download User Manual
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleExportData(device.name)}>
                            Export Device Data
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/devices/${device.id}/edit`}>Edit Device</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-500 focus:text-red-500"
                            onClick={() => handleDeleteDevice(device.id)}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete Device
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
            <Info className="mx-auto h-10 w-10 text-slate-400" />
            <h3 className="mt-4 text-lg font-medium">No devices found</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
              {searchQuery 
                ? "No devices match your search criteria. Try adjusting your filters."
                : "You haven't added any devices yet. Start by adding your first device."}
            </p>
            <Button variant="outline" className="mt-6" asChild>
              <Link to="/add-device">
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Device
              </Link>
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Devices;
