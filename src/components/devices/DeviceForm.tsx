import React, { useEffect, useState } from 'react';
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
import { deviceCatalog } from '@/data/deviceCatalog';

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
    metrics?: Record<string, number> | null;
    vendor?: string;
    model?: string;
    parameters?: string; // parameters will be stored as a JSON string
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (field: string, value: string) => void;
  validationErrors: Record<string, any>;
  isLoading?: boolean;
}

const DeviceForm: React.FC<DeviceFormProps> = ({
  device,
  handleInputChange,
  handleSelectChange,
  validationErrors,
  isLoading,
}) => {
  const [availableVendors, setAvailableVendors] = useState<string[]>([]);
  const [availableModels, setAvailableModels] = useState<any[]>([]);

  // Update available vendors when type changes
  useEffect(() => {
    if (device.type && deviceCatalog.hasOwnProperty(device.type)) {
      const vendors = Object.keys(deviceCatalog[device.type].vendors);
      setAvailableVendors(vendors);
    } else {
      setAvailableVendors([]);
    }
    // Clear vendor and model if type changes
    handleSelectChange('vendor', '');
    handleSelectChange('model', '');
  }, [device.type]);

  // Update available models when vendor changes
  useEffect(() => {
    if (device.type && device.vendor && deviceCatalog.hasOwnProperty(device.type)) {
      const models = deviceCatalog[device.type].vendors[device.vendor] || [];
      setAvailableModels(models);
    } else {
      setAvailableModels([]);
    }
    // Clear model if vendor changes
    handleSelectChange('model', '');
  }, [device.vendor, device.type]);

  // Auto-populate parameters when model is selected
  useEffect(() => {
    if (device.type && device.vendor && device.model && deviceCatalog.hasOwnProperty(device.type)) {
      const models = deviceCatalog[device.type].vendors[device.vendor] || [];
      const selectedModel = models.find((m: any) => m.model === device.model);
      if (selectedModel) {
        handleSelectChange('parameters', JSON.stringify(selectedModel.parameters));
      }
    }
  }, [device.model, device.vendor, device.type]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Device Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="space-y-2">
            <FormLabel htmlFor="name">
              Name <span className="text-red-500">*</span>
            </FormLabel>
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

          {/* Location */}
          <div className="space-y-2">
            <FormLabel htmlFor="location">Location</FormLabel>
            <Input
              id="location"
              name="location"
              value={device.location || ''}
              onChange={handleInputChange}
              placeholder="Enter location"
              className={validationErrors.location ? 'border-red-500' : ''}
              disabled={isLoading}
            />
          </div>

          {/* Type */}
          <div className="space-y-2">
            <FormLabel htmlFor="type">
              Type <span className="text-red-500">*</span>
            </FormLabel>
            <Select
              value={device.type}
              onValueChange={(value) => handleSelectChange('type', value)}
              disabled={isLoading}
            >
              <SelectTrigger id="type" className={validationErrors.type ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select device type" />
              </SelectTrigger>
              <SelectContent>
                {[
                  'solar',
                  'wind',
                  'battery',
                  'grid',
                  'load',
                  'ev_charger',
                  'inverter',
                  'meter',
                  'light',
                  'generator',
                  'hydro',
                ].map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {validationErrors.type && (
              <p className="text-sm text-red-500">{validationErrors.type.message}</p>
            )}
          </div>

          {/* Vendor (conditionally display if catalog available for type) */}
          {device.type && deviceCatalog.hasOwnProperty(device.type) && (
            <div className="space-y-2">
              <FormLabel htmlFor="vendor">
                Vendor <span className="text-red-500">*</span>
              </FormLabel>
              <Select
                value={device.vendor || ''}
                onValueChange={(value) => handleSelectChange('vendor', value)}
                disabled={isLoading}
              >
                <SelectTrigger id="vendor" className={validationErrors.vendor ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select vendor" />
                </SelectTrigger>
                <SelectContent>
                  {availableVendors.map((ven) => (
                    <SelectItem key={ven} value={ven}>
                      {ven}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {validationErrors.vendor && (
                <p className="text-sm text-red-500">{validationErrors.vendor.message}</p>
              )}
            </div>
          )}

          {/* Model (conditionally display if vendor is selected) */}
          {device.vendor && (
            <div className="space-y-2">
              <FormLabel htmlFor="model">
                Model <span className="text-red-500">*</span>
              </FormLabel>
              <Select
                value={device.model || ''}
                onValueChange={(value) => handleSelectChange('model', value)}
                disabled={isLoading}
              >
                <SelectTrigger id="model" className={validationErrors.model ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {availableModels.map((m: any) => (
                    <SelectItem key={m.model} value={m.model}>
                      {m.model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {validationErrors.model && (
                <p className="text-sm text-red-500">{validationErrors.model.message}</p>
              )}
            </div>
          )}

          {/* Status */}
          <div className="space-y-2">
            <FormLabel htmlFor="status">
              Status <span className="text-red-500">*</span>
            </FormLabel>
            <Select
              value={device.status}
              onValueChange={(value) => handleSelectChange('status', value)}
              disabled={isLoading}
            >
              <SelectTrigger id="status" className={validationErrors.status ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {[
                  'online',
                  'offline',
                  'maintenance',
                  'error',
                  'warning',
                  'idle',
                  'active',
                  'charging',
                  'discharging',
                ].map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {validationErrors.status && (
              <p className="text-sm text-red-500">{validationErrors.status.message}</p>
            )}
          </div>

          {/* Capacity */}
          <div className="space-y-2">
            <FormLabel htmlFor="capacity">
              Capacity {device.type === 'battery' ? '(kWh)' : '(kW)'}
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
            {validationErrors.capacity && (
              <p className="text-sm text-red-500">{validationErrors.capacity.message}</p>
            )}
          </div>

          {/* Firmware */}
          <div className="space-y-2">
            <FormLabel htmlFor="firmware">Firmware</FormLabel>
            <Input
              id="firmware"
              name="firmware"
              value={device.firmware || ''}
              onChange={handleInputChange}
              placeholder="Enter firmware version"
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
              placeholder="Enter site ID"
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
              step="0.0001"
              value={device.lat ?? ''}
              onChange={handleInputChange}
              placeholder="e.g., 32.1093"
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
              step="0.0001"
              value={device.lng ?? ''}
              onChange={handleInputChange}
              placeholder="e.g., 34.8555"
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
