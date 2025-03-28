
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { 
  Sliders, Save, Undo2, RefreshCw, 
  Info, AlertTriangle, Battery, Sun, 
  Wind, Building, WifiIcon, Database,
  Settings, BarChart4, Calendar
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

// Energy criteria form schema
const energyCriteriaSchema = z.object({
  // Power thresholds
  batteryChargingThreshold: z.number().min(0).max(100),
  batteryDischargingThreshold: z.number().min(0).max(100),
  renewableExportThreshold: z.number().min(0),
  peakShavingThreshold: z.number().min(0),
  demandResponseThreshold: z.number().min(0),
  
  // Energy pricing
  peakHoursStart: z.string(),
  peakHoursEnd: z.string(),
  peakRatePerKwh: z.number().min(0),
  offPeakRatePerKwh: z.number().min(0),
  feedInTariff: z.number().min(0),
  
  // Carbon intensity
  carbonIntensityGridKgPerKwh: z.number().min(0),
  carbonIntensitySolarKgPerKwh: z.number().min(0),
  carbonIntensityWindKgPerKwh: z.number().min(0),
  
  // Optimization goals
  prioritizeSelfConsumption: z.boolean(),
  prioritizeCostSavings: z.boolean(),
  prioritizeEmissionsReduction: z.boolean(),
  
  // Advanced settings
  batteryLifecycleOptimization: z.boolean(),
  weatherForecastOptimization: z.boolean(),
  demandPredictionEnabled: z.boolean(),
  minStateOfHealthPercent: z.number().min(0).max(100),
});

// Alert settings schema
const alertSettingsSchema = z.object({
  batteryLowThreshold: z.number().min(0).max(100),
  batteryHighThreshold: z.number().min(0).max(100),
  powerOutageAlertEnabled: z.boolean(),
  overproductionAlertThreshold: z.number().min(0),
  overconsumptionAlertThreshold: z.number().min(0),
  voltageHighThreshold: z.number().min(0),
  voltageLowThreshold: z.number().min(0),
  emailAlertsEnabled: z.boolean(),
  smsAlertsEnabled: z.boolean(),
  pushNotificationsEnabled: z.boolean(),
  alertRefreshInterval: z.number().min(1),
});

// Data management schema
const dataManagementSchema = z.object({
  dataSamplingInterval: z.number().min(1),
  dataRetentionDays: z.number().min(1),
  highResolutionDataDays: z.number().min(1),
  dataCompressionEnabled: z.boolean(),
  dataExportSchedule: z.enum(['daily', 'weekly', 'monthly', 'never']),
  dataBackupEnabled: z.boolean(),
  backupSchedule: z.enum(['daily', 'weekly', 'monthly', 'never']),
  aggregationInterval: z.enum(['5min', '15min', '30min', '1hour', '1day']),
});

// Hardware defaults schema
const hardwareDefaultsSchema = z.object({
  defaultModbusPort: z.number().int().min(0),
  defaultModbusUnitId: z.number().int().min(0),
  defaultMqttPort: z.number().int().min(0),
  defaultMqttTopic: z.string(),
  defaultMqttQos: z.number().int().min(0).max(2),
  defaultBaudRate: z.number().int().positive(),
  defaultParity: z.enum(['none', 'even', 'odd']),
  defaultStopBits: z.number().int().min(1).max(2),
  defaultDataBits: z.number().int().min(7).max(8),
  defaultConnectionTimeout: z.number().int().positive(),
  defaultRetryAttempts: z.number().int().min(0),
  defaultPollingInterval: z.number().int().positive(),
});

// Predefined device types
const deviceTypes = [
  {
    id: 'solar-inverter',
    name: 'Solar Inverter',
    icon: <Sun className="h-4 w-4" />,
    defaultFields: {
      type: 'inverter',
      capacity: 10,
      protocol: 'modbus_tcp',
      port: 502,
      registers: [
        { address: 40001, name: 'Power Output', unit: 'W', multiplier: 1 },
        { address: 40003, name: 'Energy Today', unit: 'kWh', multiplier: 0.1 },
        { address: 40005, name: 'Voltage', unit: 'V', multiplier: 0.1 },
      ]
    }
  },
  {
    id: 'battery-inverter',
    name: 'Battery Inverter',
    icon: <Battery className="h-4 w-4" />,
    defaultFields: {
      type: 'battery',
      capacity: 13.5,
      protocol: 'modbus_tcp',
      port: 502,
      registers: [
        { address: 40001, name: 'State of Charge', unit: '%', multiplier: 1 },
        { address: 40003, name: 'Power', unit: 'W', multiplier: 1 },
        { address: 40005, name: 'Voltage', unit: 'V', multiplier: 0.1 },
      ]
    }
  },
  {
    id: 'wind-turbine',
    name: 'Wind Turbine',
    icon: <Wind className="h-4 w-4" />,
    defaultFields: {
      type: 'wind',
      capacity: 5,
      protocol: 'modbus_tcp',
      port: 502,
      registers: [
        { address: 40001, name: 'Power Output', unit: 'W', multiplier: 1 },
        { address: 40003, name: 'Wind Speed', unit: 'm/s', multiplier: 0.1 },
        { address: 40005, name: 'RPM', unit: 'rpm', multiplier: 1 },
      ]
    }
  },
  {
    id: 'energy-meter',
    name: 'Energy Meter',
    icon: <BarChart4 className="h-4 w-4" />,
    defaultFields: {
      type: 'meter',
      capacity: 100,
      protocol: 'modbus_tcp',
      port: 502,
      registers: [
        { address: 40001, name: 'Active Power', unit: 'W', multiplier: 1 },
        { address: 40003, name: 'Energy', unit: 'kWh', multiplier: 0.01 },
        { address: 40005, name: 'Current', unit: 'A', multiplier: 0.01 },
      ]
    }
  },
];

const DefaultCriteria: React.FC = () => {
  const [activeTab, setActiveTab] = useState('energy');
  const [selectedDeviceType, setSelectedDeviceType] = useState<string | null>(null);
  
  // Energy criteria form
  const energyForm = useForm<z.infer<typeof energyCriteriaSchema>>({
    resolver: zodResolver(energyCriteriaSchema),
    defaultValues: {
      batteryChargingThreshold: 20,
      batteryDischargingThreshold: 90,
      renewableExportThreshold: 2.0,
      peakShavingThreshold: 10.0,
      demandResponseThreshold: 15.0,
      
      peakHoursStart: '17:00',
      peakHoursEnd: '21:00',
      peakRatePerKwh: 0.35,
      offPeakRatePerKwh: 0.12,
      feedInTariff: 0.08,
      
      carbonIntensityGridKgPerKwh: 0.2,
      carbonIntensitySolarKgPerKwh: 0.02,
      carbonIntensityWindKgPerKwh: 0.01,
      
      prioritizeSelfConsumption: true,
      prioritizeCostSavings: true,
      prioritizeEmissionsReduction: false,
      
      batteryLifecycleOptimization: true,
      weatherForecastOptimization: true,
      demandPredictionEnabled: true,
      minStateOfHealthPercent: 80,
    },
  });
  
  // Alert settings form
  const alertForm = useForm<z.infer<typeof alertSettingsSchema>>({
    resolver: zodResolver(alertSettingsSchema),
    defaultValues: {
      batteryLowThreshold: 15,
      batteryHighThreshold: 95,
      powerOutageAlertEnabled: true,
      overproductionAlertThreshold: 12.0,
      overconsumptionAlertThreshold: 20.0,
      voltageHighThreshold: 253.0,
      voltageLowThreshold: 207.0,
      emailAlertsEnabled: true,
      smsAlertsEnabled: false,
      pushNotificationsEnabled: true,
      alertRefreshInterval: 5,
    },
  });
  
  // Data management form
  const dataForm = useForm<z.infer<typeof dataManagementSchema>>({
    resolver: zodResolver(dataManagementSchema),
    defaultValues: {
      dataSamplingInterval: 5,
      dataRetentionDays: 365,
      highResolutionDataDays: 30,
      dataCompressionEnabled: true,
      dataExportSchedule: 'weekly',
      dataBackupEnabled: true,
      backupSchedule: 'daily',
      aggregationInterval: '15min',
    },
  });
  
  // Hardware defaults form
  const hardwareForm = useForm<z.infer<typeof hardwareDefaultsSchema>>({
    resolver: zodResolver(hardwareDefaultsSchema),
    defaultValues: {
      defaultModbusPort: 502,
      defaultModbusUnitId: 1,
      defaultMqttPort: 1883,
      defaultMqttTopic: 'energy/devices',
      defaultMqttQos: 1,
      defaultBaudRate: 9600,
      defaultParity: 'none',
      defaultStopBits: 1,
      defaultDataBits: 8,
      defaultConnectionTimeout: 5000,
      defaultRetryAttempts: 3,
      defaultPollingInterval: 60,
    },
  });
  
  // Form submission handlers
  const onEnergySubmit = (values: z.infer<typeof energyCriteriaSchema>) => {
    console.log('Energy criteria values:', values);
    toast.success('Energy optimization criteria saved');
  };
  
  const onAlertSubmit = (values: z.infer<typeof alertSettingsSchema>) => {
    console.log('Alert settings values:', values);
    toast.success('Alert settings saved');
  };
  
  const onDataSubmit = (values: z.infer<typeof dataManagementSchema>) => {
    console.log('Data management values:', values);
    toast.success('Data management settings saved');
  };
  
  const onHardwareSubmit = (values: z.infer<typeof hardwareDefaultsSchema>) => {
    console.log('Hardware defaults values:', values);
    toast.success('Hardware defaults saved');
  };
  
  // Reset forms to defaults
  const resetToDefaults = () => {
    switch (activeTab) {
      case 'energy':
        energyForm.reset();
        break;
      case 'alerts':
        alertForm.reset();
        break;
      case 'data':
        dataForm.reset();
        break;
      case 'hardware':
        hardwareForm.reset();
        break;
      default:
        break;
    }
    toast.info('Settings reset to defaults');
  };
  
  // Handle device type selection
  const handleDeviceTypeSelect = (typeId: string) => {
    setSelectedDeviceType(typeId);
  };
  
  // Predefined device type details view
  const renderDeviceTypeDetails = () => {
    if (!selectedDeviceType) return null;
    
    const deviceType = deviceTypes.find(type => type.id === selectedDeviceType);
    if (!deviceType) return null;
    
    return (
      <div className="mt-4 space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-md">
            {deviceType.icon}
          </div>
          <div>
            <h3 className="font-medium">{deviceType.name}</h3>
            <p className="text-sm text-muted-foreground">Default configuration</p>
          </div>
          <div className="ml-auto">
            <Badge>Template</Badge>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Device Type</Label>
            <Input value={deviceType.defaultFields.type} readOnly className="mt-1 bg-muted" />
          </div>
          
          <div>
            <Label>Default Capacity (kW)</Label>
            <Input 
              type="number" 
              value={deviceType.defaultFields.capacity} 
              readOnly 
              className="mt-1 bg-muted"
            />
          </div>
          
          <div>
            <Label>Protocol</Label>
            <Input 
              value={deviceType.defaultFields.protocol} 
              readOnly 
              className="mt-1 bg-muted"
            />
          </div>
          
          <div>
            <Label>Default Port</Label>
            <Input 
              type="number" 
              value={deviceType.defaultFields.port} 
              readOnly 
              className="mt-1 bg-muted"
            />
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Default Registers</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Address</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Multiplier</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deviceType.defaultFields.registers.map((register, index) => (
                <TableRow key={index}>
                  <TableCell>{register.address}</TableCell>
                  <TableCell>{register.name}</TableCell>
                  <TableCell>{register.unit}</TableCell>
                  <TableCell>{register.multiplier}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline">
            Edit Template
          </Button>
          <Button>
            Use as Default
          </Button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="container mx-auto">
      <div className="flex items-start mb-6">
        <div>
          <h1 className="text-2xl font-semibold flex items-center">
            <Sliders className="mr-2 h-6 w-6" />
            Default Settings & Criteria
          </h1>
          <p className="text-muted-foreground">
            Configure system-wide defaults and optimization criteria
          </p>
        </div>
      </div>
      
      <Tabs 
        defaultValue="energy" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="energy" className="flex items-center gap-2">
            <Battery className="h-4 w-4" />
            <span className="hidden sm:inline">Energy Optimization</span>
            <span className="inline sm:hidden">Energy</span>
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline">Alert Settings</span>
            <span className="inline sm:hidden">Alerts</span>
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Data Management</span>
            <span className="inline sm:hidden">Data</span>
          </TabsTrigger>
          <TabsTrigger value="hardware" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Hardware Defaults</span>
            <span className="inline sm:hidden">Hardware</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Energy Optimization Tab */}
        <TabsContent value="energy">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Battery className="mr-2 h-5 w-5" />
                Energy Optimization Criteria
              </CardTitle>
              <CardDescription>
                Set default energy optimization parameters and thresholds
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...energyForm}>
                <form onSubmit={energyForm.handleSubmit(onEnergySubmit)} className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Power Thresholds</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <FormField
                        control={energyForm.control}
                        name="batteryChargingThreshold"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Battery Charging Threshold (%)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field} 
                                onChange={e => field.onChange(parseFloat(e.target.value))}
                              />
                            </FormControl>
                            <FormDescription>
                              Start charging below this level
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={energyForm.control}
                        name="batteryDischargingThreshold"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Battery Discharging Threshold (%)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field} 
                                onChange={e => field.onChange(parseFloat(e.target.value))}
                              />
                            </FormControl>
                            <FormDescription>
                              Start discharging above this level
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={energyForm.control}
                        name="renewableExportThreshold"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Renewable Export Threshold (kW)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field} 
                                onChange={e => field.onChange(parseFloat(e.target.value))}
                              />
                            </FormControl>
                            <FormDescription>
                              Export to grid above this surplus
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={energyForm.control}
                        name="peakShavingThreshold"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Peak Shaving Threshold (kW)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field} 
                                onChange={e => field.onChange(parseFloat(e.target.value))}
                              />
                            </FormControl>
                            <FormDescription>
                              Start peak shaving above this demand
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={energyForm.control}
                        name="demandResponseThreshold"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Demand Response Threshold (kW)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field} 
                                onChange={e => field.onChange(parseFloat(e.target.value))}
                              />
                            </FormControl>
                            <FormDescription>
                              Trigger demand response above this level
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Energy Pricing</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <FormField
                        control={energyForm.control}
                        name="peakHoursStart"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Peak Hours Start</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={energyForm.control}
                        name="peakHoursEnd"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Peak Hours End</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={energyForm.control}
                        name="peakRatePerKwh"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Peak Rate ($/kWh)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.01"
                                {...field} 
                                onChange={e => field.onChange(parseFloat(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={energyForm.control}
                        name="offPeakRatePerKwh"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Off-Peak Rate ($/kWh)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.01"
                                {...field} 
                                onChange={e => field.onChange(parseFloat(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={energyForm.control}
                        name="feedInTariff"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Feed-in Tariff ($/kWh)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.01"
                                {...field} 
                                onChange={e => field.onChange(parseFloat(e.target.value))}
                              />
                            </FormControl>
                            <FormDescription>
                              Rate paid for energy exported to grid
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Carbon Intensity</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={energyForm.control}
                        name="carbonIntensityGridKgPerKwh"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Grid Carbon Intensity (kg CO₂/kWh)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.01"
                                {...field} 
                                onChange={e => field.onChange(parseFloat(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={energyForm.control}
                        name="carbonIntensitySolarKgPerKwh"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Solar Carbon Intensity (kg CO₂/kWh)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.01"
                                {...field} 
                                onChange={e => field.onChange(parseFloat(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={energyForm.control}
                        name="carbonIntensityWindKgPerKwh"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Wind Carbon Intensity (kg CO₂/kWh)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.01"
                                {...field} 
                                onChange={e => field.onChange(parseFloat(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Optimization Goals</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={energyForm.control}
                        name="prioritizeSelfConsumption"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Prioritize Self-Consumption</FormLabel>
                              <FormDescription>
                                Maximize use of on-site generation
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={energyForm.control}
                        name="prioritizeCostSavings"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Prioritize Cost Savings</FormLabel>
                              <FormDescription>
                                Optimize for lowest energy costs
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={energyForm.control}
                        name="prioritizeEmissionsReduction"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Prioritize Emissions Reduction</FormLabel>
                              <FormDescription>
                                Minimize carbon footprint
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Advanced Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={energyForm.control}
                        name="batteryLifecycleOptimization"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Battery Lifecycle Optimization</FormLabel>
                              <FormDescription>
                                Extend battery lifespan by optimizing charge cycles
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={energyForm.control}
                        name="weatherForecastOptimization"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Weather Forecast Optimization</FormLabel>
                              <FormDescription>
                                Use weather forecasts to optimize energy management
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={energyForm.control}
                        name="demandPredictionEnabled"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Load Demand Prediction</FormLabel>
                              <FormDescription>
                                Use machine learning to predict energy consumption
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={energyForm.control}
                        name="minStateOfHealthPercent"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Minimum Battery State of Health (%)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field} 
                                onChange={e => field.onChange(parseFloat(e.target.value))}
                              />
                            </FormControl>
                            <FormDescription>
                              Alert when battery health falls below this level
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={resetToDefaults}
              >
                <Undo2 className="mr-2 h-4 w-4" />
                Reset to Defaults
              </Button>
              <Button 
                type="submit" 
                onClick={energyForm.handleSubmit(onEnergySubmit)}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Alert Settings Tab */}
        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Alert & Notification Settings
              </CardTitle>
              <CardDescription>
                Configure notification thresholds and delivery methods
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...alertForm}>
                <form onSubmit={alertForm.handleSubmit(onAlertSubmit)} className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Battery Alerts</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={alertForm.control}
                        name="batteryLowThreshold"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Battery Low Alert Threshold (%)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field} 
                                onChange={e => field.onChange(parseFloat(e.target.value))}
                              />
                            </FormControl>
                            <FormDescription>
                              Alert when battery falls below this level
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={alertForm.control}
                        name="batteryHighThreshold"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Battery High Alert Threshold (%)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field} 
                                onChange={e => field.onChange(parseFloat(e.target.value))}
                              />
                            </FormControl>
                            <FormDescription>
                              Alert when battery exceeds this level
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Power Alerts</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={alertForm.control}
                        name="powerOutageAlertEnabled"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Power Outage Alert</FormLabel>
                              <FormDescription>
                                Notify when grid connection is lost
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={alertForm.control}
                        name="overproductionAlertThreshold"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Overproduction Alert Threshold (kW)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field} 
                                onChange={e => field.onChange(parseFloat(e.target.value))}
                              />
                            </FormControl>
                            <FormDescription>
                              Alert when excess production exceeds this level
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={alertForm.control}
                        name="overconsumptionAlertThreshold"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Overconsumption Alert Threshold (kW)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field} 
                                onChange={e => field.onChange(parseFloat(e.target.value))}
                              />
                            </FormControl>
                            <FormDescription>
                              Alert when consumption exceeds this level
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Power Quality Alerts</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={alertForm.control}
                        name="voltageHighThreshold"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Voltage High Alert Threshold (V)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field} 
                                onChange={e => field.onChange(parseFloat(e.target.value))}
                              />
                            </FormControl>
                            <FormDescription>
                              Alert when voltage exceeds this level
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={alertForm.control}
                        name="voltageLowThreshold"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Voltage Low Alert Threshold (V)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field} 
                                onChange={e => field.onChange(parseFloat(e.target.value))}
                              />
                            </FormControl>
                            <FormDescription>
                              Alert when voltage falls below this level
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Notification Methods</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={alertForm.control}
                        name="emailAlertsEnabled"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0 border rounded-md p-4">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Email Notifications</FormLabel>
                              <FormDescription>
                                Send alerts via email
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={alertForm.control}
                        name="smsAlertsEnabled"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0 border rounded-md p-4">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>SMS Notifications</FormLabel>
                              <FormDescription>
                                Send alerts via text message
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={alertForm.control}
                        name="pushNotificationsEnabled"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0 border rounded-md p-4">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Push Notifications</FormLabel>
                              <FormDescription>
                                Send alerts via app push notifications
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">General Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={alertForm.control}
                        name="alertRefreshInterval"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Alert Refresh Interval (minutes)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field} 
                                onChange={e => field.onChange(parseFloat(e.target.value))}
                              />
                            </FormControl>
                            <FormDescription>
                              Time between alert condition checks
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={resetToDefaults}
              >
                <Undo2 className="mr-2 h-4 w-4" />
                Reset to Defaults
              </Button>
              <Button 
                type="submit" 
                onClick={alertForm.handleSubmit(onAlertSubmit)}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Data Management Tab */}
        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-2 h-5 w-5" />
                Data Management Settings
              </CardTitle>
              <CardDescription>
                Configure data collection, storage, and retention policies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...dataForm}>
                <form onSubmit={dataForm.handleSubmit(onDataSubmit)} className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Data Collection</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={dataForm.control}
                        name="dataSamplingInterval"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Data Sampling Interval (minutes)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field} 
                                onChange={e => field.onChange(parseFloat(e.target.value))}
                              />
                            </FormControl>
                            <FormDescription>
                              Frequency of data collection
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={dataForm.control}
                        name="aggregationInterval"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Data Aggregation Interval</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select aggregation interval" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="5min">5 Minutes</SelectItem>
                                <SelectItem value="15min">15 Minutes</SelectItem>
                                <SelectItem value="30min">30 Minutes</SelectItem>
                                <SelectItem value="1hour">1 Hour</SelectItem>
                                <SelectItem value="1day">1 Day</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Interval for data aggregation and processing
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Data Retention</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={dataForm.control}
                        name="dataRetentionDays"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Data Retention Period (days)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field} 
                                onChange={e => field.onChange(parseFloat(e.target.value))}
                              />
                            </FormControl>
                            <FormDescription>
                              How long to keep historical data
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={dataForm.control}
                        name="highResolutionDataDays"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>High Resolution Data Retention (days)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field} 
                                onChange={e => field.onChange(parseFloat(e.target.value))}
                              />
                            </FormControl>
                            <FormDescription>
                              How long to keep detailed minute-by-minute data
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={dataForm.control}
                        name="dataCompressionEnabled"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Data Compression</FormLabel>
                              <FormDescription>
                                Compress older data to save storage space
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Data Export & Backup</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={dataForm.control}
                        name="dataExportSchedule"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Automated Data Export Schedule</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select export schedule" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="never">Never</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Schedule for automatic CSV/JSON exports
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={dataForm.control}
                        name="dataBackupEnabled"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Automated Database Backups</FormLabel>
                              <FormDescription>
                                Create regular backups of the entire database
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={dataForm.control}
                        name="backupSchedule"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Backup Schedule</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select backup schedule" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="never">Never</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              How often to run automated backups
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={resetToDefaults}
              >
                <Undo2 className="mr-2 h-4 w-4" />
                Reset to Defaults
              </Button>
              <Button 
                type="submit" 
                onClick={dataForm.handleSubmit(onDataSubmit)}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Hardware Defaults Tab */}
        <TabsContent value="hardware">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                Hardware & Communication Defaults
              </CardTitle>
              <CardDescription>
                Set default protocol settings and device configurations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="protocol" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="protocol">Communication Protocols</TabsTrigger>
                  <TabsTrigger value="template">Device Templates</TabsTrigger>
                </TabsList>
                
                {/* Protocol Settings Tab */}
                <TabsContent value="protocol">
                  <Form {...hardwareForm}>
                    <form onSubmit={hardwareForm.handleSubmit(onHardwareSubmit)} className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Modbus Settings</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <FormField
                            control={hardwareForm.control}
                            name="defaultModbusPort"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Default Modbus TCP Port</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    {...field} 
                                    onChange={e => field.onChange(parseInt(e.target.value))}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={hardwareForm.control}
                            name="defaultModbusUnitId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Default Modbus Unit ID</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    {...field} 
                                    onChange={e => field.onChange(parseInt(e.target.value))}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={hardwareForm.control}
                            name="defaultBaudRate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Default Baud Rate</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    {...field} 
                                    onChange={e => field.onChange(parseInt(e.target.value))}
                                  />
                                </FormControl>
                                <FormDescription>
                                  For Modbus RTU communications
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={hardwareForm.control}
                            name="defaultParity"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Default Parity</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select parity" />
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
                          
                          <FormField
                            control={hardwareForm.control}
                            name="defaultStopBits"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Default Stop Bits</FormLabel>
                                <Select 
                                  onValueChange={(value) => field.onChange(parseInt(value))} 
                                  defaultValue={field.value.toString()}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select stop bits" />
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
                            control={hardwareForm.control}
                            name="defaultDataBits"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Default Data Bits</FormLabel>
                                <Select 
                                  onValueChange={(value) => field.onChange(parseInt(value))} 
                                  defaultValue={field.value.toString()}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select data bits" />
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
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-lg font-medium mb-4">MQTT Settings</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={hardwareForm.control}
                            name="defaultMqttPort"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Default MQTT Port</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    {...field} 
                                    onChange={e => field.onChange(parseInt(e.target.value))}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={hardwareForm.control}
                            name="defaultMqttTopic"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Default MQTT Topic Prefix</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormDescription>
                                  Base topic for MQTT communications
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={hardwareForm.control}
                            name="defaultMqttQos"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Default MQTT QoS</FormLabel>
                                <Select 
                                  onValueChange={(value) => field.onChange(parseInt(value))} 
                                  defaultValue={field.value.toString()}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select QoS" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="0">0 - At most once</SelectItem>
                                    <SelectItem value="1">1 - At least once</SelectItem>
                                    <SelectItem value="2">2 - Exactly once</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-lg font-medium mb-4">Connection Parameters</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <FormField
                            control={hardwareForm.control}
                            name="defaultConnectionTimeout"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Default Timeout (ms)</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    {...field} 
                                    onChange={e => field.onChange(parseInt(e.target.value))}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Connection timeout in milliseconds
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={hardwareForm.control}
                            name="defaultRetryAttempts"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Default Retry Attempts</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    {...field} 
                                    onChange={e => field.onChange(parseInt(e.target.value))}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Number of retries after failure
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={hardwareForm.control}
                            name="defaultPollingInterval"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Default Polling Interval (seconds)</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    {...field} 
                                    onChange={e => field.onChange(parseInt(e.target.value))}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Time between device polling cycles
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-between mt-6">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={resetToDefaults}
                        >
                          <Undo2 className="mr-2 h-4 w-4" />
                          Reset to Defaults
                        </Button>
                        <Button 
                          type="submit"
                          onClick={hardwareForm.handleSubmit(onHardwareSubmit)}
                        >
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  </Form>
                </TabsContent>
                
                {/* Device Templates Tab */}
                <TabsContent value="template">
                  <div className="space-y-4">
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertTitle>Device Templates</AlertTitle>
                      <AlertDescription>
                        Configure default settings for common device types. These will be applied when creating new devices.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {deviceTypes.map(deviceType => (
                        <Card 
                          key={deviceType.id}
                          className={`cursor-pointer hover:bg-accent/10 transition-colors ${selectedDeviceType === deviceType.id ? 'border-primary' : ''}`}
                          onClick={() => handleDeviceTypeSelect(deviceType.id)}
                        >
                          <CardContent className="p-4 flex items-center">
                            <div className="p-2 mr-3 bg-primary/10 rounded-full">
                              {deviceType.icon}
                            </div>
                            <div>
                              <h3 className="font-medium">{deviceType.name}</h3>
                              <p className="text-xs text-muted-foreground">
                                Default communication: {deviceType.defaultFields.protocol}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    
                    {renderDeviceTypeDetails()}
                    
                    <Accordion type="single" collapsible>
                      <AccordionItem value="advanced">
                        <AccordionTrigger>Advanced Configuration</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4 p-2">
                            <p className="text-sm text-muted-foreground">
                              Advanced configuration allows you to create custom device templates
                              with specific register mappings, scaling factors, and communication parameters.
                            </p>
                            
                            <div className="bg-muted/50 rounded-md p-4">
                              <h4 className="font-medium mb-2">Custom Device Template Creation</h4>
                              <p className="text-sm mb-4">
                                Create templates from existing devices or define new ones from scratch.
                              </p>
                              <Button>Create Custom Template</Button>
                            </div>
                            
                            <div className="bg-muted/50 rounded-md p-4">
                              <h4 className="font-medium mb-2">Template Import/Export</h4>
                              <p className="text-sm mb-4">
                                Share templates between systems or back them up.
                              </p>
                              <div className="flex gap-2">
                                <Button variant="outline">Import Template</Button>
                                <Button variant="outline">Export Templates</Button>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DefaultCriteria;
