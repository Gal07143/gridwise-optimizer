import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ModbusDeviceConfig, ModbusProtocol } from '@/types/modbus';
import { supabase } from '@/integrations/supabase/client';

// Schema for ModbusDeviceConfig validation
const modbusDeviceSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Device name is required'),
  description: z.string().optional(),
  protocol: z.enum(['TCP', 'RTU', 'ASCII']),
  
  // TCP fields
  host: z.string().optional(),
  port: z.coerce.number().int().min(1).max(65535).optional(),
  
  // RTU/ASCII fields
  serialPort: z.string().optional(),
  baudRate: z.coerce.number().int().min(1200).max(115200).optional(),
  dataBits: z.coerce.number().int().min(5).max(8).optional(),
  stopBits: z.coerce.number().int().min(1).max(2).optional(),
  parity: z.enum(['none', 'even', 'odd']).optional(),
  
  // Common fields
  unitId: z.coerce.number().int().min(0).max(255),
  timeout: z.coerce.number().int().min(100).max(10000).optional(),
  autoReconnect: z.boolean().default(false)
}).refine(
  (data) => {
    if (data.protocol === 'TCP') {
      return !!data.host && !!data.port;
    } else if (data.protocol === 'RTU' || data.protocol === 'ASCII') {
      return !!data.serialPort;
    }
    return false;
  }, 
  {
    message: "Required fields missing for the selected protocol",
    path: ["protocol"] 
  }
);

type FormValues = z.infer<typeof modbusDeviceSchema>;

interface ModbusDeviceFormProps {
  initialData?: Partial<ModbusDeviceConfig>;
  onSuccess?: (device: ModbusDeviceConfig) => void;
}

const ModbusDeviceForm: React.FC<ModbusDeviceFormProps> = ({ initialData, onSuccess }) => {
  // Initialize form with default values or initial data
  const form = useForm<FormValues>({
    resolver: zodResolver(modbusDeviceSchema),
    defaultValues: {
      id: initialData?.id || undefined,
      name: initialData?.name || '',
      description: initialData?.description || '',
      protocol: initialData?.protocol || 'TCP',
      host: initialData?.host || '',
      port: initialData?.port || 502,
      serialPort: initialData?.serialPort || '',
      baudRate: initialData?.baudRate || 9600,
      dataBits: initialData?.dataBits || 8,
      stopBits: initialData?.stopBits || 1,
      parity: initialData?.parity || 'none',
      unitId: initialData?.unitId || 1,
      timeout: initialData?.timeout || 1000,
      autoReconnect: initialData?.autoReconnect || false
    }
  });

  const watchProtocol = form.watch('protocol');
  const isEdit = !!initialData?.id;
  
  // Submit handler
  const onSubmit = async (data: FormValues) => {
    try {
      const deviceData = {
        ...data,
        status: initialData?.status || 'offline'
      };
      
      let result;
      
      if (isEdit) {
        const { data: updatedDevice, error } = await supabase
          .from('modbus_devices')
          .update(deviceData)
          .eq('id', data.id)
          .select()
          .single();
          
        if (error) throw new Error(error.message);
        result = updatedDevice;
        toast.success("Device updated successfully");
      } else {
        const { data: newDevice, error } = await supabase
          .from('modbus_devices')
          .insert({
            ...deviceData,
            status: 'offline'
          })
          .select()
          .single();
          
        if (error) throw new Error(error.message);
        result = newDevice;
        toast.success("Device created successfully");
      }
      
      // Call onSuccess callback with the new or updated device
      if (onSuccess && result) {
        onSuccess(result as ModbusDeviceConfig);
      }
    } catch (error: any) {
      console.error('Error saving device:', error);
      toast.error(error.message);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Device Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                <Select 
                  onValueChange={(value: ModbusProtocol) => field.onChange(value)} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select protocol" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="TCP">Modbus TCP</SelectItem>
                    <SelectItem value="RTU">Modbus RTU</SelectItem>
                    <SelectItem value="ASCII">Modbus ASCII</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose the Modbus protocol for this device
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Tabs defaultValue={watchProtocol} value={watchProtocol} className="w-full">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="TCP">TCP</TabsTrigger>
            <TabsTrigger value="RTU">RTU</TabsTrigger>
            <TabsTrigger value="ASCII">ASCII</TabsTrigger>
          </TabsList>
          
          <TabsContent value="TCP" className="space-y-4">
            <FormField
              control={form.control}
              name="host"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Host / IP Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Default Modbus TCP port is 502
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
          
          <TabsContent value="RTU" className="space-y-4">
            <FormField
              control={form.control}
              name="serialPort"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Serial Port</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="/dev/ttyUSB0 or COM1" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="baudRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Baud Rate</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))} 
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select baud rate" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="9600">9600</SelectItem>
                        <SelectItem value="19200">19200</SelectItem>
                        <SelectItem value="38400">38400</SelectItem>
                        <SelectItem value="57600">57600</SelectItem>
                        <SelectItem value="115200">115200</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="dataBits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Bits</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))} 
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Data bits" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="7">7</SelectItem>
                        <SelectItem value="8">8</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="stopBits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stop Bits</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))} 
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Stop bits" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="parity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parity</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Parity" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="even">Even</SelectItem>
                        <SelectItem value="odd">Odd</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="ASCII" className="space-y-4">
            <FormField
              control={form.control}
              name="serialPort"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Serial Port</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="/dev/ttyUSB0 or COM1" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="baudRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Baud Rate</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))} 
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select baud rate" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="9600">9600</SelectItem>
                        <SelectItem value="19200">19200</SelectItem>
                        <SelectItem value="38400">38400</SelectItem>
                        <SelectItem value="57600">57600</SelectItem>
                        <SelectItem value="115200">115200</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="parity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parity</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Parity" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="even">Even</SelectItem>
                        <SelectItem value="odd">Odd</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="unitId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit ID / Slave Address</FormLabel>
                <FormControl>
                  <Input type="number" min={0} max={255} {...field} />
                </FormControl>
                <FormDescription>
                  Modbus device ID (0-255)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="timeout"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Timeout (ms)</FormLabel>
                <FormControl>
                  <Input type="number" min={100} max={10000} {...field} />
                </FormControl>
                <FormDescription>
                  Communication timeout in milliseconds
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="autoReconnect"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Auto Reconnect
                  </FormLabel>
                  <FormDescription>
                    Automatically attempt reconnection on connection loss
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button type="submit">
            {isEdit ? 'Update Device' : 'Create Device'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ModbusDeviceForm;
