
import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Battery, Cpu, Wind, Sun, Zap, 
  ActivitySquare, Lightbulb, Router, 
  Landmark, WifiIcon, Cloud, Info, 
  AlertTriangle, CheckCircle2
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useSiteContext } from '@/contexts/SiteContext';
import { DeviceType, DeviceStatus } from '@/types/energy';
import { toast } from 'sonner';

// Function to get icon based on device type
const getDeviceIcon = (type: DeviceType) => {
  switch (type) {
    case 'battery':
      return <Battery className="h-5 w-5" />;
    case 'inverter':
      return <Cpu className="h-5 w-5" />;
    case 'wind':
      return <Wind className="h-5 w-5" />;
    case 'solar':
      return <Sun className="h-5 w-5" />;
    case 'grid':
      return <Zap className="h-5 w-5" />;
    case 'meter':
      return <ActivitySquare className="h-5 w-5" />;
    case 'light':
      return <Lightbulb className="h-5 w-5" />;
    case 'ev_charger':
      return <Zap className="h-5 w-5" />;
    case 'load':
      return <Landmark className="h-5 w-5" />;
    default:
      return <Router className="h-5 w-5" />;
  }
};

// Form schema for enhanced device validation
const deviceSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  type: z.enum([
    'battery', 'solar', 'wind', 'grid', 'load', 
    'ev_charger', 'inverter', 'meter', 'light', 
    'generator', 'hydro'
  ] as const),
  status: z.enum([
    'online', 'offline', 'maintenance', 'error', 
    'warning', 'idle', 'active', 'charging', 'discharging'
  ] as const).default('offline'),
  description: z.string().optional(),
  model: z.string().optional(),
  manufacturer: z.string().optional(),
  serial_number: z.string().optional(),
  firmware: z.string().optional(),
  installation_date: z.string().optional(),
  location: z.string().optional(),
  coordinates: z.object({
    latitude: z.number().optional(),
    longitude: z.number().optional(),
  }).optional(),
  capacity: z.number().positive('Capacity must be positive'),
  efficiency: z.number().min(0).max(100, 'Efficiency must be between 0 and 100').optional(),
  site_id: z.string().optional(),
  protocol: z.string().optional(),
  ip_address: z.string().optional(),
  port: z.number().int().positive().optional(),
  modbus_unit_id: z.number().int().positive().optional(),
  tags: z.array(z.string()).optional(),
  alerts_enabled: z.boolean().default(true),
  maintenance_interval: z.number().int().positive().optional(),
  last_maintenance: z.string().optional(),
  warranty_expiry: z.string().optional(),
  critical_device: z.boolean().default(false),
  notes: z.string().optional(),
  connection_settings: z.object({
    authentication_required: z.boolean().default(false),
    username: z.string().optional(),
    use_encryption: z.boolean().default(false),
    timeout: z.number().int().positive().optional(),
    retry_count: z.number().int().positive().optional(),
  }).optional(),
});

type DeviceFormValues = z.infer<typeof deviceSchema>;

const protocolOptions = [
  { value: 'modbus_tcp', label: 'Modbus TCP' },
  { value: 'modbus_rtu', label: 'Modbus RTU' },
  { value: 'bacnet', label: 'BACnet' },
  { value: 'mqtt', label: 'MQTT' },
  { value: 'http', label: 'HTTP/REST' },
  { value: 'opcua', label: 'OPC UA' },
  { value: 'knx', label: 'KNX' },
  { value: 'dnp3', label: 'DNP3' },
  { value: 'iec61850', label: 'IEC 61850' },
  { value: 'zigbee', label: 'Zigbee' },
  { value: 'lora', label: 'LoRaWAN' },
  { value: 'canbus', label: 'CANbus' },
];

// Device tags
const tagOptions = [
  'Critical', 'Renewable', 'Backup', 'Production', 'Consumption',
  'Monitoring', 'Building1', 'Building2', 'FirstFloor', 'SecondFloor',
  'Outdoor', 'Indoor', 'Rooftop', 'Basement', 'Grid-Tied',
  'Off-Grid', 'Hybrid', 'Three-Phase', 'Single-Phase', 'Remote',
];

interface EnhancedDeviceFormProps {
  initialDevice?: Partial<DeviceFormValues>;
  onSubmit: (data: DeviceFormValues) => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

export const EnhancedDeviceForm: React.FC<EnhancedDeviceFormProps> = ({
  initialDevice,
  onSubmit,
  isLoading = false,
  isEdit = false,
}) => {
  const { sites } = useSiteContext();
  const [selectedTags, setSelectedTags] = useState<string[]>(initialDevice?.tags || []);
  const [connectionTestResult, setConnectionTestResult] = useState<'success' | 'error' | 'none'>('none');

  // Form initialization
  const form = useForm<DeviceFormValues>({
    resolver: zodResolver(deviceSchema),
    defaultValues: {
      name: initialDevice?.name || '',
      type: initialDevice?.type || 'meter',
      status: initialDevice?.status || 'offline',
      description: initialDevice?.description || '',
      model: initialDevice?.model || '',
      manufacturer: initialDevice?.manufacturer || '',
      serial_number: initialDevice?.serial_number || '',
      firmware: initialDevice?.firmware || '',
      installation_date: initialDevice?.installation_date || '',
      location: initialDevice?.location || '',
      coordinates: initialDevice?.coordinates || { latitude: undefined, longitude: undefined },
      capacity: initialDevice?.capacity || 0,
      efficiency: initialDevice?.efficiency || 95,
      site_id: initialDevice?.site_id || (sites[0]?.id || ''),
      protocol: initialDevice?.protocol || '',
      ip_address: initialDevice?.ip_address || '',
      port: initialDevice?.port || 502, // Default Modbus port
      modbus_unit_id: initialDevice?.modbus_unit_id || 1,
      tags: initialDevice?.tags || [],
      alerts_enabled: initialDevice?.alerts_enabled ?? true,
      maintenance_interval: initialDevice?.maintenance_interval || 90, // 90 days default
      last_maintenance: initialDevice?.last_maintenance || '',
      warranty_expiry: initialDevice?.warranty_expiry || '',
      critical_device: initialDevice?.critical_device ?? false,
      notes: initialDevice?.notes || '',
      connection_settings: initialDevice?.connection_settings || {
        authentication_required: false,
        username: '',
        use_encryption: false,
        timeout: 5000, // 5 seconds default
        retry_count: 3,
      },
    },
  });

  const deviceType = form.watch('type');
  const deviceProtocol = form.watch('protocol');

  // Update form when initial device changes
  useEffect(() => {
    if (initialDevice) {
      Object.entries(initialDevice).forEach(([key, value]) => {
        // @ts-ignore - dynamically setting form values
        form.setValue(key, value);
      });
      
      if (initialDevice.tags) {
        setSelectedTags(initialDevice.tags);
      }
    }
  }, [initialDevice, form]);

  // Handle tag selection
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
    form.setValue('tags', selectedTags.includes(tag) 
      ? selectedTags.filter(t => t !== tag) 
      : [...selectedTags, tag]);
  };

  // Test connection to device
  const testConnection = () => {
    const formData = form.getValues();
    
    // Simulate connection test
    toast.loading('Testing connection to device...', { id: 'connection-test' });
    
    setTimeout(() => {
      if (formData.ip_address && formData.port) {
        setConnectionTestResult('success');
        toast.success('Successfully connected to device', { id: 'connection-test' });
      } else {
        setConnectionTestResult('error');
        toast.error('Failed to connect. Please check connection details.', { id: 'connection-test' });
      }
    }, 2000);
  };

  const handleSubmit = (data: DeviceFormValues) => {
    // Include the selected tags in the submission
    const finalData = {
      ...data,
      tags: selectedTags,
    };
    
    onSubmit(finalData);
  };

  // Additional fields based on device type
  const renderDeviceTypeFields = () => {
    switch (deviceType) {
      case 'battery':
        return (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <FormField
              control={form.control}
              name="efficiency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Battery Efficiency (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={e => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>Round-trip efficiency of the battery</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
              <Label>Battery Chemistry</Label>
              <Select defaultValue="lithium-ion">
                <SelectTrigger>
                  <SelectValue placeholder="Select battery chemistry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lithium-ion">Lithium-Ion</SelectItem>
                  <SelectItem value="lead-acid">Lead-Acid</SelectItem>
                  <SelectItem value="lfp">LiFePO4 (LFP)</SelectItem>
                  <SelectItem value="nmc">NMC</SelectItem>
                  <SelectItem value="flow">Flow Battery</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
        
      case 'solar':
        return (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <FormField
              control={form.control}
              name="efficiency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Panel Efficiency (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={e => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
              <Label>Panel Type</Label>
              <Select defaultValue="monocrystalline">
                <SelectTrigger>
                  <SelectValue placeholder="Select panel type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monocrystalline">Monocrystalline</SelectItem>
                  <SelectItem value="polycrystalline">Polycrystalline</SelectItem>
                  <SelectItem value="thin-film">Thin Film</SelectItem>
                  <SelectItem value="bifacial">Bifacial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Mounting Type</Label>
              <Select defaultValue="fixed">
                <SelectTrigger>
                  <SelectValue placeholder="Select mounting type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed</SelectItem>
                  <SelectItem value="single-axis">Single Axis Tracker</SelectItem>
                  <SelectItem value="dual-axis">Dual Axis Tracker</SelectItem>
                  <SelectItem value="roof-mounted">Roof Mounted</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Orientation</Label>
              <Select defaultValue="south">
                <SelectTrigger>
                  <SelectValue placeholder="Select orientation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="north">North</SelectItem>
                  <SelectItem value="northeast">Northeast</SelectItem>
                  <SelectItem value="east">East</SelectItem>
                  <SelectItem value="southeast">Southeast</SelectItem>
                  <SelectItem value="south">South</SelectItem>
                  <SelectItem value="southwest">Southwest</SelectItem>
                  <SelectItem value="west">West</SelectItem>
                  <SelectItem value="northwest">Northwest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
        
      case 'inverter':
        return (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <FormField
              control={form.control}
              name="efficiency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Inverter Efficiency (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={e => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
              <Label>Inverter Type</Label>
              <Select defaultValue="string">
                <SelectTrigger>
                  <SelectValue placeholder="Select inverter type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="string">String Inverter</SelectItem>
                  <SelectItem value="central">Central Inverter</SelectItem>
                  <SelectItem value="microinverter">Microinverter</SelectItem>
                  <SelectItem value="hybrid">Hybrid Inverter</SelectItem>
                  <SelectItem value="battery">Battery Inverter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Phase Configuration</Label>
              <Select defaultValue="single">
                <SelectTrigger>
                  <SelectValue placeholder="Select phase" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single Phase</SelectItem>
                  <SelectItem value="split">Split Phase</SelectItem>
                  <SelectItem value="three">Three Phase</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>MPPT Inputs</Label>
              <Input type="number" defaultValue={1} min={1} />
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  // Protocol-specific fields
  const renderProtocolFields = () => {
    switch (deviceProtocol) {
      case 'modbus_tcp':
        return (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <FormField
              control={form.control}
              name="ip_address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IP Address</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="192.168.1.100" />
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
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={e => field.onChange(parseInt(e.target.value))} 
                      placeholder="502"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="modbus_unit_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit ID</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={e => field.onChange(parseInt(e.target.value))} 
                      placeholder="1"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
      
      case 'modbus_rtu':
        return (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Serial Port</Label>
              <Input placeholder="COM1 or /dev/ttyUSB0" />
            </div>
            
            <div className="space-y-2">
              <Label>Baud Rate</Label>
              <Select defaultValue="9600">
                <SelectTrigger>
                  <SelectValue placeholder="Select baud rate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4800">4800</SelectItem>
                  <SelectItem value="9600">9600</SelectItem>
                  <SelectItem value="19200">19200</SelectItem>
                  <SelectItem value="38400">38400</SelectItem>
                  <SelectItem value="57600">57600</SelectItem>
                  <SelectItem value="115200">115200</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Data Bits</Label>
              <Select defaultValue="8">
                <SelectTrigger>
                  <SelectValue placeholder="Select data bits" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7</SelectItem>
                  <SelectItem value="8">8</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Parity</Label>
              <Select defaultValue="none">
                <SelectTrigger>
                  <SelectValue placeholder="Select parity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="even">Even</SelectItem>
                  <SelectItem value="odd">Odd</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Stop Bits</Label>
              <Select defaultValue="1">
                <SelectTrigger>
                  <SelectValue placeholder="Select stop bits" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <FormField
              control={form.control}
              name="modbus_unit_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit ID</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={e => field.onChange(parseInt(e.target.value))} 
                      placeholder="1"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
      
      case 'mqtt':
        return (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Broker Address</Label>
              <Input placeholder="mqtt.example.com" />
            </div>
            
            <div className="space-y-2">
              <Label>Port</Label>
              <Input type="number" placeholder="1883" defaultValue={1883} />
            </div>
            
            <div className="space-y-2">
              <Label>Topic Prefix</Label>
              <Input placeholder="devices/solar/" />
            </div>
            
            <div className="space-y-2">
              <Label>Client ID</Label>
              <Input placeholder="ems-client-1" />
            </div>
            
            <div className="space-y-2">
              <Label>QoS</Label>
              <Select defaultValue="1">
                <SelectTrigger>
                  <SelectValue placeholder="Select QoS" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0 - At most once</SelectItem>
                  <SelectItem value="1">1 - At least once</SelectItem>
                  <SelectItem value="2">2 - Exactly once</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="col-span-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="mqtt-auth" />
                <label
                  htmlFor="mqtt-auth"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Authentication Required
                </label>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Username</Label>
              <Input placeholder="mqtt-user" />
            </div>
            
            <div className="space-y-2">
              <Label>Password</Label>
              <Input type="password" placeholder="••••••••" />
            </div>
          </div>
        );
        
      default:
        return (
          <div className="py-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Protocol configuration</AlertTitle>
              <AlertDescription>
                Select a communication protocol to configure connection details
              </AlertDescription>
            </Alert>
          </div>
        );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Tabs defaultValue="basic">
          <TabsList className="mb-4 grid grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="technical">Technical Details</TabsTrigger>
            <TabsTrigger value="connection">Connection</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic">
            <Card>
              <CardContent className="pt-6">
                <div className="grid gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Device Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Solar Inverter 1" />
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
                              <SelectItem value="battery">
                                <div className="flex items-center">
                                  <Battery className="mr-2 h-4 w-4" />
                                  <span>Battery Storage</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="solar">
                                <div className="flex items-center">
                                  <Sun className="mr-2 h-4 w-4" />
                                  <span>Solar PV</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="wind">
                                <div className="flex items-center">
                                  <Wind className="mr-2 h-4 w-4" />
                                  <span>Wind Turbine</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="inverter">
                                <div className="flex items-center">
                                  <Cpu className="mr-2 h-4 w-4" />
                                  <span>Inverter</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="meter">
                                <div className="flex items-center">
                                  <ActivitySquare className="mr-2 h-4 w-4" />
                                  <span>Energy Meter</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="ev_charger">
                                <div className="flex items-center">
                                  <Zap className="mr-2 h-4 w-4" />
                                  <span>EV Charger</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="load">
                                <div className="flex items-center">
                                  <Landmark className="mr-2 h-4 w-4" />
                                  <span>Load</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="grid">
                                <div className="flex items-center">
                                  <Zap className="mr-2 h-4 w-4" />
                                  <span>Grid Connection</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="light">
                                <div className="flex items-center">
                                  <Lightbulb className="mr-2 h-4 w-4" />
                                  <span>Lighting</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
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
                          <Textarea 
                            {...field} 
                            placeholder="Enter a description of this device"
                            className="resize-none"
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                <SelectValue placeholder="Select site" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {sites.map((site) => (
                                <SelectItem key={site.id} value={site.id}>
                                  {site.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            The site where this device is located
                          </FormDescription>
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
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="online">
                                <div className="flex items-center">
                                  <Badge variant="success" className="mr-2">Online</Badge>
                                  <span>Device is online and operational</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="offline">
                                <div className="flex items-center">
                                  <Badge variant="outline" className="mr-2">Offline</Badge>
                                  <span>Device is not connected</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="maintenance">
                                <div className="flex items-center">
                                  <Badge variant="warning" className="mr-2">Maintenance</Badge>
                                  <span>Under scheduled maintenance</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="error">
                                <div className="flex items-center">
                                  <Badge variant="destructive" className="mr-2">Error</Badge>
                                  <span>Device has an error condition</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="warning">
                                <div className="flex items-center">
                                  <Badge variant="warning" className="mr-2">Warning</Badge>
                                  <span>Device has a warning condition</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Building A, Room 101" />
                          </FormControl>
                          <FormDescription>
                            Physical location of the device
                          </FormDescription>
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
                              {...field} 
                              onChange={e => field.onChange(parseFloat(e.target.value))}
                              step="0.01"
                            />
                          </FormControl>
                          <FormDescription>
                            Rated capacity in kilowatts
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div>
                    <Label>Tags</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {tagOptions.map(tag => (
                        <Badge
                          key={tag}
                          variant={selectedTags.includes(tag) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleTag(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Click to select tags for this device
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="technical">
            <Card>
              <CardContent className="pt-6">
                <div className="grid gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="manufacturer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Manufacturer</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Schneider Electric" />
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
                          <FormLabel>Model</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="PowerWall 2.0" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="serial_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Serial Number</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="SN12345678" />
                          </FormControl>
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
                            <Input {...field} placeholder="v1.2.3" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    
                    <FormField
                      control={form.control}
                      name="warranty_expiry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Warranty Expiry Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* Device type specific fields */}
                  {renderDeviceTypeFields()}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="connection">
            <Card>
              <CardContent className="pt-6">
                <div className="grid gap-6">
                  <FormField
                    control={form.control}
                    name="protocol"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Communication Protocol</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select protocol" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {protocolOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          The communication protocol used by this device
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Protocol-specific fields */}
                  {renderProtocolFields()}
                  
                  {deviceProtocol && (
                    <div className="flex justify-end">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={testConnection}
                      >
                        Test Connection
                      </Button>
                    </div>
                  )}
                  
                  {connectionTestResult === 'success' && (
                    <Alert variant="success">
                      <CheckCircle2 className="h-4 w-4" />
                      <AlertTitle>Connection Successful</AlertTitle>
                      <AlertDescription>
                        Successfully connected to the device using the provided settings.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {connectionTestResult === 'error' && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Connection Failed</AlertTitle>
                      <AlertDescription>
                        Could not connect to the device. Please check your connection settings and ensure the device is online.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="advanced">
            <Card>
              <CardContent className="pt-6">
                <div className="grid gap-6">
                  <div className="flex items-center space-x-2">
                    <FormField
                      control={form.control}
                      name="critical_device"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox 
                              checked={field.value} 
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div>
                            <FormLabel>Critical Device</FormLabel>
                            <FormDescription>
                              Mark as critical if this device requires high priority monitoring
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <FormField
                      control={form.control}
                      name="alerts_enabled"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox 
                              checked={field.value} 
                              onCheckedChange={field.onChange} 
                            />
                          </FormControl>
                          <div>
                            <FormLabel>Enable Alerts</FormLabel>
                            <FormDescription>
                              Receive notifications for status changes and issues
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-base font-medium mb-2">Maintenance Schedule</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="maintenance_interval"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Maintenance Interval (days)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field} 
                                onChange={e => field.onChange(parseInt(e.target.value))}
                              />
                            </FormControl>
                            <FormDescription>
                              Days between scheduled maintenance
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="last_maintenance"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Maintenance Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="advanced-settings">
                      <AccordionTrigger>Advanced Connection Settings</AccordionTrigger>
                      <AccordionContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="use-encryption" />
                            <div>
                              <Label htmlFor="use-encryption">Use Encryption</Label>
                              <p className="text-sm text-muted-foreground">
                                Enable secure communication
                              </p>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Connection Timeout (ms)</Label>
                            <Input type="number" defaultValue={5000} />
                            <p className="text-xs text-muted-foreground">
                              Maximum time to wait for connection
                            </p>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Retry Count</Label>
                            <Input type="number" defaultValue={3} />
                            <p className="text-xs text-muted-foreground">
                              Number of retry attempts
                            </p>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Poll Interval (seconds)</Label>
                            <Input type="number" defaultValue={60} />
                            <p className="text-xs text-muted-foreground">
                              Time between data reads
                            </p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Notes</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Enter any additional notes about this device"
                            className="resize-none"
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 flex justify-end space-x-4">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>Saving...</>
            ) : isEdit ? (
              <>Update Device</>
            ) : (
              <>Add Device</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EnhancedDeviceForm;
