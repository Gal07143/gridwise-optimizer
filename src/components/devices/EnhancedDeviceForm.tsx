import React, { useState, useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import { DeviceSchema, DeviceFormValues } from './deviceValidationSchema';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from 'sonner';
import { DeviceType, DeviceStatus } from '@/types/energy';
import { createDevice, getDeviceById, updateDevice } from '@/services/deviceService';
import { useQuery } from '@tanstack/react-query';
import { Badge } from "@/components/ui/badge";
import { DatePicker } from "@/components/ui/date-picker";
import { CalendarIcon } from "lucide-react";
import { format } from 'date-fns';
import { cn } from "@/lib/utils";

const EnhancedDeviceForm: React.FC = () => {
  const { deviceId } = useParams<{ deviceId: string }>();
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  
  const form = useForm<DeviceFormValues>({
    resolver: zodResolver(DeviceSchema),
    defaultValues: {
      name: '',
      type: 'solar',
      status: 'online',
      capacity: 0,
      location: '',
      description: '',
      manufacturer: '',
      model: '',
      serialNumber: '',
      firmware: '',
      installation_date: undefined,
      lastMaintenanceDate: undefined,
      latitude: 0,
      longitude: 0,
      energyCapacity: 0,
      efficiency: 0,
      maxVoltage: 0,
      minVoltage: 0,
      maxCurrent: 0,
      minCurrent: 0,
      nominalVoltage: 0,
      nominalCurrent: 0,
      communicationProtocol: '',
      dataUpdateFrequency: 0,
    },
    mode: 'onChange',
  });
  
  const { isLoading, data: device } = useQuery({
    queryKey: ['device', deviceId],
    queryFn: () => getDeviceById(deviceId!),
    enabled: !!deviceId,
    onSuccess: (data) => {
      if (data) {
        setIsEditMode(true);
        form.setValue('name', data.name);
        form.setValue('type', data.type);
        form.setValue('status', data.status);
        form.setValue('capacity', data.capacity);
        form.setValue('location', data.location || '');
        form.setValue('description', data.description || '');
        form.setValue('manufacturer', data.manufacturer || '');
        form.setValue('model', data.model || '');
        form.setValue('serialNumber', data.serialNumber || '');
        form.setValue('firmware', data.firmware || '');
        form.setValue('installation_date', data.installation_date ? new Date(data.installation_date) : undefined);
        form.setValue('lastMaintenanceDate', data.lastMaintenanceDate ? new Date(data.lastMaintenanceDate) : undefined);
        form.setValue('latitude', data.latitude || 0);
        form.setValue('longitude', data.longitude || 0);
        form.setValue('energyCapacity', data.energyCapacity || 0);
        form.setValue('efficiency', data.efficiency || 0);
        form.setValue('maxVoltage', data.maxVoltage || 0);
        form.setValue('minVoltage', data.minVoltage || 0);
        form.setValue('maxCurrent', data.maxCurrent || 0);
        form.setValue('minCurrent', data.minCurrent || 0);
        form.setValue('nominalVoltage', data.nominalVoltage || 0);
        form.setValue('nominalCurrent', data.nominalCurrent || 0);
        form.setValue('communicationProtocol', data.communicationProtocol || '');
        form.setValue('dataUpdateFrequency', data.dataUpdateFrequency || 0);
      }
    },
    onError: (error) => {
      toast.error(`Failed to fetch device: ${error}`);
    }
  });
  
  const onSubmit = async (values: DeviceFormValues) => {
    try {
      if (isEditMode && deviceId) {
        // Update existing device
        await updateDevice(deviceId, values);
        toast.success('Device updated successfully');
      } else {
        // Create new device
        await createDevice(values);
        toast.success('Device created successfully');
      }
      navigate('/devices');
    } catch (error) {
      console.error('Error creating/updating device:', error);
      toast.error(`Failed to create/update device: ${error}`);
    }
  };
  
  const handleCancel = () => {
    navigate('/devices');
  };
  
  const deviceStatus = 'online'; // Example status
  const connectionStatus = true; // Example connection status
  
  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle>{isEditMode ? 'Edit Device' : 'Add New Device'}</CardTitle>
        <CardDescription>
          {isEditMode ? 'Modify device details here.' : 'Enter the details for the new device.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Device Name */}
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
              
              {/* Device Type */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Device Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="solar">Solar Panel</SelectItem>
                        <SelectItem value="wind">Wind Turbine</SelectItem>
                        <SelectItem value="battery">Battery Storage</SelectItem>
                        <SelectItem value="grid">Grid Connection</SelectItem>
                        <SelectItem value="load">Load</SelectItem>
                        <SelectItem value="ev_charger">EV Charger</SelectItem>
                        <SelectItem value="generator">Generator</SelectItem>
                        <SelectItem value="hydro">Hydro Turbine</SelectItem>
                        <SelectItem value="inverter">Inverter</SelectItem>
                        <SelectItem value="meter">Meter</SelectItem>
                        <SelectItem value="light">Light</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Device Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Device Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="offline">Offline</SelectItem>
                        <SelectItem value="idle">Idle</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="charging">Charging</SelectItem>
                        <SelectItem value="discharging">Discharging</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Capacity */}
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity (kW)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter capacity in kW" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Location */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter location" {...field} />
                  </FormControl>
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Manufacturer */}
              <FormField
                control={form.control}
                name="manufacturer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manufacturer</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter manufacturer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Model */}
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter model" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Serial Number */}
              <FormField
                control={form.control}
                name="serialNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serial Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter serial number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Firmware */}
              <FormField
                control={form.control}
                name="firmware"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Firmware Version</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter firmware version" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Installation Date */}
              <FormField
                control={form.control}
                name="installation_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Installation Date</FormLabel>
                    <FormControl>
                      <DatePicker
                        onSelect={field.onChange}
                        defaultMonth={field.value}
                        mode="single"
                      />
                    </FormControl>
                    <FormDescription>
                      Date of device installation.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Last Maintenance Date */}
              <FormField
                control={form.control}
                name="lastMaintenanceDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Last Maintenance Date</FormLabel>
                    <FormControl>
                      <DatePicker
                        onSelect={field.onChange}
                        defaultMonth={field.value}
                        mode="single"
                      />
                    </FormControl>
                    <FormDescription>
                      Date of last maintenance.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Latitude */}
              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter latitude" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Longitude */}
              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter longitude" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Energy Capacity */}
              <FormField
                control={form.control}
                name="energyCapacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Energy Capacity (kWh)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter energy capacity in kWh" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Efficiency */}
              <FormField
                control={form.control}
                name="efficiency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Efficiency (%)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter efficiency percentage" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Max Voltage */}
              <FormField
                control={form.control}
                name="maxVoltage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Voltage (V)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter max voltage in V" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Min Voltage */}
              <FormField
                control={form.control}
                name="minVoltage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Min Voltage (V)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter min voltage in V" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Max Current */}
              <FormField
                control={form.control}
                name="maxCurrent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Current (A)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter max current in A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Min Current */}
              <FormField
                control={form.control}
                name="minCurrent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Min Current (A)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter min current in A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nominal Voltage */}
              <FormField
                control={form.control}
                name="nominalVoltage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nominal Voltage (V)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter nominal voltage in V" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Nominal Current */}
              <FormField
                control={form.control}
                name="nominalCurrent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nominal Current (A)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter nominal current in A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Communication Protocol */}
              <FormField
                control={form.control}
                name="communicationProtocol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Communication Protocol</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter communication protocol" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Data Update Frequency */}
              <FormField
                control={form.control}
                name="dataUpdateFrequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Update Frequency (seconds)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter data update frequency in seconds" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Connection Status */}
            <div className="mb-4">
              <Label className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                Connection Status
              </Label>
              <div className="mt-2">
                {connectionStatus ? (
                  <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Connected</Badge>
                ) : (
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">Not Connected</Badge>
                )}
              </div>
            </div>
            
            {/* Device Status */}
            <div className="mb-4">
              <Label className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                Device Status
              </Label>
              <div className="mt-2">
                {deviceStatus === 'online' && (
                  <Badge variant="default" className="bg-green-500 text-white">Active</Badge>
                )}
                {deviceStatus === 'offline' && (
                  <Badge variant="destructive" className="bg-red-500 text-white">Inactive</Badge>
                )}
                {deviceStatus !== 'online' && deviceStatus !== 'offline' && (
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">Unknown</Badge>
                )}
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={handleCancel}>Cancel</Button>
              <Button type="submit">{isEditMode ? 'Update Device' : 'Add Device'}</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default EnhancedDeviceForm;
