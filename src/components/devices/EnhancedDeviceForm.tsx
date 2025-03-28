
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { toast } from 'sonner';
import { getDeviceById, updateDevice, createDevice } from '@/services/deviceService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Simple schema for device validation
const deviceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  status: z.string(),
  location: z.string().optional(),
  capacity: z.number().optional(),
  firmware: z.string().optional(),
  installation_date: z.string().optional(),
});

type DeviceFormValues = z.infer<typeof deviceSchema>;

const EnhancedDeviceForm = () => {
  const { deviceId } = useParams<{ deviceId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const isEditMode = !!deviceId;
  
  const { data: device, isLoading: isLoadingDevice } = useQuery({
    queryKey: ['device', deviceId],
    queryFn: () => getDeviceById(deviceId!),
    enabled: isEditMode,
    meta: {
      onError: (error: Error) => {
        toast.error('Failed to load device details');
        console.error(error);
      }
    }
  });

  const [formData, setFormData] = useState<DeviceFormValues>({
    name: '',
    type: '',
    status: 'offline',
    location: '',
    capacity: 0,
    firmware: '',
    installation_date: new Date().toISOString().slice(0, 10),
  });

  // On device data loaded in edit mode
  React.useEffect(() => {
    if (isEditMode && device) {
      setFormData({
        name: device.name || '',
        type: device.type || '',
        status: device.status || 'offline',
        location: device.location || '',
        capacity: device.capacity || 0,
        firmware: device.firmware || '',
        installation_date: device.installation_date || new Date().toISOString().slice(0, 10),
      });
    }
  }, [isEditMode, device]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    // Handle number inputs
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isEditMode && deviceId) {
        // Update existing device
        await updateDevice(deviceId, formData);
        toast.success('Device updated successfully');
      } else {
        // Create new device
        await createDevice(formData);
        toast.success('Device created successfully');
      }
      
      // Navigate back to devices list
      navigate('/devices');
    } catch (error) {
      toast.error('Failed to save device');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  if (isEditMode && isLoadingDevice) {
    return <div>Loading device details...</div>;
  }
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditMode ? 'Edit Device' : 'Add New Device'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Device Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter device name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Device Type</Label>
                <Input
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  placeholder="Enter device type"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter device location"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  placeholder="Enter capacity"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="firmware">Firmware Version</Label>
                <Input
                  id="firmware"
                  name="firmware"
                  value={formData.firmware}
                  onChange={handleInputChange}
                  placeholder="Enter firmware version"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="installation_date">Installation Date</Label>
                <Input
                  id="installation_date"
                  name="installation_date"
                  type="date"
                  value={formData.installation_date}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/devices')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? 'Saving...' : isEditMode ? 'Update Device' : 'Add Device'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EnhancedDeviceForm;
