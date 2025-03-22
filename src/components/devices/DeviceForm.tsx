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
import { DatePicker } from '@/components/ui/datepicker'; // 👈 Add this component if not already

interface DeviceFormProps {
  device: {
    name: string;
    location?: string;
    type: DeviceType;
    status: DeviceStatus;
    capacity: number;
    firmware?: string;
    description?: string;
    site_id?: string;
    installation_date?: string;
    lat?: number;
    lng?: number;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (field: string, value: string) => void;
  handleDateChange?: (field: string, date: Date | null) => void;
  validationErrors: Record<string, any>;
  isLoading?: boolean;
}

const DeviceForm: React.FC<DeviceFormProps> = ({
  device,
  handleInputChange,
  handleSelectChange,
  handleDateChange,
  validationErrors,
  isLoading
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Device Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="space-y-2">
            <FormLabel htmlFor="name">Name <span className="text-red-500">*</span></FormLabel>
            <Input
              id="name"
              name="name"
              value={device.name}
              onChange={handleInputChange}
              placeholder="Enter device name"
              className={validationErrors.name ? 'border-red-500' : ''}
              disabled={isLoading}
            />
            {validationErrors.name && (
              <p className="text-sm text-red-500">{validationErrors.name.message}</p>
            )}
          </div>

          {/* Type */}
          <div className="space-y-2">
            <FormLabel htmlFor="type">Type <span className="text-red-500">*</span></FormLabel>
            <Select
              value={device.type}
              onValueChange={(value) => handleSelectChange('type', value)}
              disabled={isLoading}
            >
              <SelectTrigger id="type" className={validationErrors.type ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select device type" />
              </SelectTrigger>
              <SelectContent>
                {['solar', 'wind', 'battery', 'grid', 'load', 'ev_charger', 'inverter', 'meter', 'light', 'generator', 'hydro'].map((type) => (
                  <SelectItem key={type} value={type}>{type.replace('_', ' ')}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <FormLabel htmlFor="status">Status <span className="text-red-500">*</span></FormLabel>
            <Select
              value={device.status}
              onValueChange={(value) => handleSelectChange('status', value)}
              disabled={isLoading}
            >
              <SelectTrigger id="status" className={validationErrors.status ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select device status" />
              </SelectTrigger>
              <SelectContent>
                {['online', 'offline', 'maintenance', 'error', 'warning', 'idle', 'active', 'charging', 'discharging'].map((status) => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Capacity */}
          <div className="space-y-2">
            <FormLabel htmlFor="capacity">
              Capacity {device.type === 'battery' ? '(kWh)' : '(kW)'} <span className="text-red-500">*</span>
            </FormLabel>
            <Input
              id="capacity"
              name="capacity"
              type="number"
              step="0.01"
              value={device.capacity}
              onChange={handleInputChange}
              placeholder="Enter capacity"
              className={validationErrors.capacity ? 'border-red-500' : ''}
              disabled={isLoading}
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <FormLabel htmlFor="location">Location</FormLabel>
            <Input
              id="location"
              name="location"
              value={device.location || ''}
              onChange={handleInputChange}
              placeholder="Physical location"
              disabled={isLoading}
            />
          </div>

          {/* Firmware */}
          <div className="space-y-2">
            <FormLabel htmlFor="firmware">Firmware</FormLabel>
            <Input
              id="firmware"
              name="firmware"
              value={device.firmware || ''}
              onChange={handleInputChange}
              placeholder="Firmware version"
              disabled={isLoading}
            />
          </div>

          {/* Site ID */}
          <div className="space-y-2">
            <FormLabel htmlFor="site_id">Site ID</FormLabel>
            <Input
              id="site_id"
              name="site_id"
              value={device.site_id || ''}
              onChange={handleInputChange}
              placeholder="Optional site ID"
              disabled={isLoading}
            />
          </div>

          {/* Installation Date */}
          <div className="space-y-2">
            <FormLabel htmlFor="installation_date">Installation Date</FormLabel>
            <Input
              id="installation_date"
              name="installation_date"
              type="date"
              value={device.installation_date || ''}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>

          {/* Latitude */}
          <div className="space-y-2">
            <FormLabel htmlFor="lat">Latitude</FormLabel>
            <Input
              id="lat"
              name="lat"
              type="number"
              step="0.00001"
              value={device.lat ?? ''}
              onChange={handleInputChange}
              placeholder="e.g. 32.12345"
              disabled={isLoading}
            />
          </div>

          {/* Longitude */}
          <div className="space-y-2">
            <FormLabel htmlFor="lng">Longitude</FormLabel>
            <Input
              id="lng"
              name="lng"
              type="number"
              step="0.00001"
              value={device.lng ?? ''}
              onChange={handleInputChange}
              placeholder="e.g. 34.98765"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <FormLabel htmlFor="description">Description</FormLabel>
          <Textarea
            id="description"
            name="description"
            value={device.description || ''}
            onChange={handleInputChange}
            placeholder="Describe this device"
            rows={4}
            disabled={isLoading}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceForm;
