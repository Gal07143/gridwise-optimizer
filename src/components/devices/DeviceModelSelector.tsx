
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { DeviceModel, DeviceModelReference } from '@/types/device';

// Mock function for getting device models
const getAllDeviceModels = async (): Promise<DeviceModel[]> => {
  // Simulating API call
  return [
    {
      id: '1',
      name: 'SolarEdge SE5000H',
      manufacturer: 'SolarEdge',
      model_number: 'SE5000H',
      device_type: 'inverter',
      category: 'inverter',
      power_rating: 5000,
      has_manual: true
    },
    {
      id: '2',
      name: 'Tesla Powerwall 2',
      manufacturer: 'Tesla',
      model_number: 'PW2',
      device_type: 'battery',
      category: 'battery',
      capacity: 13.5,
      has_manual: true
    }
  ];
};

interface DeviceModelSelectorProps {
  deviceType?: string;
  value?: string;
  onChange: (model: DeviceModelReference) => void;
  required?: boolean;
}

const DeviceModelSelector: React.FC<DeviceModelSelectorProps> = ({
  deviceType,
  value,
  onChange,
  required = false,
}) => {
  const { data: deviceModels = [], isLoading } = useQuery({
    queryKey: ['device-models'],
    queryFn: getAllDeviceModels,
  });

  const filteredModels = deviceType
    ? deviceModels.filter((model) => model.device_type === deviceType)
    : deviceModels;

  const selectedModel = filteredModels.find((model) => model.id === value);

  const handleModelChange = (modelId: string) => {
    const model = filteredModels.find((m) => m.id === modelId);
    if (model) {
      // Convert to DeviceModelReference
      const modelReference: DeviceModelReference = {
        id: model.id,
        name: model.name,
        manufacturer: model.manufacturer,
        model_number: model.model_number,
        device_type: model.device_type,
        category: model.category || 'unknown',
        has_manual: model.has_manual || false
      };
      onChange(modelReference);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="device-model">Device Model {required && <span className="text-red-500">*</span>}</Label>
      <Select
        value={value}
        onValueChange={handleModelChange}
        disabled={isLoading || filteredModels.length === 0}
      >
        <SelectTrigger id="device-model" className="w-full">
          <SelectValue 
            placeholder="Select a device model" 
            className="text-muted-foreground"
          >
            {selectedModel ? `${selectedModel.manufacturer} - ${selectedModel.model_number}` : 'Select a device model'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {filteredModels.length === 0 ? (
            <SelectItem value="none" disabled>
              No models available
            </SelectItem>
          ) : (
            filteredModels.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                {model.manufacturer} - {model.model_number}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default DeviceModelSelector;
