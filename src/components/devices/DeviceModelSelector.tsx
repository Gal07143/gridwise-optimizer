
import React, { useState, useEffect } from 'react';
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DeviceModel } from '@/types/device';

// Sample device models for demonstration
const sampleModels: DeviceModel[] = [
  {
    id: "1",
    name: "SolarEdge SE10000H",
    manufacturer: "SolarEdge",
    model: "SE10000H",
    model_number: "SE10000H-US",
    device_type: "inverter",
    category: "Solar Inverters",
    supported: true,
    power_rating: 10000,
    has_manual: true,
    has_datasheet: true
  },
  {
    id: "2",
    name: "Tesla Powerwall 2",
    manufacturer: "Tesla",
    model: "Powerwall 2",
    model_number: "1123982-00-D",
    device_type: "battery",
    category: "Battery Systems",
    supported: true,
    capacity: 13.5,
    has_manual: true,
    has_datasheet: false
  },
  // Add more sample models as needed
];

interface DeviceModelSelectorProps {
  value?: string;
  onChange: (value: string | undefined, model?: DeviceModel) => void;
  deviceType?: string;
}

const DeviceModelSelector: React.FC<DeviceModelSelectorProps> = ({
  value,
  onChange,
  deviceType
}) => {
  const [open, setOpen] = useState(false);
  const [models, setModels] = useState<DeviceModel[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch device models from API
  useEffect(() => {
    const fetchDeviceModels = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call
        // const response = await fetch('/api/device-models');
        // const data = await response.json();
        
        // For now, use sample data
        let filteredModels = [...sampleModels];
        
        if (deviceType) {
          filteredModels = filteredModels.filter(
            model => model.device_type?.toLowerCase() === deviceType.toLowerCase()
          );
        }
        
        setModels(filteredModels);
      } catch (error) {
        console.error('Failed to fetch device models:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeviceModels();
  }, [deviceType]);

  // Find the currently selected model
  const selectedModel = models.find(model => model.id === value);

  const handleChange = (modelId: string) => {
    const model = models.find(m => m.id === modelId);
    onChange(modelId, model);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={loading}
        >
          {value && selectedModel 
            ? (
              <div className="flex flex-col items-start text-left">
                <span>{selectedModel.name}</span>
                <span className="text-xs text-muted-foreground">
                  {selectedModel.model_number} · {selectedModel.manufacturer}
                </span>
              </div>
            ) 
            : "Select Device Model..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start" alignOffset={0} style={{ width: 'var(--radix-popover-trigger-width)' }}>
        <Command>
          <CommandInput placeholder="Search device models..." />
          <CommandEmpty>No device models found.</CommandEmpty>
          <CommandGroup>
            {models.map((model) => (
              <CommandItem
                key={model.id}
                value={model.id}
                onSelect={handleChange}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === model.id ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex flex-col">
                  <span>{model.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {model.model_number} · {model.manufacturer}
                  </span>
                </div>
                {model.has_manual && (
                  <span className="ml-auto bg-primary/20 text-primary text-xs px-1.5 py-0.5 rounded">
                    Manual
                  </span>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default DeviceModelSelector;
