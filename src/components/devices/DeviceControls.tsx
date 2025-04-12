import React from 'react';
import { Device, useDevices } from '@/contexts/DeviceContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface DeviceControlsProps {
  device: Device;
}

export function DeviceControls({ device }: DeviceControlsProps) {
  const { updateDevice, deleteDevice } = useDevices();

  const handleToggleStatus = async () => {
    const newStatus = device.status === 'online' ? 'offline' : 'online';
    await updateDevice(device.id, { status: newStatus });
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this device?')) {
      await deleteDevice(device.id);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Device Controls</CardTitle>
        <CardDescription>
          Manage device settings and actions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Device Status</Label>
            <div className="text-sm text-gray-500">
              {device.status === 'online' ? 'Device is online' : 'Device is offline'}
            </div>
          </div>
          <Switch
            checked={device.status === 'online'}
            onCheckedChange={handleToggleStatus}
          />
        </div>

        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => window.location.href = `/devices/${device.id}/settings`}
          >
            Device Settings
          </Button>
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleDelete}
          >
            Delete Device
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 