
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDevices } from '@/hooks/useDevices';
import { toast } from 'sonner';

interface AddDeviceDialogProps {
  children: React.ReactNode;
  onSave?: () => void;
}

export const AddDeviceDialog: React.FC<AddDeviceDialogProps> = ({ 
  children,
  onSave,
}) => {
  const [open, setOpen] = useState(false);
  const [deviceName, setDeviceName] = useState('');
  const [deviceType, setDeviceType] = useState('smart_meter');
  const [deviceCapacity, setDeviceCapacity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { createDevice } = useDevices();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!deviceName || !deviceType) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      await createDevice({
        name: deviceName,
        type: deviceType,
        capacity: deviceCapacity ? parseFloat(deviceCapacity) : 0,
        status: 'online',
      });
      
      toast.success('Device added successfully!');
      setOpen(false);
      setDeviceName('');
      setDeviceType('smart_meter');
      setDeviceCapacity('');
      
      if (onSave) onSave();
    } catch (error) {
      console.error('Error adding device:', error);
      toast.error('Failed to add device');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div onClick={() => setOpen(true)}>
        {children}
      </div>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Device</DialogTitle>
          <DialogDescription>
            Fill in the details for the new energy device.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-1">
            <Label
              className="text-sm font-medium leading-none"
              htmlFor="device-name"
            >
              Device Name
            </Label>
            <Input
              id="device-name"
              placeholder="Enter device name"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
            />
          </div>
          
          <div className="space-y-1">
            <Label 
              className="text-sm font-medium leading-none"
              htmlFor="device-type"
            >
              Device Type
            </Label>
            <Select
              value={deviceType}
              onValueChange={setDeviceType}
            >
              <SelectTrigger
                className="w-full"
                id="device-type"
              >
                <SelectValue placeholder="Select device type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="smart_meter">Smart Meter</SelectItem>
                <SelectItem value="solar_inverter">Solar Inverter</SelectItem>
                <SelectItem value="battery">Battery Storage</SelectItem>
                <SelectItem value="ev_charger">EV Charger</SelectItem>
                <SelectItem value="hvac">HVAC System</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1">
            <Label
              className="text-sm font-medium leading-none"
              htmlFor="device-capacity"
            >
              Capacity (kW/kWh)
            </Label>
            <Input
              id="device-capacity"
              type="number"
              placeholder="Enter device capacity"
              value={deviceCapacity}
              onChange={(e) => setDeviceCapacity(e.target.value)}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Device'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
