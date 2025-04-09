
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Device } from '@/types/device';
import { Site } from '@/types/site';
import { createDevice, updateDevice } from '@/services/deviceService';
import { getAvailableSites } from '@/services/devices/mutations/siteUtils';
import DeviceModelSelector from './DeviceModelSelector';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.string().min(1, 'Type is required'),
  status: z.string().min(1, 'Status is required'),
  location: z.string().optional(),
  capacity: z.number().positive('Capacity must be positive'),
  firmware: z.string().optional(),
  description: z.string().optional(),
  site_id: z.string().min(1, 'Site is required'),
  installation_date: z.string().optional(),
  model: z.string().optional()
});

interface EnhancedDeviceFormProps {
  existingDevice?: Device;
  onSubmit?: (device: Device) => void;
  onCancel?: () => void;
}

const EnhancedDeviceForm: React.FC<EnhancedDeviceFormProps> = ({
  existingDevice,
  onSubmit,
  onCancel
}) => {
  const [sites, setSites] = useState<Site[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: existingDevice?.name || '',
      type: existingDevice?.type || 'solar',
      status: existingDevice?.status || 'offline',
      location: existingDevice?.location || '',
      capacity: existingDevice?.capacity || 0,
      firmware: existingDevice?.firmware || '',
      description: existingDevice?.description || '',
      site_id: existingDevice?.site_id || '',
      installation_date: existingDevice?.installation_date || '',
      model: existingDevice?.model || ''
    }
  });
  
  useEffect(() => {
    const loadSites = async () => {
      const availableSites = await getAvailableSites();
      setSites(availableSites);
      
      // Set default site if none is selected and sites are available
      if (!existingDevice?.site_id && availableSites.length > 0) {
        form.setValue('site_id', availableSites[0].id);
      }
    };
    
    loadSites();
  }, [form, existingDevice?.site_id]);

  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      let result: Device;
      
      if (existingDevice) {
        // Update existing device
        result = await updateDevice(existingDevice.id, {
          name: values.name,
          type: values.type,
          status: values.status,
          location: values.location,
          capacity: values.capacity,
          firmware: values.firmware,
          description: values.description,
          site_id: values.site_id,
          model: values.model,
          installation_date: values.installation_date
        });
        toast.success('Device updated successfully');
      } else {
        // Create new device
        result = await createDevice({
          name: values.name,
          type: values.type,
          status: values.status,
          location: values.location,
          capacity: values.capacity,
          firmware: values.firmware,
          description: values.description,
          site_id: values.site_id,
          model: values.model,
          installation_date: values.installation_date
        });
        toast.success('Device created successfully');
      }
      
      if (onSubmit) {
        onSubmit(result);
      }
    } catch (error) {
      console.error('Error saving device:', error);
      toast.error('Failed to save device');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const deviceTypes = [
    { value: 'solar', label: 'Solar Panel' },
    { value: 'battery', label: 'Battery' },
    { value: 'inverter', label: 'Inverter' },
    { value: 'meter', label: 'Meter' },
    { value: 'ev_charger', label: 'EV Charger' },
    { value: 'load', label: 'Load' },
    { value: 'grid', label: 'Grid Connection' }
  ];
  
  const deviceStatuses = [
    { value: 'online', label: 'Online' },
    { value: 'offline', label: 'Offline' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'error', label: 'Error' },
    { value: 'warning', label: 'Warning' }
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Device Name</FormLabel>
                <FormControl>
                  <Input placeholder="My Solar Panel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Device Model</FormLabel>
                <FormControl>
                  <DeviceModelSelector 
                    value={field.value} 
                    onChange={(value) => field.onChange(value)} 
                    deviceType={form.getValues('type')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Device Type</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select device type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {deviceTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select device status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {deviceStatuses.map(status => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacity (kW)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="0.0" 
                    {...field}
                    onChange={e => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Building A, Room 101" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="site_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Site</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a site" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sites.map(site => (
                      <SelectItem key={site.id} value={site.id}>
                        {site.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="firmware"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Firmware Version</FormLabel>
                <FormControl>
                  <Input placeholder="v1.0.0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="installation_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Installation Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Add details about this device..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : existingDevice ? 'Update Device' : 'Create Device'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EnhancedDeviceForm;
