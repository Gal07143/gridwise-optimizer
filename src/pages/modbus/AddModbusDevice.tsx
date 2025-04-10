
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { createModbusDevice } from '@/services/modbus/modbusService';
import { PageHeader } from '@/components/ui/page-header';

// Define form schema
const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  ip_address: z.string().min(1, { message: 'IP address is required.' }),
  port: z.coerce.number().int().min(1).max(65535),
  slave_id: z.coerce.number().int().min(1).max(255),
  protocol: z.enum(['TCP', 'RTU']),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const AddModbusDevice = () => {
  const navigate = useNavigate();
  
  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      ip_address: '',
      port: 502,
      slave_id: 1,
      protocol: 'TCP',
      description: '',
    },
  });

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    try {
      const newDevice = await createModbusDevice({
        name: data.name,
        ip_address: data.ip_address,
        port: data.port,
        slave_id: data.slave_id,
        protocol: data.protocol,
        description: data.description,
      });
      
      if (newDevice) {
        toast.success('Device added successfully');
        navigate(`/modbus/devices/${newDevice.id}`);
      }
    } catch (error) {
      console.error('Error creating device:', error);
      toast.error('Failed to add device');
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header with back button */}
      <div>
        <Button variant="ghost" onClick={() => navigate('/modbus/devices')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Devices
        </Button>
      </div>

      <PageHeader 
        title="Add Modbus Device" 
        description="Configure a new Modbus device connection"
      />

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Device Details</CardTitle>
          <CardDescription>
            Enter the connection details for your Modbus device.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Device Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Device Name</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g. Solar Inverter" {...field} />
                    </FormControl>
                    <FormDescription>
                      A descriptive name to identify this device.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* IP Address */}
              <FormField
                control={form.control}
                name="ip_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IP Address</FormLabel>
                    <FormControl>
                      <Input placeholder="192.168.1.100" {...field} />
                    </FormControl>
                    <FormDescription>
                      The IP address of the Modbus device on your network.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Port */}
              <FormField
                control={form.control}
                name="port"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Port</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      Default Modbus TCP port is 502.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Slave/Unit ID */}
              <FormField
                control={form.control}
                name="slave_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slave/Unit ID</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      Modbus device identifier (typically 1 for single devices).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Protocol */}
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
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The Modbus protocol variant used by this device.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Additional information about this device..."
                        className="resize-none"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  type="button"
                  onClick={() => navigate('/modbus/devices')}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Device</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddModbusDevice;
