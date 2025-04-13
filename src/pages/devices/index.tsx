import React, { useEffect } from 'react';
import { useDevices } from '@/contexts/DeviceContext';
import { DeviceList } from '@/components/devices/DeviceList';
import { DeviceDetails } from '@/components/devices/DeviceDetails';
import { DeviceControls } from '@/components/devices/DeviceControls';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AddDeviceDialog } from '@/components/devices/AddDeviceDialog';

function DevicesPage() {
  const {
    devices,
    loading,
    error,
    selectedDevice,
    fetchDevices,
    selectDevice,
    fetchDeviceTelemetry,
  } = useDevices();

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  useEffect(() => {
    if (selectedDevice) {
      fetchDeviceTelemetry(selectedDevice.id);
    }
  }, [selectedDevice, fetchDeviceTelemetry]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Device Management</h1>
        <AddDeviceDialog>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Device
          </Button>
        </AddDeviceDialog>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-3">
          <DeviceList
            devices={devices}
            selectedDevice={selectedDevice}
            onSelectDevice={selectDevice}
          />
        </div>

        <div className="col-span-9">
          {selectedDevice ? (
            <div className="space-y-4">
              <DeviceDetails device={selectedDevice} />
              <DeviceControls device={selectedDevice} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 border rounded-lg">
              <p className="text-gray-500">Select a device to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Make sure to export the component as both default and named export
export { DevicesPage };
export default DevicesPage; 