import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Site } from '@/types/site';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Building2, Users, Clock, GanttChart, Map, Info } from 'lucide-react';

const siteFormSchema = z.object({
  name: z.string().min(2, { message: "Site name must be at least 2 characters." }),
  description: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  zipCode: z.string().optional(),
  timezone: z.string().min(1, { message: "Timezone is required." }),
  lat: z.number().nullable().optional(),
  lng: z.number().nullable().optional(),
  capacity: z.number().nullable().optional(),
  area: z.number().nullable().optional(),
  building_type: z.string().optional(),
  contact_person: z.string().optional(),
  contact_phone: z.string().optional(),
  contact_email: z.string().email().optional().or(z.literal('')),
  site_code: z.string().optional(),
  owner: z.string().optional(),
  construction_year: z.number().nullable().optional(),
  renovation_year: z.number().nullable().optional(),
  property_value: z.number().nullable().optional(),
  property_currency: z.string().optional(),
});

type SiteFormValues = z.infer<typeof siteFormSchema>;

interface SiteFormProps {
  initialData?: Partial<Site>;
  onSubmit: (data: SiteFormValues) => Promise<void>;
  isSubmitting: boolean;
}

const buildingTypes = [
  "Commercial", "Industrial", "Residential", "Educational", 
  "Healthcare", "Office", "Retail", "Wind Farm", "Solar Farm", 
  "Hydroelectric Plant", "Battery Storage", "Data Center", "Other"
];

const currencies = ["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "CNY"];

const SiteForm = ({ initialData, onSubmit, isSubmitting }: SiteFormProps) => {
  const [activeTab, setActiveTab] = useState("basic");
  
  const form = useForm<SiteFormValues>({
    resolver: zodResolver(siteFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      address: initialData?.address || '',
      city: initialData?.city || '',
      state: initialData?.state || '',
      country: initialData?.country || '',
      zipCode: initialData?.zipCode || '',
      timezone: initialData?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      lat: initialData?.lat || null,
      lng: initialData?.lng || null,
      capacity: initialData?.capacity || null,
      area: initialData?.area || null,
      building_type: initialData?.building_type || '',
      contact_person: initialData?.contact_person || '',
      contact_phone: initialData?.contact_phone || '',
      contact_email: initialData?.contact_email || '',
      site_code: initialData?.site_code || '',
      owner: initialData?.owner || '',
      construction_year: initialData?.construction_year || null,
      renovation_year: initialData?.renovation_year || null,
      property_value: initialData?.property_value || null,
      property_currency: initialData?.property_currency || 'USD',
    },
  });

  const handleSubmit = async (data: SiteFormValues) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Site form submission error:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-6 mb-6">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <Info className="h-4 w-4" /> Basic
            </TabsTrigger>
            <TabsTrigger value="location" className="flex items-center gap-2">
              <Map className="h-4 w-4" /> Location
            </TabsTrigger>
            <TabsTrigger value="building" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" /> Building
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center gap-2">
              <Users className="h-4 w-4" /> Contacts
            </TabsTrigger>
            <TabsTrigger value="operations" className="flex items-center gap-2">
              <Clock className="h-4 w-4" /> Operations
            </TabsTrigger>
            <TabsTrigger value="financial" className="flex items-center gap-2">
              <GanttChart className="h-4 w-4" /> Financial
            </TabsTrigger>
          </TabsList>
          
          {/* Basic Information */}
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Enter the essential details for your energy management site
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter site name" {...field} />
                      </FormControl>
                      <FormDescription>
                        The name of your energy management site
                      </FormDescription>
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
                        <Textarea 
                          placeholder="Enter site description" 
                          {...field} 
                          rows={3}
                        />
                      </FormControl>
                      <FormDescription>
                        A brief description of the site and its purpose
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="site_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter site code" {...field} />
                      </FormControl>
                      <FormDescription>
                        A unique identifier for this site
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="timezone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Timezone*</FormLabel>
                      <FormControl>
                        <Input placeholder="Timezone" {...field} />
                      </FormControl>
                      <FormDescription>
                        The timezone of your site's location (e.g., America/New_York)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Location Information */}
          <TabsContent value="location">
            <Card>
              <CardHeader>
                <CardTitle>Location Information</CardTitle>
                <CardDescription>
                  Enter the address and geographical details of your site
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter site address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="City" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State/Province</FormLabel>
                        <FormControl>
                          <Input placeholder="State/Province" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input placeholder="Country" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal/Zip Code</FormLabel>
                        <FormControl>
                          <Input placeholder="Postal/Zip Code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator className="my-4" />
                <h3 className="text-sm font-medium mb-2">GPS Coordinates</h3>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="lat"
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>Latitude</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Latitude" 
                            step="0.000001"
                            value={value === null ? '' : value}
                            onChange={(e) => onChange(e.target.value === '' ? null : parseFloat(e.target.value))}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lng"
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>Longitude</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Longitude" 
                            step="0.000001"
                            value={value === null ? '' : value}
                            onChange={(e) => onChange(e.target.value === '' ? null : parseFloat(e.target.value))}
                            {...field}
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
          
          {/* Building Information */}
          <TabsContent value="building">
            <Card>
              <CardHeader>
                <CardTitle>Building Information</CardTitle>
                <CardDescription>
                  Enter the physical characteristics of your building or facility
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="building_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Building Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select building type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {buildingTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The type of building or facility
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="area"
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>Area (m²)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Area in square meters" 
                            value={value === null ? '' : value}
                            onChange={(e) => onChange(e.target.value === '' ? null : parseFloat(e.target.value))}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Total floor area in square meters
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="capacity"
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>Capacity (kW)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Capacity in kW" 
                            value={value === null ? '' : value}
                            onChange={(e) => onChange(e.target.value === '' ? null : parseFloat(e.target.value))}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Total energy capacity in kilowatts
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="construction_year"
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>Construction Year</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Year of construction" 
                            value={value === null ? '' : value}
                            onChange={(e) => onChange(e.target.value === '' ? null : parseInt(e.target.value))}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="renovation_year"
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>Last Renovation Year</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Year of last renovation" 
                            value={value === null ? '' : value}
                            onChange={(e) => onChange(e.target.value === '' ? null : parseInt(e.target.value))}
                            {...field}
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
          
          {/* Contact Information */}
          <TabsContent value="contacts">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Enter contact details for this site
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="contact_person"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Person</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter contact name" {...field} />
                      </FormControl>
                      <FormDescription>
                        Primary contact person for this site
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contact_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="Enter contact email" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contact_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter contact phone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="owner"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Owner/Organization</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter owner or organization" {...field} />
                      </FormControl>
                      <FormDescription>
                        Entity that owns or operates this site
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Operations Tab */}
          <TabsContent value="operations">
            <Card>
              <CardHeader>
                <CardTitle>Operational Information</CardTitle>
                <CardDescription>
                  Enter details about how this site operates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground mb-4">
                  Operational settings will be configured in a future update.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Financial Tab */}
          <TabsContent value="financial">
            <Card>
              <CardHeader>
                <CardTitle>Financial Information</CardTitle>
                <CardDescription>
                  Enter financial details related to this site
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="property_value"
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>Property Value</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Property value" 
                            value={value === null ? '' : value}
                            onChange={(e) => onChange(e.target.value === '' ? null : parseFloat(e.target.value))}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Estimated value of the property
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="property_currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {currencies.map((currency) => (
                              <SelectItem key={currency} value={currency}>
                                {currency}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : initialData?.id ? 'Update Site' : 'Create Site'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SiteForm;
