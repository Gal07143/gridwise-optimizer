
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UploadCloud, Save, ArrowLeft, HelpCircle } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Form validation schema
const deviceModelSchema = z.object({
  manufacturer: z.string().min(2, { message: "Manufacturer name is required" }),
  model: z.string().min(2, { message: "Model name is required" }),
  deviceType: z.enum(['batteries', 'inverters', 'ev-chargers', 'meters', 'controllers']),
  protocol: z.string().min(2, { message: "Communication protocol is required" }),
  firmware: z.string().optional(),
  description: z.string().optional(),
  supported: z.boolean().default(true),
  hasRegisterMap: z.boolean().default(false),
  notes: z.string().optional()
});

type DeviceModelFormValues = z.infer<typeof deviceModelSchema>;

const AddDeviceModelPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const deviceType = queryParams.get('type') || 'batteries';
  
  const [manualFile, setManualFile] = useState<File | null>(null);
  const [registerMapFile, setRegisterMapFile] = useState<File | null>(null);
  
  // Initialize form with default values
  const form = useForm<DeviceModelFormValues>({
    resolver: zodResolver(deviceModelSchema),
    defaultValues: {
      manufacturer: '',
      model: '',
      deviceType: deviceType as any,
      protocol: '',
      firmware: '',
      description: '',
      supported: true,
      hasRegisterMap: false,
      notes: ''
    }
  });
  
  const onSubmit = async (data: DeviceModelFormValues) => {
    console.log('Form data submitted:', data);
    console.log('Manual file:', manualFile);
    console.log('Register map file:', registerMapFile);
    
    // In a real app, you would upload the files to storage and save the data to the database
    
    toast.success('Device model added successfully');
    
    // Navigate back to the device category page
    setTimeout(() => {
      navigate(`/integrations/${data.deviceType}`);
    }, 1500);
  };
  
  const handleManualFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setManualFile(e.target.files[0]);
    }
  };
  
  const handleRegisterMapFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setRegisterMapFile(e.target.files[0]);
    }
  };
  
  const deviceTypeLabels = {
    'batteries': 'Battery Systems',
    'inverters': 'Inverters',
    'ev-chargers': 'EV Chargers',
    'meters': 'Energy Meters',
    'controllers': 'Microgrid Controllers'
  };
  
  return (
    <AppLayout>
      <div className="flex flex-col gap-6 p-6 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold mb-1">Add New Device Model</h1>
            <p className="text-muted-foreground">
              Register a new device model with technical specifications
            </p>
          </div>
          
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Enter the device model details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="manufacturer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Manufacturer</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Tesla, SolarEdge, Schneider Electric" {...field} />
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
                        <FormLabel>Model Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Powerwall 2, SE10K, PM5560" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="deviceType"
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
                            {Object.entries(deviceTypeLabels).map(([value, label]) => (
                              <SelectItem key={value} value={value}>{label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="protocol"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Communication Protocol</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Modbus TCP, REST API, CAN bus" {...field} />
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
                        <FormLabel>Latest Firmware Version</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., v1.2.3" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="supported"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Supported</FormLabel>
                          <FormDescription>
                            Is this device fully supported by your system?
                          </FormDescription>
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
                        <Textarea 
                          placeholder="Brief description of the device and its capabilities..." 
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Documentation & Technical Details</CardTitle>
                <CardDescription>Upload technical documentation for the device</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="manual">User Manual (PDF)</Label>
                    <div className="mt-2 flex items-center gap-4">
                      <div className="border rounded-md p-6 w-full h-32 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                        <input
                          id="manual"
                          type="file"
                          accept=".pdf"
                          className="hidden"
                          onChange={handleManualFileChange}
                        />
                        <label htmlFor="manual" className="cursor-pointer flex flex-col items-center">
                          <UploadCloud className="h-8 w-8 mb-2 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {manualFile ? manualFile.name : 'Upload user manual'}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="registerMap">Register Map (PDF/CSV/XLS)</Label>
                      <FormField
                        control={form.control}
                        name="hasRegisterMap"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormLabel className="text-xs text-muted-foreground">Has register map</FormLabel>
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
                    <div className="mt-2 flex items-center gap-4">
                      <div className="border rounded-md p-6 w-full h-32 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                        <input
                          id="registerMap"
                          type="file"
                          accept=".pdf,.csv,.xls,.xlsx"
                          className="hidden"
                          onChange={handleRegisterMapFileChange}
                          disabled={!form.watch('hasRegisterMap')}
                        />
                        <label 
                          htmlFor="registerMap" 
                          className={`cursor-pointer flex flex-col items-center ${!form.watch('hasRegisterMap') ? 'opacity-50' : ''}`}
                        >
                          <UploadCloud className="h-8 w-8 mb-2 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {registerMapFile ? registerMapFile.name : 'Upload register map'}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any additional notes, special requirements, or known issues..." 
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  Save Device Model
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </AppLayout>
  );
};

export default AddDeviceModelPage;
