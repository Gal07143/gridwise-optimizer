
import React from 'react';
import { DeviceType, DeviceStatus } from '@/types/energy';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormLabel } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
  validationErrors: Record<string, string>;
}

const DeviceForm: React.FC<DeviceFormProps> = ({
  device,
  handleInputChange,
  handleSelectChange,
  validationErrors,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Device Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <FormLabel htmlFor="name">Name <span className="text-red-500">*</span></FormLabel>
            <Input
              id="name"
              name="name"
              value={device.name}
              onChange={handleInputChange}
              placeholder="Enter device name"
              className={validationErrors.name ? 'border-red-500' : ''}
            />
            {validationErrors.name && (
              <p className="text-sm text-red-500">{validationErrors.name}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <FormLabel htmlFor="location">Location <span className="text-red-500">*</span></FormLabel>
            <Input
              id="location"
              name="location"
              value={device.location}
              onChange={handleInputChange}
              placeholder="Enter device location"
              className={validationErrors.location ? 'border-red-500' : ''}
            />
            {validationErrors.location && (
              <p className="text-sm text-red-500">{validationErrors.location}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <FormLabel htmlFor="type">Type <span className="text-red-500">*</span></FormLabel>
            <Select
              value={device.type}
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
                <SelectItem value="light">Light/Illumination</SelectItem>
              </SelectContent>
            </Select>
            {validationErrors.type && (
              <p className="text-sm text-red-500">{validationErrors.type}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <FormLabel htmlFor="status">Status <span className="text-red-500">*</span></FormLabel>
            <Select
              value={device.status}
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
            <FormLabel htmlFor="capacity">
              Capacity {device.type === 'battery' ? '(kWh)' : '(kW)'} <span className="text-red-500">*</span>
            </FormLabel>
            <Input
              id="capacity"
              name="capacity"
              type="number"
              step="0.01"
              value={device.capacity || ''}
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
              value={device.firmware || ''}
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
            value={device.description || ''}
            onChange={handleInputChange}
            placeholder="Enter device description"
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceForm;
