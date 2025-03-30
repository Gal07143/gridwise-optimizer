
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Package, CheckCircle } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { toast } from 'sonner';
import AppLayout from '@/components/layout/AppLayout';
import { getDeviceModelById } from '@/services/deviceCatalogService';
import { createDevice } from '@/services/deviceService';
import { DeviceType, DeviceStatus } from '@/types/energy';

interface DeviceFormData {
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  location: string;
  capacity: number;
  firmware: string;
  site_id: string;
  model_reference: string;
  manufacturer: string;
  model_number: string;
  protocol: string;
  description: string;
}

const AddDevice = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const modelId = searchParams.get('modelId');
  
  const [formData, setFormData] = useState<DeviceFormData>({
    name: '',
    type: 'battery',
    status: 'offline',
    location: '',
    capacity: 0,
    firmware: '',
    site_id: '',
    model_reference: modelId || '',
    manufacturer: '',
    model_number: '',
    protocol: '',
    description: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch device model details if modelId is provided
  const { 
    data: deviceModel, 
    isLoading: isLoadingModel 
  } = useQuery({
    queryKey: ['deviceModel', modelId],
    queryFn: () => modelId ? getDeviceModelById(modelId) : Promise.resolve(null),
    enabled: !!modelId
  });
  
  // Update form data when device model is loaded
  useEffect(() => {
    if (deviceModel) {
      setFormData(prev => ({
        ...prev,
        name: deviceModel.name || `${deviceModel.manufacturer} ${deviceModel.model_name}`,
        type: deviceModel.device_type as DeviceType,
        capacity: deviceModel.capacity || 0,
        manufacturer: deviceModel.manufacturer,
        model_number: deviceModel.model_number,
        protocol: deviceModel.protocol || '',
        description: deviceModel.description || ''
      }));
    }
  }, [deviceModel]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const deviceData = {
        name: formData.name,
        type: formData.type,
        status: formData.status,
        location: formData.location,
        capacity: formData.capacity,
        firmware: formData.firmware,
        site_id: formData.site_id || undefined,
        description: formData.description,
        model: formData.model_number,
        manufacturer: formData.manufacturer,
        protocol: formData.protocol
      };
      
      const result = await createDevice(deviceData);
      
      if (result) {
        toast.success('Device added successfully');
        navigate('/devices');
      } else {
        throw new Error('Failed to create device');
      }
    } catch (error: any) {
      toast.error(`Error adding device: ${error.message}`);
      console.error('Error adding device:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <AppLayout>
      <div className="container mx-auto p-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-4 pl-0 hover:pl-2 transition-all"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Add New Device</h1>
          <p className="text-muted-foreground">
            {deviceModel 
              ? `Add a ${deviceModel.manufacturer} ${deviceModel.model_name} to your system` 
              : 'Add a device to your system'}
          </p>
        </div>
        
        {deviceModel && (
          <Card className="mb-6 bg-muted/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <Package className="h-4 w-4 mr-2" />
                Selected Model
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{deviceModel.manufacturer} {deviceModel.model_name}</p>
                  <p className="text-muted-foreground text-sm">{deviceModel.model_number}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate('/devices/catalog')}>
                  Change
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Device Information</CardTitle>
              <CardDescription>
                Enter the details about your device
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleSelectChange('type', value)}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select device type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="battery">Battery</SelectItem>
                      <SelectItem value="solar">Solar</SelectItem>
                      <SelectItem value="inverter">Inverter</SelectItem>
                      <SelectItem value="meter">Meter</SelectItem>
                      <SelectItem value="ev_charger">EV Charger</SelectItem>
                      <SelectItem value="wind">Wind Turbine</SelectItem>
                      <SelectItem value="grid">Grid Connection</SelectItem>
                      <SelectItem value="load">Load</SelectItem>
                      <SelectItem value="generator">Generator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="E.g. Basement, Roof"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleSelectChange('status', value as DeviceStatus)}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity (kW/kWh)</Label>
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
                    placeholder="E.g. v1.2.3"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="manufacturer">Manufacturer</Label>
                  <Input
                    id="manufacturer"
                    name="manufacturer"
                    value={formData.manufacturer}
                    onChange={handleInputChange}
                    placeholder="E.g. Tesla, SMA"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="model_number">Model Number</Label>
                  <Input
                    id="model_number"
                    name="model_number"
                    value={formData.model_number}
                    onChange={handleInputChange}
                    placeholder="E.g. PW2.0"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="protocol">Communication Protocol</Label>
                  <Input
                    id="protocol"
                    name="protocol"
                    value={formData.protocol}
                    onChange={handleInputChange}
                    placeholder="E.g. Modbus, MQTT"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="site_id">Site ID</Label>
                  <Input
                    id="site_id"
                    name="site_id"
                    value={formData.site_id}
                    onChange={handleInputChange}
                    placeholder="Leave blank for default site"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Additional details about this device"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/devices')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Adding...' : 'Add Device'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AddDevice;
