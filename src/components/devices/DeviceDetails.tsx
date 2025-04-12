import React from 'react';
import {
  Activity,
  AlertTriangle,
  Battery,
  Calendar,
  Clock,
  Globe,
  Info,
  MapPin,
  Power,
  Server,
  Settings,
  Tag,
  Wifi
} from 'lucide-react';
import { Device } from '@/types/device';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface DeviceDetailsProps {
  device: Device;
}

const DeviceDetails: React.FC<DeviceDetailsProps> = ({ device }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'online':
        return 'text-green-500';
      case 'offline':
        return 'text-gray-500';
      case 'warning':
        return 'text-amber-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Main Info Card */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Server className="h-5 w-5" />
            Device Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Name:</span>
                <span>{device.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Type:</span>
                <span className="capitalize">{device.type}</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className={`h-4 w-4 ${getStatusColor(device.status)}`} />
                <span className="font-medium">Status:</span>
                <Badge
                  variant={device.status.toLowerCase() === 'online' ? 'default' : 'secondary'}
                  className={getStatusColor(device.status)}
                >
                  {device.status}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Location:</span>
                <span>{device.location || 'Not specified'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Power className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Capacity:</span>
                <span>{device.capacity} kW</span>
              </div>
              <div className="flex items-center gap-2">
                <Battery className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Current Output:</span>
                <span>{device.current_output || 0} kW</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Details Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Technical Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <Server className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Model:</span>
            <span>{device.model || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Protocol:</span>
            <span>{device.protocol || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Wifi className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">IP Address:</span>
            <span>{device.ip_address || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Firmware:</span>
            <span>{device.firmware || 'N/A'}</span>
          </div>
        </CardContent>
      </Card>

      {/* Timestamps Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Timestamps
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Installation Date:</span>
            <span>{formatDate(device.installation_date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Last Updated:</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <span className="cursor-help underline decoration-dotted">
                    {formatDate(device.last_updated)}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Last time device data was updated</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Created At:</span>
            <span>{formatDate(device.created_at)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeviceDetails; 