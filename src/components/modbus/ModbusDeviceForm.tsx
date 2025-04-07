
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ModbusDevice, ModbusDeviceConfig } from '@/types/modbus';
import { createModbusDevice, updateModbusDevice } from '@/services/modbus/modbusDeviceService';
import { Textarea } from '@/components/ui/textarea';

// Form validation schema
const modbusDeviceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  ip: z.string().min(1, 'IP address is required'),
  port: z.coerce.number().int().positive().default(502),
  unit_id: z.coerce.number().int().min(0).max(255).default(1),
  protocol: z.string().default('TCP'),
  description: z.string().optional(),
  is_active: z.boolean().default(true)
});

type ModbusDeviceFormValues = z.infer<typeof modbusDeviceSchema>;

interface ModbusDeviceFormProps {
  initialData?: Partial<ModbusDeviceConfig>;
  onSuccess?: (device: ModbusDeviceConfig) => void;
}

const ModbusDeviceForm: React.FC<ModbusDeviceFormProps> = ({ 
  initialData, 
  onSuccess 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form
  const form = useForm<ModbusDeviceFormValues>({
    resolver: zodResolver(modbusDeviceSchema),
    defaultValues: {
      name: initialData?.name || '',
      ip: initialData?.ip || '',
      port: initialData?.port || 502,
      unit_id: initialData?.unit_id || 1,
      protocol: initialData?.protocol || 'TCP',
      description: initialData?.description || '',
      is_active: initialData?.is_active ?? true
    }
  });
  
  const onSubmit = async (values: ModbusDeviceFormValues) => {
    try {
      setIsSubmitting(true);
      
      let result;
      if (initialData?.id) {
        // Update existing device
        result = await updateModbusDevice(initialData.id, values as ModbusDeviceConfig);
      } else {
        // Create new device
        result = await createModbusDevice(values as ModbusDeviceConfig);
      }
      
      if (result && onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      console.error('Error saving Modbus device:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Device Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter device name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="protocol"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Protocol</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select protocol" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="TCP">Modbus TCP</SelectItem>
                    <SelectItem value="RTU">Modbus RTU over TCP</SelectItem>
                    <SelectItem value="ASCII">Modbus ASCII over TCP</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="ip"
            render={({ field }) => (
              <FormItem>
                <FormLabel>IP Address</FormLabel>
                <FormControl>
                  <Input placeholder="192.168.1.100" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="port"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Port</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="502" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="unit_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit ID / Slave ID</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="1" {...field} min={0} max={255} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Device Enabled</FormLabel>
                  <FormMessage />
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
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
                <Textarea placeholder="Optional device description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : (initialData?.id ? 'Update Device' : 'Create Device')}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ModbusDeviceForm;
