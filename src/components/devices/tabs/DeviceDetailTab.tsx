
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EnergyDevice } from '@/types/energy';
import { capitalizeWords } from '@/lib/textUtils';

interface DeviceDetailTabProps {
  device: EnergyDevice;
}

const DeviceDetailTab: React.FC<DeviceDetailTabProps> = ({ device }) => {
  const renderDeviceStatus = (status: string) => {
    let variant = 'outline';
    
    switch (status) {
      case 'online':
        variant = 'success';
        break;
      case 'offline':
        variant = 'destructive';
        break;
      case 'maintenance':
        variant = 'warning';
        break;
      case 'error':
        variant = 'destructive';
        break;
      default:
        variant = 'outline';
    }
    
    return (
      <Badge variant={variant as any} className="ml-2">
        {capitalizeWords(status)}
      </Badge>
    );
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>General Information</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-2 text-sm">
            <dt className="font-medium">ID:</dt>
            <dd className="text-muted-foreground">{device.id}</dd>
            
            <dt className="font-medium">Name:</dt>
            <dd className="text-muted-foreground">{device.name}</dd>
            
            <dt className="font-medium">Type:</dt>
            <dd className="text-muted-foreground">{capitalizeWords(device.type)}</dd>
            
            <dt className="font-medium">Status:</dt>
            <dd className="text-muted-foreground">
              {renderDeviceStatus(device.status)}
            </dd>
            
            {device.location && (
              <>
                <dt className="font-medium">Location:</dt>
                <dd className="text-muted-foreground">{device.location}</dd>
              </>
            )}
            
            {device.capacity && (
              <>
                <dt className="font-medium">Capacity:</dt>
                <dd className="text-muted-foreground">{device.capacity} kW</dd>
              </>
            )}
          </dl>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Technical Details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-2 text-sm">
            {device.firmware && (
              <>
                <dt className="font-medium">Firmware:</dt>
                <dd className="text-muted-foreground">{device.firmware}</dd>
              </>
            )}
            
            {device.description && (
              <>
                <dt className="font-medium">Description:</dt>
                <dd className="text-muted-foreground">{device.description}</dd>
              </>
            )}
            
            {device.installation_date && (
              <>
                <dt className="font-medium">Installation Date:</dt>
                <dd className="text-muted-foreground">
                  {new Date(device.installation_date).toLocaleDateString()}
                </dd>
              </>
            )}
            
            {device.metrics && Object.keys(device.metrics).length > 0 && (
              <>
                <dt className="font-medium">Metrics:</dt>
                <dd className="text-muted-foreground">
                  {Object.keys(device.metrics).map(key => (
                    <div key={key}>
                      {key}: {String(device.metrics?.[key])}
                    </div>
                  ))}
                </dd>
              </>
            )}
          </dl>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeviceDetailTab;
