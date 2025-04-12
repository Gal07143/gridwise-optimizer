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
import { toast } from 'react-hot-toast';
import { Power, Settings, Trash2, RefreshCw } from 'lucide-react';

interface DeviceControlsProps {
  device: Device;
  onRefresh?: () => void;
  onEdit?: () => void;
  isRefreshing?: boolean;
  className?: string;
}

/**
 * DeviceControls component for managing device actions and settings
 * @param device - The device to control
 * @param onRefresh - Optional callback for refreshing device data
 * @param onEdit - Optional callback for editing device settings
 * @param isRefreshing - Optional flag indicating if device is being refreshed
 * @param className - Optional additional CSS classes
 */
export function DeviceControls({ 
  device, 
  onRefresh, 
  onEdit,
  isRefreshing = false,
  className 
}: DeviceControlsProps) {
  const { updateDevice, deleteDevice, sendCommand } = useDevices();

  const handleToggleStatus = async () => {
    try {
      const newStatus = device.status === 'online' ? 'offline' : 'online';
      await updateDevice(device.id, { status: newStatus });
      toast.success(`Device ${newStatus === 'online' ? 'enabled' : 'disabled'} successfully`);
    } catch (error) {
      toast.error('Failed to update device status');
      console.error('Toggle status error:', error);
    }
  };

  const handleTogglePower = async () => {
    try {
      await sendCommand(device.id, { command: 'toggle_power' });
      toast.success('Power command sent successfully');
      onRefresh?.();
    } catch (error) {
      toast.error('Failed to send power command');
      console.error('Toggle power error:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this device? This action cannot be undone.')) {
      try {
        await deleteDevice(device.id);
        toast.success('Device deleted successfully');
      } catch (error) {
        toast.error('Failed to delete device');
        console.error('Delete error:', error);
      }
    }
  };

  return (
    <Card className={className}>
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
            <div className="text-sm text-muted-foreground">
              {device.status === 'online' ? 'Device is online' : 'Device is offline'}
            </div>
          </div>
          <Switch
            checked={device.status === 'online'}
            onCheckedChange={handleToggleStatus}
            aria-label="Toggle device status"
          />
        </div>

        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={onEdit}
            disabled={isRefreshing}
          >
            <Settings className="w-4 h-4 mr-2" />
            Device Settings
          </Button>
          
          <Button
            variant="outline"
            className="w-full"
            onClick={handleTogglePower}
            disabled={isRefreshing}
          >
            <Power className="w-4 h-4 mr-2" />
            Toggle Power
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={onRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>

          <Button
            variant="destructive"
            className="w-full"
            onClick={handleDelete}
            disabled={isRefreshing}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Device
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 