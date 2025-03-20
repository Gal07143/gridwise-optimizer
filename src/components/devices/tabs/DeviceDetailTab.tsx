import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, Check, Edit, Loader2, X } from 'lucide-react';
import { DeviceType, DeviceStatus, EnergyDevice } from '@/types/energy';
import { Button } from '@/components/ui/button';
import { updateDevice } from '@/services/devices/mutations';
import { toast } from 'sonner';

interface DeviceDetailTabProps {
  device: {
    id: string;
    name: string;
    location: string;
    type: DeviceType;
    status: DeviceStatus;
    capacity: number;
    firmware: string;
    description: string;
  };
}

const DeviceDetailTab = ({ device }: DeviceDetailTabProps) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editableDevice, setEditableDevice] = useState({
    name: device.name,
    location: device.location,
    type: device.type,
    status: device.status,
    capacity: device.capacity,
    firmware: device.firmware || '',
    description: device.description || '',
  });
  
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'capacity') {
      setEditableDevice(prev => ({ ...prev, [name]: value === '' ? 0 : Number(value) }));
    } else {
      setEditableDevice(prev => ({ ...prev, [name]: value }));
    }
    
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleSelectChange = (field: string, value: string) => {
    setEditableDevice(prev => ({ ...prev, [field]: value }));
    
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };
  
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!editableDevice.name.trim()) {
      errors.name = "Device name is required";
    }
    
    if (!editableDevice.location.trim()) {
      errors.location = "Location is required";
    }
    
    if (editableDevice.capacity <= 0) {
      errors.capacity = "Capacity must be greater than zero";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const updatedDevice = await updateDevice(device.id, editableDevice);
      
      if (updatedDevice) {
        toast.success('Device updated successfully');
        setIsEditing(false);
        
        queryClient.invalidateQueries({ queryKey: ['device', device.id] });
        queryClient.invalidateQueries({ queryKey: ['devices'] });
      } else {
        toast.error('Failed to update device');
      }
    } catch (error: any) {
      console.error('Error updating device:', error);
      toast.error(`An error occurred: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    setEditableDevice({
      name: device.name,
      location: device.location,
      type: device.type,
      status: device.status,
      capacity: device.capacity,
      firmware: device.firmware || '',
      description: device.description || '',
    });
    setValidationErrors({});
    setIsEditing(false);
  };
  
  if (!isEditing) {
    return (
      <div>
        <div className="flex justify-between mb-4">
          <h3 className="text-lg font-medium">Device Details</h3>
          <Button onClick={() => setIsEditing(true)}>Edit Details</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Name</div>
              <div className="text-base">{device.name}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Type</div>
              <div className="text-base capitalize">{device.type}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Capacity</div>
              <div className="text-base">{device.capacity} {device.type === 'battery' ? 'kWh' : 'kW'}</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Location</div>
              <div className="text-base">{device.location}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Status</div>
              <div className="text-base capitalize">{device.status}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Firmware</div>
              <div className="text-base">{device.firmware || 'Not specified'}</div>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="text-sm font-medium text-muted-foreground">Description</div>
          <div className="text-base">{device.description || 'No description provided.'}</div>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between mb-4">
        <h3 className="text-lg font-medium">Edit Device</h3>
        <div className="space-x-2">
          <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
      
      <DeviceForm 
        device={editableDevice}
        handleInputChange={handleInputChange}
        handleSelectChange={handleSelectChange}
        validationErrors={validationErrors}
      />
    </div>
  );
};

export default DeviceDetailTab;
