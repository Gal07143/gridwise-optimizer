
import React from 'react';
import { Device } from '@/types/energy';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow, format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface DeviceDetailTabProps {
  device: Device;
}

const DeviceDetailTab: React.FC<DeviceDetailTabProps> = ({ device }) => {
  // Function to get status color based on device status
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'online':
      case 'active':
      case 'connected':
        return 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400';
      case 'standby':
      case 'idle':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400';
      case 'warning':
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'error':
      case 'fault':
      case 'offline':
      case 'disconnected':
        return 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic info section */}
      <Card>
        <CardHeader>
          <CardTitle>Device Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Name</TableCell>
                <TableCell>{device.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Type</TableCell>
                <TableCell className="capitalize">{device.type}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Status</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(device.status)}>
                    {device.status}
                  </Badge>
                </TableCell>
              </TableRow>
              {device.model && (
                <TableRow>
                  <TableCell className="font-medium">Model</TableCell>
                  <TableCell>{device.model}</TableCell>
                </TableRow>
              )}
              {device.manufacturer && (
                <TableRow>
                  <TableCell className="font-medium">Manufacturer</TableCell>
                  <TableCell>{device.manufacturer}</TableCell>
                </TableRow>
              )}
              {device.serialNumber && (
                <TableRow>
                  <TableCell className="font-medium">Serial Number</TableCell>
                  <TableCell>{device.serialNumber}</TableCell>
                </TableRow>
              )}
              {device.firmware && (
                <TableRow>
                  <TableCell className="font-medium">Firmware Version</TableCell>
                  <TableCell>{device.firmware}</TableCell>
                </TableRow>
              )}
              {device.protocol && (
                <TableRow>
                  <TableCell className="font-medium">Protocol</TableCell>
                  <TableCell>{device.protocol}</TableCell>
                </TableRow>
              )}
              {device.capacity && (
                <TableRow>
                  <TableCell className="font-medium">Capacity</TableCell>
                  <TableCell>{device.capacity} {device.type === 'battery' ? 'kWh' : 'kW'}</TableCell>
                </TableRow>
              )}
              {device.installation_date && (
                <TableRow>
                  <TableCell className="font-medium">Installation Date</TableCell>
                  <TableCell>{format(new Date(device.installation_date), 'PPP')}</TableCell>
                </TableRow>
              )}
              {device.last_seen && (
                <TableRow>
                  <TableCell className="font-medium">Last Seen</TableCell>
                  <TableCell>{formatDistanceToNow(new Date(device.last_seen))} ago</TableCell>
                </TableRow>
              )}
              {device.location && (
                <TableRow>
                  <TableCell className="font-medium">Location</TableCell>
                  <TableCell>{device.location}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Description section (if available) */}
      {device.description && (
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{device.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Metrics section (if available) */}
      {device.metrics && Object.keys(device.metrics).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Current Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Metric</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(device.metrics).map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell className="font-medium capitalize">
                      {key.replace(/_/g, ' ')}
                    </TableCell>
                    <TableCell>
                      {value} 
                      {key.includes('temp') ? '°C' : 
                       key.includes('power') ? 'W' :
                       key.includes('voltage') ? 'V' :
                       key.includes('current') ? 'A' :
                       key.includes('energy') ? 'kWh' :
                       key.includes('frequency') ? 'Hz' : ''}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Tags section (if available) */}
      {device.tags && (device.tags as string[]).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {(device.tags as string[]).map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DeviceDetailTab;
