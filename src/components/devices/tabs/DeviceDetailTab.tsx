
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnergyDevice } from '@/types/energy';
import { formatDate } from '@/utils/dateUtils';

interface DeviceDetailTabProps {
  device: EnergyDevice;
}

const DeviceDetailTab: React.FC<DeviceDetailTabProps> = ({ device }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Device Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Device Name</h3>
            <p className="mt-1">{device.name}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Device Type</h3>
            <p className="mt-1 capitalize">{device.type}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
            <p className="mt-1 capitalize">{device.status}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Capacity</h3>
            <p className="mt-1">{device.capacity} {device.type === 'battery' ? 'kWh' : 'kW'}</p>
          </div>
          
          {device.location && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
              <p className="mt-1">{device.location}</p>
            </div>
          )}
          
          {device.installation_date && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Installation Date</h3>
              <p className="mt-1">{formatDate(device.installation_date)}</p>
            </div>
          )}
          
          {device.firmware && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Firmware Version</h3>
              <p className="mt-1">{device.firmware}</p>
            </div>
          )}

          {device.last_seen && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Last Seen</h3>
              <p className="mt-1">{formatDate(device.last_seen, true)}</p>
            </div>
          )}
        </div>
        
        {device.description && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
            <p className="mt-1">{device.description}</p>
          </div>
        )}
        
        {device.metrics && Object.keys(device.metrics).length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">Current Metrics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(device.metrics).map(([key, value]) => (
                <div key={key} className="bg-muted/50 p-3 rounded-md">
                  <div className="text-xs text-muted-foreground capitalize">{key.replace('_', ' ')}</div>
                  <div className="font-medium mt-1">{value}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeviceDetailTab;
