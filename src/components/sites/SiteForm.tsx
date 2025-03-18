
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
import { Site } from '@/types/energy';

// Validation schema
const siteFormSchema = z.object({
  name: z.string().min(2, { message: "Site name must be at least 2 characters." }),
  location: z.string().min(2, { message: "Location must be at least 2 characters." }),
  timezone: z.string().min(1, { message: "Timezone is required." }),
  lat: z.number().nullable().optional(),
  lng: z.number().nullable().optional(),
});

type SiteFormValues = z.infer<typeof siteFormSchema>;

interface SiteFormProps {
  initialData?: Partial<Site>;
  onSubmit: (data: SiteFormValues) => Promise<void>;
  isSubmitting: boolean;
}

const SiteForm = ({ initialData, onSubmit, isSubmitting }: SiteFormProps) => {
  const form = useForm<SiteFormValues>({
    resolver: zodResolver(siteFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      location: initialData?.location || '',
      timezone: initialData?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      lat: initialData?.lat || null,
      lng: initialData?.lng || null,
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
        <Card>
          <CardHeader>
            <CardTitle>Site Information</CardTitle>
            <CardDescription>
              Enter the details for your energy management site
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site Name</FormLabel>
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
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter site location" {...field} />
                  </FormControl>
                  <FormDescription>
                    The physical address or location of your site
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
                  <FormLabel>Timezone</FormLabel>
                  <FormControl>
                    <Input placeholder="Timezone" {...field} />
                  </FormControl>
                  <FormDescription>
                    The timezone of your site's location
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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
          <CardFooter className="flex justify-end space-x-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : initialData?.id ? 'Update Site' : 'Create Site'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default SiteForm;
