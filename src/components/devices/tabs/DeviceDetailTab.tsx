
import React from 'react';
import { 
  Battery, 
  Sun, 
  Wind, 
  Zap, 
  Activity, 
  BatteryCharging,
  Settings,
  MapPin,
  Calendar,
  Info,
  BarChart3,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { DeviceStatus, DeviceType } from '@/types/energy';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface DeviceDetailProps {
  device: {
    id: string;
    name: string;
    type: DeviceType;
    status: DeviceStatus;
    capacity: number;
    firmware?: string;
    location: string;
    description?: string;
  };
}

const DeviceDetailTab: React.FC<DeviceDetailProps> = ({ device }) => {
  const getDeviceTypeIcon = (type: DeviceType) => {
    switch (type) {
      case 'battery':
        return <Battery className="h-5 w-5 text-blue-500" />;
      case 'solar':
        return <Sun className="h-5 w-5 text-yellow-500" />;
      case 'wind':
        return <Wind className="h-5 w-5 text-teal-500" />;
      case 'grid':
        return <Zap className="h-5 w-5 text-purple-500" />;
      case 'load':
        return <Activity className="h-5 w-5 text-red-500" />;
      case 'ev_charger':
        return <BatteryCharging className="h-5 w-5 text-green-500" />;
      case 'inverter':
        return <Settings className="h-5 w-5 text-indigo-500" />;
      case 'meter':
        return <BarChart3 className="h-5 w-5 text-orange-500" />;
      default:
        return <Settings className="h-5 w-5 text-gray-500" />;
    }
  };

  const getDeviceStatusIcon = (status: DeviceStatus) => {
    switch (status) {
      case 'online':
        return <Badge className="bg-green-500">Online</Badge>;
      case 'offline':
        return <Badge variant="outline" className="text-gray-500 border-gray-300">Offline</Badge>;
      case 'maintenance':
        return <Badge className="bg-blue-500">Maintenance</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'warning':
        return <Badge className="bg-amber-500">Warning</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getDeviceTypeLabel = (type: DeviceType) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-muted-foreground">
            {getDeviceTypeIcon(device.type)}
            <span className="capitalize">{getDeviceTypeLabel(device.type)}</span>
          </div>
          
          <h2 className="text-xl font-semibold">{device.name}</h2>
          
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{device.location || 'No location set'}</span>
          </div>
          
          <p className="text-muted-foreground">
            {device.description || `No description available for this ${device.type.replace(/_/g, ' ')}.`}
          </p>
          
          <Separator className="my-4" />
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Status</div>
              <div className="flex items-center mt-1">
                {getDeviceStatusIcon(device.status)}
              </div>
            </div>
            
            <div>
              <div className="text-sm text-muted-foreground">Capacity</div>
              <div className="font-medium mt-1">
                {device.capacity} {device.type === 'battery' ? 'kWh' : 'kW'}
              </div>
            </div>
            
            <div>
              <div className="text-sm text-muted-foreground">Firmware</div>
              <div className="font-medium mt-1">
                {device.firmware || 'Not available'}
              </div>
            </div>
            
            <div>
              <div className="text-sm text-muted-foreground">ID</div>
              <div className="font-mono text-xs truncate mt-1">
                {device.id}
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="rounded-md border p-4 bg-muted/10">
            <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              Device Information
            </h3>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type:</span>
                <span className="font-medium">{getDeviceTypeLabel(device.type)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Model:</span>
                <span className="font-medium">Standard {getDeviceTypeLabel(device.type)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Manufacturer:</span>
                <span className="font-medium">Generic</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Capacity:</span>
                <span className="font-medium">{device.capacity} {device.type === 'battery' ? 'kWh' : 'kW'}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Firmware:</span>
                <span className="font-medium">{device.firmware || 'Not available'}</span>
              </div>
            </div>
          </div>
          
          <div className="rounded-md border p-4 bg-muted/10">
            <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Status Information
            </h3>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current Status:</span>
                <span className="font-medium">{device.status}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Maintenance:</span>
                <span className="font-medium">Not recorded</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Warranty Status:</span>
                <span className="font-medium">Active</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Next Scheduled Check:</span>
                <span className="font-medium">Not scheduled</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceDetailTab;
