
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DeviceType, DeviceStatus } from '@/types/energy';

interface DeviceFormProps {
  device: {
    name: string;
    location: string;
    type: DeviceType;
    status: DeviceStatus;
    capacity: number;
    firmware: string;
    description: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (field: string, value: string) => void;
}

const DeviceForm: React.FC<DeviceFormProps> = ({
  device,
  handleInputChange,
  handleSelectChange
}) => {
  return (
    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
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
              required
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
              value={device.capacity === 0 ? '' : device.capacity.toString()} 
              onChange={handleInputChange}
              placeholder="e.g., 50"
              required
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
              required
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
          value={device.description}
          onChange={handleInputChange}
          placeholder="Additional information about this device..."
        />
      </div>
    </form>
  );
};

export default DeviceForm;
