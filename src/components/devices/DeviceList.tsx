import React from 'react';
import { Device } from '@/contexts/DeviceContext';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DeviceListProps {
  devices: Device[];
  selectedDevice: Device | null;
  onSelectDevice: (device: Device) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  className?: string;
}

/**
 * DeviceList component for displaying and selecting devices
 * @param devices - Array of devices to display
 * @param selectedDevice - Currently selected device
 * @param onSelectDevice - Callback when a device is selected
 * @param onRefresh - Optional callback for refreshing the device list
 * @param isRefreshing - Optional flag indicating if the list is being refreshed
 * @param className - Optional additional CSS classes
 */
export function DeviceList({ 
  devices, 
  selectedDevice, 
  onSelectDevice,
  onRefresh,
  isRefreshing = false,
  className 
}: DeviceListProps) {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredDevices = React.useMemo(() => {
    if (!searchQuery) return devices;
    
    const query = searchQuery.toLowerCase();
    return devices.filter(device => 
      device.name.toLowerCase().includes(query) ||
      device.type.toLowerCase().includes(query) ||
      device.protocol.toLowerCase().includes(query)
    );
  }, [devices, searchQuery]);

  return (
    <div className={cn("border rounded-lg overflow-hidden", className)}>
      <div className="p-4 bg-muted space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Devices</h2>
          {onRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
              aria-label="Refresh devices"
            >
              <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
            </Button>
          )}
        </div>
        
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search devices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="divide-y">
        {filteredDevices.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            {searchQuery ? 'No devices match your search' : 'No devices found'}
          </div>
        ) : (
          filteredDevices.map((device) => (
            <button
              key={device.id}
              onClick={() => onSelectDevice(device)}
              className={cn(
                'w-full p-4 text-left hover:bg-muted transition-colors',
                selectedDevice?.id === device.id && 'bg-muted'
              )}
              aria-selected={selectedDevice?.id === device.id}
            >
              <div className="flex items-center justify-between">
                <div className="font-medium">{device.name}</div>
                <Badge 
                  variant={device.status === 'online' ? 'success' : 'destructive'}
                  className="ml-2"
                >
                  {device.status}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground mt-1">{device.type}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {device.protocol} • Last seen: {device.last_seen ? new Date(device.last_seen).toLocaleString() : 'Never'}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
} 