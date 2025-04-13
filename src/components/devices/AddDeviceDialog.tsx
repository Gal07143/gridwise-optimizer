
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useDeviceForm from '@/hooks/useDeviceForm';
import { toast } from 'sonner';

interface AddDeviceDialogProps {
  children: React.ReactNode;
}

export function AddDeviceDialog({ children }: AddDeviceDialogProps) {
  const [open, setOpen] = useState(false);
  const {
    device: formValues,
    handleInputChange,
    handleSelectChange,
    handleSubmit,
    isSaving,
    validationErrors,
    clearValidationError,
  } = useDeviceForm();
  
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await handleSubmit();
    
    if (result) {
      setOpen(false);
      toast.success('Device added successfully');
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Device</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formValues.name}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Device name"
                required
                onFocus={() => clearValidationError('name')}
              />
              {validationErrors.name && (
                <p className="col-span-3 col-start-2 text-sm text-red-500">
                  {validationErrors.name}
                </p>
              )}
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Location
              </Label>
              <Input
                id="location"
                name="location"
                value={formValues.location}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Device location"
                required
                onFocus={() => clearValidationError('location')}
              />
              {validationErrors.location && (
                <p className="col-span-3 col-start-2 text-sm text-red-500">
                  {validationErrors.location}
                </p>
              )}
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select 
                name="type" 
                value={formValues.type} 
                onValueChange={(value) => handleSelectChange('type', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select device type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inverter">Inverter</SelectItem>
                  <SelectItem value="battery">Battery</SelectItem>
                  <SelectItem value="solar">Solar Panel</SelectItem>
                  <SelectItem value="meter">Smart Meter</SelectItem>
                  <SelectItem value="ev_charger">EV Charger</SelectItem>
                  <SelectItem value="controller">Controller</SelectItem>
                  <SelectItem value="sensor">Sensor</SelectItem>
                </SelectContent>
              </Select>
              {validationErrors.type && (
                <p className="col-span-3 col-start-2 text-sm text-red-500">
                  {validationErrors.type}
                </p>
              )}
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select 
                name="status" 
                value={formValues.status} 
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select device status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
              {validationErrors.status && (
                <p className="col-span-3 col-start-2 text-sm text-red-500">
                  {validationErrors.status}
                </p>
              )}
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="capacity" className="text-right">
                Capacity (kW)
              </Label>
              <Input
                id="capacity"
                name="capacity"
                type="number"
                value={formValues.capacity || ''}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Device capacity"
                onFocus={() => clearValidationError('capacity')}
              />
              {validationErrors.capacity && (
                <p className="col-span-3 col-start-2 text-sm text-red-500">
                  {validationErrors.capacity}
                </p>
              )}
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firmware" className="text-right">
                Firmware
              </Label>
              <Input
                id="firmware"
                name="firmware"
                value={formValues.firmware || ''}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Firmware version"
                onFocus={() => clearValidationError('firmware')}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                name="description"
                value={formValues.description || ''}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Device description (optional)"
                onFocus={() => clearValidationError('description')}
              />
            </div>

          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Adding...' : 'Add Device'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
