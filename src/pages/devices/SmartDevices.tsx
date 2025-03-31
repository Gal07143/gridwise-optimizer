
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AppLayout from '@/components/layout/AppLayout';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, RefreshCw, PlugZap, Wifi, Signal, CloudOff } from 'lucide-react';
import { toast } from 'sonner';
import { getDevices } from '@/services/deviceService';

interface SmartDevice {
  id: string;
  name: string;
  type: string;
  status: string;
  location?: string;
  lastSeen?: string;
  signalStrength?: number;
  batteryLevel?: number;
  firmware?: string;
  ip?: string;
}

const SmartDevices = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: rawDevices = [], isLoading, error, refetch } = useQuery({
    queryKey: ['devices'],
    queryFn: getDevices,
    meta: {
      onError: (error: Error) => {
        console.error('Error fetching devices:', error);
        toast.error('Failed to load devices');
      }
    }
  });
  
  // Transform and filter to only smart devices (mocked for this example)
  const smartDevices: SmartDevice[] = rawDevices
    .filter(device => ['solar', 'battery', 'ev_charger', 'inverter', 'meter'].includes(device.type))
    .map(device => ({
      id: device.id,
      name: device.name,
      type: device.type,
      status: device.status,
      location: device.location,
      lastSeen: new Date().toISOString(),
      signalStrength: Math.floor(Math.random() * 100),
      batteryLevel: device.type === 'battery' ? Math.floor(Math.random() * 100) : undefined,
      firmware: device.firmware,
      ip: `192.168.1.${Math.floor(Math.random() * 255)}`
    }));
  
  // Filter smart devices based on search query
  const filteredDevices = smartDevices.filter(device => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      device.name.toLowerCase().includes(query) ||
      device.type.toLowerCase().includes(query) ||
      (device.location && device.location.toLowerCase().includes(query))
    );
  });
  
  const handleRefresh = () => {
    refetch();
    toast.success('Refreshing device status...');
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return <Badge className="bg-green-500 flex items-center gap-1"><Wifi className="h-3 w-3" /> Connected</Badge>;
      case 'offline':
        return <Badge variant="outline" className="text-gray-500 flex items-center gap-1"><CloudOff className="h-3 w-3" /> Disconnected</Badge>;
      case 'warning':
        return <Badge className="bg-amber-500">Warning</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };
  
  const getSignalStrengthIndicator = (strength: number) => {
    if (strength >= 80) {
      return <Signal className="h-4 w-4 text-green-500" />;
    } else if (strength >= 50) {
      return <Signal className="h-4 w-4 text-amber-500" />;
    } else {
      return <Signal className="h-4 w-4 text-red-500" />;
    }
  };
  
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };
  
  return (
    <AppLayout>
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Smart Devices</h1>
            <p className="text-muted-foreground">Monitor and manage your smart energy devices</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Status
            </Button>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search smart devices..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <p className="text-red-500 mb-4">Failed to load smart devices</p>
              <Button 
                variant="outline" 
                onClick={() => refetch()}
              >
                Retry
              </Button>
            </CardContent>
          </Card>
        ) : filteredDevices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDevices.map((device) => (
              <Card key={device.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <PlugZap className="h-5 w-5 text-primary" />
                      <CardTitle className="text-base">{device.name}</CardTitle>
                    </div>
                    {getStatusBadge(device.status)}
                  </div>
                  <CardDescription>{device.location || 'No location set'}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex flex-col">
                        <span className="text-muted-foreground">Type</span>
                        <span className="capitalize">{device.type.replace('_', ' ')}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-muted-foreground">IP Address</span>
                        <span className="font-mono text-xs">{device.ip}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-muted-foreground">Signal</span>
                        <span className="flex items-center gap-1">
                          {getSignalStrengthIndicator(device.signalStrength || 0)}
                          {device.signalStrength}%
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-muted-foreground">Last Seen</span>
                        <span>{formatTimeAgo(device.lastSeen || '')}</span>
                      </div>
                      {device.batteryLevel !== undefined && (
                        <div className="flex flex-col">
                          <span className="text-muted-foreground">Battery</span>
                          <span className="flex items-center">
                            {device.batteryLevel}%
                          </span>
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="text-muted-foreground">Firmware</span>
                        <span>{device.firmware || 'Unknown'}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 border-t pt-4">
                  <Button variant="outline" size="sm">Configure</Button>
                  <Button size="sm">Manage</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <p className="text-lg font-medium mb-2">No smart devices found</p>
              <p className="text-muted-foreground text-center mb-4">
                {searchQuery 
                  ? "No devices match your search query"
                  : "You don't have any smart devices connected to your system"}
              </p>
              {searchQuery && (
                <Button 
                  variant="outline" 
                  onClick={() => setSearchQuery('')}
                >
                  Clear Search
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default SmartDevices;
