
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Site } from '@/types/energy';
import { MapPin } from 'lucide-react';

// Schema for site form validation
const siteFormSchema = z.object({
  name: z.string()
    .min(2, { message: 'Site name must be at least 2 characters.' })
    .max(100, { message: 'Site name must be less than 100 characters.' }),
  location: z.string()
    .min(2, { message: 'Location must be at least 2 characters.' })
    .max(100, { message: 'Location must be less than 100 characters.' }),
  timezone: z.string()
    .min(1, { message: 'Timezone is required.' }),
  lat: z.coerce.number()
    .min(-90, { message: 'Latitude must be between -90 and 90.' })
    .max(90, { message: 'Latitude must be between -90 and 90.' })
    .optional()
    .nullable(),
  lng: z.coerce.number()
    .min(-180, { message: 'Longitude must be between -180 and 180.' })
    .max(180, { message: 'Longitude must be between -180 and 180.' })
    .optional()
    .nullable(),
});

type SiteFormValues = z.infer<typeof siteFormSchema>;

interface SiteFormProps {
  initialData?: Partial<Site>;
  onSubmit: (data: SiteFormValues) => void;
  isSubmitting?: boolean;
}

const SiteForm = ({ initialData, onSubmit, isSubmitting = false }: SiteFormProps) => {
  const isEditing = !!initialData?.id;
  
  // Get the user's timezone as default
  const defaultTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  // Form with default values
  const form = useForm<SiteFormValues>({
    resolver: zodResolver(siteFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      location: initialData?.location || '',
      timezone: initialData?.timezone || defaultTimezone,
      lat: initialData?.lat || null,
      lng: initialData?.lng || null,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                A recognizable name for your energy site.
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
                <Input placeholder="Enter physical location" {...field} />
              </FormControl>
              <FormDescription>
                The physical address or description of where this site is located.
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
                <Input placeholder="e.g. America/New_York" {...field} />
              </FormControl>
              <FormDescription>
                The IANA timezone identifier (e.g., "America/New_York").
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="lat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Latitude (optional)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="e.g. 40.7128" 
                    {...field} 
                    value={field.value === null ? '' : field.value}
                    onChange={(e) => {
                      const value = e.target.value === '' ? null : parseFloat(e.target.value);
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="lng"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Longitude (optional)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="e.g. -74.0060" 
                    {...field} 
                    value={field.value === null ? '' : field.value}
                    onChange={(e) => {
                      const value = e.target.value === '' ? null : parseFloat(e.target.value);
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Site' : 'Create Site'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SiteForm;
