
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ChevronLeft,
  Save,
  Loader2,
  AlertTriangle,
  Check
} from 'lucide-react';
import { getDeviceById, updateDevice } from '@/services/devices';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { DeviceType, DeviceStatus, EnergyDevice } from '@/types/energy';

const EditDeviceContent = () => {
  const { deviceId } = useParams<{ deviceId: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<EnergyDevice>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const { data: device, isLoading, isError } = useQuery({
    queryKey: ['device', deviceId],
    queryFn: () => getDeviceById(deviceId as string),
    enabled: !!deviceId,
    onSuccess: (data) => {
      if (data) {
        setFormData({
          name: data.name,
          type: data.type,
          status: data.status,
          location: data.location || '',
          capacity: data.capacity,
          firmware: data.firmware || '',
          description: data.description || '',
        });
      }
    }
  });

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name?.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.type) {
      errors.type = 'Type is required';
    }
    
    if (!formData.status) {
      errors.status = 'Status is required';
    }
    
    if (formData.capacity === undefined || formData.capacity <= 0) {
      errors.capacity = 'Capacity must be greater than 0';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'capacity' ? parseFloat(value) : value,
    }));
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the validation errors');
      return;
    }
    
    if (!deviceId) {
      toast.error('Device ID is missing');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const updatedDevice = await updateDevice(deviceId, formData);
      
      if (updatedDevice) {
        toast.success('Device updated successfully', {
          action: {
            label: 'View',
            onClick: () => navigate(`/device-view/${deviceId}`),
          },
        });
        navigate(`/device-view/${deviceId}`);
      } else {
        toast.error('Failed to update device');
      }
    } catch (error) {
      console.error('Error updating device:', error);
      toast.error('An error occurred while updating the device');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">Loading device data...</p>
        </div>
      </div>
    );
  }

  if (isError || !device) {
    return (
      <div className="flex-1 p-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link to="/devices">
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold">Device Not Found</h1>
        </div>
        
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            The device you are trying to edit could not be found or you don't have permission to edit it.
          </AlertDescription>
        </Alert>
        
        <Button asChild>
          <Link to="/devices">Back to Devices</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 animate-in fade-in duration-500">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link to={`/device-view/${deviceId}`}>
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold">Edit Device</h1>
      </div>
      
      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Edit the basic device details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <FormLabel htmlFor="name">Name</FormLabel>
                <Input
                  id="name"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  placeholder="Enter device name"
                  className={validationErrors.name ? 'border-red-500' : ''}
                />
                {validationErrors.name && (
                  <p className="text-sm text-red-500">{validationErrors.name}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <FormLabel htmlFor="location">Location</FormLabel>
                <Input
                  id="location"
                  name="location"
                  value={formData.location || ''}
                  onChange={handleInputChange}
                  placeholder="Enter device location"
                />
              </div>
              
              <div className="space-y-2">
                <FormLabel htmlFor="type">Type</FormLabel>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleSelectChange('type', value)}
                >
                  <SelectTrigger id="type" className={validationErrors.type ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select device type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solar">Solar</SelectItem>
                    <SelectItem value="wind">Wind</SelectItem>
                    <SelectItem value="battery">Battery</SelectItem>
                    <SelectItem value="grid">Grid</SelectItem>
                    <SelectItem value="load">Load</SelectItem>
                    <SelectItem value="ev_charger">EV Charger</SelectItem>
                    <SelectItem value="inverter">Inverter</SelectItem>
                    <SelectItem value="meter">Meter</SelectItem>
                  </SelectContent>
                </Select>
                {validationErrors.type && (
                  <p className="text-sm text-red-500">{validationErrors.type}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <FormLabel htmlFor="status">Status</FormLabel>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger id="status" className={validationErrors.status ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select device status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                  </SelectContent>
                </Select>
                {validationErrors.status && (
                  <p className="text-sm text-red-500">{validationErrors.status}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <FormLabel htmlFor="capacity">Capacity ({device.type === 'battery' ? 'kWh' : 'kW'})</FormLabel>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  step="0.01"
                  value={formData.capacity || ''}
                  onChange={handleInputChange}
                  placeholder="Enter device capacity"
                  className={validationErrors.capacity ? 'border-red-500' : ''}
                />
                {validationErrors.capacity && (
                  <p className="text-sm text-red-500">{validationErrors.capacity}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <FormLabel htmlFor="firmware">Firmware Version</FormLabel>
                <Input
                  id="firmware"
                  name="firmware"
                  value={formData.firmware || ''}
                  onChange={handleInputChange}
                  placeholder="Enter firmware version"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <FormLabel htmlFor="description">Description</FormLabel>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleInputChange}
                placeholder="Enter device description"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(`/device-view/${deviceId}`)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditDeviceContent;
