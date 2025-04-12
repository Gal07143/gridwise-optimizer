import React from 'react';
import { Device } from '@/contexts/DeviceContext';
import { cn } from '@/lib/utils';

interface DeviceListProps {
  devices: Device[];
  selectedDevice: Device | null;
  onSelectDevice: (device: Device) => void;
}

export function DeviceList({ devices, selectedDevice, onSelectDevice }: DeviceListProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="p-4 bg-muted">
        <h2 className="font-semibold">Devices</h2>
      </div>
      <div className="divide-y">
        {devices.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No devices found
          </div>
        ) : (
          devices.map((device) => (
            <button
              key={device.id}
              onClick={() => onSelectDevice(device)}
              className={cn(
                'w-full p-4 text-left hover:bg-muted transition-colors',
                selectedDevice?.id === device.id && 'bg-muted'
              )}
            >
              <div className="font-medium">{device.name}</div>
              <div className="text-sm text-gray-500">{device.type}</div>
              <div className="flex items-center mt-1">
                <div
                  className={cn(
                    'w-2 h-2 rounded-full mr-2',
                    device.status === 'online'
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  )}
                />
                <span className="text-xs text-gray-500">
                  {device.status}
                </span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
} 