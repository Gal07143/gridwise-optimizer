import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Save } from 'lucide-react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import GlassPanel from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createDevice } from '@/services/deviceService';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DeviceType, DeviceStatus } from '@/types/energy';

const AddDevice = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [device, setDevice] = useState({
    name: '',
    location: '',
    type: 'solar' as DeviceType,
    status: 'online' as DeviceStatus,
    capacity: 0,
    firmware: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDevice(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setDevice(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!device.name || !device.location || !device.capacity) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      const newDevice = await createDevice(device);
      
      if (newDevice) {
        toast.success('Device created successfully');
        navigate(`/devices`);
      } else {
        toast.error('Failed to create device');
      }
    } catch (error) {
      console.error('Error creating device:', error);
      toast.error('An error occurred while creating the device');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-y-auto p-6 animate-fade-in">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center gap-1 mb-2"
                onClick={() => navigate('/devices')}
              >
                <ChevronLeft size={16} />
                <span>Back to Devices</span>
              </Button>
              <h1 className="text-2xl font-semibold">Add New Device</h1>
              <p className="text-muted-foreground">Add a new energy device to the system</p>
            </div>
            <Button 
              className="flex items-center gap-2"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              <Save size={16} />
              <span>{isSubmitting ? 'Saving...' : 'Save Device'}</span>
            </Button>
          </div>
          
          <GlassPanel className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Device Name *</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={device.name} 
                      onChange={handleInputChange}
                      placeholder="e.g., Rooftop Solar Array"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="type">Device Type *</Label>
                    <Select 
                      value={device.type} 
                      onValueChange={(value) => handleSelectChange('type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select device type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="solar">Solar</SelectItem>
                        <SelectItem value="wind">Wind</SelectItem>
                        <SelectItem value="battery">Battery</SelectItem>
                        <SelectItem value="grid">Grid</SelectItem>
                        <SelectItem value="load">Load</SelectItem>
                        <SelectItem value="ev_charger">EV Charger</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="capacity">Capacity (kW/kWh) *</Label>
                    <Input 
                      id="capacity" 
                      name="capacity" 
                      type="number"
                      value={device.capacity.toString()} 
                      onChange={handleInputChange}
                      placeholder="e.g., 50"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <Input 
                      id="location" 
                      name="location" 
                      value={device.location} 
                      onChange={handleInputChange}
                      placeholder="e.g., Main Building Rooftop"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={device.status} 
                      onValueChange={(value) => handleSelectChange('status', value)}
                    >
                      <SelectTrigger>
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
                  
                  <div>
                    <Label htmlFor="firmware">Firmware Version</Label>
                    <Input 
                      id="firmware" 
                      name="firmware" 
                      value={device.firmware} 
                      onChange={handleInputChange}
                      placeholder="e.g., v2.4.1"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Notes</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  rows={4}
                  placeholder="Additional information about this device..."
                />
              </div>
            </form>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
};

export default AddDevice;
