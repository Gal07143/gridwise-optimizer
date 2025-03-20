
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from 'sonner';
import { EnergyDevice, DeviceType, DeviceStatus } from '@/types/energy';
import { updateDevice } from '@/services/devices/mutations';

interface DeviceDetailProps {
  device: {
    id: string;
    name: string;
    location: string;
    type: DeviceType;
    status: DeviceStatus;
    capacity: number;
    firmware?: string;
    description?: string;
  };
}

const DeviceDetailTab = ({ device }: DeviceDetailProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedDevice, setEditedDevice] = useState({
    name: device.name,
    location: device.location,
    type: device.type,
    status: device.status,
    capacity: device.capacity,
    firmware: device.firmware || '',
    description: device.description || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedDevice(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setEditedDevice(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const updates = {
        name: editedDevice.name,
        location: editedDevice.location,
        type: editedDevice.type as DeviceType,
        status: editedDevice.status as DeviceStatus,
        capacity: Number(editedDevice.capacity),
        firmware: editedDevice.firmware || null,
        description: editedDevice.description || null
      };
      
      // Call the update function from your service
      const result = await updateDevice(device.id, updates);
      
      if (result) {
        toast.success("Device updated successfully");
        setIsEditDialogOpen(false);
        // You might want to refresh your data or update the UI here
      } else {
        toast.error("Failed to update device");
      }
    } catch (error) {
      console.error("Error updating device:", error);
      toast.error("Failed to update device");
    }
  };

  const getStatusLabel = (status: DeviceStatus) => {
    switch (status) {
      case 'online': return 'Online';
      case 'offline': return 'Offline';
      case 'maintenance': return 'Maintenance';
      case 'error': return 'Error';
      case 'warning': return 'Warning';
      default: return status;
    }
  };

  const getTypeLabel = (type: DeviceType) => {
    switch (type) {
      case 'solar': return 'Solar Panel';
      case 'wind': return 'Wind Turbine';
      case 'battery': return 'Battery Storage';
      case 'grid': return 'Grid Connection';
      case 'load': return 'Load';
      case 'ev_charger': return 'EV Charger';
      case 'inverter': return 'Inverter';
      case 'meter': return 'Smart Meter';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between">
        <div>
          <h3 className="text-lg font-medium">Device Information</h3>
          <p className="text-sm text-muted-foreground">
            View and edit the device details
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => setIsEditDialogOpen(true)}
          className="mt-2 md:mt-0"
        >
          Edit Details
        </Button>
      </div>
      
      <Separator />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-muted-foreground">Device Name</h4>
          <p>{device.name}</p>
        </div>
        
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-muted-foreground">Location</h4>
          <p>{device.location || 'Not specified'}</p>
        </div>
        
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-muted-foreground">Type</h4>
          <p>{getTypeLabel(device.type)}</p>
        </div>
        
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
          <p>{getStatusLabel(device.status)}</p>
        </div>
        
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-muted-foreground">Capacity</h4>
          <p>{device.capacity} {device.type === 'battery' ? 'kWh' : 'kW'}</p>
        </div>
        
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-muted-foreground">Firmware</h4>
          <p>{device.firmware || 'Not specified'}</p>
        </div>
      </div>
      
      {device.description && (
        <>
          <Separator />
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
            <p className="text-sm">{device.description}</p>
          </div>
        </>
      )}
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Device</DialogTitle>
            <DialogDescription>
              Make changes to the device information here.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleFormSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={editedDevice.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">
                  Location
                </Label>
                <Input
                  id="location"
                  name="location"
                  value={editedDevice.location}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <Select
                  value={editedDevice.type}
                  onValueChange={(value) => handleSelectChange('type', value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solar">Solar Panel</SelectItem>
                    <SelectItem value="wind">Wind Turbine</SelectItem>
                    <SelectItem value="battery">Battery Storage</SelectItem>
                    <SelectItem value="grid">Grid Connection</SelectItem>
                    <SelectItem value="load">Load</SelectItem>
                    <SelectItem value="ev_charger">EV Charger</SelectItem>
                    <SelectItem value="inverter">Inverter</SelectItem>
                    <SelectItem value="meter">Smart Meter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select
                  value={editedDevice.status}
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="capacity" className="text-right">
                  Capacity
                </Label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  value={editedDevice.capacity}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="firmware" className="text-right">
                  Firmware
                </Label>
                <Input
                  id="firmware"
                  name="firmware"
                  value={editedDevice.firmware}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  name="description"
                  value={editedDevice.description}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeviceDetailTab;
